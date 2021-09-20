import LRUCache from "./lru-cache";
import client from "./redis-client";

function currentSeconds() {
  return Math.floor(new Date().getTime() / 1000);
}

export default class RedisCache {
  private local: LRUCache;

  constructor() {
    this.local = new LRUCache();
  }

  public get(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.local.get(key).then(value => {
        if (value) {
          // Try to grab the data from the local cache if possible ...
          resolve(value);
        } else {
          // ... or fall back to Redis.
          return client.get(key, (err: any, data: any) => {
            if (err) {
              reject(err);
              return;
            }

            let parsedValue: any;
            try {
              parsedValue = JSON.parse(data);
            } catch (e) {
              reject(e);
              return;
            }
            resolve(parsedValue);

            // Add the value to the local cache if it has a large enough TTL.
            client.ttl(key, (err: any, data: any) => {
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

  public set(key: string, value: any, maxAge: number) {
    const localDeadline = currentSeconds() + maxAge;
    return new Promise((resolve, reject) => {
      try {
        client.setex(key, maxAge, JSON.stringify(value), (err: any) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();

          // Account for the time it takes to write the data to redis
          // and write to the local cache.
          const localAge = localDeadline - currentSeconds();
          if (localAge > 0) {
            this.local.set(key, value, localAge);
          }
        });
      } catch (err) {
        reject(err);
        return;
      }
    });
  }

  public stop() {
    this.local.stop();
  }
}
