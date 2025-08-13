'use server'

import prisma from '@/lib/prisma';

export const uploadSong = async (data: {
  name: string;
  thumbnail: string;
  songCid: string;
  length: number;
  userAddress: string;
}) => {
  const { name, thumbnail, songCid,length, userAddress } = data;

  // Find the user by their address
  const user = await prisma.user.findUnique({
    where: { accountAddress: userAddress },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Create the song
  const song = await prisma.song.create({
    data: {
      name,
      thumbnail,
      songCid,
      length,
      userId: user.id,
      totalListeningTime: 0, // Initialize total listening time to 0
    },
  });

  return song;
};
