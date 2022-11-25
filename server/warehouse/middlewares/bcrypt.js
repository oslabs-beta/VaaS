"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const models_1 = require("../../models");
const bcrypt_1 = __importDefault(require("bcrypt"));
const terminal_1 = require("../../services/terminal");
exports.default = async (req, res, next) => {
    (0, terminal_1.terminal)(`Received ${req.method} request at 'bcrypt' middleware`);
    console.log(res.locals.newAcctInfo);
    let { password } = req.body;
    if (res.locals.newAcctInfo) {
        password = res.locals.newAcctInfo.password;
    }
    console.log('PASSWORD: ', password);
    const saltRounds = 10;
    /* REGISTER USER */
    if (!res.locals.hashedPassword) {
        res.locals.userId = new mongoose_1.Types.ObjectId();
        res.locals.hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
        (0, terminal_1.terminal)(`Success: Password hashed`);
    }
    /* LOGIN USER OR VERIFY PASSWORD FOR DELETE USER */
    else {
        let { username } = req.body;
        if (res.locals.newAcctInfo) {
            username = res.locals.newAcctInfo.username;
        }
        (0, terminal_1.terminal)(`Searching for user [${username}] in MongoDB`);
        const user = await models_1.User.find({ username: username });
        (0, terminal_1.terminal)(`Success: MongoDB query executed [${username}]`);
        res.locals.userId = user[0]._id;
        const result = await bcrypt_1.default.compare(password, res.locals.hashedPassword);
        if (!result) {
            const error = {
                status: 401,
                message: 'Invalid credentials',
                invalid: true
            };
            (0, terminal_1.terminal)(`Fail: ${error.message}`);
            return res.status(error.status).json(error);
        }
    }
    (0, terminal_1.terminal)(`Success: Forwarding ${req.method} request to next middleware`);
    return next();
};
//# sourceMappingURL=bcrypt.js.map