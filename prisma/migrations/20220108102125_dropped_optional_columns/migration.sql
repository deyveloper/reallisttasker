/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `registerSince` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AutorInfo" DROP CONSTRAINT "AutorInfo_itemId_fkey";

-- AlterTable
ALTER TABLE "AutorInfo" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
DROP COLUMN "registerSince";

-- AddForeignKey
ALTER TABLE "AutorInfo" ADD CONSTRAINT "AutorInfo_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutorInfo" ADD CONSTRAINT "AutorInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
