import express, { Request, Response, NextFunction, Express } from "express";
import cookieParser from "cookie-parser";

import loginController from "./controllers/loginController";
import callbackController from "./controllers/callbackController";

const app: Express = express();

app.use(cookieParser());

app.get(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.send("Hello World!");
    } catch (err) {
      next(err);
    }
  }
);

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
