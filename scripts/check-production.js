/**
 * Script to check production setup and fix common issues
 * Usage: node scripts/check-production.js
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🔍 Checking production setup...\n')

// Check if .env.local exists (from vercel env pull)
const envLocalPath = path.join(process.cwd(), '.env.local')
if (!fs.existsSync(envLocalPath)) {
  console.log('⚠️  .env.local not found')
  console.log('📝 Run: vercel env pull .env.local\n')
} else {
  console.log('✅ .env.local found')
}

// Check DATABASE_URL
const envContent = fs.existsSync(envLocalPath) 
  ? fs.readFileSync(envLocalPath, 'utf-8')
  : ''

const hasDatabaseUrl = envContent.includes('DATABASE_URL=')
const hasSiteUrl = envContent.includes('SITE_URL=')

if (!hasDatabaseUrl) {
  console.log('⚠️  DATABASE_URL not found in .env.local')
  console.log('📝 Add DATABASE_URL to Vercel Environment Variables\n')
} else {
  console.log('✅ DATABASE_URL found')
}

if (!hasSiteUrl) {
  console.log('⚠️  SITE_URL not found in .env.local')
  console.log('📝 Add SITE_URL to Vercel Environment Variables\n')
} else {
  console.log('✅ SITE_URL found')
}

console.log('\n📋 Next steps:')
console.log('1. Run: vercel env pull .env.local')
console.log('2. Check DATABASE_URL and SITE_URL in .env.local')
console.log('3. Run: npx tsx prisma/seed.ts')
console.log('4. Check Vercel Dashboard → Deployments → last deployment')
console.log('')

