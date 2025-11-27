import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});
redis.on("error", (err) => {
  console.log(process.env.REDIS_HOST);
  console.error("Redis error", err);
});

export default redis;
