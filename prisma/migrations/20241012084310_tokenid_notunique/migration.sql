-- DropForeignKey
ALTER TABLE "boughtTokens" DROP CONSTRAINT "boughtTokens_tokenId_fkey";

-- DropIndex
DROP INDEX "MintedTokens_tokenId_key";

-- AddForeignKey
ALTER TABLE "boughtTokens" ADD CONSTRAINT "boughtTokens_id_fkey" FOREIGN KEY ("id") REFERENCES "MintedTokens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
