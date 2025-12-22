# SEO Services MVP

Веб-приложение для предоставления SEO услуг с админ-панелью для управления контентом.

## 🚀 Быстрый старт

**Одна команда:**
```bash
npm run dev
```

Всё настроится автоматически:
- ✅ Создастся `.env` файл
- ✅ Настроится база данных
- ✅ Заполнятся тестовые данные

**После запуска:**
- Сайт: http://localhost:3000
- Админка: http://localhost:3000/admin
  - Логин: `admin`
  - Пароль: `admin123`

## 📋 Требования

- Node.js 18+ 
- npm или yarn

## 🛠️ Установка

```bash
# Клонировать репозиторий
git clone https://github.com/YOUR_USERNAME/seo-services-mvp.git

# Перейти в папку проекта
cd seo-services-mvp

# Установить зависимости
npm install

# Запустить сервер разработки
npm run dev
```

## ⚙️ Настройка

### База данных
База данных настраивается автоматически при первом запуске.

### SMTP (для отправки писем)
Скопируйте `.env.example` в `.env` и заполните настройки SMTP:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
```

Подробная инструкция: [SMTP-SETUP.md](./SMTP-SETUP.md)

## 📁 Структура проекта

```
seo-services-mvp/
├── app/              # Next.js App Router
│   ├── admin/        # Админ-панель
│   ├── api/          # API routes
│   └── ...           # Публичные страницы
├── components/       # React компоненты
├── prisma/           # Схема базы данных
└── lib/              # Утилиты
```

## 🔧 Доступные команды

```bash
npm run dev          # Запуск сервера разработки
npm run build        # Сборка для продакшена
npm run start        # Запуск продакшен сервера
npm run lint         # Проверка кода
npm run prisma:generate  # Генерация Prisma Client
npm run prisma:migrate   # Применение миграций
```

## 📝 Функционал

- ✅ Управление услугами
- ✅ Управление страницами и блогом
- ✅ Управление кейсами и отзывами
- ✅ Калькулятор стоимости
- ✅ Форма обратной связи
- ✅ SEO настройки (robots.txt, sitemap.xml)
- ✅ Админ-панель с авторизацией

## 🔒 Безопасность

- Файл `.env` не попадает в репозиторий
- Используйте `.env.example` как шаблон
- Не коммитьте секретные данные

## 📄 Лицензия

MIT

## 👤 Автор

Ваше имя

---

**Примечание:** При первом запуске выполните `npm install` для установки зависимостей.
