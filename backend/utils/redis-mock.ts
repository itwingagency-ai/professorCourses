// Mock Redis client for development when Redis is unavailable
export const redis = {
    get: async (key: string) => null,
    set: async (key: string, value: any, mode?: string, duration?: number) => 'OK',
    del: async (key: string) => 1,
    exists: async (key: string) => 0,
    expire: async (key: string, seconds: number) => 1,
    flushall: async () => 'OK'
};

console.log('Using mock Redis client');