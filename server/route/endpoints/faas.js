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
router_1.default.route('/faas::functionName')
    .get(middlewares_1.jwtVerify, async (req, res) => {
    (0, terminal_1.terminal)(`Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`);
    if (!req.headers.clusterid ||
        !req.params.functionName) {
        const error = {
            status: 500,
            message: 'Unable to fulfill request without all parameters (id, functionName) passed'
        };
        (0, terminal_1.terminal)(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
    }
    const { clusterid } = req.headers;
    const { functionName } = req.params;
    try {
        const cluster = await models_1.Cluster.findOne({ _id: clusterid });
        if (cluster) {
            const { url, faas_port, authorization } = cluster;
            const functionInfo = await (0, node_fetch_1.default)(`${url}:${faas_port}/system/function/${functionName}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': authorization
                },
            })
                .then(res => res.json());
            (0, terminal_1.terminal)(`Success: OpenFaaS function [${functionName} @ ${url}:${faas_port}] retrieved`);
            return res.status(200).json(functionInfo);
        }
        else {
            const error = {
                status: 401,
                message: `Fail: Cluster [${clusterid}] does not exist`,
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
router_1.default.route('/faas')
    .get(middlewares_1.jwtVerify, async (req, res) => {
    (0, terminal_1.terminal)(`Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`);
    if (req.query.OpenFaaSStore) {
        try {
            const functions = await (0, node_fetch_1.default)('https://raw.githubusercontent.com/openfaas/store/master/functions.json')
                .then(res => res.json());
            (0, terminal_1.terminal)(`Success: OpenFaaS Store functions retrieved`);
            return res.status(200).json(functions);
        }
        catch (err) {
            const error = {
                status: 500,
                message: `Unable to fulfill ${req.method} request: ${err}`
            };
            (0, terminal_1.terminal)(`Fail: ${error.message}`);
            return res.status(error.status).json(error);
        }
    }
    if (!req.headers.id) {
        const error = {
            status: 500,
            message: 'Unable to fulfill request without parameter (id) passed'
        };
        (0, terminal_1.terminal)(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
    }
    const { id } = req.headers;
    try {
        const cluster = await models_1.Cluster.findOne({ _id: id });
        if (cluster) {
            const { url, faas_port, authorization } = cluster;
            const functionInfo = await (0, node_fetch_1.default)(`${url}:${faas_port}/system/functions`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': authorization
                },
            })
                .then(res => res.json());
            (0, terminal_1.terminal)(`Success: Deployed OpenFaaS functions retrieved`);
            return res.status(200).json(functionInfo);
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
})
    .post(middlewares_1.jwtVerify, async (req, res) => {
    (0, terminal_1.terminal)(`Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`);
    // Validate request body
    if (!req.body.clusterId ||
        !req.body.service ||
        !req.body.image) {
        const error = {
            status: 500,
            message: 'Unable to fulfill request without all parameters (clusterId, service, image) passed'
        };
        (0, terminal_1.terminal)(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
    }
    try {
        const { clusterId, service, image } = req.body;
        const cluster = await models_1.Cluster.findOne({ _id: clusterId });
        if (cluster) {
            const { url, faas_port, authorization } = cluster;
            await (0, node_fetch_1.default)(`${url}:${faas_port}/system/functions`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': authorization
                },
                body: JSON.stringify({
                    service,
                    image
                })
            });
            (0, terminal_1.terminal)(`Success: OpenFaaS function [${service}] deployed`);
            return res.status(200).json({ success: true });
        }
        else {
            const error = {
                status: 401,
                message: `Fail: Cluster [${clusterId}] does not exist`,
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
})
    .delete(async (req, res) => {
    (0, terminal_1.terminal)(`Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`);
    if (!req.body.clusterId ||
        !req.body.functionName) {
        const error = {
            status: 500,
            message: 'Unable to fulfill request without all parameters (clusterId, functionName) passed'
        };
        (0, terminal_1.terminal)(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
    }
    try {
        const { clusterId, functionName } = req.body;
        const cluster = await models_1.Cluster.findOne({ _id: clusterId });
        if (cluster) {
            const { url, faas_port, authorization } = cluster;
            await (0, node_fetch_1.default)(`${url}:${faas_port}/system/functions`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': authorization
                },
                body: JSON.stringify({
                    functionName
                })
            })
                .then(res => res.text());
            (0, terminal_1.terminal)(`Success: OpenFaaS function [${functionName}] deleted`);
            return res.status(200).json({ success: true });
        }
        else {
            const error = {
                status: 401,
                message: `Fail: Cluster [${clusterId}] does not exist`,
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
router_1.default.route('/faas/invoke')
    .post(middlewares_1.jwtVerify, async (req, res) => {
    (0, terminal_1.terminal)(`Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`);
    if (!req.body.clusterId ||
        !req.body.functionName) {
        const error = {
            status: 500,
            message: 'Unable to fulfill request without all parameters (clusterId, functionName) passed'
        };
        (0, terminal_1.terminal)(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
    }
    try {
        const { clusterId, functionName, data } = req.body;
        const cluster = await models_1.Cluster.findOne({ _id: clusterId });
        if (cluster && data) {
            const { url, faas_port, authorization } = cluster;
            const body = data;
            const func = await (0, node_fetch_1.default)(`${url}:${faas_port}/function/${functionName}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': authorization
                },
                body: body
            })
                .then(res => res.text());
            (0, terminal_1.terminal)(`Success: OpenFaaS function [${functionName}] invoked`);
            return res.status(200).json(func);
        }
        else if (cluster && !data) {
            const { url, faas_port, authorization } = cluster;
            const func = await (0, node_fetch_1.default)(`${url}:${faas_port}/function/${functionName}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': authorization
                }
            })
                .then(res => res.text());
            (0, terminal_1.terminal)(`Success: OpenFaaS function [${functionName}] invoked`);
            return res.status(200).json(func);
        }
        else {
            const error = {
                status: 401,
                message: `Fail: Cluster [${clusterId}] does not exist`,
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
//# sourceMappingURL=faas.js.map