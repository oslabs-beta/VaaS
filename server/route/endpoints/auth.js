"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("../router"));
const models_1 = require("../../models");
const middlewares_1 = require("../../warehouse/middlewares");
const terminal_1 = require("../../services/terminal");
router_1.default.route('/auth')
    // check if you are logged in? 
    .get(middlewares_1.jwtVerify, async (req, res) => {
    (0, terminal_1.terminal)(`Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`);
    try {
        (0, terminal_1.terminal)(`Success: Access to route is allowed`);
        return res.status(201).json({ invalid: false });
    }
    catch (err) {
        const error = {
            status: 500,
            message: `Unable to fulfill ${req.method} request: ${err}`
        };
        (0, terminal_1.terminal)(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
    }
})
    // create account
    .post(middlewares_1.authUser, middlewares_1.bcrypt, middlewares_1.jwtCreator, async (req, res) => {
    (0, terminal_1.terminal)(`Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`);
    try {
        const { username, firstName, lastName } = req.body, { userId, hashedPassword, jwt } = res.locals;
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
        return res.status(201).header("x-auth-token", jwt).json({ ...jwt, userId: userId });
    }
    catch (err) {
        const error = {
            status: 500,
            message: `Unable to fulfill ${req.method} request: ${err}`
        };
        (0, terminal_1.terminal)(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
    }
})
    // assign token when logging in
    .put(middlewares_1.authUser, middlewares_1.bcrypt, middlewares_1.jwtCreator, async (req, res) => {
    (0, terminal_1.terminal)(`Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`);
    try {
        const { jwt, userId } = res.locals;
        (0, terminal_1.terminal)('Success: User login information authenticated');
        return res.status(201).header("x-auth-token", jwt).json({ ...jwt, userId });
    }
    catch (err) {
        const error = {
            status: 500,
            message: `Unable to fulfill ${req.method} request: ${err}`
        };
        (0, terminal_1.terminal)(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
    }
});
exports.default = router_1.default;
//# sourceMappingURL=auth.js.map