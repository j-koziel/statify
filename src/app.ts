import express, { Request, Response, NextFunction, Express } from "express";

import loginController from "./controllers/loginController";
import callbackController from "./controllers/callbackController";

const stateKey = "spotify_auth_state";

const app: Express = express();

app.get("/", (req: Request, res: Response, next: NextFunction): void => {
  res.send("Hello World!");
});

/**
 * Redirects user to the spotify login page to provide authorization.
 * The authorization code is then used to get an access token and refresh token
 */
app.get("/login", loginController);

/**
 * This is where the user will be redirected after they login.
 */
app.get("/callback", callbackController);

export default app;
