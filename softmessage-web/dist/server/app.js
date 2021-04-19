"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const router_1 = __importDefault(require("./api/router"));
const app = express_1.default();
const port = 3000;
app.disable('etag');
app.get('/', (req, res) => res.send('Hello World!'));
app.use('/web', express_1.default.static(path_1.default.join(__dirname, '../static')));
app.use('/v1/api', router_1.default);
app.listen(port, () => console.log(`Example app listening on port ${port}`));
//# sourceMappingURL=app.js.map