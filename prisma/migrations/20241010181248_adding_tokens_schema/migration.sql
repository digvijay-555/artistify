-- CreateTable
CREATE TABLE "MintedTokens" (
    "id" SERIAL NOT NULL,
    "tokenId" TEXT NOT NULL,
    "tokenThumbail" TEXT NOT NULL,
    "tokenName" TEXT NOT NULL,
    "tokenDesc" TEXT NOT NULL,
    "tokenPrice" INTEGER NOT NULL,
    "avaibleToken" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MintedTokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boughtTokens" (
    "id" SERIAL NOT NULL,
    "tokenId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "tokensBought" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "boughtTokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MintedTokens_tokenId_key" ON "MintedTokens"("tokenId");

-- AddForeignKey
ALTER TABLE "MintedTokens" ADD CONSTRAINT "MintedTokens_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boughtTokens" ADD CONSTRAINT "boughtTokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boughtTokens" ADD CONSTRAINT "boughtTokens_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "MintedTokens"("tokenId") ON DELETE RESTRICT ON UPDATE CASCADE;
