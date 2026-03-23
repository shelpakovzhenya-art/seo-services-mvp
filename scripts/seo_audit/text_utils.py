from __future__ import annotations

import re
from dataclasses import fields, is_dataclass, replace
from typing import Any

_MOJIBAKE_MARKERS = ("Р", "С", "вЂ", "Ð", "Ñ", "â€", "â€™", "â€œ", "Â", "�")
_PHRASE_REPLACEMENTS = {
    "SEO AUDIT / GROWTH MAP": "SEO-аудит / план работ",
    "Executive summary": "Краткий вывод",
    "Quick wins": "Быстрые исправления",
    "Roadmap": "План работ",
    "growth map": "план работ",
    "Crawl & Indexability": "Обход и индексация",
    "Architecture & Internal Linking": "Структура и внутренняя перелинковка",
    "On-Page SEO": "Мета-теги и шаблоны страниц",
    "Performance и CWV": "Скорость и Core Web Vitals",
    "Performance & CWV": "Скорость и Core Web Vitals",
    "Structured Data": "Микроразметка",
    "Commercial Pages & Content": "Коммерческие страницы и контент",
    "business-effect": "пользе для бизнеса",
    "backlog": "список задач",
    "answer-first блоки": "блоки с короткими ответами",
    "answer-first фрагментами": "блоками с короткими ответами",
    "answer-first": "короткие ответы",
    "growth-layer": "основу для роста",
    "lead-страницы": "страницы заявок",
    "lead-страниц": "страниц заявок",
    "лид-страницы": "страницы заявок",
    "лид-страниц": "страниц заявок",
    "Контактных/страниц заявок": "Контактных страниц и страниц заявок",
    "SEO-friendly страницы": "нормальные страницы для поиска",
    "SEO-friendly URL": "чистые URL",
    "SEO-friendly маршруты": "чистые маршруты",
    "query-URL": "URL с параметрами",
    "query-страницы": "страницы с параметрами",
    "query- и route-страницы": "страницы с параметрами и служебные страницы",
    "route-страницы": "служебные страницы",
    "route/query-страниц": "служебных страниц и страниц с параметрами",
    "route/query страницы": "служебные страницы и страницы с параметрами",
    "SEO-посадочные": "целевые страницы",
    "SEO-документы": "страницы",
    "SEO-обвязка": "SEO-оформление",
    "schema": "микроразметка",
    "canonical": "канонический адрес",
    "CTA": "призыв к действию",
    "rel=канонический адрес": "канонической ссылки",
    "Контактные и страницы заявок недооформлены как целевые страницы": "Контакты и страницы заявок оформлены слабо",
    "Доделать контактные и заявочные страницы как полноценные страницы, а не как технические формы.": (
        "Превратить контактные и заявочные страницы в полноценные страницы, а не в простые технические формы."
    ),
    "Пересобрать шаблоны карточек и листингов: короткие title, рабочие description, канонический адрес, alt, микроразметка и коммерческие призыв к действию.": (
        "Пересобрать шаблоны карточек и листингов: короткие title, понятные description, канонический адрес, alt, "
        "микроразметка и заметный призыв к действию."
    ),
    "Добавить answer-first блоки, FAQ и внутреннюю перелинковку между важными разделами для обычной и -выдачи.": (
        "Добавить блоки с короткими ответами, FAQ и внутреннюю перелинковку между важными разделами, "
        "чтобы сайт лучше отвечал на вопросы пользователей в поиске."
    ),
    "Добавить блоки с короткими ответами, FAQ и внутреннюю перелинковку между важными разделами для обычной и -выдачи.": (
        "Добавить блоки с короткими ответами, FAQ и внутреннюю перелинковку между важными разделами, "
        "чтобы сайт лучше отвечал на вопросы пользователей в поиске."
    ),
    "AI-ответы": "короткие ответы на частые вопросы",
    "AI-видимость": "дополнительную видимость",
    "branded-ответы": "брендовые ответы",
    "ИИ-ответах": "поисковых ответах",
    "ИИ-видимость": "дополнительную видимость",
    "ИИ-видимости": "дополнительной видимости",
    "ИИ-выдаче": "поисковой выдаче",
    "ИИ-выдачи": "поисковой выдачи",
    "ИИ-выдачу": "поисковую выдачу",
    "Есть llms.txt, значит сайт уже можно дожимать и под дополнительную видимость.": "Есть llms.txt. При необходимости его можно использовать как дополнительный технический файл для внешних сервисов.",
    "У проекта уже есть llms.txt, а значит можно отдельно усиливать видимость в поисковых ответах и branded-покрытие.": "У проекта уже есть llms.txt. При необходимости его можно использовать как дополнительный технический файл для внешних сервисов.",
    "У проекта уже есть llms.txt, а значит можно дополнительно усиливать дополнительную видимость и брендовые ответы.": "У проекта уже есть llms.txt. При необходимости его можно использовать как дополнительный технический файл для внешних сервисов.",
}

_POST_REPLACEMENTS = {
    "Разбираю шаблоны title, description, H1 и то, насколько страницы готовы к нормальному сниппету.": "Проверка title, описания страницы и H1 на ключевых шаблонах.",
    "По H1 каркас у выборки в целом собран неплохо.": "На проверенных страницах H1 в целом оформлен нормально.",
    "Сильно пустых страниц в выборке немного.": "Пустых страниц в выборке почти нет.",
    "Даже при нормальном объеме текста нужно отдельно проверить, насколько хорошо он поддерживает коммерческий интент и FAQ-слой.": "Даже при нормальном объеме текста важно проверить, закрывает ли контент выбор, условия, FAQ и доверие.",
    "Критической ямы по title в выборке не видно.": "Критических провалов по title в выборке не видно.",
    "Описания страниц покрыты достаточно ровно.": "Описания страниц заполнены на большей части выборки.",
    "Есть llms.txt, значит сайт уже можно дожимать и под AI-видимость.": "Дополнительных ограничений по техническим файлам для обхода в выборке не видно.",
    "Есть llms.txt, значит сайт уже можно дожимать и под дополнительную видимость.": "Дополнительных ограничений по техническим файлам для обхода в выборке не видно.",
    "Отдельного llms.txt не найдено.": "Дополнительных ограничений по техническим файлам для обхода в выборке не видно.",
    "служебные служебные страницы": "служебные страницы",
    "нормальные нормальные страницы для поиска": "нормальные страницы для поиска",
    "страниц заявоками": "страниц заявок",
    "справить битую JSON-LD разметку": "Исправить битую JSON-LD разметку",
    "вернет валидную микроразметка в индекс": "Вернет валидную микроразметку в индекс",
    "Title Рё meta description": "Title и meta description",
    "Покрытие микроразметка-разметкой": "Покрытие микроразметкой",
    "микроразметка-разметкой": "микроразметкой",
    "микроразметка-разметку": "микроразметку",
    "микроразметка-разметки": "микроразметки",
    "Schema coverage": "Покрытие микроразметкой",
    "Canonical coverage": "Покрытие каноническими ссылками",
    "structured data": "микроразметка",
    "route-URL": "служебные URL",
    "query- или route-URL": "URL с параметрами или служебные URL",
    "query-параметрам": "параметрам URL",
    "route/query URL": "служебные URL и URL с параметрами",
    "query/route URL": "URL с параметрами и служебные URL",
    "query- или служебные URL": "URL с параметрами или служебные URL",
    "query и route URL": "URL с параметрами и служебные URL",
    "query и route-URL": "URL с параметрами и служебные URL",
    "Разрулить индексируемые query и route URL": "Разобраться с индексируемыми URL с параметрами и служебными URL",
    "Разрулить индексируемые URL с параметрами и служебные URL": "Закрыть индексируемые URL с параметрами и служебные URL",
    "image SEO": "SEO для изображений",
    "image-шаблон": "шаблон для изображений",
    "image-схему/карту сайта": "карту изображений",
    "contact-страниц": "контактных страниц",
    "Служебные URL с параметрами и служебные URL": "URL с параметрами и служебные URL",
    "служебные служебные URL": "служебные URL",
    "ндексируемых URL с параметрами": "Индексируемых URL с параметрами",
    "ИИндексируемых URL с параметрами": "Индексируемых URL с параметрами",
    "ИИзображения": "Изображения",
    "ИИзображений": "Изображений",
    "ИИзображение": "Изображение",
    "иИИзображения": "изображения",
    "иИИзображений": "изображений",
    "иИИзображение": "изображение",
    "зображения": "Изображения",
    "зображений": "Изображений",
    "зображение": "Изображение",
    "вЂў": "•",
    "иИзображения": "изображения",
    "иИзображений": "изображений",
    "иИзображении": "изображении",
    "иИзображениях": "изображениях",
    "ИИзображения": "Изображения",
    "ИИзображений": "Изображений",
    "ИИзображении": "Изображении",
    "ИИзображениях": "Изображениях",
}


def _text_score(text: str) -> int:
    score = 0
    for char in text:
        code = ord(char)
        if 0x0400 <= code <= 0x04FF:
            score += 3
        elif char.isascii():
            score += 0
        elif char in ("\n", "\r", "\t"):
            score += 0
        else:
            score -= 1

    score -= text.count("�") * 12
    score -= text.count("Р") * 4
    score -= text.count("С") * 4
    score -= text.count("вЂ") * 8
    score -= text.count("Ð") * 6
    score -= text.count("Ñ") * 6
    score -= text.count("Â") * 5
    return score


def normalize_output_text(value: object) -> str:
    text = "" if value is None else str(value)
    if not text:
        return ""

    best = text
    best_score = _text_score(text)

    for source_encoding in ("cp1251", "latin1", "cp1252"):
        try:
            candidate = text.encode(source_encoding).decode("utf-8")
        except UnicodeError:
            candidate = None

        if candidate is not None:
            candidate_score = _text_score(candidate)
            if candidate_score > best_score + 2:
                best = candidate
                best_score = candidate_score

        try:
            candidate = text.encode(source_encoding, errors="ignore").decode("utf-8", errors="ignore")
        except UnicodeError:
            continue

        if not candidate:
            continue

        candidate_score = _text_score(candidate)
        if candidate_score > best_score + 2:
            best = candidate
            best_score = candidate_score

    if any(marker in best for marker in _MOJIBAKE_MARKERS):
        for source_encoding in ("cp1251", "latin1", "cp1252"):
            try:
                candidate = best.encode(source_encoding, errors="ignore").decode("utf-8", errors="ignore")
            except UnicodeError:
                continue

            candidate_score = _text_score(candidate)
            if candidate_score > best_score + 2:
                best = candidate
                best_score = candidate_score

    text = best.replace("\xa0", " ")
    for source, target in _PHRASE_REPLACEMENTS.items():
        text = text.replace(source, target)
    for source, target in _POST_REPLACEMENTS.items():
        text = text.replace(source, target)
    text = re.sub(r"\bРё\b", "и", text)
    text = re.sub(r"\bР\b", "И", text)
    text = re.sub(r"\bИИзображ", "Изображ", text)
    text = re.sub(r"\bиИИзображ", "изображ", text)
    text = re.sub(r"\bИИндексируем", "Индексируем", text)
    text = re.sub(r"\bндексируем", "Индексируем", text)
    text = re.sub(r"\bслужебные\s+служебные URL\b", "служебные URL", text, flags=re.IGNORECASE)
    text = re.sub(r"\b(чистые|понятные|полноценные|микроразметка)\s+\1\b", r"\1", text, flags=re.IGNORECASE)
    text = re.sub(r"\bиИзображ", "изображ", text)
    text = re.sub(r"\bИИзображ", "Изображ", text)
    text = text.replace("Служебные служебные страницы", "Служебные страницы")
    text = text.replace("служебные служебные страницы", "служебные страницы")
    text = text.replace("ИИИИсправить битую JSON-LD разметку", "Исправить битую JSON-LD разметку")
    text = text.replace("Вернет валидную structured data в индекс", "Вернет валидную микроразметку в индекс")
    text = text.replace("Вернет валидную микроразметка в индекс", "Вернет валидную микроразметку в индекс")
    text = text.replace("блоки schema на ключевых страницах", "блоки микроразметки на ключевых страницах")
    text = text.replace(
        "В выборке есть индексируемые служебные или URL с параметрами без нормальной SEO-обвязки",
        "В выборке есть индексируемые служебные страницы и URL с параметрами без нормальной SEO-обвязки",
    )
    text = text.replace("Индексируемых query-URL", "Индексируемых URL с параметрами")
    text = text.replace("Indexable-страницы", "Индексируемые страницы")
    text = text.replace("route/query URL", "служебные URL и URL с параметрами")
    text = text.replace("route-страницу", "служебную страницу")
    text = text.replace("SEO-friendly", "чистые")
    text = re.sub(r"\s{2,}", " ", text).strip()
    return text


def normalize_structure(value: Any) -> Any:
    if isinstance(value, str) or value is None:
        return normalize_output_text(value)
    if isinstance(value, list):
        return [normalize_structure(item) for item in value]
    if isinstance(value, tuple):
        return tuple(normalize_structure(item) for item in value)
    if isinstance(value, dict):
        return {key: normalize_structure(item) for key, item in value.items()}
    if is_dataclass(value) and not isinstance(value, type):
        return replace(value, **{field.name: normalize_structure(getattr(value, field.name)) for field in fields(value)})
    return value
