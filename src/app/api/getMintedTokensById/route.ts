import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export const POST = async(req: NextRequest) => {
  try {
    const reqjson = await req.json(); 
    console.log(reqjson)
    const { tokenId } = reqjson;  // Access tokenId from the parsed body
    console.log(tokenId);

    const mintedToken = await prisma.mintedToken.findUnique({
      where: { tokenId: Number(tokenId) },
      include: {
        user: {
          include: {
            userInfo: true,
          },
        },
      },
    });

    if (!mintedToken) {
      return new Response(JSON.stringify({ error: 'Token not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ mintedToken }), { status: 200 });
  } catch (error) {
    console.error('Error fetching minted token:', error);
    return new Response(JSON.stringify({ error: 'Invalid req' }), { status: 401 });
  }
}
