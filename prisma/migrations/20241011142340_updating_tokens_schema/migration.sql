/*
  Warnings:

  - You are about to drop the column `totalListeningHrs` on the `Song` table. All the data in the column will be lost.
  - Added the required column `percentShare` to the `MintedTokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokensToMint` to the `MintedTokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalListeningTime` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MintedTokens" ADD COLUMN     "percentShare" INTEGER NOT NULL,
ADD COLUMN     "tokensToMint" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Song" DROP COLUMN "totalListeningHrs",
ADD COLUMN     "totalListeningTime" INTEGER NOT NULL;
