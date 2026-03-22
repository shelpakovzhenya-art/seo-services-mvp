# Shelpakov Digital SEO Audit Generator

Этот подпроект делает брендовый SEO-аудит в `.docx` и сохраняет его в папку `audits/`.
По умолчанию рядом создаются:

- `.html` — визуальный preview, который легко открыть без Word
- `.json` — сырые данные аудита
- папка `*-assets` — автоскриншоты ключевых страниц

## Быстрый запуск

```powershell
npm run seo:audit -- --url https://akvarium-akvas.ru --company "Аквас"
```

Если `.docx` неудобно открывать из VS Code или встроенного превью, смотри рядом созданный `.html`:

```powershell
audits/akvarium-akvas-2026-03-22.html
```

Он генерируется автоматически и показывает тот же аудит в браузере вместе со скриншотами.

Можно указать свой путь для файла:

```powershell
npm run seo:audit -- --url https://example.com --company "Example" --output audits/example-audit.docx
```

## Что делает генератор

- забирает `robots.txt`, `sitemap.xml`, `llms.txt`
- собирает выборку ключевых URL
- проверяет `title`, `description`, `H1`, `canonical`, schema, alt, служебные route-страницы
- формирует брендовый `.docx`-аудит в стиле Shelpakov Digital
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
- `--output` — куда сохранить `.docx`
- `--sample-size` — сколько URL проверять в рамках выборки
- `--no-json` — не сохранять сырые данные рядом с `.docx`
- `--no-preview` — не создавать HTML-preview
- `--no-screenshots` — не делать автоскриншоты страниц
