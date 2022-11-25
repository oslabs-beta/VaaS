"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../../services/jwt");
const terminal_1 = require("../../services/terminal");
exports.default = (req, res, next) => {
    (0, terminal_1.terminal)(`Received ${req.method} request at 'jwtCreator' middleware`);
    const { username } = req.body, { userId } = res.locals;
    const partialSession = {
        id: userId,
        username: username
    };
    res.locals.jwt = (0, jwt_1.encodeSession)(process.env.JWT_ACCESS_SECRET, partialSession);
    (0, terminal_1.terminal)(`Success: JWT created: ${res.locals.jwt} for ${username}`);
    return next();
};
//# sourceMappingURL=jwtCreator.js.map