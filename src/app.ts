import express, { Express } from "express";
import cookieParser from "cookie-parser";
import path from "path";

import loginController from "./controllers/loginController";
import callbackController from "./controllers/callbackController";
import homeController from "./controllers/homeController";
import statsController from "./controllers/statsController";

const app: Express = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

/**
 * Renders the home page
 */
app.get("/", homeController);

/**
 * Renders the stats page
 */
app.get("/stats", statsController)

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
