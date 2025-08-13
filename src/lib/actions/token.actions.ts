'use server'

import prisma from "../prisma";

export const mintToken = async (data: {
  tokenName: string;
  tokenDesc: string;
  tokenPrice: number;
  tokensToMint: number;
  percentShare: number;
  tokenId: number;
  image: string;
  userAddress: string;
}) => {
  const { tokenName, tokenDesc, tokenPrice, tokensToMint, percentShare, image, userAddress, tokenId } = data;
  console.log(tokenName, tokenDesc, tokenPrice, tokensToMint, percentShare, image, userAddress, tokenId)
  try {
    // Find user by address
    const user = await prisma.user.findUnique({
      where: { accountAddress: userAddress.toLowerCase() },
    });
    console.log(user)

    if (!user) {
      throw new Error('User not found');
    }

    // Create minted token record
    const mintedToken = await prisma.mintedToken.create({
      data: {
        tokenName,
        tokenDesc,
        tokenPrice: Math.round(tokenPrice), // Ensure it's an integer
        tokensToMint,
        percentShare,
        tokenId: tokenId,
        tokenThumbail: image,
        availableToken: tokensToMint, // Assuming availableToken should be initialized with tokensToMint
        user: { connect: { id: user.id } },
      },
    });

    return mintedToken;
  } catch (error) {
    console.error('Error minting token:', error);
    throw new Error('Error minting token');
  }
};

export const buyToken = async (data: {
  accountAddress: string;
  tokenId: number;
  tokensBought: number;
}) => {
  const { accountAddress, tokenId, tokensBought } = data;
  try {
    // Find user by address
    const user = await prisma.user.findUnique({
      where: { accountAddress: accountAddress.toLowerCase() },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Find the minted token
    const mintedToken = await prisma.mintedToken.findUnique({
      where: { tokenId },
    });

    if (!mintedToken) {
      throw new Error('Minted token not found');
    }

    // Create bought token record
    const boughtToken = await prisma.boughtToken.create({
      data: {
        accountAddress: accountAddress.toLowerCase(),
        tokensBought,
        user: { connect: { id: user.id } },
        mintedToken: { connect: { id: mintedToken.id } }, // Ensure the mintedToken relation is correctly specified
      },
    });

    // Update available tokens in minted token
    await prisma.mintedToken.update({
      where: { id: mintedToken.id },
      data: {
        availableToken: (mintedToken.availableToken ?? 0) - tokensBought,
      },
    });

    return boughtToken;
  } catch (error) {
    console.error('Error buying token:', error);
    throw new Error('Error buying token');
  }
};

export const releaseSong = async (tokenId: number) => {
  try {
    // Check if the token exists
    const token = await prisma.mintedToken.findUnique({
      where: { tokenId },
    });
    console.log(token)

    if (!token) {
      throw new Error('Minted token not found');
    }

    // Update the minted token
    const updatedToken = await prisma.mintedToken.update({
      where: { tokenId },
      data: { isReleased: true },
    });

    console.log(updatedToken)

    return updatedToken;
  } catch (error) {
    console.error('Error releasing song:', error);
    throw new Error('Error releasing song');
  }
}