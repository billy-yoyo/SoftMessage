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
exports.TChannelUserRow = exports.ChannelUserRow = void 0;
const tsplate_1 = __importDefault(require("tsplate"));
const table_1 = __importDefault(require("../table"));
let ChannelUserRow = class ChannelUserRow {
    constructor(channel_id, user_id) {
        this.channel_id = channel_id;
        this.user_id = user_id;
    }
};
__decorate([
    tsplate_1.default.template(tsplate_1.default.Int)
], ChannelUserRow.prototype, "channel_id", void 0);
__decorate([
    tsplate_1.default.template(tsplate_1.default.Int)
], ChannelUserRow.prototype, "user_id", void 0);
ChannelUserRow = __decorate([
    tsplate_1.default.constructor('channel_id', 'user_id')
], ChannelUserRow);
exports.ChannelUserRow = ChannelUserRow;
exports.TChannelUserRow = tsplate_1.default.AutoClass(ChannelUserRow);
exports.default = new table_1.default('sm_channel_users', exports.TChannelUserRow);
//# sourceMappingURL=sm_channel_users.js.map