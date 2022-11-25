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
router_1.default.route("/gateway")
    .get(middlewares_1.jwtVerify, async (req, res) => {
    (0, terminal_1.terminal)(`Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`);
    (0, terminal_1.terminal)(req.query);
    if (!req.query.id || !req.query.q) {
        const error = {
            status: 500,
            message: 'Unable to fulfill request without all parameters (id, q) passed'
        };
        (0, terminal_1.terminal)(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
    }
    const { id, q, type } = req.query;
    console.log('q', q);
    try {
        const cluster = await models_1.Cluster.findOne({ _id: id });
        if (cluster) {
            const { url, k8_port } = cluster;
            const data = await (0, node_fetch_1.default)(`${url}:${k8_port}/api/v1/query?query=${q}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json());
            (0, terminal_1.terminal)(`Success: PromQL query [${q}] executed`);
            // cleaning up the data send back to front end according to type of query it is
            if (type === "avg") {
                const dataCleaned = {
                    function_name: data.data.result[0].metric.function_name,
                    value: data.data.result[0].value[1]
                };
                return res.status(200).json(dataCleaned);
            }
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
//# sourceMappingURL=gateway.js.map