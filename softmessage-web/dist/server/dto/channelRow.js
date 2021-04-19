"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const channel_1 = require("../../common/models/channel");
exports.default = (channelRow) => {
    return new channel_1.Channel(channelRow.channel_id, channelRow.channel_name);
};
//# sourceMappingURL=channelRow.js.map