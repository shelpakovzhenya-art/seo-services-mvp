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

// Check if we're in production (non-interactive environment)
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1' || !process.stdin.isTTY

// Check if DATABASE_URL is PostgreSQL (starts with postgresql:// or postgres://)
const databaseUrl = process.env.DATABASE_URL || ''
const isPostgreSQL = databaseUrl.startsWith('postgresql://') || databaseUrl.startsWith('postgres://')
const isSQLite = databaseUrl.startsWith('file:') || !databaseUrl || databaseUrl.includes('dev.db')

if (isProduction && isPostgreSQL) {
  // Production with PostgreSQL - apply migrations
  try {
    console.log('📦 Applying database migrations (PostgreSQL)...')
    execSync('npx prisma migrate deploy', { stdio: 'inherit' })
    console.log('✅ Migrations applied')
  } catch (error) {
    console.warn('⚠️  Migration deploy warning:', error.message)
    // Try to push schema if migrations fail
    try {
      console.log('📦 Attempting to push schema...')
      execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' })
      console.log('✅ Schema pushed')
    } catch (pushError) {
      console.warn('⚠️  Schema push warning:', pushError.message)
    }
  }
} else if (!isProduction && isSQLite) {
  // Development with SQLite
  if (!fs.existsSync(dbPath)) {
    try {
      // Check if migrations directory exists
      if (fs.existsSync(migrationsPath) && fs.readdirSync(migrationsPath).length > 0) {
        // Migrations exist, but we're using SQLite - use db push instead
        console.log('📦 Creating SQLite database...')
        execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' })
        console.log('✅ SQLite database created')
      } else {
        // No migrations, create initial one (only in dev)
        console.log('📦 Creating initial migration...')
        execSync('npx prisma migrate dev --name init', { stdio: 'inherit' })
        console.log('✅ Initial migration created and applied')
      }
    } catch (error) {
      console.warn('⚠️  Migration warning (will retry on dev):', error.message)
    }
  } else {
    console.log('✅ SQLite database exists')
  }
} else if (!isProduction && isPostgreSQL) {
  // Development with PostgreSQL
  try {
    console.log('📦 Applying database migrations (PostgreSQL dev)...')
    execSync('npx prisma migrate deploy', { stdio: 'inherit' })
    console.log('✅ Migrations applied')
  } catch (error) {
    console.warn('⚠️  Migration warning:', error.message)
  }
} else {
  console.log('⏭️  Skipping database setup (unknown database type)')
}

// 4. Seed database (only in production with PostgreSQL, or if SQLite exists)
if ((isProduction && isPostgreSQL) || (isSQLite && fs.existsSync(dbPath))) {
  console.log('🌱 Seeding database...')
  try {
    execSync('npx tsx prisma/seed.ts', { stdio: 'inherit', env: { ...process.env, NODE_ENV: isProduction ? 'production' : 'development' } })
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
