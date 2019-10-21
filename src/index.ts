import LRUCache from "./lru-cache";
import RedisCache from "./redis-cache";

const cache = process.env.REDIS_URL ? new RedisCache() : new LRUCache();

export default async function<T>(key, maxAge, value: () => T): Promise<any> {
  try {
    const hit = await cache.get(key);
    if (hit) {
      return hit;
    }

    const result = await value();
    cache.set(key, result, maxAge);
    return result;
  } catch (err) {
    return value();
  }
}
