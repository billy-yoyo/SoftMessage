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
exports.TMessage = exports.Message = void 0;
const tsplate_1 = __importDefault(require("tsplate"));
let Message = class Message {
    constructor(id, userId, channelId, body, timeSent) {
        this.id = id;
        this.userId = userId;
        this.channelId = channelId;
        this.body = body;
        this.timeSent = timeSent;
    }
};
__decorate([
    tsplate_1.default.template(tsplate_1.default.Int)
], Message.prototype, "id", void 0);
__decorate([
    tsplate_1.default.template(tsplate_1.default.Int)
], Message.prototype, "userId", void 0);
__decorate([
    tsplate_1.default.template(tsplate_1.default.Int)
], Message.prototype, "channelId", void 0);
__decorate([
    tsplate_1.default.template(tsplate_1.default.String)
], Message.prototype, "body", void 0);
__decorate([
    tsplate_1.default.template(tsplate_1.default.Date)
], Message.prototype, "timeSent", void 0);
Message = __decorate([
    tsplate_1.default.constructor('id', 'userId', 'channelId', 'body', 'timeSent')
], Message);
exports.Message = Message;
exports.TMessage = tsplate_1.default.AutoClass(Message);
//# sourceMappingURL=message.js.map