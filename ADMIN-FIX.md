# Исправление проблемы с админкой

## Проблема
Админка не открывается из-за отсутствия базы данных.

## Решение

Выполните в терминале (в директории проекта):

```powershell
cd C:\seo-services-mvp

# Создать базу данных
npx prisma db push

# Заполнить тестовыми данными
npx tsx prisma/seed.ts

# Перезапустить сервер
npm run dev
```

## Доступ к админке

После выполнения команд выше:

1. Откройте: http://localhost:3000/admin/login
2. Введите:
   - Логин: `admin`
   - Пароль: `admin123`

## Альтернатива

Если база не создается, попробуйте:

```powershell
# Удалить старые миграции
Remove-Item -Recurse -Force prisma\migrations -ErrorAction SilentlyContinue

# Создать новую миграцию
npx prisma migrate dev --name init

# Заполнить данными
npx tsx prisma/seed.ts
```


