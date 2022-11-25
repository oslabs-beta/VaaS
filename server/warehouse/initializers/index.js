"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger"));
const check_1 = __importDefault(require("./check"));
// THESE MIDDLEWARES RUN BEFORE THE CONTROLLERS DO AND ARE EXECUTED IN ORDER
exports.default = {
    check: check_1.default,
    logger: logger_1.default
};
//# sourceMappingURL=index.js.map