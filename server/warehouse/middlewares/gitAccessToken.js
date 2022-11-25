"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../models");
const terminal_1 = require("../../services/terminal");
const node_fetch_1 = __importDefault(require("node-fetch"));
require("dotenv");
exports.default = async (req, res, next) => {
    (0, terminal_1.terminal)(`Received ${req.method} request at 'gitAccessToken' middleware`);
    // grab code from body
    const { code } = req.body;
    // make make post request to github to get accesstoken
    try {
        const gitClientID = process.env.GITHUB_CLIENT_ID;
        const gitSecret = process.env.GITHUB_SECRET;
        const accessToken = await (0, node_fetch_1.default)(`https://github.com/login/oauth/access_token?client_id=${gitClientID}&client_secret=${gitSecret}&code=${code}`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
            }
        }).then((res) => res.json());
        // store token and return next
        res.locals.accessToken = accessToken;
        (0, terminal_1.terminal)(`Success: GithubToken received: ${res.locals.accessToken.access_token}`);
        // using token to request for userInfo
        const { access_token, token_type } = res.locals.accessToken;
        const authHeader = `${token_type} ${access_token}`;
        const gitHubData = await (0, node_fetch_1.default)(`https://api.github.com/user`, {
            method: 'GET',
            headers: {
                "Authorization": authHeader,
            }
        }).then((res => res.json()));
        console.log(`USER DATA IS : `, gitHubData);
        // set up acct info and return next 
        // eslint-disable-next-line prefer-const
        let { name, login, id } = gitHubData;
        const firstName = name.split(' ')[0];
        const lastName = name.split(' ')[1];
        id = id.toString();
        const newAcctInfo = {
            firstName,
            lastName,
            username: login,
            password: id,
            darkMode: false,
        };
        res.locals.newAcctInfo = newAcctInfo;
        const { username } = newAcctInfo;
        // checking if acct exist in db 
        (0, terminal_1.terminal)(`Searching for user [${username}] in MongoDB`);
        const user = await models_1.User.find({ username: username });
        (0, terminal_1.terminal)(`Success: MongoDB query executed [${username}]`);
        console.log(user);
        if (user[0]) {
            (0, terminal_1.terminal)(`Success: User [${username}] found in DB`);
            res.locals.hasAcct = true;
            res.locals.user = user[0];
            return next();
        }
        else {
            const error = {
                status: 401,
                message: 'Invalid credentials',
                invalid: true
            };
            (0, terminal_1.terminal)(`Fail: ${error.message}`);
            res.locals.hasAcct = false;
            return next();
        }
    }
    catch (err) {
        const error = {
            status: 500,
            message: `Unable to fulfill ${req.method} request: ${err}`
        };
        (0, terminal_1.terminal)(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
    }
};
//# sourceMappingURL=gitAccessToken.js.map