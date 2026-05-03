import {Redis} from 'ioredis';
require ('dotenv').config();

// Connecting Redis with proper error handling
const redisClient = () => {
    if(process.env.REDIS_URL){
        return process.env.REDIS_URL;
    }
    throw new Error('Redis Connection Failed - REDIS_URL not found');
};

export const redis = new Redis(redisClient(), {
    maxRetriesPerRequest: 3,
    enableReadyCheck: false,
    lazyConnect: true
});

let isConnected = false;

redis.on('connect', () => {
    if (!isConnected) {
        console.log('Redis Connected Successfully');
        isConnected = true;
    }
});

redis.on('error', (err) => {
    if (isConnected) {
        console.log('Redis connection lost, attempting to reconnect...');
        isConnected = false;
    }
});

redis.on('close', () => {
    isConnected = false;
});
