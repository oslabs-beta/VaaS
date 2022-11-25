"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("../router"));
const terminal_1 = require("../../services/terminal");
const models_1 = require("../../models");
const middlewares_1 = require("../../warehouse/middlewares");
router_1.default.route('/github')
    .post(middlewares_1.gitAccessToken, middlewares_1.gitAuthUser, middlewares_1.bcrypt, middlewares_1.jwtCreator, async (req, res) => {
    (0, terminal_1.terminal)(`Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`);
    try {
        if (res.locals.hasAcct === false) {
            const { username, firstName, lastName } = res.locals.newAcctInfo, { userId, hashedPassword, jwt } = res.locals;
            const attempt = new models_1.User({
                _id: userId,
                username,
                password: hashedPassword,
                firstName,
                lastName,
                darkMode: false,
                refreshRate: 60000
            });
            await attempt.save();
            (0, terminal_1.terminal)(`Success: New user [${userId}] stored in MongoDB collection`);
            return res.status(201).header("x-auth-token", jwt).json({ ...jwt, userId: userId, name: username });
        }
        else {
            const { jwt, userId } = res.locals, { username } = res.locals.newAcctInfo;
            (0, terminal_1.terminal)('Success: User login information authenticated');
            return res.status(201).header("x-auth-token", jwt).json({ ...jwt, userId, name: username });
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
    // redirect to auth user to set header and create account
});
exports.default = router_1.default;
//# sourceMappingURL=github.js.map