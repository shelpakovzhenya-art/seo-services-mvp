# 🗄️ Настройка базы данных в Vercel

## 🎯 Цель: Настроить PostgreSQL для вашего сайта

---

## ✅ ВАРИАНТ 1: Vercel Postgres (РЕКОМЕНДУЕТСЯ - Самый простой)

### Шаг 1: Создать базу данных в Vercel

1. Откройте: https://vercel.com/dashboard
2. Выберите ваш проект: **seo-services-mvp**
3. Перейдите в раздел **Storage** (в боковом меню)
4. Нажмите **"Create Database"**
5. Выберите **"Postgres"**
6. Выберите план:
   - **Hobby** (бесплатно) - для начала достаточно
   - Или **Pro** (если нужны дополнительные возможности)
7. Нажмите **"Create"**

### Шаг 2: Скопировать Connection String

1. После создания базы данных откройте её
2. Перейдите в раздел **".env.local"** или **"Settings"**
3. Найдите **"Connection String"** или **"DATABASE_URL"**
4. Скопируйте строку подключения (она выглядит так):
   ```
   postgres://default:password@host:5432/database
   ```

### Шаг 3: Добавить DATABASE_URL в Environment Variables

1. В Vercel Dashboard → ваш проект → **Settings** → **Environment Variables**
2. Нажмите **"Add New"**
3. Введите:
   - **Key:** `DATABASE_URL`
   - **Value:** вставьте скопированную Connection String
   - **Environment:** выберите **Production**, **Preview**, и **Development**
4. Нажмите **"Save"**

### Шаг 4: Применить миграции и заполнить базу данных

**Вариант A: Через Vercel CLI (локально)**

```powershell
# 1. Установите Vercel CLI (если еще не установлен)
npm i -g vercel

# 2. Подключитесь к проекту
vercel link

# 3. Получите переменные окружения
vercel env pull .env.local

# 4. Примените миграции
npx prisma migrate deploy

# 5. Заполните базу данных
npx tsx prisma/seed.ts
```

**Вариант B: Через API endpoint (после деплоя)**

1. После деплоя откройте в браузере:
   ```
   https://ваш-домен.vercel.app/api/admin/emergency-fix
   ```
2. Это автоматически:
   - Применит миграции
   - Создаст админа
   - Загрузит все услуги, меню, страницы

### Шаг 5: Сделать Redeploy

1. В Vercel Dashboard → ваш проект
2. Перейдите в **Deployments**
3. Найдите последний деплой
4. Нажмите **"..."** → **"Redeploy"**
5. Дождитесь завершения

---

## ✅ ВАРИАНТ 2: Supabase (Альтернатива)

### Шаг 1: Создать проект в Supabase

1. Откройте: https://supabase.com
2. Войдите или зарегистрируйтесь
3. Нажмите **"New Project"**
4. Заполните:
   - **Name:** seo-services-mvp
   - **Database Password:** придумайте надежный пароль (сохраните его!)
   - **Region:** выберите ближайший регион
5. Нажмите **"Create new project"**
6. Дождитесь создания проекта (2-3 минуты)

### Шаг 2: Получить Connection String

1. В Supabase Dashboard → ваш проект
2. Перейдите в **Settings** → **Database**
3. Найдите раздел **"Connection string"**
4. Выберите **"URI"** (не "Session mode")
5. Скопируйте строку подключения
6. Замените `[YOUR-PASSWORD]` на ваш пароль базы данных

Пример:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

### Шаг 3: Добавить в Vercel

1. Vercel Dashboard → ваш проект → **Settings** → **Environment Variables**
2. Добавьте:
   - **Key:** `DATABASE_URL`
   - **Value:** вставьте Connection String из Supabase (с паролем!)
   - **Environment:** Production, Preview, Development
3. Сохраните

### Шаг 4: Применить миграции

Следуйте **Шагу 4** из Варианта 1 (через CLI или через API endpoint)

---

## ✅ ВАРИАНТ 3: Внешний PostgreSQL (Timeweb, Beget, REG.RU и т.д.)

### Шаг 1: Получить данные подключения

От вашего хостинг-провайдера вам нужны:
- **Host:** адрес сервера БД
- **Port:** обычно 5432
- **Database:** имя базы данных
- **User:** имя пользователя
- **Password:** пароль

### Шаг 2: Сформировать DATABASE_URL

Формат:
```
postgresql://user:password@host:port/database
```

Пример:
```
postgresql://myuser:mypassword@db.example.com:5432/mydb
```

### Шаг 3: Добавить в Vercel

1. Vercel Dashboard → **Settings** → **Environment Variables**
2. Добавьте `DATABASE_URL` с вашей строкой подключения
3. Сохраните

### Шаг 4: Применить миграции

Следуйте **Шагу 4** из Варианта 1

---

## 🔍 Проверка после настройки

### 1. Проверить переменные окружения

```powershell
# Локально (после vercel env pull)
cat .env.local | findstr DATABASE_URL
```

Должно быть что-то вроде:
```
DATABASE_URL=postgresql://...
```

### 2. Проверить подключение

```powershell
# Локально
npx prisma db pull
```

Если ошибок нет - подключение работает!

### 3. Применить миграции

```powershell
npx prisma migrate deploy
```

### 4. Заполнить базу данных

```powershell
npx tsx prisma/seed.ts
```

### 5. Проверить сайт

1. Откройте ваш сайт на Vercel
2. Попробуйте войти в админку: `/admin`
3. Логин: `admin`
4. Пароль: `admin123`

---

## ⚠️ ВАЖНЫЕ ЗАМЕЧАНИЯ:

1. **DATABASE_URL обязателен** - без него сайт не работает
2. **Формат должен быть правильным** - начинаться с `postgresql://` или `postgres://`
3. **После изменения DATABASE_URL** - обязательно сделайте Redeploy
4. **Пароль в Connection String** - должен быть реальным паролем (не `[YOUR-PASSWORD]`)

---

## 🆘 Если что-то не работает:

### Ошибка: "DATABASE_URL must start with postgresql://"

**Решение:** Проверьте формат DATABASE_URL в Vercel Environment Variables

### Ошибка: "Connection refused"

**Решение:** 
- Проверьте, что база данных создана и запущена
- Проверьте правильность пароля
- Проверьте, что хост и порт правильные

### Ошибка: "Table does not exist"

**Решение:** 
- Примените миграции: `npx prisma migrate deploy`
- Или откройте `/api/admin/emergency-fix` после деплоя

---

## ✅ После успешной настройки:

1. ✅ DATABASE_URL настроен в Vercel
2. ✅ Миграции применены
3. ✅ База данных заполнена (seed)
4. ✅ Админка работает: `admin` / `admin123`
5. ✅ Все услуги и разделы отображаются

---

**Готово!** Ваша база данных настроена и работает! 🎉

