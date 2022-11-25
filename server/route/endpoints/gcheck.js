"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("../router"));
const terminal_1 = require("../../services/terminal");
const models_1 = require("../../models");
router_1.default.route('/gcheck')
    .post((req, res) => {
    const { username } = req.body;
    models_1.User.find({ username: username })
        .then(response => {
        console.log(response);
        if (response[0])
            res.status(200).json(true);
        else
            res.status(200).json(false);
    })
        .catch(err => {
        const error = {
            status: 500,
            message: `Failed at gcheck: ${err}`
        };
        (0, terminal_1.terminal)(`fail: ${error}`);
    });
});
exports.default = router_1.default;
//# sourceMappingURL=gcheck.js.map