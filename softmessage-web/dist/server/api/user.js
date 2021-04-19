"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRow_1 = __importDefault(require("../dto/userRow"));
const channelRow_1 = __importDefault(require("../dto/channelRow"));
const withDb_1 = __importDefault(require("./lib/withDb"));
const router = express_1.Router();
router.get('/:userId', withDb_1.default((connection, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
        return res.status(400).json({ message: `Invalid userId: ${req.params.userId}, must be an integer` });
    }
    const userRow = yield connection.sm_user.query({ user_id: userId }).findOne();
    const user = userRow_1.default(userRow);
    res.status(200).json(user);
})));
router.get('/', withDb_1.default((connection, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rawUserIds = req.query.userIds;
    if (!rawUserIds) {
        return res.status(400).json({ message: 'Missing userIds query parameter' });
    }
    const userIds = rawUserIds.split(',').map(parseInt);
    if (userIds.some(isNaN)) {
        return res.status(400).json({ message: 'Invalid userId, all userids must be integers' });
    }
    const userRows = yield connection.sm_user.queryOr(userIds.map(id => ({ user_id: id }))).findAll();
    const users = userRows.map(userRow_1.default);
    res.status(200).json(users);
})));
router.get('/:userId/channels', withDb_1.default((connection, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
        return res.status(400).json({ message: `Invalid userId: ${req.params.userId}, must be an integer` });
    }
    const userChannelRows = yield connection.sm_channel_users.query({ user_id: userId }).findAll();
    if (userChannelRows.length > 0) {
        const channelRows = yield connection.sm_channel.queryOr(userChannelRows.map(row => ({ channel_id: row.channel_id }))).findAll();
        const channels = channelRows.map(channelRow_1.default);
        res.status(200).json(channels);
    }
    else {
        res.status(200).json([]);
    }
})));
exports.default = router;
//# sourceMappingURL=user.js.map