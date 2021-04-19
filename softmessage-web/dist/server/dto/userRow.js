"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../../common/models/user");
exports.default = (userRow) => {
    return new user_1.User(userRow.user_id, userRow.user_name, userRow.is_online);
};
//# sourceMappingURL=userRow.js.map