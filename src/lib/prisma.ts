
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  namespace NodeJS {
    interface Global {
      prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
    }
  }
}

const prisma: ReturnType<typeof prismaClientSingleton> = (globalThis as typeof globalThis & { prismaGlobal?: ReturnType<typeof prismaClientSingleton> }).prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') (globalThis as typeof globalThis & { prismaGlobal?: ReturnType<typeof prismaClientSingleton> }).prismaGlobal = prisma
