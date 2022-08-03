-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('CategoryItemLinksParse', 'ItemDetailsParse', 'HomePageParse');

-- CreateTable
CREATE TABLE "JobInfo" (
    "id" SERIAL NOT NULL,
    "type" "JobType" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "done" BOOLEAN NOT NULL DEFAULT false,
    "additionalInfo" TEXT,

    CONSTRAINT "JobInfo_pkey" PRIMARY KEY ("id")
);
