import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import dotenv from "dotenv";

dotenv.config();

const redis = new Redis({
  url: process.env.UPSTASH_REST_URL,
  token: process.env.UPSTASH_REST_TOKEN,
});

const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "20s"),
});

export default rateLimit;
