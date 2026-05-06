import { Redis } from 'ioredis';
require('dotenv').config();

// Simple in-memory fallback for Redis operations
class RedisMock {
    private data: Record<string, string> = {};
    
    async get(key: string) {
        return this.data[key] || null;
    }
    
    async set(key: string, value: string, mode?: string, duration?: number) {
        this.data[key] = value;
        return 'OK';
    }
    
    async del(key: string) {
        delete this.data[key];
        return 1;
    }

    on(event: string, callback: any) {
        // No-op for mock
    }
}

const redisClient = () => {
    const url = process.env.REDIS_URL;
    if (url) {
        return new Redis(url, {
            maxRetriesPerRequest: 1,
            enableReadyCheck: false,
            lazyConnect: true,
            connectTimeout: 5000,
        });
    }
    
    console.log("REDIS_URL not found. Using in-memory Redis mock.");
    return new RedisMock() as unknown as Redis;
};

let actualRedis: Redis | RedisMock = redisClient();

// If it's a real Redis instance, handle connection errors and fallback
if (actualRedis instanceof Redis) {
    actualRedis.on('error', (err: any) => {
        if (err.message.includes('ENOTFOUND') || err.message.includes('ETIMEOUT')) {
            console.log("Detected Redis connectivity issues. Falling back to in-memory mock...");
            actualRedis = new RedisMock() as unknown as Redis;
            // Update the export reference by mutating the object or using a proxy
            // For simplicity, we'll just log and let the existing export keep trying 
            // OR we can export a wrapper
        }
    });
}

// Export a wrapper that always uses the current best "redis"
export const redis = new Proxy({} as Redis, {
    get: (target, prop: string) => {
        return (actualRedis as any)[prop];
    }
});

actualRedis.on('connect', () => {
    console.log('Redis Connected Successfully');
});
