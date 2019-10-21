"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lru_cache_1 = __importDefault(require("./lru-cache"));
const redis_cache_1 = __importDefault(require("./redis-cache"));
const cache = process.env.REDIS_URL ? new redis_cache_1.default() : new lru_cache_1.default();
async function default_1(key, maxAge, value) {
    try {
        const hit = await cache.get(key);
        if (hit) {
            return hit;
        }
        const result = await value();
        cache.set(key, result, maxAge);
        return result;
    }
    catch (err) {
        return value();
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map