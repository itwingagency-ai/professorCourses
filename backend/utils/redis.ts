import { Redis } from "ioredis";
require("dotenv").config();

// Simple in-memory fallback for Redis operations
class RedisMock {
  private data: Record<string, string> = {};

  async get(key: string) {
    return this.data[key] || null;
  }

  async set(key: string, value: string, mode?: string, duration?: number) {
    this.data[key] = value;
    return "OK";
  }

  async del(key: string) {
    delete this.data[key];
    return 1;
  }

  on(event: string, callback: any) {
    // No-op for mock events
  }
}

const createRedisInstance = () => {
  const url = process.env.REDIS_URL;
  if (url) {
    console.log(`⏳ Attempting to connect to Redis at: ${url.includes('@') ? url.split('@').pop() : url}...`);
    try {
        const client = new Redis(url, {
          maxRetriesPerRequest: 2,
          connectTimeout: 10000,
        });

        client.on("connect", () => {
          console.log("✅ Redis Connected Successfully");
        });

        client.on("error", (err: any) => {
          console.error("❌ Redis Connection Error:", err.message);
          // If it's a connection issue, we'll swap to mock later if needed, 
          // but ioredis handles retries automatically.
        });

        return client;
    } catch (e: any) {
        console.error("❌ Failed to initialize Redis client:", e.message);
        return new RedisMock() as unknown as Redis;
    }
  }

  console.log("⚠️  REDIS_URL not found. Using in-memory Redis mock.");
  return new RedisMock() as unknown as Redis;
};

let actualRedis: Redis | RedisMock = createRedisInstance();

// Export a wrapper that always uses the current best "redis" instance
export const redis = new Proxy({} as Redis, {
  get: (target, prop: string) => {
    return (actualRedis as any)[prop];
  },
});
