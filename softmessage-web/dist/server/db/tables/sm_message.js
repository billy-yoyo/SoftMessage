"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.MessageTable = exports.TMessageRow = exports.MessageRow = void 0;
const tsplate_1 = __importDefault(require("tsplate"));
const table_1 = __importDefault(require("../table"));
let MessageRow = class MessageRow {
    constructor(message_id, user_id, channel_id, body, time_sent) {
        this.message_id = message_id;
        this.user_id = user_id;
        this.channel_id = channel_id;
        this.body = body;
        this.time_sent = time_sent;
    }
};
__decorate([
    tsplate_1.default.template(tsplate_1.default.Int)
], MessageRow.prototype, "message_id", void 0);
__decorate([
    tsplate_1.default.template(tsplate_1.default.Int)
], MessageRow.prototype, "user_id", void 0);
__decorate([
    tsplate_1.default.template(tsplate_1.default.Int)
], MessageRow.prototype, "channel_id", void 0);
__decorate([
    tsplate_1.default.template(tsplate_1.default.String)
], MessageRow.prototype, "body", void 0);
__decorate([
    tsplate_1.default.template(tsplate_1.default.Any)
], MessageRow.prototype, "time_sent", void 0);
MessageRow = __decorate([
    tsplate_1.default.constructor('message_id', 'user_id', 'channel_id', 'body', 'time_sent')
], MessageRow);
exports.MessageRow = MessageRow;
exports.TMessageRow = tsplate_1.default.AutoClass(MessageRow);
class MessageTable extends table_1.default {
    constructor(client) {
        super('sm_message', exports.TMessageRow, client);
    }
    getMessagesBefore(endDate, amount, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.getClient(client).query(`SELECT * FROM ${this.name} WHERE time_sent < $1 ORDER BY time_sent DESC LIMIT $2`, [endDate, amount]);
            return this.convertResultRows(result);
        });
    }
    withClient(client) {
        return new MessageTable(client);
    }
}
exports.MessageTable = MessageTable;
exports.default = new MessageTable();
//# sourceMappingURL=sm_message.js.map