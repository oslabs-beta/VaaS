"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const initializers_1 = __importDefault(require("../warehouse/initializers"));
const router = express_1.default.Router();
// FUNNEL REQUEST DATA THROUGH INITIALIZING MIDDLEWARES
router.use(Object.values(initializers_1.default));
// ALL INITIALIZERS RUN BEFORE REACHING ENDPOINTS
exports.default = router;
//# sourceMappingURL=router.js.map