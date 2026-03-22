# Shelpakov Digital SEO Audit Generator

Этот подпроект делает брендовый SEO-аудит в `.pdf` и `.docx` и сохраняет его в папку `audits/`.
По умолчанию рядом создаются:

- `.pdf` — основной клиентский файл аудита
- `.html` — визуальный preview, который легко открыть без Word
- `.json` — сырые данные аудита
- папка `*-assets` — автоскриншоты ключевых страниц

## Быстрый запуск

```powershell
npm run seo:audit -- --url https://akvarium-akvas.ru --company "Аквас"
```

Если `.pdf` или `.docx` неудобно открывать из VS Code или встроенного превью, смотри рядом созданный `.html`:

```powershell
audits/akvarium-akvas-2026-03-22.html
```

Он генерируется автоматически и показывает тот же аудит в браузере вместе со скриншотами.

Чтобы открыть последний аудит напрямую в системе, не через VS Code preview:

```powershell
npm run seo:audit:open
```

Откроется последний `.html` из папки `audits/`.

Если нужен именно `.docx`:

```powershell
npm run seo:audit:open -- --format docx
```

Можно указать свой путь для файла:

```powershell
npm run seo:audit -- --url https://example.com --company "Example" --output audits/example-audit.docx
```

## Что делает генератор

- забирает `robots.txt`, `sitemap.xml`, `llms.txt`
- собирает выборку ключевых URL
- проверяет `title`, `description`, `H1`, `canonical`, schema, alt, служебные route-страницы
- формирует брендовый `.pdf`-аудит и `.docx`-версию в стиле Shelpakov Digital
- дополнительно сохраняет `.json` со всеми сырыми данными аудита

## Основная команда

Через npm:

```powershell
npm run seo:audit -- --url https://site.ru --company "Название бренда"
```

Напрямую через PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/run-seo-audit.ps1 --url https://site.ru --company "Название бренда"
```

Напрямую через Python:

```powershell
python scripts/seo_audit/generate_audit.py --url https://site.ru --company "Название бренда"
```

## Параметры

- `--url` — обязательный URL сайта
- `--company` — название клиента/проекта на обложке
- `--output` — куда сохранить `.docx`-версию, рядом автоматически появится `.pdf`
- `--sample-size` — сколько URL проверять; `0` означает полный обход сайта
- `--no-json` — не сохранять сырые данные рядом с `.docx`
- `--no-preview` — не создавать HTML-preview
- `--no-pdf` — не создавать PDF-версию
- `--no-screenshots` — не делать автоскриншоты страниц
