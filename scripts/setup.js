const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 Setting up project...')

// 1. Create .env if it doesn't exist
const envPath = path.join(process.cwd(), '.env')
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...')
  const envContent = `# Database
DATABASE_URL="file:./prisma/dev.db"

# Admin credentials
ADMIN_USER=admin
ADMIN_PASS=admin123

# SMTP settings (optional - leave empty if not needed)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

# Site
SITE_URL=http://localhost:3000
`
  fs.writeFileSync(envPath, envContent)
  console.log('✅ .env file created')
} else {
  console.log('✅ .env file already exists')
}

// 2. Generate Prisma Client
console.log('🔧 Generating Prisma Client...')
try {
  execSync('npx prisma generate', { stdio: 'inherit' })
  console.log('✅ Prisma Client generated')
} catch (error) {
  console.warn('⚠️  Prisma generate warning (will retry on dev):', error.message)
  // Don't exit - let predev handle it
}

// 3. Run migrations (non-blocking)
console.log('📦 Setting up database...')
const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
const migrationsPath = path.join(process.cwd(), 'prisma', 'migrations')

if (!fs.existsSync(dbPath)) {
  try {
    // Check if migrations directory exists
    if (fs.existsSync(migrationsPath) && fs.readdirSync(migrationsPath).length > 0) {
      // Migrations exist, deploy them
      console.log('📦 Applying existing migrations...')
      execSync('npx prisma migrate deploy', { stdio: 'inherit' })
      console.log('✅ Migrations applied')
    } else {
      // No migrations, create initial one
      console.log('📦 Creating initial migration...')
      execSync('npx prisma migrate dev --name init', { stdio: 'inherit' })
      console.log('✅ Initial migration created and applied')
    }
  } catch (error) {
    console.warn('⚠️  Migration warning (will retry on dev):', error.message)
    // Don't fail - predev will handle it
  }
} else {
  console.log('✅ Database exists')
}

// 4. Seed database (only if DB exists)
if (fs.existsSync(dbPath)) {
  console.log('🌱 Seeding database...')
  try {
    execSync('npx tsx prisma/seed.ts', { stdio: 'inherit', env: { ...process.env, NODE_ENV: 'development' } })
    console.log('✅ Database seeded')
  } catch (error) {
    // Seed errors are non-fatal - data might already exist
    console.warn('⚠️  Seed completed with warnings (this is OK)')
  }
} else {
  console.log('⏭️  Skipping seed (database will be created on dev)')
}

console.log('✨ Setup complete!')
console.log('')
console.log('📝 Next steps:')
console.log('   1. Run: npm run dev')
console.log('   2. Open: http://localhost:3000')
console.log('   3. Admin: http://localhost:3000/admin (admin/admin123)')
console.log('')
