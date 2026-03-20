const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

function hasPostgresUrl(url) {
  return url.startsWith('postgresql://') || url.startsWith('postgres://')
}

function run(command) {
  execSync(command, { stdio: 'inherit', env: process.env })
}

const envPath = path.join(process.cwd(), '.env')
const databaseUrl = process.env.DATABASE_URL || ''
const isCi = process.env.CI === 'true' || process.env.RAILWAY_ENVIRONMENT_NAME || process.env.RAILWAY_PROJECT_ID

console.log('Setting up project...')

if (!fs.existsSync(envPath) && !isCi) {
  console.log('Creating local .env template...')
  fs.writeFileSync(
    envPath,
    `# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/seo_services?schema=public"

# Admin credentials
ADMIN_USER=admin
ADMIN_PASS=admin123

# SMTP settings (optional)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

# Site
SITE_URL=http://localhost:3000
`,
    'utf8'
  )
} else {
  console.log('Skipping .env creation')
}

console.log('Generating Prisma Client...')
run('npx prisma generate')

if (hasPostgresUrl(databaseUrl)) {
  console.log('PostgreSQL detected, skipping local auto-setup.')
  console.log('Use Railway variables or your local Postgres credentials in .env.')
} else {
  console.log('DATABASE_URL is not configured for PostgreSQL yet.')
}

console.log('Setup complete.')
