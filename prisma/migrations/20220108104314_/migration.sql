/*
  Warnings:

  - You are about to drop the column `itemJobHash` on the `AuthorInfo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[jobHash]` on the table `AuthorInfo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `jobHash` to the `AuthorInfo` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "AuthorInfo_itemJobHash_key";

-- AlterTable
ALTER TABLE "AuthorInfo" DROP COLUMN "itemJobHash",
ADD COLUMN     "jobHash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AuthorInfo_jobHash_key" ON "AuthorInfo"("jobHash");
