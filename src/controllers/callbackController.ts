import { Request, Response, NextFunction } from "express";
import superagent from "superagent";
import querystring from "querystring";

import secrets from "../secrets";
import stateKey from "../utils/stateKey";
import StatsGetter from "./StatsGetter";

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
        .then(async (response: superagent.Response) => {
          const accessToken: string = response.body.access_token;
          const refreshToken: string = response.body.refresh_token;
          const statsGetter: StatsGetter = new StatsGetter(accessToken)


          const data = {
            topArtists: await statsGetter.getUsersTopArtists("https://api.spotify.com/v1/me/top/artists"), topTracks: await statsGetter.getUsersTopTracks("https://api.spotify.com/v1/me/top/tracks"), usersRecentlyPlayed: await statsGetter.getUsersRecentlyPlayed("https://api.spotify.com/v1/me/player/recently-played"), usersRecentlyPlayedMinutes: await statsGetter.getUsersRecentlyPlayedMinutes("https://api.spotify.com/v1/me/player/recently-played")
          }
          res.send(data);
        })
        .catch((err) => console.log(err));
    }
  } catch (err: unknown) {
    next(err);
  }
};

export default callbackController;
