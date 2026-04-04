-- CreateTable
CREATE TABLE "ranking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "curStreak" INTEGER NOT NULL DEFAULT 0,
    "streakRecord" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ranking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishlist_item" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "name" TEXT,
    "imgSrc" TEXT,
    "releaseDate" INTEGER,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wishlist_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ranking_userId_key" ON "ranking"("userId");

-- CreateIndex
CREATE INDEX "wishlist_item_userId_idx" ON "wishlist_item"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "wishlist_item_userId_itemId_key" ON "wishlist_item"("userId", "itemId");

-- AddForeignKey
ALTER TABLE "ranking" ADD CONSTRAINT "ranking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist_item" ADD CONSTRAINT "wishlist_item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
