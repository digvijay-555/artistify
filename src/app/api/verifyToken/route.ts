import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const SECRET_KEY = 'robinaditya';

export const POST = async (request: NextRequest) => {
    try {
        const { token } = await request.json();

        if (!token) {
            return new Response(JSON.stringify({ error: 'Token is required' }), { status: 400 });
        }

        const decoded = jwt.verify(token, SECRET_KEY) as { address: string };

        console.log('decoded', decoded.address);

        const userDetails = await prisma.user.findUnique({
            where: { accountAddress: decoded.address.toLowerCase() },
            include:{
                userInfo: true,
                mintedTokens: true,
                boughtTokens: true
            }
        });
        return new Response(JSON.stringify({ userDetails:userDetails }), { status: 200 });
    } catch (error) {
        console.error('Invalid token:', error);
        return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
    }
};

export const GET = async () => {
    return new Response("Method Not Allowed", { status: 405, headers: { Allow: 'POST' } });
};