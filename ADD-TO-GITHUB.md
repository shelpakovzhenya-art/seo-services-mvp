# Добавление проекта в существующий GitHub репозиторий

## Вариант 1: GitHub Desktop (рекомендуется)

1. Откройте **GitHub Desktop**
2. Выберите **File** → **Add Local Repository**
3. Нажмите **Choose...** и выберите папку `c:\seo-services-mvp`
4. Если репозиторий уже подключен, вы увидите все файлы в списке изменений
5. Внизу введите сообщение коммита: `Initial commit: SEO Services MVP`
6. Нажмите **Commit to main**
7. Нажмите **Push origin** для загрузки на GitHub

## Вариант 2: Если репозиторий уже клонирован

Если у вас уже есть папка с клонированным репозиторием:

1. Скопируйте все файлы из `c:\seo-services-mvp` в папку с репозиторием
2. **НЕ копируйте**:
   - `.env` (если он есть в репозитории)
   - `node_modules/`
   - `.next/`
   - `prisma/dev.db`
3. В GitHub Desktop вы увидите изменения
4. Сделайте коммит и push

## Вариант 3: Через командную строку (если Git установлен)

Откройте PowerShell в папке проекта и выполните:

```powershell
cd c:\seo-services-mvp

# Проверка, есть ли уже git репозиторий
if (Test-Path .git) {
    Write-Host "Git репозиторий уже инициализирован"
} else {
    git init
}

# Добавление всех файлов
git add .

# Коммит
git commit -m "Initial commit: SEO Services MVP"

# Если remote еще не добавлен, добавьте его (замените URL на ваш)
# git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Проверка remote
git remote -v

# Загрузка на GitHub
git push -u origin main
```

## Вариант 4: Если нужно подключить к существующему remote

Если репозиторий уже существует на GitHub, но не подключен:

```powershell
cd c:\seo-services-mvp

# Инициализация (если еще не сделано)
git init

# Добавление remote (замените URL на ваш репозиторий)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Проверка
git remote -v

# Добавление файлов
git add .

# Коммит
git commit -m "Initial commit: SEO Services MVP"

# Переименование ветки в main (если нужно)
git branch -M main

# Загрузка
git push -u origin main
```

## Важные файлы, которые НЕ должны попасть в репозиторий

Убедитесь, что `.gitignore` содержит:
- `.env` - файл с секретами
- `node_modules/` - зависимости
- `prisma/dev.db` - база данных
- `.next/` - скомпилированные файлы

## Если возникли конфликты

Если в репозитории уже есть файлы (например, README.md):

```powershell
# Получить изменения с GitHub
git pull origin main --allow-unrelated-histories

# Разрешить конфликты вручную, затем:
git add .
git commit -m "Merge with existing repository"
git push origin main
```

