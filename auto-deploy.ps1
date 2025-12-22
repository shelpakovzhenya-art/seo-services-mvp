# Автоматический коммит и пуш изменений для деплоя

Write-Host "=== Автоматический деплой ===" -ForegroundColor Cyan
Write-Host ""

Set-Location $PSScriptRoot

# Проверка Git
try {
    $gitVersion = git --version 2>&1
    Write-Host "✅ Git найден" -ForegroundColor Green
} catch {
    Write-Host "❌ Git не найден. Используйте GitHub Desktop для коммита." -ForegroundColor Red
    Write-Host ""
    Write-Host "Или выполните вручную:" -ForegroundColor Yellow
    Write-Host "  git add ." -ForegroundColor White
    Write-Host "  git commit -m 'Fix TypeScript errors for Vercel deployment'" -ForegroundColor White
    Write-Host "  git push" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "📝 Добавление файлов..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "💾 Создание коммита..." -ForegroundColor Yellow
$commitMessage = "Fix TypeScript errors and Prisma migrate for Vercel deployment"
git commit -m $commitMessage

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Нет изменений для коммита или ошибка" -ForegroundColor Yellow
    git status
} else {
    Write-Host "✅ Коммит создан" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "🚀 Отправка на GitHub..." -ForegroundColor Yellow
    git push
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Изменения отправлены на GitHub!" -ForegroundColor Green
        Write-Host "Vercel автоматически задеплоит новую версию" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "❌ Ошибка при отправке" -ForegroundColor Red
        Write-Host "Проверьте авторизацию или используйте GitHub Desktop" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Готово!" -ForegroundColor Cyan

