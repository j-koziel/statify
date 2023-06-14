import express, { Request, Response, NextFunction } from "express";
import { URLSearchParams } from "url";
import querystring from "querystring";
import generateRandomString from "./utils/generateRandomString";
import secrets from "./secrets";

const app = express();

app.get("/", (req: Request, res: Response, next: NextFunction): void => {
  res.send("Hello World!");
});

/**
 * Redirects user to the spotify login page to provide authorization.
 * The authorization code is then used to get an access token and refresh token
 */
app.get("/login", (req: Request, res: Response, next: NextFunction): void => {
  const state: string = generateRandomString(16);
  const scope =
    "user-read-private user-read-email user-top-read user-follow-read user-read-recently-played playlist-read-private playlist-read-collaborative";
  const params: string = querystring.stringify({
    response_type: "code",
    client_id: secrets.clientId,
    scope,
    redirect_uri: "http://localhost:3000/callback",
    state,
  });

  res.redirect("https://accounts.spotify.com/authorize?" + params);
});

/**
 * This is where the user will be redirected after they login.
 */
app.get(
  "/callback",
  (req: Request, res: Response, next: NextFunction): void => {
    res.send("IT WORKED!!!!!");
  }
);

export default app;
