"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../../services/jwt");
const terminal_1 = require("../../services/terminal");
exports.default = (req, res, next) => {
    (0, terminal_1.terminal)(`Received ${req.method} request at 'jwtVerify' middleware`);
    const authorized = (0, jwt_1.decodeSession)(process.env.JWT_ACCESS_SECRET, req.headers.authorization);
    console.log(authorized);
    if (authorized.type === 'valid') {
        res.locals.jwt = authorized.session;
        const tokenStatus = (0, jwt_1.checkExpStatus)(authorized.session);
        console.log(tokenStatus);
        if (tokenStatus === 'active') {
            (0, terminal_1.terminal)(`Success: JWT is ${tokenStatus}: [${req.headers.authorization}]`);
            console.log(`Success: JWT is ${tokenStatus}: [${req.headers.authorization}]`);
            return next();
        }
        else {
            const error = {
                status: 401,
                message: `JWT is ${tokenStatus}: [${req.headers.authorization}]`,
                invalid: true
            };
            (0, terminal_1.terminal)(`Fail: ${error.message}`);
            return res.status(error.status).json(error);
        }
    }
    else {
        const error = {
            status: 401,
            message: `JWT not verified: [${req.headers.authorization}]}`,
            invalid: true
        };
        (0, terminal_1.terminal)(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
    }
};
//# sourceMappingURL=jwtVerify.js.map