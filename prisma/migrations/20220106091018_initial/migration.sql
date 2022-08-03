-- CreateTable
CREATE TABLE "ItemUpdated" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "name" TEXT,
    "priceAmount" DOUBLE PRECISION,
    "currency" TEXT,
    "priceAdditionalInfo" TEXT,
    "location" TEXT,
    "locationMapRef" TEXT,
    "flagTop" BOOLEAN NOT NULL DEFAULT false,
    "flagHome" BOOLEAN NOT NULL DEFAULT false,
    "flagUrgent" BOOLEAN NOT NULL DEFAULT false,
    "datePosted" TIMESTAMP(3) NOT NULL,
    "dateRenewed" TIMESTAMP(3),
    "categories" TEXT[],
    "properties" TEXT,
    "images" TEXT[],

    CONSTRAINT "ItemUpdated_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "listId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "listId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "registerSince" TIMESTAMP(3) NOT NULL,
    "avatar" TEXT NOT NULL,
    "phones" TEXT[],
    "userUrl" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Item_listId_key" ON "Item"("listId");

-- CreateIndex
CREATE UNIQUE INDEX "User_listId_key" ON "User"("listId");

-- AddForeignKey
ALTER TABLE "ItemUpdated" ADD CONSTRAINT "ItemUpdated_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
