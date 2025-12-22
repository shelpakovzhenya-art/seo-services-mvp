const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Quick check and setup before dev
console.log('🔍 Pre-dev check...')

const envPath = path.join(process.cwd(), '.env')
const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
const nodeModulesPath = path.join(process.cwd(), 'node_modules')

// Check .env
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env...')
  fs.writeFileSync(envPath, `DATABASE_URL="file:./prisma/dev.db"
ADMIN_USER=admin
ADMIN_PASS=admin123
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
SITE_URL=http://localhost:3000
`)
}

// Check Prisma Client
const prismaClientPath = path.join(process.cwd(), 'node_modules', '.prisma', 'client')
if (!fs.existsSync(prismaClientPath)) {
  console.log('🔧 Generating Prisma Client...')
  try {
    execSync('npx prisma generate', { stdio: 'inherit' })
  } catch (e) {
    console.warn('⚠️  Prisma generate warning')
  }
}

// Check database - ALWAYS ensure it exists and is seeded
const dbDir = path.join(process.cwd(), 'prisma')
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

let dbNeedsSeed = false

if (!fs.existsSync(dbPath)) {
  console.log('📦 Creating database...')
  try {
    // Try db push first (faster, no migration files needed)
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' })
    dbNeedsSeed = true
  } catch (e) {
    // If db push fails, try migrate
    try {
      execSync('npx prisma migrate dev --name init', { stdio: 'inherit' })
      dbNeedsSeed = true
    } catch (e2) {
      console.warn('⚠️  Database creation failed, will be created on first request')
    }
  }
} else {
  // Database exists, check if it needs seeding
  const stats = fs.statSync(dbPath)
  if (stats.size < 5000) {
    // Very small DB, probably empty
    dbNeedsSeed = true
  }
}

function seedDatabase() {
  if (fs.existsSync(dbPath)) {
    console.log('🌱 Seeding database...')
    try {
      execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' })
    } catch (e) {
      console.warn('⚠️  Seed warning (may already be seeded)')
    }
  }
}

// Seed if needed
if (dbNeedsSeed) {
  seedDatabase()
}

console.log('✅ Ready to start dev server\n')

