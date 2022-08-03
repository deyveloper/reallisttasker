/*
  Warnings:

  - Made the column `itemId` on table `AutorInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `AutorInfo` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "AutorInfo" DROP CONSTRAINT "AutorInfo_itemId_fkey";

-- DropForeignKey
ALTER TABLE "AutorInfo" DROP CONSTRAINT "AutorInfo_userId_fkey";

-- AlterTable
ALTER TABLE "AutorInfo" ALTER COLUMN "itemId" SET NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "AutorInfo" ADD CONSTRAINT "AutorInfo_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutorInfo" ADD CONSTRAINT "AutorInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
