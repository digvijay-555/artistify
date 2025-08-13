/*
  Warnings:

  - You are about to drop the `MintedTokens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `boughtTokens` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `length` on the `Song` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "MintedTokens" DROP CONSTRAINT "MintedTokens_id_fkey";

-- DropForeignKey
ALTER TABLE "boughtTokens" DROP CONSTRAINT "boughtTokens_accountAddress_fkey";

-- DropForeignKey
ALTER TABLE "boughtTokens" DROP CONSTRAINT "boughtTokens_tokenId_fkey";

-- AlterTable
ALTER TABLE "Song" DROP COLUMN "length",
ADD COLUMN     "length" INTEGER NOT NULL;

-- DropTable
DROP TABLE "MintedTokens";

-- DropTable
DROP TABLE "boughtTokens";

-- CreateTable
CREATE TABLE "MintedToken" (
    "id" SERIAL NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "tokenThumbail" TEXT NOT NULL,
    "tokenName" TEXT NOT NULL,
    "tokenDesc" TEXT NOT NULL,
    "tokenPrice" INTEGER NOT NULL,
    "tokensToMint" INTEGER NOT NULL,
    "percentShare" INTEGER NOT NULL,
    "availableToken" INTEGER,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MintedToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoughtToken" (
    "id" SERIAL NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "accountAddress" TEXT NOT NULL,
    "tokensBought" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BoughtToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MintedToken_tokenId_key" ON "MintedToken"("tokenId");

-- CreateIndex
CREATE INDEX "BoughtToken_tokenId_idx" ON "BoughtToken"("tokenId");

-- CreateIndex
CREATE INDEX "BoughtToken_userId_idx" ON "BoughtToken"("userId");

-- CreateIndex
CREATE INDEX "Song_userId_idx" ON "Song"("userId");

-- AddForeignKey
ALTER TABLE "MintedToken" ADD CONSTRAINT "MintedToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoughtToken" ADD CONSTRAINT "BoughtToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoughtToken" ADD CONSTRAINT "BoughtToken_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "MintedToken"("tokenId") ON DELETE RESTRICT ON UPDATE CASCADE;
