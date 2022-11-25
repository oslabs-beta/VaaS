"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../models");
const terminal_1 = require("../../services/terminal");
exports.default = async (req, res, next) => {
    (0, terminal_1.terminal)(`Received ${req.method} request at 'authUser' middleware`);
    try {
        if (!req.body.username) {
            const error = {
                status: 500,
                message: 'Unable to fulfull request without username'
            };
            (0, terminal_1.terminal)(`Fail: ${error.message}`);
            return res.status(error.status).json(error);
        }
        const { username } = req.body;
        (0, terminal_1.terminal)(`Searching for user [${username}] in MongoDB`);
        const user = await models_1.User.find({ username: username });
        (0, terminal_1.terminal)(`Success: MongoDB query executed [${username}]`);
        /* REGISTER USER */
        if (req.method === 'POST') {
            // Validate request body
            if (!req.body.password ||
                !req.body.firstName ||
                !req.body.lastName) {
                const error = {
                    status: 500,
                    message: 'Unable to fulfull request without all fields completed'
                };
                (0, terminal_1.terminal)(`Fail: ${error.message}`);
                return res.status(error.status).json(error);
            }
            // If username does exist, send boolean to client demonstrating "user already exists"
            if (user[0]) {
                const error = {
                    status: 401,
                    message: `User [${user[0].username}] already exists`,
                    exists: true
                };
                (0, terminal_1.terminal)(`Fail: ${error.message}`);
                return res.status(error.status).json(error);
            }
        }
        /* LOGIN USER */
        if ((req.url === '/auth' && req.method === 'PUT') ||
            (req.url === '/user' && req.method === 'DELETE')) {
            // Validate request body
            if (!req.body.username || !req.body.password) {
                const error = {
                    status: 500,
                    message: 'Unable to fulfull request without all fields completed',
                };
                (0, terminal_1.terminal)(`Fail: ${error.message}`);
                return res.status(error.status).json(error);
            }
            // If username does not exist, send message to client saying "Invalid credentials"
            if (!user[0]) {
                const error = {
                    status: 401,
                    message: 'Invalid credentials',
                    invalid: true
                };
                (0, terminal_1.terminal)(`Fail: ${error.message}`);
                return res.status(error.status).json(error);
            }
            // If it does exist, save stored password to res.locals.hashedPassword
            (0, terminal_1.terminal)(`Success: User [${user[0].username}] found`);
            res.locals.hashedPassword = user[0].password;
            res.locals.userId = user[0]._id;
        }
        (0, terminal_1.terminal)(`Success: Forwarding ${req.method} request to next middleware`);
        return next();
    }
    catch (err) {
        const error = {
            status: 500,
            message: `Unable to fulfull request at '${req.baseUrl}${req.url}' endpoint: ${err}`
        };
        (0, terminal_1.terminal)(err);
        return res.status(error.status).json(error);
    }
};
//# sourceMappingURL=authUser.js.map