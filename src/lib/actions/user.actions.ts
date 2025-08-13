"use server"

import { revalidatePath } from "next/cache";
import prisma from "../prisma";

export const logInUser = async (address: string):Promise<void> => {
    try {
      const userAccountAddress = await prisma.user.findUnique({
        where: {
          accountAddress: address, // Make sure this matches the schema
        },
      });
  
      if (!userAccountAddress) {
        await prisma.user.create({
          data: {
          accountAddress: address,
          },
        });
        console.log('User created successfully');
      } else {
        console.log('User already exists');
      }
    } catch (error:any) {
      console.error('Error in logInUser function:', error.message); // Log the actual error message
      console.error('Stack trace:', error.stack); // Optional: Log full error stack trace
      throw new Error('Failed to log in or create user');
    }
  };

  export async function onboardUser(formData: FormData, address: string): Promise<{ success: boolean }> {
    const name = formData.get('name') as string;
    const instaAccUrl = formData.get('instaAccUrl') as string;
    console.log('Onboarding user:', { name, instaAccUrl });

    try {
      // First, get the user to check if they have userInfo
      const existingUser = await prisma.user.findUnique({
        where: { accountAddress: address },
        include: { userInfo: true }
      });

      if (!existingUser) {
        throw new Error('User not found');
      }

      // Update user and handle userInfo creation/update
      await prisma.user.update({
        where: { accountAddress: address },
        data: {
          isOnboarded: true,
          userInfo: existingUser.userInfo 
            ? {
                // Update existing userInfo
                update: {
                  name,
                  instaAccUrl,
                }
              }
            : {
                // Create new userInfo if it doesn't exist
                create: {
                  name,
                  instaAccUrl,
                }
              },
          verificationStatus: instaAccUrl ? 'Processing' : 'UnVerified',
        },
      });
  
      console.log('User onboarded successfully');
      
      // Revalidate the path for updated data
      revalidatePath(`/portfolio/${address}`);
      
      // Return success indicator instead of redirecting
      return { success: true };
    } catch (error) {
      console.error('Error during onboarding:', error);
      throw new Error('Failed to onboard user');
    }
  }

  export async function getUserByAddress(address: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { accountAddress: address },
        include: {
          userInfo: true,
          songs: true,
        },
      });
      return user;
    } catch (error) {
      console.error('Error fetching user by address:', error);
      throw new Error('Failed to fetch user');
    }
  }
