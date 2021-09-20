import LRU from "lru-cache";

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

export default class LRUCache {
  private cache: LRU;
  private pruneJob: any;

  constructor() {
    this.cache = new LRU({ max, maxAge });
    this.pruneJob = setInterval(() => {
      this.cache.prune();
    }, 60 * 1000);
  }

  public async get(key: string): Promise<any> {
    const value = this.cache.get(key);
    return value ? JSON.parse(value) : undefined;
  }

  public async set(key: string, value: any, maxAge: number) {
    return this.cache.set(key, JSON.stringify(value), maxAge * 1000);
  }

  public stop() {
    clearInterval(this.pruneJob);
  }
}
