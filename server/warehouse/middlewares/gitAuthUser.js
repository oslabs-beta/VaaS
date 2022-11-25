"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const terminal_1 = require("../../services/terminal");
exports.default = async (req, res, next) => {
    (0, terminal_1.terminal)(`Received ${req.method} request at 'gitAuthUser' middleware`);
    const { firstName, lastName, username, password } = res.locals.newAcctInfo;
    console.log('PASSWORD IS : ', password);
    try {
        // if user has account
        if (res.locals.hasAcct === true) {
            if (!username || !password) {
                const error = {
                    status: 500,
                    message: 'Unable to fulfull request without all fields completed',
                };
                (0, terminal_1.terminal)(`Fail: ${error.message}`);
                return res.status(error.status).json(error);
            }
            // saving userId and password for next middleware
            res.locals.hashedPassword = res.locals.user.password;
            res.locals.userId = res.locals.user._id;
            (0, terminal_1.terminal)(`Success: Forwarding ${req.method} request to next middleware`);
            return next();
        }
        // if user not yet have acct
        else {
            if (!password ||
                !firstName ||
                !lastName) {
                const error = {
                    status: 500,
                    message: 'Unable to fulfull request without all fields completed'
                };
                (0, terminal_1.terminal)(`Fail: ${error.message}`);
                return res.status(error.status).json(error);
            }
            (0, terminal_1.terminal)(`Success: Forwarding ${req.method} request to next middleware`);
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
//# sourceMappingURL=gitAuthUser.js.map