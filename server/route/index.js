"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("./endpoints/auth"));
const user_1 = __importDefault(require("./endpoints/user"));
const cluster_1 = __importDefault(require("./endpoints/cluster"));
const prom_1 = __importDefault(require("./endpoints/prom"));
const faas_1 = __importDefault(require("./endpoints/faas"));
const gateway_1 = __importDefault(require("./endpoints/gateway"));
const alert_1 = __importDefault(require("./endpoints/alert"));
const github_1 = __importDefault(require("./endpoints/github"));
const gcheck_1 = __importDefault(require("./endpoints/gcheck"));
exports.default = {
    auth: auth_1.default,
    user: user_1.default,
    cluster: cluster_1.default,
    prom: prom_1.default,
    faas: faas_1.default,
    gateway: gateway_1.default,
    alert: alert_1.default,
    github: github_1.default,
    gcheck: gcheck_1.default
};
//# sourceMappingURL=index.js.map