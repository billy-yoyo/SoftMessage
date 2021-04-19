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
const query_1 = require("./query");
class Table {
    constructor(name, rowTemplate, client) {
        this.name = name;
        this.rowTemplate = rowTemplate;
        this.client = client;
    }
    withClient(client) {
        return new Table(this.name, this.rowTemplate, client);
    }
    allRows(client) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.getClient(client).query(`SELECT * FROM ${this.name}`);
            return this.convertResultRows(result);
        });
    }
    findAll(query, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const [where, values] = query.build();
            const result = yield this.getClient(client).query(`SELECT * FROM ${this.name} WHERE ${where}`, values);
            return this.convertResultRows(result);
        });
    }
    findOne(query, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.findAll(query, client);
            if (results.length !== 1) {
                throw Error('attempted to find single row, but multiple rows matched criteria');
            }
            return results[0];
        });
    }
    query(params) {
        return new query_1.Query(this, params, undefined);
    }
    queryOr(paramArray) {
        if (paramArray.length === 0) {
            throw Error('cannot create or query with no parameters');
        }
        let query = this.query(paramArray[0]);
        paramArray.slice(1).forEach(param => query = query.or(param));
        return query;
    }
    convertResultRows(result) {
        const rows = [];
        for (const row of result.rows) {
            if (this.rowTemplate.valid(row)) {
                rows.push(this.rowTemplate.toModel(row));
            }
            else {
                console.warn(`invalid row ${JSON.stringify(row)}`);
            }
        }
        return rows;
    }
    getClient(client) {
        return client || this.client;
    }
}
exports.default = Table;
//# sourceMappingURL=table.js.map