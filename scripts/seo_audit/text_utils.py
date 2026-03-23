from __future__ import annotations

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
