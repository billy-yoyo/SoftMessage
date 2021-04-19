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
exports.TMessageCreatedEvent = exports.MessageCreatedEvent = exports.messageCreated = void 0;
const tsplate_1 = __importDefault(require("tsplate"));
const message_1 = require("../message");
exports.messageCreated = 'message-created';
let MessageCreatedEvent = class MessageCreatedEvent {
    constructor(eventType, message) {
        this.eventType = exports.messageCreated;
        this.message = message;
    }
};
__decorate([
    tsplate_1.default.template(tsplate_1.default.Enum(exports.messageCreated))
], MessageCreatedEvent.prototype, "eventType", void 0);
__decorate([
    tsplate_1.default.template(message_1.TMessage)
], MessageCreatedEvent.prototype, "message", void 0);
MessageCreatedEvent = __decorate([
    tsplate_1.default.constructor('eventType', 'message')
], MessageCreatedEvent);
exports.MessageCreatedEvent = MessageCreatedEvent;
exports.TMessageCreatedEvent = tsplate_1.default.AutoClass(MessageCreatedEvent);
//# sourceMappingURL=messageCreated.js.map