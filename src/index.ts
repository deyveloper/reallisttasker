import { CronJob } from 'cron';
import Parser from 'reallistparser';
import * as Configs from './configs';
import { PrismaModule, RedisModule } from './modules';
import { PrismaClient } from '.prisma/client';
import { RedisMainClient } from './interfaces/redis';
import * as Jobs from './jobs';


class TaskService {
    cronJobs: { [key: string]: CronJob } = {};
    private jobsDecleration: (string | (() => Promise<void>))[][];
    private prisma: PrismaClient;
    private redis: RedisMainClient;
    private parser = new Parser({});

    private async declareJobs() {
        const jobs = [
            ['category_item_parse', '* * * * 2 *', Jobs.CategoryItemLinksParse],
            ['item_details_parse', '* * * * 2 *', Jobs.ItemDetailsParse]
        ];

        console.info(`Number of declared jobs ${jobs.length}`);

        this.jobsDecleration = jobs;
    }

    private async bindJobs() {
        const tabular: {
            Alias: string,
            Timing: string,
            "Exec function": Function
        }[] = [];

        for (let jobsDecleration of this.jobsDecleration) {
            const func = typeof jobsDecleration[2] === 'function'
                ? jobsDecleration[2]
                : () => null;
            const alias = jobsDecleration[0].toString();
            const timing = jobsDecleration[1].toString();

            this.cronJobs[alias] = new CronJob(
                timing,
                func.bind(this)
            );

            tabular.push({
                Alias: alias,
                Timing: timing,
                "Exec function": func
            });
        }

        console.table(tabular);
    }

    async startup() {
        await this.declareJobs();
        await this.bindJobs();

        const prismaModule = new PrismaModule();
        await prismaModule.connect();

        this.prisma = prismaModule.prisma;

        const redisModule = new RedisModule(Configs.REDIS);
        await redisModule.connect();

        this.redis = redisModule.redis;

        //@ts-ignore
        Jobs.ItemDetailsParse.bind(this)();

        for (let jobsDecleration of this.jobsDecleration) {
            const alias = jobsDecleration[0].toString();
            this.cronJobs[alias].start();
        }
    }
}

export default TaskService;