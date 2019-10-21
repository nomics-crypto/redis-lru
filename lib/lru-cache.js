"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lru_cache_1 = __importDefault(require("lru-cache"));
const { LRU_CACHE_SIZE } = process.env;
let max = 100;
if (LRU_CACHE_SIZE) {
    const maxInt = parseInt(LRU_CACHE_SIZE, 10);
    if (!isNaN(maxInt)) {
        max = maxInt;
    }
}
class LRUCache {
    constructor() {
        this.cache = new lru_cache_1.default({ max });
    }
    async get(key) {
        const value = this.cache.get(key);
        return value ? JSON.parse(value) : undefined;
    }
    async set(key, value, maxAge) {
        return this.cache.set(key, JSON.stringify(value), maxAge * 1000);
    }
}
exports.default = LRUCache;
//# sourceMappingURL=lru-cache.js.map