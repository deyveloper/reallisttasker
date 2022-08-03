-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "lastFoundInfo" TIMESTAMP(3),
ALTER COLUMN "updatedAt" DROP NOT NULL;
