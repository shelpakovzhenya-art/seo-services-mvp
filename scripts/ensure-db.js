const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')

// Ensure prisma directory exists
const prismaDir = path.join(process.cwd(), 'prisma')
if (!fs.existsSync(prismaDir)) {
  fs.mkdirSync(prismaDir, { recursive: true })
}

// Create database if it doesn't exist
if (!fs.existsSync(dbPath)) {
  console.log('Creating database...')
  try {
    execSync('npx prisma db push --accept-data-loss --skip-generate', { 
      stdio: 'inherit',
      cwd: process.cwd()
    })
  } catch (e) {
    console.error('Failed to create database:', e.message)
    process.exit(1)
  }
}

// Seed database
console.log('Seeding database...')
try {
  execSync('npx tsx prisma/seed.ts', { 
    stdio: 'inherit',
    cwd: process.cwd()
  })
} catch (e) {
  console.warn('Seed warning (may already be seeded):', e.message)
}

console.log('Database ready!')


