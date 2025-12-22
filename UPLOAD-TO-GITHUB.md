# Загрузка проекта на GitHub

## Репозиторий: https://github.com/shelpakovzhenya-art/my-site.git

## Вариант 1: GitHub Desktop (САМЫЙ ПРОСТОЙ) ⭐

1. **Откройте GitHub Desktop**
   - Если не установлен: https://desktop.github.com/

2. **Добавьте репозиторий:**
   - File → **Clone Repository**
   - Вкладка **URL**
   - Вставьте: `https://github.com/shelpakovzhenya-art/my-site.git`
   - Выберите папку для клонирования (например: `C:\Users\ваше-имя\Documents\GitHub\my-site`)
   - Нажмите **Clone**

3. **Скопируйте файлы проекта:**
   - Скопируйте ВСЕ файлы из `c:\seo-services-mvp` 
   - Вставьте в папку `C:\Users\ваше-имя\Documents\GitHub\my-site`
   - **НЕ копируйте:**
     - `.env` (если он есть)
     - `node_modules\` (если есть)
     - `.next\` (если есть)

4. **В GitHub Desktop:**
   - Вы увидите все файлы в списке изменений
   - Внизу введите сообщение: `Initial commit: SEO Services MVP`
   - Нажмите **Commit to main**
   - Нажмите **Push origin**

✅ **Готово!** Проект загружен на GitHub.

---

## Вариант 2: Установить Git и использовать командную строку

### Шаг 1: Установка Git

1. Скачайте Git: https://git-scm.com/download/win
2. Установите с настройками по умолчанию
3. **Перезапустите PowerShell** после установки

### Шаг 2: Команды для загрузки

Откройте PowerShell в папке проекта и выполните:

```powershell
cd c:\seo-services-mvp

# Инициализация
git init

# Добавление remote
git remote add origin https://github.com/shelpakovzhenya-art/my-site.git

# Добавление всех файлов
git add .

# Создание коммита
git commit -m "Initial commit: SEO Services MVP"

# Переименование ветки
git branch -M main

# Загрузка на GitHub
git push -u origin main
```

### Шаг 3: Авторизация

При `git push` GitHub запросит авторизацию:

**Вариант A: Personal Access Token (рекомендуется)**
1. Создайте токен: https://github.com/settings/tokens
2. Нажмите **Generate new token (classic)**
3. Выберите права: `repo` (полный доступ)
4. Скопируйте токен
5. Используйте токен как **пароль** при запросе

**Вариант B: Авторизация через браузер**
- GitHub может открыть браузер для авторизации
- Следуйте инструкциям на экране

---

## Вариант 3: Через веб-интерфейс GitHub

1. Зайдите на: https://github.com/shelpakovzhenya-art/my-site
2. Нажмите **"uploading an existing file"**
3. Перетащите все файлы из `c:\seo-services-mvp`
4. Введите сообщение коммита: `Initial commit: SEO Services MVP`
5. Нажмите **Commit changes**

⚠️ **Не загружайте:**
- `.env` - файл с секретами
- `node_modules\` - зависимости
- `.next\` - скомпилированные файлы
- `prisma\dev.db` - база данных

---

## Проверка загрузки

После загрузки проверьте:
- https://github.com/shelpakovzhenya-art/my-site
- Должны быть видны все файлы проекта
- README.md должен отображаться на главной странице

---

## Если возникли проблемы

### Ошибка: "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/shelpakovzhenya-art/my-site.git
```

### Ошибка: "failed to push some refs"
```powershell
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Ошибка авторизации
- Используйте Personal Access Token вместо пароля
- Убедитесь, что токен имеет права `repo`

---

## Рекомендация

**Используйте GitHub Desktop** - это самый простой способ для начинающих!

