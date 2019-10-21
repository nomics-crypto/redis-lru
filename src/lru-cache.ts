import LRU from "lru-cache";

const { LRU_CACHE_SIZE } = process.env;
let max = 100;
if (LRU_CACHE_SIZE) {
  const maxInt = parseInt(LRU_CACHE_SIZE, 10);
  if (!isNaN(maxInt)) {
    max = maxInt;
  }
}

export default class LRUCache {
  private cache;
  constructor() {
    this.cache = new LRU({ max });
  }

  public async get(key): Promise<any> {
    const value = this.cache.get(key);
    return value ? JSON.parse(value) : undefined;
  }

  public async set(key, value, maxAge) {
    return this.cache.set(key, JSON.stringify(value), maxAge * 1000);
  }
}
