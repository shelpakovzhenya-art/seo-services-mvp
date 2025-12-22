# Скрипт для копирования файлов проекта в клонированный GitHub репозиторий

Write-Host "=== Копирование проекта в GitHub репозиторий ===" -ForegroundColor Cyan
Write-Host ""

# Определяем возможные пути к GitHub репозиторию
$possiblePaths = @(
    "$env:USERPROFILE\Documents\GitHub\my-site",
    "$env:USERPROFILE\Desktop\my-site",
    "C:\GitHub\my-site"
)

$repoPath = $null

# Ищем существующий репозиторий
foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        if (Test-Path (Join-Path $path ".git")) {
            $repoPath = $path
            Write-Host "✅ Найден репозиторий: $repoPath" -ForegroundColor Green
            break
        }
    }
}

# Если не найден, спрашиваем у пользователя
if (-not $repoPath) {
    Write-Host "⚠️  Репозиторий не найден в стандартных местах" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Возможные варианты:" -ForegroundColor Cyan
    Write-Host "1. Клонируйте репозиторий через GitHub Desktop:" -ForegroundColor White
    Write-Host "   File → Clone Repository → URL" -ForegroundColor Gray
    Write-Host "   https://github.com/shelpakovzhenya-art/my-site.git" -ForegroundColor Gray
    Write-Host ""
    $userPath = Read-Host "2. Или введите путь к клонированному репозиторию вручную"
    
    if ($userPath -and (Test-Path $userPath)) {
        if (Test-Path (Join-Path $userPath ".git")) {
            $repoPath = $userPath
        } else {
            Write-Host "❌ В указанной папке нет .git репозитория" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "❌ Путь не указан или не существует" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "📁 Исходная папка: c:\seo-services-mvp" -ForegroundColor Cyan
Write-Host "📁 Целевая папка: $repoPath" -ForegroundColor Cyan
Write-Host ""

# Подтверждение
$confirm = Read-Host "Копировать файлы? (Y/N)"
if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "Отменено" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "📋 Копирование файлов..." -ForegroundColor Yellow

# Исключаемые файлы и папки
$excludeItems = @(
    ".env",
    "node_modules",
    ".next",
    "*.db",
    "*.db-journal",
    ".git"
)

# Копирование с исключениями
$sourcePath = "c:\seo-services-mvp"
$copied = 0
$skipped = 0

Get-ChildItem -Path $sourcePath -Recurse -File | ForEach-Object {
    $relativePath = $_.FullName.Substring($sourcePath.Length + 1)
    $destFile = Join-Path $repoPath $relativePath
    $destDir = Split-Path $destFile -Parent
    
    # Проверка на исключения
    $shouldExclude = $false
    foreach ($exclude in $excludeItems) {
        if ($relativePath -like "*\$exclude" -or $relativePath -like "$exclude\*" -or $relativePath -eq $exclude) {
            $shouldExclude = $true
            break
        }
    }
    
    if (-not $shouldExclude) {
        # Создаем директорию если нужно
        if (-not (Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        
        # Копируем файл
        Copy-Item -Path $_.FullName -Destination $destFile -Force
        $copied++
    } else {
        $skipped++
    }
}

Write-Host ""
Write-Host "✅ Скопировано файлов: $copied" -ForegroundColor Green
Write-Host "⏭️  Пропущено файлов: $skipped" -ForegroundColor Yellow
Write-Host ""
Write-Host "📦 Следующие шаги:" -ForegroundColor Cyan
Write-Host "1. Откройте GitHub Desktop" -ForegroundColor White
Write-Host "2. Вы увидите все файлы в списке изменений" -ForegroundColor White
Write-Host "3. Введите сообщение: 'Initial commit: SEO Services MVP'" -ForegroundColor White
Write-Host "4. Нажмите 'Commit to main'" -ForegroundColor White
Write-Host "5. Нажмите 'Push origin'" -ForegroundColor White
Write-Host ""
Write-Host "Готово! ✅" -ForegroundColor Green

