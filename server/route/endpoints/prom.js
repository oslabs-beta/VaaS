"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("../router"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const models_1 = require("../../models");
const middlewares_1 = require("../../warehouse/middlewares");
const terminal_1 = require("../../services/terminal");
router_1.default.route('/prom')
    .get(middlewares_1.jwtVerify, async (req, res) => {
    (0, terminal_1.terminal)(`Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`);
    (0, terminal_1.terminal)(req.query);
    (0, terminal_1.terminal)(`URL IS ${req.url}`);
    if (!req.query.id ||
        !req.query.ns ||
        !req.query.q) {
        const error = {
            status: 500,
            message: 'Unable to fulfill request without all parameters (id, ns, q) passed'
        };
        (0, terminal_1.terminal)(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
    }
    const { id, ns, q } = req.query;
    try {
        const cluster = await models_1.Cluster.findOne({ _id: id });
        if (cluster) {
            const { url, k8_port, faas_port } = cluster;
            let port;
            switch (ns) {
                case 'k8':
                    port = k8_port;
                    break;
                case 'faas':
                    port = faas_port;
                    break;
                default: {
                    const error = {
                        status: 401,
                        message: `Fail: Invalid namespace [${ns}] passed (k8 || faas)`,
                    };
                    return res.status(error.status).json(error);
                }
            }
            const metric = await (0, node_fetch_1.default)(`${url}:${port}/api/v1/query?query=${q}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json());
            (0, terminal_1.terminal)(`Success: PromQL query [${q}] executed`);
            return res.status(200).json(metric);
        }
        else {
            const error = {
                status: 401,
                message: `Fail: Cluster [${id}] does not exist`,
                exists: false
            };
            (0, terminal_1.terminal)(`Fail: ${error.message}`);
            return res.status(error.status).json(error);
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
});
exports.default = router_1.default;
//# sourceMappingURL=prom.js.map