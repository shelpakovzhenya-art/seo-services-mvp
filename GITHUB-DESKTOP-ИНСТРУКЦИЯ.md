# 📦 Инструкция: Загрузка проекта через GitHub Desktop

## Шаг 1: Клонирование репозитория

1. **Откройте GitHub Desktop**
2. Нажмите **File** → **Clone Repository**
3. Перейдите на вкладку **URL**
4. В поле **Repository URL** вставьте:
   ```
   https://github.com/shelpakovzhenya-art/my-site.git
   ```
5. В поле **Local path** выберите папку (например: `C:\Users\ваше-имя\Documents\GitHub`)
6. Нажмите **Clone**

✅ Репозиторий будет склонирован в папку: `C:\Users\ваше-имя\Documents\GitHub\my-site`

---

## Шаг 2: Копирование файлов проекта

1. **Откройте папку с клонированным репозиторием:**
   - `C:\Users\ваше-имя\Documents\GitHub\my-site`

2. **Скопируйте ВСЕ файлы** из `c:\seo-services-mvp` в эту папку

3. **НЕ копируйте** (если они есть):
   - ❌ `.env` - файл с секретами
   - ❌ `node_modules\` - зависимости (слишком большой)
   - ❌ `.next\` - скомпилированные файлы
   - ❌ `prisma\dev.db` - база данных

4. **Можно копировать:**
   - ✅ Все `.ts`, `.tsx`, `.js`, `.json` файлы
   - ✅ Все папки: `app\`, `components\`, `lib\`, `prisma\schema.prisma`
   - ✅ Конфигурационные файлы: `package.json`, `tsconfig.json`, `.gitignore`
   - ✅ Документацию: `README.md`, `*.md` файлы

---

## Шаг 3: Загрузка в GitHub Desktop

1. **Вернитесь в GitHub Desktop**
2. Вы увидите все скопированные файлы в списке изменений слева
3. Внизу в поле **Summary** введите:
   ```
   Initial commit: SEO Services MVP
   ```
4. (Опционально) В поле **Description** можно добавить описание
5. Нажмите кнопку **Commit to main** (внизу слева)
6. После коммита нажмите **Push origin** (вверху справа)

✅ **Готово!** Проект загружен на GitHub!

---

## Проверка

Откройте в браузере:
https://github.com/shelpakovzhenya-art/my-site

Вы должны увидеть все файлы вашего проекта!

---

## Если возникли проблемы

### Проблема: "Nothing to commit"
- Убедитесь, что файлы скопированы в правильную папку
- Проверьте, что файлы не игнорируются `.gitignore`

### Проблема: "Authentication failed"
- В GitHub Desktop: **File** → **Options** → **Accounts**
- Убедитесь, что вы авторизованы
- Если нет - нажмите **Sign in** и войдите в GitHub

### Проблема: "Push failed"
- Проверьте интернет-соединение
- Убедитесь, что у вас есть права на запись в репозиторий
- Попробуйте **Repository** → **Pull** сначала, затем **Push**

---

## Быстрая команда для копирования (PowerShell)

Если хотите скопировать файлы автоматически, откройте PowerShell и выполните:

```powershell
# Путь к клонированному репозиторию (замените на ваш путь)
$destPath = "C:\Users\ваше-имя\Documents\GitHub\my-site"

# Копирование файлов (исключая ненужные)
Copy-Item -Path "c:\seo-services-mvp\*" -Destination $destPath -Recurse -Exclude ".env","node_modules",".next","*.db","*.db-journal" -Force

Write-Host "Файлы скопированы в: $destPath"
```

---

## Альтернатива: Через веб-интерфейс GitHub

Если GitHub Desktop не работает:

1. Зайдите на: https://github.com/shelpakovzhenya-art/my-site
2. Нажмите **"uploading an existing file"**
3. Перетащите файлы из `c:\seo-services-mvp`
4. Введите сообщение: `Initial commit: SEO Services MVP`
5. Нажмите **Commit changes**

⚠️ **Не загружайте:** `.env`, `node_modules\`, `.next\`, `*.db`

