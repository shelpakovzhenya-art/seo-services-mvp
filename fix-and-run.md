# Исправление проблем с запуском

## Если сайт не работает, выполните по порядку:

### 1. Проверьте, что вы в правильной директории:
```powershell
cd seo-services-mvp
```

### 2. Установите зависимости:
```powershell
npm install
```

### 3. Если установка завершилась с ошибками, попробуйте:
```powershell
# Очистить кэш
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

# Переустановить
npm install
```

### 4. Настройте базу данных вручную (если автоматическая настройка не сработала):
```powershell
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 5. Запустите сервер:
```powershell
npm run dev
```

### 6. Проверьте ошибки:
- Если порт 3000 занят, убейте процесс: `Get-Process -Name node | Stop-Process`
- Если есть ошибки TypeScript, проверьте файлы на наличие синтаксических ошибок
- Если база данных не создается, проверьте права доступа к папке prisma

### 7. Альтернативный запуск (если setup не работает):
```powershell
# Создайте .env вручную
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
"@ | Out-File -FilePath .env -Encoding utf8

# Затем запустите
npm run dev
```

## Частые проблемы:

1. **"Cannot find module"** - Запустите `npm install`
2. **"Prisma Client not generated"** - Запустите `npm run prisma:generate`
3. **"Database not found"** - Запустите `npm run prisma:migrate`
4. **Порт 3000 занят** - Измените порт в package.json или убейте процесс на порту 3000


