"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const superagent_1 = __importDefault(require("superagent"));
const querystring_1 = __importDefault(require("querystring"));
const secrets_1 = __importDefault(require("../secrets"));
const stateKey_1 = __importDefault(require("../utils/stateKey"));
const callbackController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const code = req.query.code || null;
        const state = req.query.state || null;
        const storedState = req.cookies ? req.cookies[stateKey_1.default] : null;
        console.log(req.cookies);
        if (state === null || state !== storedState) {
            res.redirect("/#" +
                querystring_1.default.stringify({
                    error: "state_mismatch",
                }));
        }
        else {
            res.clearCookie("spotify_auth_state");
            const authOptions = {
                url: "https://accounts.spotify.com/api/token",
                form: {
                    grant_type: "authorization_code",
                    redirect_uri: secrets_1.default.redirectUri,
                    code: code,
                },
                headers: {
                    Authorization: "Basic " +
                        Buffer.from(`${secrets_1.default.clientId}:${secrets_1.default.clientSecret}`).toString("base64"),
                },
                json: true,
            };
            superagent_1.default
                .post(authOptions.url)
                .send(authOptions.form)
                .set("Content-Type", "application/x-www-form-urlencoded")
                .set("Authorization", authOptions.headers.Authorization)
                .then((response) => {
                const accessToken = response.body.access_token;
                const refreshToken = response.body.refresh_token;
                res.send({ access_code: accessToken, refresh_code: refreshToken });
            })
                .catch((err) => console.log(err));
        }
    }
    catch (err) {
        next(err);
    }
});
exports.default = callbackController;
