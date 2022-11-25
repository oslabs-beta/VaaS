"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("../router"));
const models_1 = require("../../models");
const middlewares_1 = require("../../warehouse/middlewares");
const terminal_1 = require("../../services/terminal");
router_1.default.route('/user::username')
    // logging in 
    .get(middlewares_1.jwtVerify, async (req, res) => {
    (0, terminal_1.terminal)(`Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`);
    console.log('HERE ', req.params);
    try {
        const user = await models_1.User.find({ username: req.params['username'] });
        if (user.length === 0) {
            const error = {
                status: 401,
                message: `Fail: User [${req.params['username']}] does not exist`,
                exists: false
            };
            (0, terminal_1.terminal)(`Fail: ${error.message}`);
            console.log('FAILED');
            return res.status(error.status).json(error);
        }
        (0, terminal_1.terminal)(`Success: User [${req.params['username']}] document retrieved from MongoDB collection`);
        console.log(user);
        return res.status(200).json(user[0]);
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
router_1.default.route('/user')
    // get userData
    .get(middlewares_1.jwtVerify, async (req, res) => {
    (0, terminal_1.terminal)(`Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`);
    try {
        const users = await models_1.User.find({});
        if (users.length === 0) {
            const error = {
                status: 401,
                message: `Fail: No user data exists`,
                exists: false
            };
            (0, terminal_1.terminal)(`Fail: ${error.message}`);
            return res.status(error.status).json(error);
        }
        (0, terminal_1.terminal)(`Success: No user data exists in MongoDB collection`);
        return res.status(200).json(users);
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
    // update user settings 
    .put(middlewares_1.jwtVerify, async (req, res) => {
    (0, terminal_1.terminal)(`Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`);
    const { username, firstName, lastName, darkMode, refreshRate } = req.body;
    const { jwt: { id } } = res.locals;
    try {
        // Check to see if cluster exists
        (0, terminal_1.terminal)(`Searching for user [${username}] in MongoDB`);
        const user = await models_1.User.find({ _id: id });
        (0, terminal_1.terminal)(`Success: MongoDB query executed [${username}]`);
        if (user.length === 0) {
            const error = {
                status: 401,
                message: `Fail: User [${username}] does not exist`,
                exists: false
            };
            (0, terminal_1.terminal)(`Fail: ${error.message}`);
            return res.status(error.status).json(error);
        }
        await models_1.User.updateOne({ _id: id }, {
            username: username,
            firstName: firstName,
            lastName: lastName,
            darkMode: darkMode,
            refreshRate: refreshRate
        });
        (0, terminal_1.terminal)(`Success: User [${req.body.username}] document updated`);
        return res.status(201).json({ success: true });
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
    // delete admin account
    .delete(middlewares_1.authUser, middlewares_1.bcrypt, middlewares_1.jwtVerify, async (req, res) => {
    (0, terminal_1.terminal)(`Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`);
    try {
        const response = await models_1.User.deleteOne({ username: req.body.username });
        if (response.deletedCount === 0) {
            const error = {
                status: 401,
                message: `Fail: User [${req.body.username}] either does not exist or could not be deleted`
            };
            (0, terminal_1.terminal)(`Fail: ${error.message}`);
            return res.status(error.status).json({ error });
        }
        (0, terminal_1.terminal)(`Success: User [${req.body.username}] deleted from MongoDB collection`);
        return res.status(200).json({ deleted: true });
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
//# sourceMappingURL=user.js.map