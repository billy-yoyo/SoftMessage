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
exports.TUserChangedStatusEvent = exports.UserChangedStatusEvent = exports.userChangedStatus = void 0;
const tsplate_1 = __importDefault(require("tsplate"));
const user_1 = require("../user");
exports.userChangedStatus = 'user-changed-status';
let UserChangedStatusEvent = class UserChangedStatusEvent {
    constructor(eventType, user) {
        this.eventType = exports.userChangedStatus;
        this.user = user;
    }
};
__decorate([
    tsplate_1.default.template(tsplate_1.default.Enum(exports.userChangedStatus))
], UserChangedStatusEvent.prototype, "eventType", void 0);
__decorate([
    tsplate_1.default.template(user_1.TUser)
], UserChangedStatusEvent.prototype, "user", void 0);
UserChangedStatusEvent = __decorate([
    tsplate_1.default.constructor('eventType', 'user')
], UserChangedStatusEvent);
exports.UserChangedStatusEvent = UserChangedStatusEvent;
exports.TUserChangedStatusEvent = tsplate_1.default.AutoClass(UserChangedStatusEvent);
//# sourceMappingURL=userChangedStatus.js.map