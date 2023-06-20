import { Request, Response, NextFunction } from "express";
import querystring from "querystring";

import secrets from "../secrets";
import generateRandomString from "../utils/generateRandomString";
import stateKey from "../utils/stateKey";

const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const state: string = generateRandomString(16);
    res.cookie(stateKey, state);

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
};

export default loginController;
