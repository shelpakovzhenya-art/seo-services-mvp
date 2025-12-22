@echo off
echo === SEO Services MVP - Dev Server ===
echo.

cd /d "%~dp0"

if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

echo [1/4] Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: npm install failed!
        pause
        exit /b 1
    )
) else (
    echo Dependencies: OK
)

echo [2/4] Checking .env file...
if not exist ".env" (
    echo Creating .env file...
    (
        echo DATABASE_URL="file:./prisma/dev.db"
        echo ADMIN_USER=admin
        echo ADMIN_PASS=admin123
        echo SMTP_HOST=
        echo SMTP_PORT=
        echo SMTP_USER=
        echo SMTP_PASS=
        echo SMTP_FROM=
        echo SITE_URL=http://localhost:3000
    ) > .env
    echo .env created
) else (
    echo .env: OK
)

echo [3/4] Setting up Prisma...
if not exist "prisma\dev.db" (
    echo Generating Prisma Client...
    call npx prisma generate >nul 2>&1
    echo Creating database...
    call npx prisma migrate dev --name init >nul 2>&1
    echo Seeding database...
    call npx tsx prisma/seed.ts >nul 2>&1
) else (
    echo Database: OK
)

echo [4/4] Starting dev server...
echo.
echo === Server will start on http://localhost:3000 ===
echo Press Ctrl+C to stop the server
echo.

call npm run dev

