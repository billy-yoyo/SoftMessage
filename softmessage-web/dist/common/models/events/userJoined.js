"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TUserJoinedEvent = exports.UserJoinedEvent = exports.userJoined = void 0;
const tsplate_1 = __importDefault(require("tsplate"));
const channel_1 = require("../channel");
const user_1 = require("../user");
exports.userJoined = 'user-joined';
let UserJoinedEvent = class UserJoinedEvent {
    constructor(eventType, user, channel) {
        this.eventType = exports.userJoined;
        this.user = user;
        this.channel = channel;
    }
};
__decorate([
    tsplate_1.default.template(tsplate_1.default.Enum(exports.userJoined))
], UserJoinedEvent.prototype, "eventType", void 0);
__decorate([
    tsplate_1.default.template(user_1.TUser)
], UserJoinedEvent.prototype, "user", void 0);
__decorate([
    tsplate_1.default.template(channel_1.TChannel)
], UserJoinedEvent.prototype, "channel", void 0);
UserJoinedEvent = __decorate([
    tsplate_1.default.constructor('eventType', 'user', 'channel')
], UserJoinedEvent);
exports.UserJoinedEvent = UserJoinedEvent;
exports.TUserJoinedEvent = tsplate_1.default.AutoClass(UserJoinedEvent);
//# sourceMappingURL=userJoined.js.map