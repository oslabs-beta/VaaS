"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const route_1 = __importDefault(require("./route"));
const mongoDb_1 = __importDefault(require("./mongoDb"));
require("dotenv");
const terminal_1 = require("./services/terminal");
const app = (0, express_1.default)();
mongoDb_1.default.connect();
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
const port = Number(process.env.EXPRESS_PORT) || 3020;
app.use(express_1.default.static(path_1.default.join(__dirname, '../dist')));
app.get('/', (req, res) => {
    (0, terminal_1.terminal)('sending index.html');
    res.sendFile(path_1.default.join(__dirname, '../dist/index.html'));
});
const routes = Object.values(route_1.default);
app.use('/api', routes);
app.listen(port);
console.log(`VaaS is awake on port: ${port}`);
//# sourceMappingURL=index.js.map