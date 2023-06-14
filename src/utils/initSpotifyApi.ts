import SpotifyWebApi from "spotify-web-api-node";
import secrets from "../secrets";

function initSpotifyApi() {
  return new SpotifyWebApi({
    clientId: secrets.clientId,
    clientSecret: secrets.clientSecret,
    redirectUri: secrets.redirectUri,
  });
}

export default initSpotifyApi;
