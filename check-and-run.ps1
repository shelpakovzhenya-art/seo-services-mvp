# Diagnostic and run script
Write-Host "=== SEO Services MVP - Diagnostic ===" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
$projectRoot = Get-Location
Write-Host "Current directory: $projectRoot" -ForegroundColor Yellow

# Check package.json
if (Test-Path "package.json") {
    Write-Host "✓ package.json found" -ForegroundColor Green
} else {
    Write-Host "✗ package.json NOT found" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory"
    exit 1
}

# Check node_modules
if (Test-Path "node_modules") {
    Write-Host "✓ node_modules found" -ForegroundColor Green
} else {
    Write-Host "✗ node_modules NOT found" -ForegroundColor Red
    Write-Host "Running: npm install..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ npm install failed" -ForegroundColor Red
        exit 1
    }
}

# Check .env
if (Test-Path ".env") {
    Write-Host "✓ .env file found" -ForegroundColor Green
} else {
    Write-Host "⚠ .env file NOT found - will be created by setup" -ForegroundColor Yellow
}

# Check Prisma
if (Test-Path "prisma/schema.prisma") {
    Write-Host "✓ Prisma schema found" -ForegroundColor Green
} else {
    Write-Host "✗ Prisma schema NOT found" -ForegroundColor Red
    exit 1
}

# Check database
if (Test-Path "prisma/dev.db") {
    Write-Host "✓ Database file found" -ForegroundColor Green
} else {
    Write-Host "⚠ Database file NOT found - will be created on first run" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Starting dev server ===" -ForegroundColor Cyan
Write-Host ""

# Run dev server
npm run dev


