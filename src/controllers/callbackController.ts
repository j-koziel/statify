import { Request, Response, NextFunction } from "express";
import superagent from "superagent";
import querystring from "querystring";

import secrets from "../secrets";
import stateKey from "../utils/stateKey";

const callbackController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
      res.redirect(
        "/#" +
          querystring.stringify({
            error: "state_mismatch",
          })
      );
    } else {
      res.clearCookie("spotify_auth_state");
      const authOptions = {
        url: "https://accounts.spotify.com/api/token",
        form: {
          grant_type: "authorization_code",
          redirect_uri: secrets.redirectUri,
          code: code,
        },
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${secrets.clientId}:${secrets.clientSecret}`).toString(
              "base64"
            ),
        },
        json: true,
      };

      superagent
        .post(authOptions.url)
        .send(authOptions.form)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .set("Authorization", authOptions.headers.Authorization)
        .then((response: superagent.Response) => {
          const accessToken: string = response.body.access_token;
          const refreshToken: string = response.body.refresh_token;
          res.send({ access_code: accessToken, refresh_code: refreshToken });
        })
        .catch((err) => console.log(err));
    }
  } catch (err: unknown) {
    next(err);
  }
};

export default callbackController;
