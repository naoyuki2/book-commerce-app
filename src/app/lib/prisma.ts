import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

//シングルトン：一度だけインスタンス化を実行する
const globalForPrisma = global as unknown as {
    prisma: PrismaClient | undefined
}

if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient()
}

prisma = globalForPrisma.prisma

export default prisma
