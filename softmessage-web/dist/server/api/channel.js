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
const withDb_1 = __importDefault(require("./lib/withDb"));
const channelRow_1 = __importDefault(require("../dto/channelRow"));
const messageRow_1 = __importDefault(require("../dto/messageRow"));
const router = express_1.Router();
router.get('/:channelId', withDb_1.default((connection, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const channelId = parseInt(req.params.channelId);
    if (isNaN(channelId)) {
        return res.status(400).json({ message: `Invalid channelId: ${req.params.channelId}, must be an integer` });
    }
    const channelRow = yield connection.sm_channel.query({ channel_id: channelId }).findOne();
    const channel = channelRow_1.default(channelRow);
    res.status(200).json(channel);
})));
router.get('/:channelId/users', withDb_1.default((connection, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const channelId = parseInt(req.params.channelId);
    if (isNaN(channelId)) {
        return res.status(400).json({ message: `Invalid channelId: ${req.params.channelId}, must be an integer` });
    }
    const userChannelRows = yield connection.sm_channel_users.query({ channel_id: channelId }).findAll();
    if (userChannelRows.length > 0) {
        const userRows = yield connection.sm_user.queryOr(userChannelRows.map(row => ({ user_id: row.user_id }))).findAll();
        const userIds = userRows.map(row => row.user_id);
        res.status(200).json(userIds);
    }
    else {
        res.status(200).json([]);
    }
})));
router.get('/:channelId/messages', withDb_1.default((connection, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.query.endDate) {
        return res.status(400).json({ message: 'Missing endDate query parameter' });
    }
    if (!req.query.amount) {
        return res.status(400).json({ message: 'Missing amount query parameter' });
    }
    const endDate = new Date(req.query.endDate);
    if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
        return res.status(400).json({ message: 'Invalid endDate parameter, must be a valid datestring' });
    }
    const amount = parseInt(req.query.amount);
    if (isNaN(amount)) {
        return res.status(400).json({ message: 'Invalid amount parameter, must be an integer' });
    }
    const messageRows = yield connection.sm_message.getMessagesBefore(endDate, amount);
    const messages = messageRows.map(messageRow_1.default);
    res.status(200).json(messages);
})));
exports.default = router;
//# sourceMappingURL=channel.js.map