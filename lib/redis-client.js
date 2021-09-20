"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("redis"));
let client;
if (process.env.REDIS_URL) {
    client = redis_1.default.createClient(process.env.REDIS_URL);
    client.on("error", (err) => {
        console.error(err);
        client = null;
    });
}
exports.default = client;
//# sourceMappingURL=redis-client.js.map