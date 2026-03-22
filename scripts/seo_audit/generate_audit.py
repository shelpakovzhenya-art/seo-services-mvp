#!/usr/bin/env python
from __future__ import annotations

import argparse
import json
import math
import re
import statistics
from dataclasses import asdict, dataclass
from datetime import datetime
from pathlib import Path
from typing import Iterable
from urllib.parse import urljoin, urlparse
from xml.etree import ElementTree as ET

import requests
from bs4 import BeautifulSoup
from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Inches, Pt, RGBColor

BRAND_NAME = "Shelpakov Digital"
BRAND_DARK = "101C2B"
BRAND_DARK_ALT = "18283C"
BRAND_TEXT = "102035"
BRAND_MUTED = "5D6B82"
BRAND_LINE = "D8E7F6"
BRAND_CYAN = "69D3FF"
BRAND_ORANGE = "F28B34"
BRAND_SOFT = "F6F9FC"
BRAND_ACCENT_SOFT = "FFF3E6"
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/132.0.0.0 Safari/537.36 ShelpakovAuditBot/1.0"
)


@dataclass
class PageSnapshot:
    url: str
    page_type: str
    status_code: int
    response_time_ms: int
    content_type: str
    title: str
    description: str
    canonical: str
    h1s: list[str]
    meta_robots: str
    x_robots_tag: str
    image_count: int
    missing_alt_count: int
    lazy_missing_count: int
    schema_types: list[str]
    internal_links: int
    word_count: int
    has_meta_keywords: bool
    has_forms: bool
    html_size_kb: float


@dataclass
class AuditIssue:
    severity: str
    title: str
    why_it_matters: str
    evidence: list[str]
    recommendation: str


def normalize_base_url(raw_url: str) -> str:
    url = raw_url.strip()
    if not url.startswith(("http://", "https://")):
        url = f"https://{url}"
    parsed = urlparse(url)
    clean = parsed._replace(path=parsed.path.rstrip("/"), params="", query="", fragment="")
    return clean.geturl() or url


def slugify_for_filename(value: str) -> str:
    value = re.sub(r"^https?://", "", value.strip().lower())
    value = re.sub(r"[^a-z0-9.-]+", "-", value)
    value = re.sub(r"-{2,}", "-", value).strip("-")
    return value or "audit"


def make_session() -> requests.Session:
    session = requests.Session()
    session.headers.update({"User-Agent": USER_AGENT, "Accept-Language": "ru,en;q=0.8"})
    return session


def add_page_borders(section) -> None:
    sect_pr = section._sectPr
    pg_borders = OxmlElement("w:pgBorders")
    pg_borders.set(qn("w:offsetFrom"), "page")
    borders = {
        "top": ("18", BRAND_LINE),
        "right": ("12", BRAND_LINE),
        "bottom": ("18", BRAND_LINE),
        "left": ("28", BRAND_ORANGE),
    }
    for edge, (size, color) in borders.items():
        element = OxmlElement(f"w:{edge}")
        element.set(qn("w:val"), "single")
        element.set(qn("w:sz"), size)
        element.set(qn("w:space"), "18")
        element.set(qn("w:color"), color)
        pg_borders.append(element)
    sect_pr.append(pg_borders)


def set_cell_shading(cell, color: str) -> None:
    cell_properties = cell._tc.get_or_add_tcPr()
    shading = OxmlElement("w:shd")
    shading.set(qn("w:fill"), color)
    cell_properties.append(shading)


def set_cell_margins(cell, top=80, start=80, bottom=80, end=80) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_mar = tc_pr.first_child_found_in("w:tcMar")
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for tag, value in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        node = tc_mar.find(qn(f"w:{tag}"))
        if node is None:
            node = OxmlElement(f"w:{tag}")
            tc_mar.append(node)
        node.set(qn("w:w"), str(value))
        node.set(qn("w:type"), "dxa")


def remove_table_borders(table) -> None:
    tbl_pr = table._tbl.tblPr
    borders = tbl_pr.first_child_found_in("w:tblBorders")
    if borders is None:
        borders = OxmlElement("w:tblBorders")
        tbl_pr.append(borders)
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        node = borders.find(qn(f"w:{edge}"))
        if node is None:
            node = OxmlElement(f"w:{edge}")
            borders.append(node)
        node.set(qn("w:val"), "nil")


def add_page_number(paragraph) -> None:
    run = paragraph.add_run()
    fld_begin = OxmlElement("w:fldChar")
    fld_begin.set(qn("w:fldCharType"), "begin")
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = "PAGE"
    fld_end = OxmlElement("w:fldChar")
    fld_end.set(qn("w:fldCharType"), "end")
    run._r.extend([fld_begin, instr, fld_end])


def set_font(run, *, size=None, bold=None, color=None, name="Arial") -> None:
    run.font.name = name
    if size is not None:
        run.font.size = Pt(size)
    if bold is not None:
        run.font.bold = bold
    if color is not None:
        run.font.color.rgb = RGBColor.from_string(color)


def add_text_paragraph(container, text: str, *, size=11.5, color=BRAND_TEXT, bold=False, space_after=6, alignment=None):
    paragraph = container.add_paragraph()
    if alignment is not None:
        paragraph.alignment = alignment
    run = paragraph.add_run(text)
    set_font(run, size=size, bold=bold, color=color)
    paragraph.paragraph_format.space_after = Pt(space_after)
    paragraph.paragraph_format.line_spacing = 1.25
    return paragraph


def add_bullet_list(container, items: Iterable[str], *, size=11.2, color=BRAND_TEXT) -> None:
    for item in items:
        paragraph = container.add_paragraph(style=None)
        paragraph.paragraph_format.left_indent = Cm(0.4)
        paragraph.paragraph_format.first_line_indent = Cm(-0.4)
        paragraph.paragraph_format.space_after = Pt(4)
        run = paragraph.add_run(f"• {item}")
        set_font(run, size=size, color=color)


def add_section_heading(doc: Document, kicker: str, title: str, intro: str | None = None) -> None:
    kicker_paragraph = doc.add_paragraph()
    kicker_run = kicker_paragraph.add_run(kicker.upper())
    set_font(kicker_run, size=9.5, bold=True, color=BRAND_ORANGE)
    title_paragraph = doc.add_paragraph()
    title_run = title_paragraph.add_run(title)
    set_font(title_run, size=20, bold=True, color=BRAND_TEXT)
    title_paragraph.paragraph_format.space_after = Pt(6)
    if intro:
        add_text_paragraph(doc, intro, size=11.3, color=BRAND_MUTED, space_after=10)


def strip_namespace(tag: str) -> str:
    return tag.split("}", 1)[-1]


def safe_get(session: requests.Session, url: str, *, allow_redirects=True, timeout=25):
    try:
        response = session.get(url, timeout=timeout, allow_redirects=allow_redirects)
        return response, None
    except Exception as exc:  # noqa: BLE001
        return None, str(exc)


def discover_sitemaps(robots_text: str, base_url: str) -> list[str]:
    found = []
    for line in robots_text.splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        if key.strip().lower() == "sitemap":
            cleaned = value.strip()
            if cleaned:
                found.append(cleaned)
    if not found:
        found.append(urljoin(f"{base_url}/", "sitemap.xml"))
    unique = []
    for item in found:
        if item not in unique:
            unique.append(item)
    return unique


def parse_sitemap_urls(
    session: requests.Session, sitemap_urls: list[str], domain: str, max_sitemaps=25
) -> tuple[list[str], list[str], int]:
    discovered_urls: list[str] = []
    processed: list[str] = []
    queue = list(sitemap_urls)
    seen = set()
    while queue and len(processed) < max_sitemaps:
        current = queue.pop(0)
        if current in seen:
            continue
        seen.add(current)
        response, error = safe_get(session, current, timeout=35)
        if error or response is None or response.status_code >= 400:
            continue
        processed.append(current)
        try:
            root = ET.fromstring(response.content)
        except ET.ParseError:
            continue
        tag = strip_namespace(root.tag)
        if tag == "sitemapindex":
            for child in root:
                if strip_namespace(child.tag) != "sitemap":
                    continue
                for node in child:
                    if strip_namespace(node.tag) == "loc" and node.text:
                        queue.append(node.text.strip())
        elif tag == "urlset":
            for child in root:
                if strip_namespace(child.tag) != "url":
                    continue
                for node in child:
                    if strip_namespace(node.tag) == "loc" and node.text:
                        loc = node.text.strip()
                        if urlparse(loc).netloc == domain:
                            discovered_urls.append(loc)
    unique_urls = []
    seen_urls = set()
    for url in discovered_urls:
        if url not in seen_urls:
            seen_urls.add(url)
            unique_urls.append(url)
    return unique_urls, processed, len(discovered_urls)


def extract_visible_text(soup: BeautifulSoup) -> str:
    for tag in soup(["script", "style", "noscript", "svg"]):
        tag.extract()
    text = " ".join(soup.stripped_strings)
    return re.sub(r"\s+", " ", text).strip()


def parse_jsonld_types(soup: BeautifulSoup) -> list[str]:
    found: list[str] = []
    for script in soup.find_all("script", attrs={"type": "application/ld+json"}):
        raw = (script.string or script.get_text()).strip()
        if not raw:
            continue
        try:
            data = json.loads(raw)
        except Exception:  # noqa: BLE001
            found.append("Invalid JSON-LD")
            continue
        stack = data if isinstance(data, list) else [data]
        for item in stack:
            if isinstance(item, dict) and "@graph" in item and isinstance(item["@graph"], list):
                stack.extend(item["@graph"])
            if isinstance(item, dict):
                value = item.get("@type")
                if isinstance(value, list):
                    found.extend(str(entry) for entry in value)
                elif value:
                    found.append(str(value))
    unique: list[str] = []
    for item in found:
        if item not in unique:
            unique.append(item)
    return unique


def detect_page_type(url: str, schema_types: list[str]) -> str:
    parsed = urlparse(url)
    if not parsed.path or parsed.path == "/":
        return "Главная"
    if "Product" in schema_types:
        return "Товар"
    if parsed.query:
        return "Служебная"
    segments = [segment for segment in parsed.path.split("/") if segment]
    if len(segments) == 1:
        return "Категория"
    if len(segments) == 2:
        return "Подкатегория"
    return "Внутренняя"


def analyse_page(session: requests.Session, url: str, base_domain: str) -> PageSnapshot:
    response, error = safe_get(session, url)
    if error or response is None:
        return PageSnapshot(
            url=url,
            page_type="Ошибка загрузки",
            status_code=0,
            response_time_ms=0,
            content_type="",
            title="",
            description="",
            canonical="",
            h1s=[],
            meta_robots="",
            x_robots_tag="",
            image_count=0,
            missing_alt_count=0,
            lazy_missing_count=0,
            schema_types=[],
            internal_links=0,
            word_count=0,
            has_meta_keywords=False,
            has_forms=False,
            html_size_kb=0.0,
        )
    content_type = response.headers.get("content-type", "")
    html = response.text if "html" in content_type else ""
    soup = BeautifulSoup(html, "lxml") if html else BeautifulSoup("", "lxml")
    title = soup.title.get_text(" ", strip=True) if soup.title else ""
    description_tag = soup.find("meta", attrs={"name": "description"})
    description = description_tag.get("content", "").strip() if description_tag else ""
    canonical_tag = soup.find("link", rel=lambda value: value and "canonical" in value)
    canonical = canonical_tag.get("href", "").strip() if canonical_tag else ""
    h1s = [h.get_text(" ", strip=True) for h in soup.find_all("h1")]
    images = soup.find_all("img")
    missing_alt_count = sum(1 for image in images if not (image.get("alt") or "").strip())
    lazy_missing_count = sum(1 for image in images if image.get("loading") != "lazy")
    schema_types = parse_jsonld_types(soup)
    internal_links = 0
    for anchor in soup.find_all("a", href=True):
        href = anchor["href"].strip()
        if not href or href.startswith(("#", "mailto:", "tel:", "javascript:")):
            continue
        absolute = urljoin(url, href)
        if urlparse(absolute).netloc == base_domain:
            internal_links += 1
    visible_text = extract_visible_text(soup)
    word_count = len(re.findall(r"\w+", visible_text, flags=re.U))
    meta_keywords = soup.find("meta", attrs={"name": "keywords"}) is not None
    has_forms = bool(soup.find("form"))
    page_type = detect_page_type(url, schema_types)
    robots_meta_tag = soup.find("meta", attrs={"name": "robots"})
    return PageSnapshot(
        url=url,
        page_type=page_type,
        status_code=response.status_code,
        response_time_ms=round(response.elapsed.total_seconds() * 1000),
        content_type=content_type,
        title=title,
        description=description,
        canonical=canonical,
        h1s=h1s,
        meta_robots=robots_meta_tag.get("content", "").strip() if robots_meta_tag else "",
        x_robots_tag=response.headers.get("X-Robots-Tag", "").strip(),
        image_count=len(images),
        missing_alt_count=missing_alt_count,
        lazy_missing_count=lazy_missing_count,
        schema_types=schema_types,
        internal_links=internal_links,
        word_count=word_count,
        has_meta_keywords=meta_keywords,
        has_forms=has_forms,
        html_size_kb=round(len(response.content) / 1024, 1),
    )


def discover_home_links(session: requests.Session, base_url: str, base_domain: str) -> list[str]:
    response, error = safe_get(session, base_url)
    if error or response is None:
        return []
    soup = BeautifulSoup(response.text, "lxml")
    candidates: list[str] = []
    for anchor in soup.find_all("a", href=True):
        href = anchor["href"].strip()
        if not href or href.startswith(("#", "mailto:", "tel:", "javascript:")):
            continue
        absolute = urljoin(base_url, href)
        parsed = urlparse(absolute)
        if parsed.netloc != base_domain:
            continue
        if parsed.query and "route=information/contactform" not in parsed.query:
            continue
        normalized = parsed._replace(fragment="").geturl().rstrip("/") or absolute
        if normalized == base_url:
            continue
        if any(block in normalized for block in ("account/login", "account/register", "checkout", "search")):
            continue
        candidates.append(normalized)
    unique = list(dict.fromkeys(candidates))
    unique.sort(key=lambda item: (urlparse(item).path.count("/"), len(item)))
    return unique[:12]


def analyze_redirects(session: requests.Session, base_url: str) -> list[dict]:
    parsed = urlparse(base_url)
    host = parsed.netloc
    no_www_host = host[4:] if host.startswith("www.") else host
    variants = [
        f"http://{no_www_host}/",
        f"https://www.{no_www_host}/",
        f"http://www.{no_www_host}/",
    ]
    results = []
    for variant in variants:
        response, error = safe_get(session, variant, allow_redirects=True)
        if error or response is None:
            results.append({"url": variant, "error": error, "chain": [], "final_url": ""})
            continue
        chain = []
        for item in response.history:
            chain.append({"status": item.status_code, "location": item.headers.get("location", "")})
        results.append({"url": variant, "error": "", "chain": chain, "final_url": response.url})
    return results


def build_issue_list(audit: dict) -> list[AuditIssue]:
    issues: list[AuditIssue] = []
    robots_lines = audit["robots_lines"]
    sample_pages: list[PageSnapshot] = audit["sample_pages"]
    key_pages = {snapshot.url: snapshot for snapshot in sample_pages}
    problematic_titles = [snapshot for snapshot in sample_pages if len(snapshot.title) > 70]
    problematic_descriptions = [
        snapshot for snapshot in sample_pages if len(snapshot.description) > 160 or (0 < len(snapshot.description) < 120)
    ]
    alt_gaps = [snapshot for snapshot in sample_pages if snapshot.missing_alt_count > 0]
    redirect_chains = [item for item in audit["redirect_checks"] if len(item["chain"]) > 1]

    if any("sitemap.xml" in line.lower() and "disallow" in line.lower() for line in robots_lines):
        issues.append(
            AuditIssue(
                severity="Critical",
                title="robots.txt конфликтует с собственной картой сайта",
                why_it_matters=(
                    "Сейчас в robots.txt одновременно указан Sitemap и стоит Disallow на sitemap.xml. "
                    "Для Яндекса и части сервисов это выглядит как конфликт сигналов и мешает чистой индексации."
                ),
                evidence=[
                    "В robots.txt найдено правило `Disallow: *sitemap.xml`.",
                    "Одновременно файл содержит `Sitemap: https://akvarium-akvas.ru/sitemap.xml`.",
                ],
                recommendation=(
                    "Удалить запрет на sitemap.xml, оставить только директиву Sitemap и привести Host к чистому домену без протокола."
                ),
            )
        )

    contact_page = key_pages.get(urljoin(f"{audit['base_url']}/", "contacts"))
    route_contact_page = key_pages.get(urljoin(f"{audit['base_url']}/", "index.php?route=information/contactform"))
    if contact_page and (not contact_page.h1s or not contact_page.description or not contact_page.canonical):
        evidence = []
        if not contact_page.h1s:
            evidence.append("Страница /contacts открывается без H1.")
        if not contact_page.description:
            evidence.append("На /contacts отсутствует meta description.")
        if not contact_page.canonical:
            evidence.append("На /contacts отсутствует canonical.")
        issues.append(
            AuditIssue(
                severity="High",
                title="Контактные и lead-страницы недооптимизированы",
                why_it_matters=(
                    "Контактные страницы участвуют в доверии, конверсии и брендовой выдаче. "
                    "Когда у них нет базовой SEO-разметки, сайт теряет и кликабельность, и качество индекса."
                ),
                evidence=evidence or ["Контактная зона сайта не оформлена как полноценная посадочная страница."],
                recommendation=(
                    "Сделать полноценную контактную страницу: H1, title до 70 символов, description 140-160 символов, canonical, "
                    "контент про производство, доставку, гарантию, адрес, телефоны и CTA."
                ),
            )
        )
    if route_contact_page and not route_contact_page.title and not route_contact_page.description:
        issues.append(
            AuditIssue(
                severity="High",
                title="Внутренний служебный URL с формой обратного звонка доступен без SEO-контроля",
                why_it_matters=(
                    "Indexable-страницы без title, description и H1 создают шум в индексе, размывают релевантность и тянут crawl budget."
                ),
                evidence=[
                    "URL `/index.php?route=information/contactform` доступен по 200.",
                    "На странице нет title, description и H1.",
                    "Ссылка на этот URL есть в шапке как `Обратный звонок`.",
                ],
                recommendation=(
                    "Либо закрыть route-страницу от индексации и убрать прямые ссылки, либо перевести ее на нормальный SEO-friendly URL с оформлением."
                ),
            )
        )

    if problematic_titles:
        examples = [f"{urlparse(snapshot.url).path or '/'} — {len(snapshot.title)} симв." for snapshot in problematic_titles[:4]]
        issues.append(
            AuditIssue(
                severity="High",
                title="Шаблоны title на товарах и категориях слишком длинные",
                why_it_matters=(
                    "Длинные title режутся в выдаче, ухудшают CTR и снижают контроль над тем, какой оффер поисковик покажет пользователю."
                ),
                evidence=[
                    f"В выборке {len(problematic_titles)} из {len(sample_pages)} страниц имеют title длиннее 70 символов.",
                    *examples,
                ],
                recommendation=(
                    "Пересобрать шаблоны title: сначала ключ + модель/категория, затем оффер и бренд. "
                    "Для каталога держать диапазон 55-70 символов."
                ),
            )
        )

    if problematic_descriptions:
        examples = [
            f"{urlparse(snapshot.url).path or '/'} — {len(snapshot.description)} симв."
            for snapshot in problematic_descriptions[:4]
        ]
        issues.append(
            AuditIssue(
                severity="Medium",
                title="Meta description на части страниц обрезается или не дотягивает до нормального сниппета",
                why_it_matters=(
                    "Сниппет — это коммерческий оффер в выдаче. "
                    "Когда description слишком короткий или перегруженный, поисковик чаще берет случайный кусок текста со страницы."
                ),
                evidence=[
                    f"В выборке {len(problematic_descriptions)} из {len(sample_pages)} страниц имеют description вне комфортного диапазона.",
                    *examples,
                ],
                recommendation=(
                    "Собрать шаблоны description под типы страниц: ключ, ценность, доставка/гарантия, регион, призыв. "
                    "Ориентир — 140-160 символов."
                ),
            )
        )

    if alt_gaps:
        issues.append(
            AuditIssue(
                severity="Medium",
                title="Изображения теряют поисковый трафик и контекст карточек",
                why_it_matters="Для товарного проекта alt влияет и на картинки, и на понимание ассортимента, и на доступность.",
                evidence=[
                    f"На {len(alt_gaps)} из {len(sample_pages)} проверенных страниц есть изображения без alt.",
                    f"На главной найдено {audit['home_page'].missing_alt_count} изображений без alt.",
                ],
                recommendation=(
                    "Ввести шаблонную генерацию alt по типу карточки: товар + объем/размер + бренд/серия, "
                    "а для категорий — общий интент страницы."
                ),
            )
        )

    if redirect_chains:
        issues.append(
            AuditIssue(
                severity="Medium",
                title="Есть лишняя redirect-цепочка у части доменных вариантов",
                why_it_matters=(
                    "Дополнительный редирект добавляет задержку на входе и создает ненужную техническую сложность для ботов и пользователей."
                ),
                evidence=[
                    "Путь `http://www.akvarium-akvas.ru/` отдает две последовательные 301-переадресации.",
                    "Финальный канонический домен — `https://akvarium-akvas.ru/`.",
                ],
                recommendation=(
                    "Свести все варианты домена к одному 301-редиректу напрямую на канонический HTTPS без промежуточного `https://www`."
                ),
            )
        )

    if audit["home_page"].has_meta_keywords:
        issues.append(
            AuditIssue(
                severity="Low",
                title="На главной остался meta keywords, который уже не дает SEO-ценности",
                why_it_matters="Сам по себе тег не вредит, но это сигнал, что шаблон меты стоит почистить и поддерживать в актуальном виде.",
                evidence=["На главной найден тег meta keywords."],
                recommendation="Убрать meta keywords из шаблона и сосредоточиться на title, description, H1, schema и коммерческих блоках.",
            )
        )

    if audit["sitemap_url_count"] > 5000:
        issues.append(
            AuditIssue(
                severity="Medium",
                title="Карта сайта уже большая и требует более управляемой структуры",
                why_it_matters=(
                    "Когда URL почти 7000 и все лежит в одном потоке, сложнее отслеживать индексацию категорий, товаров и служебных страниц отдельно."
                ),
                evidence=[
                    f"В sitemap обнаружено {audit['sitemap_url_count']} URL.",
                    "Сейчас удобнее управлять индексом через раздельные sitemap по типам страниц.",
                ],
                recommendation=(
                    "Разделить sitemap минимум на товары, категории, служебные страницы и медиа/статьи, "
                    "чтобы проще контролировать покрытие и переобход."
                ),
            )
        )

    if audit.get("sitemap_total_entries", 0) > audit["sitemap_url_count"] * 1.3:
        duplicate_entries = audit["sitemap_total_entries"] - audit["sitemap_url_count"]
        issues.append(
            AuditIssue(
                severity="Medium",
                title="Карта сайта раздута повторяющимися URL",
                why_it_matters=(
                    "Когда один и тот же URL повторяется в sitemap много раз, поисковики получают лишний шум вместо чистого сигнала, "
                    "а анализ индексации становится менее управляемым."
                ),
                evidence=[
                    f"В sitemap найдено {audit['sitemap_total_entries']} записей, но только {audit['sitemap_url_count']} уникальных URL.",
                    f"Повторов: {duplicate_entries}.",
                ],
                recommendation=(
                    "Пересобрать генерацию sitemap так, чтобы каждый индексируемый URL попадал туда один раз, "
                    "а карта сайта отражала реальную структуру проекта без дублей."
                ),
            )
        )

    severity_order = {"Critical": 0, "High": 1, "Medium": 2, "Low": 3}
    issues.sort(key=lambda issue: severity_order.get(issue.severity, 4))
    return issues


def build_strengths(audit: dict) -> list[str]:
    strengths = []
    if audit["home_page"].status_code == 200:
        strengths.append("Сайт стабильно отвечает по HTTPS и главная страница отдает 200 код без JS-заглушки.")
    if audit["sitemap_url_count"]:
        strengths.append(
            f"Сайт уже имеет индексируемую карту сайта с {audit['sitemap_url_count']} URL и image-тегами для карточек."
        )
    if audit["home_page"].canonical:
        strengths.append("На ключевых коммерческих страницах проставлены canonical, что помогает удерживать основной URL.")
    if audit["schema_coverage_ratio"] >= 0.7:
        strengths.append("На товарах и категориях уже используется schema-разметка (Product / BreadcrumbList / LocalBusiness).")
    if audit["h1_coverage_ratio"] >= 0.8:
        strengths.append("У большинства проверенных коммерческих страниц есть H1, что хорошо для масштабного каталога.")
    strengths.append("URL-структура в каталоге понятная и хорошо дробит спрос по литражу, форме, назначению и комплектации.")
    if audit["llms_exists"]:
        strengths.append("У проекта уже есть llms.txt, а значит можно дополнительно усиливать AI-видимость и branded-ответы.")
    return strengths


def build_growth_points() -> list[str]:
    return [
        "Усилить страницы категорий уникальными интро-блоками, FAQ, доставкой, гарантией, сроками производства и объяснением, как выбрать модель.",
        "Сделать отдельные посадочные под высокий спрос: по литражу, форме, назначению, типу комплектации и готовым решениям под ключ.",
        "Добавить в категории и карточки блоки доверия: производство в России, гарантия, доставка по РФ, кастомизация размеров, комплектация.",
        "Развернуть image SEO: alt-шаблоны, подписи, structured data и подбор визуалов под поисковый спрос по аквариумам и террариумам.",
        "Собрать шаблонный слой сниппетов: короткие title, коммерческие description, аккуратный canonical и понятные H1 на всех типах страниц.",
        "Сегментировать sitemap и параллельно настроить контроль индексации категорий, товаров, фильтров и служебных route-страниц.",
    ]


def build_roadmap() -> list[tuple[str, list[str]]]:
    return [
        (
            "0-14 дней",
            [
                "Исправить robots.txt: убрать конфликт с sitemap.xml и нормализовать Host.",
                "Закрыть или переработать `/index.php?route=information/contactform`.",
                "Доделать SEO-шаблон страницы контактов: H1, title, description, canonical, коммерческий контент.",
                "Подготовить новое правило генерации title и description для товаров и категорий.",
            ],
        ),
        (
            "15-30 дней",
            [
                "Внедрить alt-шаблоны для карточек и категорий.",
                "Свести доменные редиректы к одному шагу на канонический HTTPS.",
                "Разделить sitemap по типам страниц и подать их отдельно в Яндекс Вебмастер и GSC.",
                "Обновить сниппеты и протестировать рост CTR по категориям и товарным кластерам.",
            ],
        ),
        (
            "31-60 дней",
            [
                "Усилить спросовые категории контентом, FAQ, коммерческими блоками и перелинковкой.",
                "Собрать посадочные под ключевые кластеры спроса: литраж, форма, сценарий использования, комплектация.",
                "Добавить контент-слой под AI-ответы: краткие определения, таблицы сравнения, ответы на частые вопросы.",
            ],
        ),
    ]


def build_score(audit: dict, issues: list[AuditIssue]) -> int:
    score = 82
    penalties = {"Critical": 9, "High": 6, "Medium": 3, "Low": 1}
    for issue in issues[:6]:
        score -= penalties.get(issue.severity, 1)
    score -= min(8, int(round(audit["title_long_ratio"] * 10)))
    score -= min(6, int(round(audit["description_problem_ratio"] * 8)))
    score -= 2 if audit["home_page"].missing_alt_count else 0
    return max(45, min(95, score))


def shorten_path(url: str, max_length=48) -> str:
    parsed = urlparse(url)
    path = parsed.path or "/"
    if parsed.query:
        path = f"{path}?{parsed.query}"
    if len(path) <= max_length:
        return path
    return f"{path[: max_length - 1]}…"


def build_audit(url: str, company_name: str | None, sample_size: int) -> dict:
    base_url = normalize_base_url(url)
    parsed = urlparse(base_url)
    base_domain = parsed.netloc
    session = make_session()

    homepage = analyse_page(session, base_url, base_domain)
    robots_response, _ = safe_get(session, urljoin(f"{base_url}/", "robots.txt"))
    llms_response, _ = safe_get(session, urljoin(f"{base_url}/", "llms.txt"))
    robots_text = robots_response.text if robots_response is not None and robots_response.status_code == 200 else ""
    sitemap_urls, processed_sitemaps, sitemap_total_entries = parse_sitemap_urls(
        session, discover_sitemaps(robots_text, base_url), base_domain
    )
    home_links = discover_home_links(session, base_url, base_domain)
    preferred_urls = [
        base_url,
        urljoin(f"{base_url}/", "contacts"),
        urljoin(f"{base_url}/", "index.php?route=information/contactform"),
        *home_links[:8],
        *sitemap_urls[: max(10, sample_size)],
    ]
    unique_urls = list(dict.fromkeys(preferred_urls))[: sample_size + 8]
    snapshots = [analyse_page(session, item, base_domain) for item in unique_urls]
    html_pages = [snapshot for snapshot in snapshots if snapshot.status_code == 200 and "html" in snapshot.content_type]

    title_long = [snapshot for snapshot in html_pages if len(snapshot.title) > 70]
    description_problem = [
        snapshot for snapshot in html_pages if len(snapshot.description) > 160 or (0 < len(snapshot.description) < 120)
    ]
    schema_pages = [snapshot for snapshot in html_pages if snapshot.schema_types]
    h1_pages = [snapshot for snapshot in html_pages if snapshot.h1s]
    total_missing_alt = sum(snapshot.missing_alt_count for snapshot in html_pages)
    redirect_checks = analyze_redirects(session, base_url)
    company = company_name or re.sub(r"^www\.", "", base_domain)

    audit = {
        "base_url": base_url,
        "domain": base_domain,
        "company_name": company,
        "generated_at": datetime.now().strftime("%d.%m.%Y %H:%M"),
        "home_page": homepage,
        "robots_status": robots_response.status_code if robots_response is not None else 0,
        "robots_lines": [line.strip() for line in robots_text.splitlines() if line.strip()],
        "llms_exists": bool(llms_response is not None and llms_response.status_code == 200),
        "sitemap_url_count": len(sitemap_urls),
        "sitemap_total_entries": sitemap_total_entries,
        "processed_sitemaps": processed_sitemaps,
        "sample_pages": html_pages,
        "raw_sampled_urls": unique_urls,
        "title_long_ratio": (len(title_long) / len(html_pages)) if html_pages else 0,
        "description_problem_ratio": (len(description_problem) / len(html_pages)) if html_pages else 0,
        "schema_coverage_ratio": (len(schema_pages) / len(html_pages)) if html_pages else 0,
        "h1_coverage_ratio": (len(h1_pages) / len(html_pages)) if html_pages else 0,
        "total_missing_alt": total_missing_alt,
        "average_response_ms": round(statistics.mean([snapshot.response_time_ms for snapshot in html_pages]), 1)
        if html_pages
        else 0,
        "average_html_kb": round(statistics.mean([snapshot.html_size_kb for snapshot in html_pages]), 1)
        if html_pages
        else 0,
        "average_words": round(statistics.mean([snapshot.word_count for snapshot in html_pages]), 1) if html_pages else 0,
        "redirect_checks": redirect_checks,
    }
    issues = build_issue_list(audit)
    audit["issues"] = issues
    audit["strengths"] = build_strengths(audit)
    audit["growth_points"] = build_growth_points()
    audit["roadmap"] = build_roadmap()
    audit["score"] = build_score(audit, issues)
    return audit


def configure_document(doc: Document) -> None:
    section = doc.sections[0]
    section.page_width = Cm(21)
    section.page_height = Cm(29.7)
    section.left_margin = Cm(1.7)
    section.right_margin = Cm(1.5)
    section.top_margin = Cm(1.6)
    section.bottom_margin = Cm(1.4)
    add_page_borders(section)
    styles = doc.styles
    styles["Normal"].font.name = "Arial"
    styles["Normal"].font.size = Pt(11)
    styles["Normal"].font.color.rgb = RGBColor.from_string(BRAND_TEXT)


def add_header_footer(doc: Document, logo_path: Path, audit: dict) -> None:
    for section in doc.sections:
        header = section.header
        header_table = header.add_table(rows=1, cols=3, width=Cm(17.4))
        header_table.alignment = WD_TABLE_ALIGNMENT.CENTER
        remove_table_borders(header_table)
        header_table.columns[0].width = Cm(0.45)
        header_table.columns[1].width = Cm(10.7)
        header_table.columns[2].width = Cm(6.25)
        accent_cell, brand_cell, label_cell = header_table.rows[0].cells
        set_cell_shading(accent_cell, BRAND_ORANGE)
        set_cell_shading(brand_cell, BRAND_DARK)
        set_cell_shading(label_cell, BRAND_DARK)
        for cell in (accent_cell, brand_cell, label_cell):
            set_cell_margins(cell, 70, 120, 70, 120)
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        brand_paragraph = brand_cell.paragraphs[0]
        brand_paragraph.alignment = WD_ALIGN_PARAGRAPH.LEFT
        if logo_path.exists():
            brand_run = brand_paragraph.add_run()
            brand_run.add_picture(str(logo_path), width=Inches(0.24))
            brand_paragraph.add_run("  ")
        brand_run = brand_paragraph.add_run(BRAND_NAME)
        set_font(brand_run, size=10.5, bold=True, color="FFFFFF")
        label_paragraph = label_cell.paragraphs[0]
        label_paragraph.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        label_run = label_paragraph.add_run("SEO AUDIT / GROWTH MAP")
        set_font(label_run, size=8.6, bold=True, color=BRAND_CYAN)

        footer = section.footer
        footer_table = footer.add_table(rows=1, cols=2, width=Cm(17.4))
        footer_table.alignment = WD_TABLE_ALIGNMENT.CENTER
        remove_table_borders(footer_table)
        footer_table.columns[0].width = Cm(13.5)
        footer_table.columns[1].width = Cm(3.9)
        left_cell, right_cell = footer_table.rows[0].cells
        set_cell_margins(left_cell, 50, 0, 20, 0)
        set_cell_margins(right_cell, 50, 0, 20, 0)
        left_paragraph = left_cell.paragraphs[0]
        left_run = left_paragraph.add_run(f"{audit['domain']}  |  Audit by {BRAND_NAME}")
        set_font(left_run, size=8.7, color=BRAND_MUTED)
        right_paragraph = right_cell.paragraphs[0]
        right_paragraph.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        add_page_number(right_paragraph)
        if right_paragraph.runs:
            set_font(right_paragraph.runs[-1], size=8.7, color=BRAND_MUTED)


def add_cover(doc: Document, audit: dict, logo_path: Path) -> None:
    cover = doc.add_table(rows=1, cols=2)
    cover.alignment = WD_TABLE_ALIGNMENT.CENTER
    remove_table_borders(cover)
    left, right = cover.rows[0].cells
    left.width = Cm(11.2)
    right.width = Cm(6.2)
    set_cell_shading(left, BRAND_DARK)
    set_cell_shading(right, BRAND_ACCENT_SOFT)
    for cell in (left, right):
        cell.vertical_alignment = WD_ALIGN_VERTICAL.TOP
        set_cell_margins(cell, 220, 220, 220, 220)

    if logo_path.exists():
        p_logo = left.paragraphs[0]
        run = p_logo.add_run()
        run.add_picture(str(logo_path), width=Inches(0.65))
        p_logo.add_run("  ")
        brand_run = p_logo.add_run(BRAND_NAME)
        set_font(brand_run, size=14, bold=True, color="FFFFFF")

    p_tag = left.add_paragraph()
    p_tag.paragraph_format.space_before = Pt(30)
    tag_run = p_tag.add_run("SEO AUDIT / ТОЧКИ РОСТА")
    set_font(tag_run, size=10.5, bold=True, color=BRAND_CYAN)

    p_title = left.add_paragraph()
    p_title.paragraph_format.space_before = Pt(10)
    title_run = p_title.add_run(f"SEO-аудит сайта\n{audit['domain']}")
    set_font(title_run, size=26, bold=True, color="FFFFFF")

    p_subtitle = left.add_paragraph()
    subtitle_run = p_subtitle.add_run(
        "Документ для продажи услуги и внедрения реальных SEO-точек роста. "
        "Не просто список замечаний, а план того, как быстрее усилить видимость, индекс и коммерческий трафик."
    )
    set_font(subtitle_run, size=11.4, color="E8EEF6")
    p_subtitle.paragraph_format.space_after = Pt(18)

    callout = left.add_table(rows=1, cols=1)
    remove_table_borders(callout)
    callout_cell = callout.rows[0].cells[0]
    set_cell_shading(callout_cell, BRAND_DARK_ALT)
    set_cell_margins(callout_cell, 110, 130, 110, 130)
    callout_run = callout_cell.paragraphs[0].add_run(
        "Внутри: индексация, robots/sitemap, шаблоны title/description, категории, "
        "товарные карточки, изображения, коммерческие блоки и 60-дневный roadmap."
    )
    set_font(callout_run, size=10.8, color="FFFFFF")

    run = right.paragraphs[0].add_run("Паспорт проекта")
    set_font(run, size=14, bold=True, color=BRAND_TEXT)
    add_text_paragraph(right, f"Бренд: {audit['company_name']}", size=11.4)
    add_text_paragraph(right, f"Домен: {audit['base_url']}", size=11.2)
    add_text_paragraph(right, f"Дата: {audit['generated_at']}", size=11.2)
    add_text_paragraph(right, "Формат: SEO-аудит / growth map", size=11.2)
    add_text_paragraph(right, f"Исполнитель: {BRAND_NAME}", size=11.2, bold=True)
    add_text_paragraph(
        right,
        "Фокус аудита: индексация, структура каталога, шаблоны метаданных, изображения, "
        "контактные страницы и потенциал роста кластеров спроса.",
        size=11,
        color=BRAND_MUTED,
        space_after=12,
    )

    score_box = right.add_table(rows=1, cols=1)
    remove_table_borders(score_box)
    score_cell = score_box.rows[0].cells[0]
    set_cell_shading(score_cell, "FFFFFF")
    set_cell_margins(score_cell, 120, 120, 120, 120)
    score_label = score_cell.paragraphs[0]
    score_label.alignment = WD_ALIGN_PARAGRAPH.CENTER
    label_run = score_label.add_run("Индекс SEO-готовности")
    set_font(label_run, size=10.2, bold=True, color=BRAND_MUTED)
    score_value = score_cell.add_paragraph()
    score_value.alignment = WD_ALIGN_PARAGRAPH.CENTER
    score_run = score_value.add_run(str(audit["score"]))
    set_font(score_run, size=28, bold=True, color=BRAND_TEXT)
    score_hint = score_cell.add_paragraph()
    score_hint.alignment = WD_ALIGN_PARAGRAPH.CENTER
    hint_run = score_hint.add_run("из 100")
    set_font(hint_run, size=10.2, color=BRAND_MUTED)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)


def add_metric_grid(doc: Document, audit: dict) -> None:
    metrics = [
        ("Sitemap unique", str(audit["sitemap_url_count"])),
        ("Sitemap entries", str(audit.get("sitemap_total_entries", audit["sitemap_url_count"]))),
        ("Средний ответ", f"{audit['average_response_ms']} ms"),
        ("Средний HTML", f"{audit['average_html_kb']} KB"),
        ("Title > 70", f"{math.floor(audit['title_long_ratio'] * 100)}%"),
        ("Desc вне диапазона", f"{math.floor(audit['description_problem_ratio'] * 100)}%"),
        ("Schema coverage", f"{math.floor(audit['schema_coverage_ratio'] * 100)}%"),
        ("Alt gaps", str(audit["total_missing_alt"])),
    ]
    table = doc.add_table(rows=2, cols=4)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    remove_table_borders(table)
    index = 0
    for row in table.rows:
        for cell in row.cells:
            title, value = metrics[index]
            set_cell_shading(cell, BRAND_SOFT if index % 2 == 0 else "FFFFFF")
            set_cell_margins(cell, 100, 110, 100, 110)
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            p1 = cell.paragraphs[0]
            p1.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r1 = p1.add_run(title.upper())
            set_font(r1, size=8.5, bold=True, color=BRAND_MUTED)
            p2 = cell.add_paragraph()
            p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r2 = p2.add_run(value)
            set_font(r2, size=17, bold=True, color=BRAND_TEXT)
            index += 1
    doc.add_paragraph().paragraph_format.space_after = Pt(6)


def add_issue_cards(doc: Document, issues: list[AuditIssue]) -> None:
    severity_colors = {"Critical": "FFE3E3", "High": "FFF1E6", "Medium": "EEF7FF", "Low": "F4F6FA"}
    severity_text_colors = {"Critical": "B42318", "High": "B54708", "Medium": "175CD3", "Low": BRAND_MUTED}
    for issue in issues:
        table = doc.add_table(rows=2, cols=1)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        remove_table_borders(table)
        head = table.rows[0].cells[0]
        body = table.rows[1].cells[0]
        set_cell_shading(head, severity_colors.get(issue.severity, "F7F7F7"))
        set_cell_shading(body, "FFFFFF")
        set_cell_margins(head, 100, 120, 90, 120)
        set_cell_margins(body, 100, 120, 120, 120)
        head_run = head.paragraphs[0].add_run(f"{issue.severity.upper()}  |  {issue.title}")
        set_font(head_run, size=11.2, bold=True, color=severity_text_colors.get(issue.severity, BRAND_TEXT))
        body_run = body.paragraphs[0].add_run(issue.why_it_matters)
        set_font(body_run, size=11.1, color=BRAND_TEXT)
        body.paragraphs[0].paragraph_format.space_after = Pt(6)
        add_bullet_list(body, issue.evidence, size=10.8)
        recommendation = body.add_paragraph()
        recommendation_run = recommendation.add_run(f"Что делать: {issue.recommendation}")
        set_font(recommendation_run, size=10.9, bold=True, color=BRAND_TEXT)
        doc.add_paragraph().paragraph_format.space_after = Pt(4)


def add_roadmap_table(doc: Document, roadmap: list[tuple[str, list[str]]]) -> None:
    table = doc.add_table(rows=1, cols=3)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    remove_table_borders(table)
    for idx, (period, tasks) in enumerate(roadmap):
        cell = table.rows[0].cells[idx]
        set_cell_shading(cell, BRAND_SOFT if idx != 1 else "FFFFFF")
        set_cell_margins(cell, 120, 120, 120, 120)
        title = cell.paragraphs[0]
        title.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = title.add_run(period)
        set_font(run, size=11.2, bold=True, color=BRAND_ORANGE)
        add_bullet_list(cell, tasks, size=10.4)


def add_snapshot_table(doc: Document, snapshots: list[PageSnapshot]) -> None:
    table = doc.add_table(rows=1, cols=7)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers = ["Путь", "Тип", "Код", "Title", "Desc", "H1", "Schema"]
    for idx, header in enumerate(headers):
        cell = table.rows[0].cells[idx]
        set_cell_shading(cell, BRAND_DARK)
        set_cell_margins(cell, 90, 80, 90, 80)
        paragraph = cell.paragraphs[0]
        paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = paragraph.add_run(header)
        set_font(run, size=9, bold=True, color="FFFFFF")
    for snapshot in snapshots[:12]:
        row = table.add_row().cells
        values = [
            shorten_path(snapshot.url),
            snapshot.page_type,
            str(snapshot.status_code),
            str(len(snapshot.title)),
            str(len(snapshot.description)),
            str(len(snapshot.h1s)),
            ", ".join(snapshot.schema_types[:2]) or "—",
        ]
        for idx, value in enumerate(values):
            cell = row[idx]
            set_cell_shading(cell, BRAND_SOFT if idx % 2 == 0 else "FFFFFF")
            set_cell_margins(cell, 70, 70, 70, 70)
            paragraph = cell.paragraphs[0]
            if idx in (2, 3, 4, 5):
                paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
            run = paragraph.add_run(value)
            set_font(run, size=9.2, color=BRAND_TEXT)


def build_executive_summary(audit: dict) -> list[str]:
    return [
        (
            f"{audit['company_name']} уже имеет сильный фундамент для роста: чистый HTTPS-домен, "
            f"большой каталог спроса, рабочий sitemap, schema на товарах и категориях и широкую URL-структуру под кластеры."
        ),
        (
            "Но сейчас проект теряет часть видимости не из-за отсутствия ассортимента, а из-за технических и шаблонных ограничений: "
            "robots.txt конфликтует с картой сайта, метаданные у товарных и категорийных шаблонов часто слишком длинные, "
            "контактные страницы недооформлены, а изображения не добирают SEO-сигналы через alt."
        ),
        (
            "Если убрать этот технический шум и пересобрать коммерческие шаблоны, сайт сможет заметно сильнее раскрыть спрос "
            "по аквариумам, террариумам, тумбам и аксессуарам без полной переделки платформы."
        ),
    ]


def generate_docx(audit: dict, output_path: Path, logo_path: Path) -> None:
    doc = Document()
    configure_document(doc)
    add_header_footer(doc, logo_path, audit)
    add_cover(doc, audit, logo_path)
    doc.add_page_break()

    add_section_heading(
        doc,
        "Executive summary",
        "Где проект уже силён и где он теряет рост",
        "Ниже — выжимка по тем точкам, которые сильнее всего влияют на индексацию, кликабельность и масштабирование спроса.",
    )
    for paragraph in build_executive_summary(audit):
        add_text_paragraph(doc, paragraph, size=11.4, color=BRAND_TEXT, space_after=6)
    add_metric_grid(doc, audit)

    add_section_heading(doc, "Сильные стороны", "Что уже работает в плюс проекту")
    add_bullet_list(doc, audit["strengths"], size=11.1)

    add_section_heading(
        doc,
        "Приоритеты",
        "Главные точки роста, которые нужно зафиксировать первыми",
        "Список отсортирован по бизнес-риску: сверху то, что сильнее всего влияет на индекс, crawl budget, CTR и доверие.",
    )
    add_issue_cards(doc, audit["issues"])

    add_section_heading(
        doc,
        "Что усиливать",
        "Как превратить текущую структуру в источник роста",
        "Ниже — не технические правки, а те улучшения, которые помогут глубже забрать спрос и лучше конвертировать трафик в заявки и продажи.",
    )
    add_bullet_list(doc, audit["growth_points"], size=11.1)

    add_section_heading(
        doc,
        "Roadmap",
        "План внедрения на 60 дней",
        "Такой порядок даёт самый быстрый эффект: сначала чистим индексацию и шаблоны, затем усиливаем кластеры спроса.",
    )
    add_roadmap_table(doc, audit["roadmap"])

    add_section_heading(
        doc,
        "Приложение",
        "Фрагмент выборки страниц, которые легли в основу аудита",
        "Это не полный crawl всего проекта, а репрезентативная выборка по главным, категорийным, товарным и служебным URL.",
    )
    add_snapshot_table(doc, audit["sample_pages"])

    output_path.parent.mkdir(parents=True, exist_ok=True)
    doc.save(str(output_path))


def serialize_audit(audit: dict) -> dict:
    payload = dict(audit)
    payload["home_page"] = asdict(audit["home_page"])
    payload["sample_pages"] = [asdict(item) for item in audit["sample_pages"]]
    payload["issues"] = [asdict(item) for item in audit["issues"]]
    return payload


def main() -> None:
    global BRAND_NAME
    parser = argparse.ArgumentParser(description="Generate a branded Shelpakov Digital SEO audit in DOCX format.")
    parser.add_argument("--url", required=True, help="Target website URL")
    parser.add_argument("--company", help="Client / brand name for the cover")
    parser.add_argument("--brand", default=BRAND_NAME, help="Brand label on the audit")
    parser.add_argument("--output", help="Output DOCX path")
    parser.add_argument("--sample-size", type=int, default=18, help="How many pages to analyze from the website")
    parser.add_argument("--no-json", action="store_true", help="Do not save raw audit JSON next to the DOCX")
    args = parser.parse_args()

    BRAND_NAME = args.brand

    target = normalize_base_url(args.url)
    today = datetime.now().strftime("%Y-%m-%d")
    output = Path(args.output) if args.output else Path("audits") / f"{slugify_for_filename(target)}-{today}.docx"

    audit = build_audit(target, args.company, args.sample_size)
    logo_path = Path("public") / "android-chrome-512x512.png"
    generate_docx(audit, output, logo_path)
    if not args.no_json:
        json_path = output.with_suffix(".json")
        json_path.write_text(json.dumps(serialize_audit(audit), ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Audit ready: {output}")


if __name__ == "__main__":
    main()
