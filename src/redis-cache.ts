import client from "./redis-client";

export default class RedisCache {
  public get(key): Promise<any> {
    return new Promise((resolve, reject) => {
      return client.get(key, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(JSON.parse(data));
      });
    });
  }

  public set(key, value, maxAge) {
    return new Promise((resolve, reject) => {
      client.setex(key, maxAge, JSON.stringify(value), err => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }
}
