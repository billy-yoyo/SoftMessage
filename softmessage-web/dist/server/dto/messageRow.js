"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const message_1 = require("../../common/models/message");
exports.default = (messageRow) => {
    return new message_1.Message(messageRow.message_id, messageRow.user_id, messageRow.channel_id, messageRow.body, messageRow.time_sent);
};
//# sourceMappingURL=messageRow.js.map