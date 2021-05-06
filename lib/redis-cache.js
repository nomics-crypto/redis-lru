"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lru_cache_1 = __importDefault(require("./lru-cache"));
const redis_client_1 = __importDefault(require("./redis-client"));
function currentSeconds() {
    return Math.floor(new Date().getTime() / 1000);
}
class RedisCache {
    constructor() {
        this.local = new lru_cache_1.default();
    }
    get(key) {
        return new Promise((resolve, reject) => {
            this.local.get(key).then(value => {
                if (value) {
                    // Try to grab the data from the local cache if possible ...
                    resolve(value);
                }
                else {
                    // ... or fall back to Redis.
                    return redis_client_1.default.get(key, (err, data) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        let parsedValue;
                        try {
                            parsedValue = JSON.parse(data);
                        }
                        catch (e) {
                            reject(e);
                            return;
                        }
                        resolve(parsedValue);
                        // Add the value to the local cache if it has a large enough TTL.
                        redis_client_1.default.ttl(key, (err, data) => {
                            if (err) {
                                return;
                            }
                            const deadline = Number(data);
                            if (deadline > 30) {
                                this.local.set(key, parsedValue, deadline - 1);
                            }
                        });
                    });
                }
            });
        });
    }
    set(key, value, maxAge) {
        const localDeadline = currentSeconds() + maxAge;
        return new Promise((resolve, reject) => {
            redis_client_1.default.setex(key, maxAge, JSON.stringify(value), (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
                // Account for the time it takes to write the data to redis
                // and write to the local cache.
                const localAge = localDeadline - currentSeconds();
                if (localAge > 0) {
                    this.local.set(key, value, localDeadline - currentSeconds());
                }
            });
        });
    }
}
exports.default = RedisCache;
//# sourceMappingURL=redis-cache.js.map