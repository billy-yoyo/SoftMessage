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
exports.TChannelRow = exports.ChannelRow = void 0;
const tsplate_1 = __importDefault(require("tsplate"));
const table_1 = __importDefault(require("../table"));
let ChannelRow = class ChannelRow {
    constructor(channel_id, channel_name) {
        this.channel_id = channel_id;
        this.channel_name = channel_name;
    }
};
__decorate([
    tsplate_1.default.template(tsplate_1.default.Int)
], ChannelRow.prototype, "channel_id", void 0);
__decorate([
    tsplate_1.default.template(tsplate_1.default.String)
], ChannelRow.prototype, "channel_name", void 0);
ChannelRow = __decorate([
    tsplate_1.default.constructor('channel_id', 'channel_name')
], ChannelRow);
exports.ChannelRow = ChannelRow;
exports.TChannelRow = tsplate_1.default.AutoClass(ChannelRow);
exports.default = new table_1.default('sm_channel', exports.TChannelRow);
//# sourceMappingURL=sm_channel.js.map