import Secrets from "./types/Secrets";
import dotenv from "dotenv";
dotenv.config();

// Storing secrets from .env file
const secrets: Secrets = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
};

export default secrets;
