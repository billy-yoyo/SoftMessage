"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const channel_1 = __importDefault(require("./channel"));
const user_1 = __importDefault(require("./user"));
const router = express_1.Router();
router.use('/channel', channel_1.default);
router.use('/user', user_1.default);
exports.default = router;
//# sourceMappingURL=router.js.map