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
          maxRetriesPerRequest: 1,
          connectTimeout: 5000,
          // Stop retrying after first failure
          retryStrategy: () => null,
          enableOfflineQueue: false,
          lazyConnect: true,
        });

        client.connect().then(() => {
          console.log("✅ Redis Connected Successfully");
        }).catch(() => {
          console.log("⚠️  Redis unavailable — switching to in-memory mock.");
          actualRedis = new RedisMock() as unknown as Redis;
        });

        client.on("error", () => {
          // Silently handled above via connect().catch
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
