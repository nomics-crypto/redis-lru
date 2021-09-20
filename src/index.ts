import LRUCache from "./lru-cache";
import RedisCache from "./redis-cache";

const cache = process.env.REDIS_URL ? new RedisCache() : new LRUCache();

export default async function<T>(key: string, maxAge: number, value: () => Promise<T>): Promise<any> {
  try {
    const hit = await cache.get(key);
    if (hit) {
      return hit;
    }
  } catch (err) {
    return value();
  }

  const result = await value();
  try {
    await cache.set(key, result, maxAge);
    return result;
  } catch (err) {
    console.error(err);
    return result;
  }
}
