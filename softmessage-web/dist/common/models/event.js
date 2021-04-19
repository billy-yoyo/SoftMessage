"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEvent = void 0;
const tsplate_1 = __importDefault(require("tsplate"));
const messageCreated_1 = require("./events/messageCreated");
const userChangedStatus_1 = require("./events/userChangedStatus");
const userJoined_1 = require("./events/userJoined");
;
exports.TEvent = tsplate_1.default.Union(messageCreated_1.TMessageCreatedEvent, tsplate_1.default.Union(userJoined_1.TUserJoinedEvent, userChangedStatus_1.TUserChangedStatusEvent, (m) => m.eventType === 'user-joined'), (m) => m.eventType === 'message-created');
//# sourceMappingURL=event.js.map