"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lru_cache_1 = __importDefault(require("lru-cache"));
const { LRU_CACHE_SIZE, LRU_CACHE_MAX_AGE } = process.env;
let max = 100;
if (LRU_CACHE_SIZE) {
    const maxInt = parseInt(LRU_CACHE_SIZE, 10);
    if (!isNaN(maxInt)) {
        max = maxInt;
    }
}
let maxAge = 3600 * 1000;
if (LRU_CACHE_MAX_AGE) {
    const n = parseInt(LRU_CACHE_MAX_AGE, 10);
    if (!isNaN(n)) {
        maxAge = n;
    }
}
class LRUCache {
    constructor() {
        this.cache = new lru_cache_1.default({ max, maxAge });
        this.pruneJob = setInterval(() => {
            this.cache.prune();
        }, 60 * 1000);
    }
    async get(key) {
        const value = this.cache.get(key);
        return value ? JSON.parse(value) : undefined;
    }
    async set(key, value, maxAge) {
        return this.cache.set(key, JSON.stringify(value), maxAge * 1000);
    }
    stop() {
        clearInterval(this.pruneJob);
    }
}
exports.default = LRUCache;
//# sourceMappingURL=lru-cache.js.map