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
exports.TUserRow = exports.UserRow = void 0;
const tsplate_1 = __importDefault(require("tsplate"));
const table_1 = __importDefault(require("../table"));
let UserRow = class UserRow {
    constructor(user_id, user_name, is_online) {
        this.user_id = user_id;
        this.user_name = user_name;
        this.is_online = is_online;
    }
};
__decorate([
    tsplate_1.default.template(tsplate_1.default.Int)
], UserRow.prototype, "user_id", void 0);
__decorate([
    tsplate_1.default.template(tsplate_1.default.String)
], UserRow.prototype, "user_name", void 0);
__decorate([
    tsplate_1.default.template(tsplate_1.default.Boolean)
], UserRow.prototype, "is_online", void 0);
UserRow = __decorate([
    tsplate_1.default.constructor('user_id', 'user_name', 'is_online')
], UserRow);
exports.UserRow = UserRow;
exports.TUserRow = tsplate_1.default.AutoClass(UserRow);
exports.default = new table_1.default('sm_user', exports.TUserRow);
//# sourceMappingURL=sm_user.js.map