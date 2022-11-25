"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoDb_1 = __importDefault(require("../mongoDb"));
const { mongo: { model } } = mongoDb_1.default;
const userSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    darkMode: Boolean,
    refreshRate: Number
});
// THIRD PARAMETER DEFINES DEFAULT COLLECTION NAME
exports.default = model('User', userSchema, 'users');
//# sourceMappingURL=user.js.map