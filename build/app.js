"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const querystring_1 = __importDefault(require("querystring"));
const generateRandomString_1 = __importDefault(require("./utils/generateRandomString"));
const secrets_1 = __importDefault(require("./secrets"));
const app = (0, express_1.default)();
app.get("/", (req, res, next) => {
    res.send("Hello World!");
});
app.get("/login", (req, res, next) => {
    const state = (0, generateRandomString_1.default)(16);
    const scope = "user-read-private user-read-email";
    const params = querystring_1.default.stringify({
        response_type: "code",
        client_id: secrets_1.default.clientId,
        scope,
        redirect_uri: "http://localhost:3000/callback",
        state,
    });
    res.redirect("https://accounts.spotify.com/authorize?" + params);
});
exports.default = app;
