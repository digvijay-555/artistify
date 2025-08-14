import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export const POST = async (request: NextRequest) => {
    try {
        const { address } = await request.json();

        if (!address) {
            return new Response(JSON.stringify({ error: 'Address is required' }), { status: 400 });
        }

        const userDetails = await prisma.user.findUnique({
            where: { accountAddress: address },
            include: {
                userInfo: true,
                mintedTokens: true,
                boughtTokens: true
            }
        });

        return new Response(JSON.stringify({ userDetails }), { status: 200 });
    } catch (error) {
        console.error('Error fetching user data:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch user data' }), { status: 500 });
    }
};

export const GET = async () => {
    return new Response("Method Not Allowed", { status: 405, headers: { Allow: 'POST' } });
};
