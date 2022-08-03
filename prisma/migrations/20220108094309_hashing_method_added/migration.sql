/*
  Warnings:

  - You are about to drop the column `avatar` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phones` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userUrl` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ItemUpdated" ADD COLUMN     "hash" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatar",
DROP COLUMN "phones",
DROP COLUMN "userUrl";

-- CreateTable
CREATE TABLE "AutorInfo" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER,
    "name" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "phones" TEXT[],
    "userUrl" TEXT,
    "hash" TEXT,

    CONSTRAINT "AutorInfo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AutorInfo" ADD CONSTRAINT "AutorInfo_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
