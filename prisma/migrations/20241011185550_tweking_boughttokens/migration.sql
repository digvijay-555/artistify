/*
  Warnings:

  - You are about to drop the column `userId` on the `boughtTokens` table. All the data in the column will be lost.
  - Added the required column `accountAddress` to the `boughtTokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "boughtTokens" DROP CONSTRAINT "boughtTokens_userId_fkey";

-- AlterTable
ALTER TABLE "boughtTokens" DROP COLUMN "userId",
ADD COLUMN     "accountAddress" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "boughtTokens" ADD CONSTRAINT "boughtTokens_accountAddress_fkey" FOREIGN KEY ("accountAddress") REFERENCES "User"("accountAddress") ON DELETE RESTRICT ON UPDATE CASCADE;
