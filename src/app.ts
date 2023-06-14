import express, { Request, Response, NextFunction, Express } from "express";
import { URLSearchParams } from "url";
import superagent from "superagent";
import SpotifyWebApi from "spotify-web-api-node";
import initSpotifyApi from "./utils/initSpotifyApi";
import { Buffer } from "buffer";
import querystring from "querystring";
import generateRandomString from "./utils/generateRandomString";
import secrets from "./secrets";

const stateKey = "spotify_auth_state";
const spotifyApi = initSpotifyApi();

const app: Express = express();

app.get("/", (req: Request, res: Response, next: NextFunction): void => {
  res.send("Hello World!");
});

/**
 * Redirects user to the spotify login page to provide authorization.
 * The authorization code is then used to get an access token and refresh token
 */
app.get(
  "/login",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const state: string = generateRandomString(16);
      // res.cookie(stateKey, state);

      const scope =
        "user-read-private user-read-email user-top-read user-follow-read user-read-recently-played playlist-read-private playlist-read-collaborative";
      const params: string = querystring.stringify({
        response_type: "code",
        client_id: secrets.clientId,
        scope,
        redirect_uri: secrets.redirectUri,
        state,
      });

      res.redirect("https://accounts.spotify.com/authorize?" + params);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * This is where the user will be redirected after they login.
 */
app.get(
  "/callback",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const code = req.query.code || null;
      const state = req.query.state || null;
      const storedState = req.cookies ? req.cookies[stateKey] : null;
      // console.log(req.cookies);

      if (state === null) {
        res.redirect(
          "/#" +
            querystring.stringify({
              error: "state_mismatch",
            })
        );
      } else {
        // res.clearCookie("spotify_auth_state");
        const authOptions = {
          url: "https://accounts.spotify.com/api/token",
          form: {
            code: code,
            redirect_uri: secrets.redirectUri,
            grant_type: "authorization_code",
          },
          headers: {
            Authorization:
              "Basic " +
              Buffer.from(
                `${secrets.clientId}:${secrets.clientSecret}`
              ).toString("base64"),
          },
          json: true,
        };

        superagent
          .post(authOptions.url)
          .send(authOptions.form)
          .accept("json")
          .set("Content-Type", "application/x-www-form-urlencoded")
          .set("Authorization", authOptions.headers.Authorization)
          .then((res) => {
            const accessToken = res.body.access_token;
            const refreshToken = res.body.refresh_token;
            spotifyApi.setAccessToken(accessToken);
            spotifyApi.setRefreshToken(refreshToken);
          })
          .catch((err) => console.log(err));

        // res.send({ code: spotifyApi.getAccessToken() });
      }
    } catch (err: any) {
      res.status(400).send(err.message);
      // next(err);
    }
  }
);

export default app;
