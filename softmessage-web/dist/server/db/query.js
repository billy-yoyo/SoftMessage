"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
class Query {
    constructor(table, params, parent) {
        this.table = table;
        this.params = params;
        this.parent = parent;
    }
    or(params) {
        return new Query(this.table, params, this);
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.table.findAll(this);
        });
    }
    findOne() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.table.findOne(this);
        });
    }
    build(offset = 0) {
        const keys = Object.keys(this.params);
        let whereClause = keys.map((key, index) => `${key} = $${1 + offset + index}`).join(' AND ');
        let values = keys.map(key => this.params[key]);
        if (this.parent) {
            const [parentWhere, parentValues] = this.parent.build(values.length + offset);
            whereClause += ` OR ${parentWhere}`;
            values = values.concat(parentValues);
        }
        return [whereClause, values];
    }
}
exports.Query = Query;
//# sourceMappingURL=query.js.map