# 🚀 Инструкция по деплою на Vercel

## ✅ Исправленные ошибки:

1. **TypeScript ошибка** - исправлена типизация в `app/admin/settings/page.tsx`
2. **Prisma migrate** - теперь использует `migrate deploy` в продакшене

## ⚠️ Важно: База данных для продакшена

SQLite (файловая БД) **НЕ работает** на Vercel, потому что:
- Файлы не сохраняются между деплоями
- Нет постоянного хранилища

### Решение: Используйте внешнюю БД

### Вариант 1: Supabase (PostgreSQL) - БЕСПЛАТНО ⭐

1. Зайдите на https://supabase.com
2. Создайте аккаунт (бесплатно)
3. Создайте новый проект
4. Скопируйте **Connection String** (URI)
5. В Vercel → Settings → Environment Variables добавьте:
   ```
   DATABASE_URL=postgresql://user:password@host:5432/database
   ```

### Вариант 2: Railway (PostgreSQL) - БЕСПЛАТНО

1. Зайдите на https://railway.app
2. Создайте аккаунт
3. New Project → Database → PostgreSQL
4. Скопируйте Connection String
5. Добавьте в Vercel Environment Variables

### Вариант 3: Neon (PostgreSQL) - БЕСПЛАТНО

1. Зайдите на https://neon.tech
2. Создайте аккаунт
3. Создайте проект
4. Скопируйте Connection String
5. Добавьте в Vercel

---

## 📋 Пошаговая инструкция:

### Шаг 1: Создайте PostgreSQL базу данных

1. Выберите один из вариантов выше (рекомендую Supabase)
2. Создайте проект/базу данных
3. Скопируйте Connection String

### Шаг 2: Обновите Prisma схему (если нужно)

Если используете PostgreSQL, убедитесь что в `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // или "sqlite" для локальной разработки
  url      = env("DATABASE_URL")
}
```

**Или** используйте разные схемы для dev и prod.

### Шаг 3: Настройте Vercel Environment Variables

В Vercel → Settings → Environment Variables добавьте:

```
DATABASE_URL=postgresql://... (ваш Connection String)
ADMIN_USER=admin
ADMIN_PASS=ваш-надежный-пароль
SMTP_HOST=ваш-smtp-host
SMTP_PORT=587
SMTP_USER=ваш-email
SMTP_PASS=ваш-пароль
SMTP_FROM=ваш-email
SITE_URL=https://ваш-домен.vercel.app
```

### Шаг 4: Примените миграции

После первого деплоя, выполните миграции:

**Вариант A: Через Vercel CLI**
```bash
npx vercel env pull
npx prisma migrate deploy
```

**Вариант B: Через Supabase Dashboard**
- Зайдите в SQL Editor
- Скопируйте SQL из `prisma/migrations/*/migration.sql`
- Выполните SQL

**Вариант C: Через Prisma Studio**
```bash
npx prisma studio
```

### Шаг 5: Задеплойте снова

После настройки БД:
1. В Vercel нажмите **Redeploy**
2. Или сделайте новый коммит в GitHub

---

## 🔧 Быстрое решение (временное):

Если нужно быстро задеплоить без настройки БД:

1. Временно отключите использование БД в коде
2. Используйте моки данных
3. Позже настройте PostgreSQL

---

## ✅ После исправлений:

1. Закоммитьте изменения:
   ```bash
   git add .
   git commit -m "Fix TypeScript errors and Prisma migrate for production"
   git push
   ```

2. Vercel автоматически задеплоит новую версию

3. Настройте PostgreSQL БД (см. выше)

---

## 🆘 Если все еще не работает:

1. Проверьте логи в Vercel Dashboard
2. Убедитесь, что DATABASE_URL правильно настроен
3. Проверьте, что миграции применены
4. Убедитесь, что Prisma Client сгенерирован

---

## 📞 Нужна помощь?

Если нужна помощь с настройкой PostgreSQL - напишите!

