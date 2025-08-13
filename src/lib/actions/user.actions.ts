"use server"

import { revalidatePath } from "next/cache";
import prisma from "../prisma";
import { redirect } from "next/navigation";

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

  export async function onboardUser(formData: FormData, address: string) {
    const name = formData.get('name') as string;
    const instaAccUrl = formData.get('instaAccUrl') as string;
  
    try {
      await prisma.user.update({
        where: { accountAddress: address },
        data: {
          isOnboarded: true,
          userInfo: {
            create: {
              name,
              instaAccUrl,
            },
          },
          verificationStatus: instaAccUrl ? 'Processing' : 'UnVerified',
        },
      });
  
      // Revalidate or redirect after successful onboarding
      revalidatePath(`/portfolio/${address}`);
      redirect(`/portfolio/${address}`);
    } catch (error) {
      console.error('Error during onboarding:', error);
      throw new Error('Failed to onboard user');
    }
  }
  