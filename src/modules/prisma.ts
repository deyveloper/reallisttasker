import { PrismaClient } from '@prisma/client';


class PrismaModule {
    private prismaClient: PrismaClient;

    constructor() {
        this.prismaClient = new PrismaClient();
    }

    async connect() {
        await this.prismaClient.$connect();
        console.info(`Prisma client connected.`);
    }

    get prisma() {
        return this.prismaClient;
    }
}

export default PrismaModule;