# Скрипт для загрузки проекта на GitHub
# Репозиторий: https://github.com/shelpakovzhenya-art/my-site.git

Write-Host "=== Загрузка проекта на GitHub ===" -ForegroundColor Cyan
Write-Host "Репозиторий: https://github.com/shelpakovzhenya-art/my-site.git" -ForegroundColor Yellow
Write-Host ""

# Проверка наличия Git
try {
    $gitVersion = git --version 2>&1
    Write-Host "✅ Git найден: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git не найден в PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Установите Git:" -ForegroundColor Yellow
    Write-Host "1. Скачайте: https://git-scm.com/download/win" -ForegroundColor White
    Write-Host "2. Установите с настройками по умолчанию" -ForegroundColor White
    Write-Host "3. Перезапустите PowerShell" -ForegroundColor White
    Write-Host ""
    Write-Host "Или используйте GitHub Desktop:" -ForegroundColor Cyan
    Write-Host "   https://desktop.github.com/" -ForegroundColor White
    exit 1
}

Write-Host ""

# Переход в папку проекта
Set-Location $PSScriptRoot
Write-Host "📁 Рабочая папка: $(Get-Location)" -ForegroundColor Cyan
Write-Host ""

# Инициализация Git (если нужно)
if (Test-Path .git) {
    Write-Host "✅ Git репозиторий уже инициализирован" -ForegroundColor Green
} else {
    Write-Host "📦 Инициализация Git репозитория..." -ForegroundColor Yellow
    git init
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Репозиторий инициализирован" -ForegroundColor Green
    } else {
        Write-Host "❌ Ошибка инициализации" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Проверка и добавление remote
$remoteCheck = git remote -v 2>&1
if ($remoteCheck -match "origin.*my-site") {
    Write-Host "✅ Remote 'origin' уже настроен:" -ForegroundColor Green
    git remote -v
} else {
    Write-Host "🔗 Настройка remote..." -ForegroundColor Yellow
    # Удаляем старый remote если есть
    git remote remove origin 2>$null
    # Добавляем новый
    git remote add origin https://github.com/shelpakovzhenya-art/my-site.git
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Remote добавлен" -ForegroundColor Green
        git remote -v
    } else {
        Write-Host "❌ Ошибка добавления remote" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Добавление файлов
Write-Host "📝 Добавление файлов..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Файлы добавлены" -ForegroundColor Green
} else {
    Write-Host "⚠️  Предупреждение при добавлении файлов" -ForegroundColor Yellow
}

Write-Host ""

# Проверка, есть ли изменения для коммита
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "ℹ️  Нет изменений для коммита" -ForegroundColor Cyan
    Write-Host "Проверка текущего состояния..." -ForegroundColor Yellow
    git status
} else {
    # Создание коммита
    Write-Host "💾 Создание коммита..." -ForegroundColor Yellow
    git commit -m "Initial commit: SEO Services MVP"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Коммит создан" -ForegroundColor Green
    } else {
        Write-Host "❌ Ошибка создания коммита" -ForegroundColor Red
        Write-Host "Возможно, нужно настроить имя и email:" -ForegroundColor Yellow
        Write-Host "  git config --global user.name 'Ваше Имя'" -ForegroundColor White
        Write-Host "  git config --global user.email 'ваш-email@example.com'" -ForegroundColor White
        exit 1
    }
}

Write-Host ""

# Переименование ветки
Write-Host "🌿 Проверка ветки..." -ForegroundColor Yellow
$currentBranch = git branch --show-current
if ($currentBranch -ne "main" -and $currentBranch -ne "master") {
    Write-Host "Переименование ветки в 'main'..." -ForegroundColor Yellow
    git branch -M main
}

Write-Host ""

# Загрузка на GitHub
Write-Host "🚀 Загрузка на GitHub..." -ForegroundColor Yellow
Write-Host "⚠️  Если потребуется авторизация:" -ForegroundColor Yellow
Write-Host "   - Используйте Personal Access Token вместо пароля" -ForegroundColor White
Write-Host "   - Создайте токен: https://github.com/settings/tokens" -ForegroundColor White
Write-Host "   - Выберите права: repo (полный доступ)" -ForegroundColor White
Write-Host ""

try {
    git push -u origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Проект успешно загружен на GitHub!" -ForegroundColor Green
        Write-Host "🔗 Репозиторий: https://github.com/shelpakovzhenya-art/my-site" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "❌ Ошибка при загрузке" -ForegroundColor Red
        Write-Host ""
        Write-Host "Возможные решения:" -ForegroundColor Yellow
        Write-Host "1. Проверьте авторизацию (используйте Personal Access Token)" -ForegroundColor White
        Write-Host "2. Убедитесь, что у вас есть права на запись в репозиторий" -ForegroundColor White
        Write-Host "3. Попробуйте через GitHub Desktop" -ForegroundColor White
    }
} catch {
    Write-Host ""
    Write-Host "❌ Ошибка: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Готово!" -ForegroundColor Cyan

