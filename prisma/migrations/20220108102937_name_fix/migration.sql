/*
  Warnings:

  - You are about to drop the `AutorInfo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AutorInfo" DROP CONSTRAINT "AutorInfo_itemId_fkey";

-- DropForeignKey
ALTER TABLE "AutorInfo" DROP CONSTRAINT "AutorInfo_userId_fkey";

-- DropTable
DROP TABLE "AutorInfo";

-- CreateTable
CREATE TABLE "AuthorInfo" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "phones" TEXT[],
    "userUrl" TEXT,
    "hash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "AuthorInfo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AuthorInfo" ADD CONSTRAINT "AuthorInfo_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorInfo" ADD CONSTRAINT "AuthorInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
