"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const terminal_1 = require("../../services/terminal");
// logs when a request is made
exports.default = (req, res, next) => {
    console.clear();
    const date = new Date();
    (0, terminal_1.terminal)([{
            date: `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`,
            method: req.method,
            url: `${req.baseUrl}${req.url}`,
            body: req.body,
            query: req.query
        }]);
    return next();
};
//# sourceMappingURL=logger.js.map