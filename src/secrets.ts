import Secrets from "./types/Secrets";
import dotenv from "dotenv";
dotenv.config();

const secrets: Secrets = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
};

export default secrets;
