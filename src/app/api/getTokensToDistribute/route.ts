import prisma from '@/lib/prisma';

export const GET = async() => {
    try {
      const mintedTokens = await prisma.mintedToken.findMany({
            where: {
                isReleased: true
            }
      });
      return new Response(JSON.stringify({ mintedTokens:mintedTokens }), { status: 200 });
    } catch (error) {
      console.error('Error fetching minted tokens:', error);
      return new Response(JSON.stringify({ error: 'Invalid req' }), { status: 401 });
    }
}