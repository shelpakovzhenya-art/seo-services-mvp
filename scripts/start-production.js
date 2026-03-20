const { execSync, spawn } = require('child_process')

function run(command) {
  execSync(command, { stdio: 'inherit', env: process.env })
}

function hasPostgresUrl(url) {
  return url.startsWith('postgresql://') || url.startsWith('postgres://')
}

const databaseUrl = process.env.DATABASE_URL || ''
const shouldPrepareDb = process.env.SKIP_DB_PREPARE !== '1' && hasPostgresUrl(databaseUrl)

if (shouldPrepareDb) {
  console.log('Preparing PostgreSQL database...')

  try {
    run('npx prisma db push --accept-data-loss')
  } catch (error) {
    console.warn('Database schema sync failed:', error.message)
  }

  try {
    run('npx tsx prisma/seed.ts')
  } catch (error) {
    console.warn('Database seed failed:', error.message)
  }
} else {
  console.log('Skipping database prepare step.')
}

const child = spawn('npx', ['next', 'start'], {
  stdio: 'inherit',
  env: process.env,
  shell: true,
})

child.on('exit', (code) => {
  process.exit(code ?? 0)
})
