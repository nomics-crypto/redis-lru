"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_client_1 = __importDefault(require("./redis-client"));
class RedisCache {
    get(key) {
        return new Promise((resolve, reject) => {
            return redis_client_1.default.get(key, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(JSON.parse(data));
            });
        });
    }
    set(key, value, maxAge) {
        return new Promise((resolve, reject) => {
            redis_client_1.default.setex(key, maxAge, JSON.stringify(value), err => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
}
exports.default = RedisCache;
//# sourceMappingURL=redis-cache.js.map