/*
  Warnings:

  - The `tokenId` column on the `MintedTokens` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `tokenId` on the `boughtTokens` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "boughtTokens" DROP CONSTRAINT "boughtTokens_tokenId_fkey";

-- AlterTable
ALTER TABLE "MintedTokens" DROP COLUMN "tokenId",
ADD COLUMN     "tokenId" INTEGER,
ALTER COLUMN "avaibleToken" DROP NOT NULL;

-- AlterTable
ALTER TABLE "boughtTokens" DROP COLUMN "tokenId",
ADD COLUMN     "tokenId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MintedTokens_tokenId_key" ON "MintedTokens"("tokenId");

-- AddForeignKey
ALTER TABLE "boughtTokens" ADD CONSTRAINT "boughtTokens_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "MintedTokens"("tokenId") ON DELETE RESTRICT ON UPDATE CASCADE;
