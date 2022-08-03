import redis from 'redis';

export type RedisMainClient = ReturnType<typeof redis.createClient>;