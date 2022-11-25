"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("../../route/path"));
const terminal_1 = require("../../services/terminal");
// check if method is valid for the endpoint
exports.default = (req, res, next) => {
    (0, terminal_1.terminal)(`${req.method} request routed to '${req.baseUrl}${req.url}' from ${req.socket.remoteAddress}`);
    let route = (0, path_1.default)(req.url);
    if (Object.keys(req.query).length > 0) {
        route = (0, path_1.default)(req.url.substring(0, req.url.indexOf('?')));
    }
    if (req.url.search(':') !== -1) {
        route = (0, path_1.default)(req.url.substring(0, req.url.indexOf(':')));
    }
    if (route.methods.includes(req.method)) {
        (0, terminal_1.terminal)(`Success: ${req.method} method is valid for this endpoint`);
        return next();
    }
    else {
        const error = {
            status: 405,
            message: 'This type of method is not supported by this endpoint'
        };
        res.setHeader('allow', route.methods);
        return res.status(405).json(error);
    }
};
//# sourceMappingURL=check.js.map