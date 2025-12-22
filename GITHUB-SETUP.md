# Инструкция по загрузке проекта на GitHub

## Шаг 1: Установка Git

Если Git не установлен, скачайте и установите:
- **Скачать Git**: https://git-scm.com/download/win
- Установите с настройками по умолчанию
- После установки перезапустите терминал/PowerShell

## Шаг 2: Проверка установки

Откройте PowerShell и выполните:
```powershell
git --version
```

Если видите версию (например, `git version 2.x.x`), значит Git установлен.

## Шаг 3: Настройка Git (первый раз)

```powershell
git config --global user.name "Ваше Имя"
git config --global user.email "ваш-email@example.com"
```

## Шаг 4: Создание репозитория на GitHub

1. Зайдите на https://github.com
2. Нажмите кнопку **"New"** или **"+"** → **"New repository"**
3. Введите название репозитория (например: `seo-services-mvp`)
4. Выберите **Public** или **Private**
5. **НЕ** ставьте галочки на "Add a README file", "Add .gitignore", "Choose a license"
6. Нажмите **"Create repository"**

## Шаг 5: Инициализация Git в проекте

Откройте PowerShell в папке проекта и выполните:

```powershell
cd c:\seo-services-mvp

# Инициализация репозитория
git init

# Добавление всех файлов
git add .

# Первый коммит
git commit -m "Initial commit: SEO Services MVP"

# Добавление удаленного репозитория (замените YOUR_USERNAME на ваш GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/seo-services-mvp.git

# Переименование ветки в main (если нужно)
git branch -M main

# Загрузка на GitHub
git push -u origin main
```

## Шаг 6: Если потребуется авторизация

При первом `git push` GitHub может запросить авторизацию:
- Используйте **Personal Access Token** вместо пароля
- Создайте токен: https://github.com/settings/tokens
- Нажмите **"Generate new token (classic)"**
- Выберите права: `repo` (полный доступ к репозиториям)
- Скопируйте токен и используйте его как пароль

## Важные файлы, которые НЕ будут загружены

Благодаря `.gitignore`, следующие файлы **НЕ** попадут в репозиторий:
- `.env` - файл с секретными данными (SMTP, пароли)
- `node_modules/` - зависимости
- `prisma/dev.db` - база данных
- `.next/` - скомпилированные файлы Next.js

## После загрузки

1. Создайте файл `.env.example` с примером настроек (без реальных паролей)
2. Добавьте README.md с описанием проекта
3. Обновите `.gitignore` если нужно

## Обновление проекта на GitHub

После внесения изменений:

```powershell
git add .
git commit -m "Описание изменений"
git push
```

## Полезные команды

```powershell
# Проверить статус
git status

# Посмотреть изменения
git diff

# Посмотреть историю коммитов
git log

# Отменить изменения в файле
git checkout -- имя-файла
```

