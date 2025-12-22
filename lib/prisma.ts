import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Check DATABASE_URL
const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  console.error('❌ DATABASE_URL is not set!')
  console.error('Please set DATABASE_URL in Vercel Environment Variables')
}

if (databaseUrl && !databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://') && !databaseUrl.startsWith('file:')) {
  console.error('❌ DATABASE_URL has invalid format!')
  console.error('DATABASE_URL must start with postgresql://, postgres://, or file:')
  console.error('Current DATABASE_URL:', databaseUrl?.substring(0, 20) + '...')
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

