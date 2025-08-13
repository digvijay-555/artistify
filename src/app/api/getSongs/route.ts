import prisma from "@/lib/prisma";

export const GET = async() => {
    try {
        const songs = await prisma.song.findMany({
            include: {
              user: {
                include: {
                  userInfo: true,
                },
              },
            },
          });
          return new Response(JSON.stringify({ songs:songs }), { status: 200 });
    } catch (error) {
        console.error('Error fetching songs:', error);
        return new Response(JSON.stringify({ error: 'Invalid req' }), { status: 401 });
    }
}