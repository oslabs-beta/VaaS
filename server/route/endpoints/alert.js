"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("../router"));
const middlewares_1 = require("../../warehouse/middlewares");
const terminal_1 = require("../../services/terminal");
const child_process_1 = require("child_process");
const js_yaml_1 = __importDefault(require("js-yaml"));
const fs_1 = __importDefault(require("fs"));
// import path from 'path';
// import { execPath } from 'process';
const findup_sync_1 = __importDefault(require("findup-sync"));
router_1.default.route('/alert')
    .get(middlewares_1.jwtVerify, async (req, res) => {
    (0, terminal_1.terminal)({ req });
    (0, terminal_1.terminal)(`Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`);
    (0, terminal_1.terminal)(`URL IS ${req.url}`);
    const { id, ns, q, expr, dur } = req.query;
    try {
        console.log('enters alert');
        const fileLoc = (0, findup_sync_1.default)('alert-rules.yaml');
        console.log('fileloc', fileLoc);
        const doc = js_yaml_1.default.load(fs_1.default.readFileSync(`${fileLoc}`, 'utf8'));
        doc["additionalPrometheusRulesMap"]["custom-rules"]["groups"][0]["rules"][0]["alert"] = q;
        doc["additionalPrometheusRulesMap"]["custom-rules"]["groups"][0]["rules"][0]["expr"] = expr;
        doc["additionalPrometheusRulesMap"]["custom-rules"]["groups"][0]["rules"][0]["for"] = dur;
        fs_1.default.writeFile(`${fileLoc}`, js_yaml_1.default.dump(doc), (err) => {
            if (err) {
                console.log('error with overwriting the yaml file');
                console.log(err);
            }
            const term = (0, child_process_1.execSync)(`helm upgrade --reuse-values -f ${fileLoc} prometheus prometheus-community/kube-prometheus-stack -n monitor`, { encoding: 'utf-8' });
            (0, terminal_1.terminal)(term);
        });
        return res.status(200).json(q);
    }
    catch (err) {
        const error = {
            status: 500,
            message: `Unable to alert fulfill ${req.method} request: ${err}`
        };
        (0, terminal_1.terminal)(`Fail in alert page: ${error.message}`);
        return res.status(error.status).json(error);
    }
});
exports.default = router_1.default;
//# sourceMappingURL=alert.js.map