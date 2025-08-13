/*
  Warnings:

  - A unique constraint covering the columns `[tokenId]` on the table `MintedTokens` will be added. If there are existing duplicate values, this will fail.
  - Made the column `tokenId` on table `MintedTokens` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "boughtTokens" DROP CONSTRAINT "boughtTokens_id_fkey";

-- AlterTable
ALTER TABLE "MintedTokens" ALTER COLUMN "tokenId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MintedTokens_tokenId_key" ON "MintedTokens"("tokenId");

-- AddForeignKey
ALTER TABLE "boughtTokens" ADD CONSTRAINT "boughtTokens_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "MintedTokens"("tokenId") ON DELETE RESTRICT ON UPDATE CASCADE;
