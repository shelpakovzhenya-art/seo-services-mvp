# Скрипт для добавления проекта в существующий GitHub репозиторий

Write-Host "=== Добавление проекта в GitHub ===" -ForegroundColor Cyan
Write-Host ""

# Проверка наличия Git
$gitPath = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitPath) {
    Write-Host "❌ Git не найден в PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Варианты решения:" -ForegroundColor Yellow
    Write-Host "1. Установите Git: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "2. Используйте GitHub Desktop для добавления репозитория" -ForegroundColor Yellow
    Write-Host "3. Если Git установлен в другом месте, добавьте его в PATH" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Или используйте GitHub Desktop:" -ForegroundColor Cyan
    Write-Host "  1. File → Add Local Repository" -ForegroundColor White
    Write-Host "  2. Выберите папку: c:\seo-services-mvp" -ForegroundColor White
    Write-Host "  3. Сделайте коммит и push" -ForegroundColor White
    exit 1
}

Write-Host "✅ Git найден" -ForegroundColor Green
Write-Host ""

# Переход в папку проекта
Set-Location $PSScriptRoot

# Проверка, инициализирован ли git
if (Test-Path .git) {
    Write-Host "✅ Git репозиторий уже инициализирован" -ForegroundColor Green
} else {
    Write-Host "📦 Инициализация Git репозитория..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Репозиторий инициализирован" -ForegroundColor Green
}

Write-Host ""

# Проверка remote
$remote = git remote -v 2>&1
if ($remote -match "origin") {
    Write-Host "✅ Remote 'origin' уже настроен:" -ForegroundColor Green
    git remote -v
    Write-Host ""
} else {
    Write-Host "⚠️  Remote 'origin' не настроен" -ForegroundColor Yellow
    Write-Host ""
    $repoUrl = Read-Host "Введите URL вашего GitHub репозитория (например: https://github.com/username/repo.git)"
    if ($repoUrl) {
        git remote add origin $repoUrl
        Write-Host "✅ Remote добавлен" -ForegroundColor Green
    } else {
        Write-Host "❌ URL не введен. Добавьте remote вручную:" -ForegroundColor Red
        Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git" -ForegroundColor White
        exit 1
    }
}

Write-Host ""
Write-Host "📝 Добавление файлов..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "💾 Создание коммита..." -ForegroundColor Yellow
$commitMessage = "Initial commit: SEO Services MVP"
git commit -m $commitMessage

Write-Host ""
Write-Host "🌿 Проверка ветки..." -ForegroundColor Yellow
$currentBranch = git branch --show-current
if ($currentBranch -ne "main" -and $currentBranch -ne "master") {
    Write-Host "Переименование ветки в 'main'..." -ForegroundColor Yellow
    git branch -M main
}

Write-Host ""
Write-Host "🚀 Загрузка на GitHub..." -ForegroundColor Yellow
Write-Host "⚠️  Если потребуется авторизация, используйте Personal Access Token" -ForegroundColor Yellow
Write-Host ""

try {
    git push -u origin main
    Write-Host ""
    Write-Host "✅ Проект успешно загружен на GitHub!" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "❌ Ошибка при загрузке:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Возможные решения:" -ForegroundColor Yellow
    Write-Host "1. Проверьте URL репозитория" -ForegroundColor White
    Write-Host "2. Убедитесь, что у вас есть права на запись" -ForegroundColor White
    Write-Host "3. Используйте Personal Access Token для авторизации" -ForegroundColor White
    Write-Host "4. Попробуйте через GitHub Desktop" -ForegroundColor White
}

Write-Host ""
Write-Host "Готово!" -ForegroundColor Cyan

