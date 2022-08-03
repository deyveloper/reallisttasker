import * as redis from 'redis';
import { RedisMainClient } from '../interfaces/redis';

class RedisModule {
    public redisClient: RedisMainClient;
    private configs: {
        url: string
    };

    constructor({
        url
    }: {
        url: string
    }) {
        this.configs = {
            url
        };
        this.redisClient = redis.createClient(this.configs);
    }


    async connect() {
        await this.redisClient.connect();
        console.info(`Redis connected to`
            + ` ${this.configs.url.split('//').reverse()[0]
                .split('@').reverse()[0]}`);
    }

    get redis() {
        return this.redisClient;
    }
}

export default RedisModule;