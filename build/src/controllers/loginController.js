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
const querystring_1 = __importDefault(require("querystring"));
const secrets_1 = __importDefault(require("../secrets"));
const generateRandomString_1 = __importDefault(require("../utils/generateRandomString"));
const stateKey_1 = __importDefault(require("../utils/stateKey"));
const loginController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const state = (0, generateRandomString_1.default)(16);
        res.cookie(stateKey_1.default, state);
        const scope = "user-read-private user-read-email user-top-read user-follow-read user-read-recently-played playlist-read-private playlist-read-collaborative";
        const params = querystring_1.default.stringify({
            response_type: "code",
            client_id: secrets_1.default.clientId,
            scope,
            redirect_uri: secrets_1.default.redirectUri,
            state,
        });
        res.redirect("https://accounts.spotify.com/authorize?" + params);
    }
    catch (err) {
        next(err);
    }
});
exports.default = loginController;
