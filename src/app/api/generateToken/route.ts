import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'robinaditya';

export const POST = async (request: NextRequest) => {
    try {
        const { address } = await request.json();

        if (!address) {
            return new Response(JSON.stringify({ error: 'Address is required' }), { status: 400 });
        }

        const token = jwt.sign({ address }, SECRET_KEY, { expiresIn: '1h' });
        return new Response(JSON.stringify({ token }), { status: 200 });
    } catch (error) {
        return new Response(`Failed to generate token: ${error}`, { status: 500 });
    }
};

export const GET = async () => {
    return new Response("Method Not Allowed", { status: 405, headers: { Allow: 'POST' } });
};