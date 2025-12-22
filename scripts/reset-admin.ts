/**
 * Script to reset admin password
 * Usage: npx tsx scripts/reset-admin.ts [username] [new-password]
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const username = process.argv[2] || process.env.ADMIN_USER || 'admin'
  const newPassword = process.argv[3] || process.env.ADMIN_PASS || 'admin123'

  console.log('🔐 Resetting admin password...')
  console.log(`Username: ${username}`)
  console.log(`New password: ${newPassword}`)

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update or create admin user
    const admin = await prisma.admin.upsert({
      where: { username },
      update: {
        password: hashedPassword,
      },
      create: {
        username,
        password: hashedPassword,
      },
    })

    console.log('✅ Admin password reset successfully!')
    console.log(`Admin ID: ${admin.id}`)
    console.log(`Username: ${admin.username}`)
    console.log('')
    console.log('📝 You can now login with:')
    console.log(`   Username: ${username}`)
    console.log(`   Password: ${newPassword}`)
  } catch (error) {
    console.error('❌ Error resetting admin password:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

