import { Request, Response, NextFunction } from "express";
import superagent from "superagent";
import querystring from "querystring";

import secrets from "../secrets";
import stateKey from "../utils/stateKey";

const getUsersTopArtists = async (url: string, accessToken: string) => {
  try {
    const topArtists = await superagent.get(url)
      .query({ time_range: "short_term", limit: "5" })
      .set("Authorization", `Bearer ${accessToken}`)
      .then((res: superagent.Response) => res.body.items.map((artist: any) => artist.name))
      .catch(err => {
        console.log(err)
      });

    return topArtists
  } catch (err) {
    console.log(err);
  }
}

const getUsersTopTracks = async (url: string, accessToken: string) => {
  try {
    const topTracks = await superagent.get(url)
      .query({ time_range: "short_term", limit: "5" })
      .set("Authorization", `Bearer ${accessToken}`)
      .then((res: superagent.Response) => res.body.items.map((track: any) => track.name))
      .catch(err => {
        console.log(err)
      });

    return topTracks
  } catch (err) {
    console.log(err);
  }
}


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
          res.send({ topArtists: await getUsersTopArtists("https://api.spotify.com/v1/me/top/artists", accessToken), topTracks: await getUsersTopTracks("https://api.spotify.com/v1/me/top/tracks", accessToken) });
        })
        .catch((err) => console.log(err));
    }
  } catch (err: unknown) {
    next(err);
  }
};

export default callbackController;
