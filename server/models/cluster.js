"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoDb_1 = __importDefault(require("../mongoDb"));
const { mongo: { model } } = mongoDb_1.default;
const clusterSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    url: String,
    k8_port: Number,
    faas_port: Number,
    authorization: String,
    name: String,
    description: String,
    favorite: [mongoose_1.Schema.Types.ObjectId],
});
// THIRD PARAMETER DEFINES DEFAULT COLLECTION NAME
exports.default = model('Cluster', clusterSchema, 'clusters');
//# sourceMappingURL=cluster.js.map