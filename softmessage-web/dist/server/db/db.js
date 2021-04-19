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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = exports.DatabaseConnection = void 0;
const pg_1 = require("pg");
const sm_channel_1 = __importDefault(require("./tables/sm_channel"));
const sm_channel_users_1 = __importDefault(require("./tables/sm_channel_users"));
const sm_message_1 = __importDefault(require("./tables/sm_message"));
const sm_user_1 = __importDefault(require("./tables/sm_user"));
class DatabaseConnection {
    constructor(client) {
        this.client = client;
        this.sm_message = sm_message_1.default.withClient(client);
        this.sm_channel = sm_channel_1.default.withClient(client);
        this.sm_user = sm_user_1.default.withClient(client);
        this.sm_channel_users = sm_channel_users_1.default.withClient(client);
    }
    release() {
        this.client.release();
    }
}
exports.DatabaseConnection = DatabaseConnection;
class Database {
    constructor(pool) {
        this.sm_message = sm_message_1.default;
        this.sm_channel = sm_channel_1.default;
        this.sm_user = sm_user_1.default;
        this.sm_channel_users = sm_channel_users_1.default;
        this.pool = pool;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            return new DatabaseConnection(client);
        });
    }
    withConnection(runner) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.connect();
            try {
                yield runner(connection);
            }
            finally {
                connection.release();
            }
        });
    }
}
exports.Database = Database;
exports.default = new Database(new pg_1.Pool());
//# sourceMappingURL=db.js.map