/**
 * Script to fix admin login in production
 * This script can be run directly in Vercel or locally with DATABASE_URL
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🔐 Fixing admin credentials...\n')

  const username = process.env.ADMIN_USER || 'admin'
  const password = process.env.ADMIN_PASS || 'admin123'

  console.log(`Username: ${username}`)
  console.log(`Password: ${password}\n`)

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log('✅ Password hashed')

    // Find or create admin
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

    console.log('✅ Admin user fixed!')
    console.log(`Admin ID: ${admin.id}`)
    console.log(`Username: ${admin.username}`)
    console.log('\n📝 You can now login with:')
    console.log(`   Username: ${username}`)
    console.log(`   Password: ${password}\n`)

    // Verify the password works
    const isValid = await bcrypt.compare(password, admin.password)
    if (isValid) {
      console.log('✅ Password verification: SUCCESS')
    } else {
      console.log('❌ Password verification: FAILED')
    }

  } catch (error) {
    console.error('❌ Error fixing admin:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

