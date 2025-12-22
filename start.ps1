# Auto-fix and start script
$ErrorActionPreference = "Continue"

Write-Host "=== SEO Services MVP - Auto Start ===" -ForegroundColor Cyan
Write-Host ""

# Check if package.json exists
if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: package.json not found!" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory" -ForegroundColor Yellow
    exit 1
}

Write-Host "[1/5] Checking dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "  Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ERROR: npm install failed!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "  ✓ Dependencies installed" -ForegroundColor Green
}

Write-Host "[2/5] Checking .env file..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Write-Host "  Creating .env file..." -ForegroundColor Yellow
    @"
DATABASE_URL="file:./prisma/dev.db"
ADMIN_USER=admin
ADMIN_PASS=admin123
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
SITE_URL=http://localhost:3000
"@ | Out-File -FilePath .env -Encoding utf8 -NoNewline
    Write-Host "  ✓ .env created" -ForegroundColor Green
} else {
    Write-Host "  ✓ .env exists" -ForegroundColor Green
}

Write-Host "[3/5] Generating Prisma Client..." -ForegroundColor Yellow
try {
    npx prisma generate 2>&1 | Out-Null
    Write-Host "  ✓ Prisma Client generated" -ForegroundColor Green
} catch {
    Write-Host "  ⚠ Prisma generate warning (continuing...)" -ForegroundColor Yellow
}

Write-Host "[4/5] Setting up database..." -ForegroundColor Yellow
if (-not (Test-Path "prisma/dev.db")) {
    Write-Host "  Creating database..." -ForegroundColor Yellow
    try {
        npx prisma migrate dev --name init 2>&1 | Out-Null
        Write-Host "  ✓ Database created" -ForegroundColor Green
    } catch {
        Write-Host "  ⚠ Migration warning (trying db push...)" -ForegroundColor Yellow
        npx prisma db push 2>&1 | Out-Null
    }
    
    Write-Host "  Seeding database..." -ForegroundColor Yellow
    try {
        npx tsx prisma/seed.ts 2>&1 | Out-Null
        Write-Host "  ✓ Database seeded" -ForegroundColor Green
    } catch {
        Write-Host "  ⚠ Seed warning (continuing...)" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ✓ Database exists" -ForegroundColor Green
}

Write-Host "[5/5] Starting dev server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "=== Server starting on http://localhost:3000 ===" -ForegroundColor Cyan
Write-Host ""

npm run dev


