import redis from "redis";

let client;

if (process.env.REDIS_URL) {
  client = redis.createClient(process.env.REDIS_URL);
  client.on("error", (err: any) => {
    console.error(err);
    client = null;
  });
}

export default client;
