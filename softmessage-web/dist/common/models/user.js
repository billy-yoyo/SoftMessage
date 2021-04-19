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
exports.TUser = exports.User = void 0;
const tsplate_1 = __importDefault(require("tsplate"));
let User = class User {
    constructor(id, name, isOnline) {
        this.id = id;
        this.name = name;
        this.isOnline = isOnline;
    }
};
__decorate([
    tsplate_1.default.template(tsplate_1.default.Int)
], User.prototype, "id", void 0);
__decorate([
    tsplate_1.default.template(tsplate_1.default.String)
], User.prototype, "name", void 0);
__decorate([
    tsplate_1.default.template(tsplate_1.default.Boolean)
], User.prototype, "isOnline", void 0);
User = __decorate([
    tsplate_1.default.constructor('id', 'name', 'isOnline')
], User);
exports.User = User;
exports.TUser = tsplate_1.default.AutoClass(User);
//# sourceMappingURL=user.js.map