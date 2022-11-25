"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("../router"));
const mongoose_1 = require("mongoose");
const models_1 = require("../../models");
const middlewares_1 = require("../../warehouse/middlewares");
const terminal_1 = require("../../services/terminal");
router_1.default.route('/cluster::name')
    .get(middlewares_1.jwtVerify, async (req, res) => {
    (0, terminal_1.terminal)(`Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`);
    try {
        const response = await models_1.Cluster.find({ name: req.params['name'] });
        if (response.length === 0) {
            const error = {
                status: 401,
                message: `Fail: Cluster [${req.params['name']}] does not exist`,
            };
            (0, terminal_1.terminal)(`Fail: ${error.message}`);
            return res.status(error.status).json(error);
        }
        (0, terminal_1.terminal)(`Success: Cluster [${req.params['name']}] document retrieved from MongoDB collection`);
        return res.status(200).json(response[0]);
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
router_1.default.route('/cluster')
    .get(middlewares_1.jwtVerify, async (req, res) => {
    (0, terminal_1.terminal)(`Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`);
    try {
        const clusters = await models_1.Cluster.find({});
        if (clusters.length === 0) {
            const error = {
                status: 401,
                message: `Fail: No cluster data exists`
            };
            return res.status(error.status).json(error);
        }
        (0, terminal_1.terminal)(`Success: All cluster documents retrieved from MongoDB collection`);
        return res.status(200).json(clusters);
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
    if (!req.body.url ||
        !req.body.k8_port ||
        !req.body.faas_port ||
        !req.body.faas_username ||
        !req.body.faas_password ||
        !req.body.name ||
        !req.body.description) {
        const error = {
            status: 500,
            message: 'Unable to fulfill request without all fields completed'
        };
        (0, terminal_1.terminal)(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
    }
    try {
        const { url, k8_port, faas_port, faas_username, faas_password, name, description } = req.body;
        (0, terminal_1.terminal)(`Searching for cluster [${name}] in MongoDB`);
        const cluster = await models_1.Cluster.find({ name: name });
        (0, terminal_1.terminal)(`Success: MongoDB query executed [${name}]`);
        if (cluster[0]) {
            const error = {
                status: 401,
                message: `Cluster [${cluster[0].name}] already exists`,
                exists: true
            };
            (0, terminal_1.terminal)(`Fail: ${error.message}`);
            return res.status(error.status).json(error);
        }
        const clusterId = new mongoose_1.Types.ObjectId();
        const encodeAuth = Buffer.from(`${faas_username}:${faas_password}`).toString('base64');
        const authorization = `Basic ${encodeAuth}`;
        const attempt = new models_1.Cluster({
            _id: clusterId,
            url,
            k8_port,
            faas_port,
            authorization,
            name,
            description,
            favorite: []
        });
        await attempt.save();
        (0, terminal_1.terminal)(`Success: New cluster [${clusterId}] stored in MongoDB collection`);
        return res.status(201).json({ success: true });
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
    .put(middlewares_1.jwtVerify, async (req, res) => {
    (0, terminal_1.terminal)(`Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`);
    // Validate request body
    if (!req.body.clusterId) {
        const error = {
            status: 500,
            message: 'Unable to fulfill request without clusterId'
        };
        (0, terminal_1.terminal)(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
    }
    if ((req.body.faas_username && !req.body.faas_password) ||
        (req.body.faas_password && !req.body.faas_username)) {
        const error = {
            status: 500,
            message: 'Unable to fulfill request without both OpenFaaS credentials, username and password'
        };
        (0, terminal_1.terminal)(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
    }
    try {
        const { clusterId, url, k8_port, faas_port, faas_username, faas_password, name, description } = req.body;
        const { jwt: { id } } = res.locals;
        // Check to see if cluster exists
        (0, terminal_1.terminal)(`Searching for cluster [${name}] in MongoDB`);
        const cluster = await models_1.Cluster.find({ _id: clusterId });
        (0, terminal_1.terminal)(`Success: MongoDB query executed [${name}]`);
        if (cluster.length === 0) {
            const error = {
                status: 401,
                message: `Fail: Cluster [${name}] does not exist`,
                exists: false
            };
            (0, terminal_1.terminal)(`Fail: ${error.message}`);
            return res.status(error.status).json(error);
        }
        let authorization;
        if (faas_username && faas_password) {
            const encodeAuth = Buffer.from(`${faas_username}:${faas_password}`).toString('base64');
            authorization = `Basic ${encodeAuth}`;
        }
        switch (req.body.favorite) {
            case true: {
                await models_1.Cluster.updateOne({ _id: clusterId }, {
                    url: url,
                    k8_port: k8_port,
                    faas_port: faas_port,
                    authorization: authorization,
                    name: name,
                    description: description,
                    $push: { favorite: id }
                });
                (0, terminal_1.terminal)(`Success: Cluster [${req.body.clusterId}] added to favorites`);
                return res.status(201).json({ success: true });
            }
            case false: {
                await models_1.Cluster.updateOne({ _id: clusterId }, {
                    url: url,
                    k8_port: k8_port,
                    faas_port: faas_port,
                    authorization: authorization,
                    name: name,
                    description: description,
                    $pull: { favorite: id }
                });
                (0, terminal_1.terminal)(`Success: Cluster [${req.body.clusterId}] removed from favorites`);
                return res.status(201).json({ success: true });
            }
            case undefined: {
                await models_1.Cluster.updateOne({ _id: clusterId }, {
                    url: url,
                    k8_port: k8_port,
                    faas_port: faas_port,
                    authorization: authorization,
                    name: name,
                    description: description
                });
                (0, terminal_1.terminal)(`Success: Cluster [${req.body.clusterId}] document updated`);
                return res.status(201).json({ success: true });
            }
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
    .delete(middlewares_1.jwtVerify, async (req, res) => {
    (0, terminal_1.terminal)(`Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`);
    // Validate request body
    if (!req.body.clusterId) {
        const error = {
            status: 500,
            message: 'Unable to fulfill request without clusterId'
        };
        (0, terminal_1.terminal)(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
    }
    try {
        const response = await models_1.Cluster.deleteOne({ _id: req.body.clusterId });
        if (response.deletedCount === 0) {
            const error = {
                status: 401,
                message: `Fail: Cluster [${req.body.clusterId}] either does not exist or could not be deleted`
            };
            (0, terminal_1.terminal)(`Fail: ${error.message}`);
            return res.status(error.status).json({ error });
        }
        (0, terminal_1.terminal)(`Success: Cluster [${req.body.clusterId}] deleted from MongoDB collection`);
        return res.status(200).json({ deleted: true });
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
//# sourceMappingURL=cluster.js.map