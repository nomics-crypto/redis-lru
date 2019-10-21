import redis from "redis";

let client;

if (process.env.REDIS_URL) {
  client = redis.createClient(process.env.REDIS_URL);
}

export default client;
