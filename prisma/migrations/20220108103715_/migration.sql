/*
  Warnings:

  - A unique constraint covering the columns `[itemJobHash]` on the table `AuthorInfo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `itemJobHash` to the `AuthorInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AuthorInfo" ADD COLUMN     "itemJobHash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AuthorInfo_itemJobHash_key" ON "AuthorInfo"("itemJobHash");
