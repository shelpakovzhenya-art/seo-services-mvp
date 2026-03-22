#!/usr/bin/env python
from __future__ import annotations

import argparse
from collections import Counter
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
from preview_export import write_preview_html, write_preview_pdf

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
    missing_dimensions_count: int
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
            missing_dimensions_count=0,
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
    missing_dimensions_count = sum(1 for image in images if not image.get("width") or not image.get("height"))
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
        missing_dimensions_count=missing_dimensions_count,
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


CONTACT_PATH_KEYWORDS = (
    "contact",
    "contacts",
    "kontakt",
    "kontakty",
    "callback",
    "feedback",
    "request",
    "lead",
    "zayav",
    "svyaz",
    "consult",
)

BLOG_PATH_KEYWORDS = (
    "blog",
    "blogs",
    "article",
    "articles",
    "news",
    "novosti",
    "stati",
    "aktuelles",
)


def human_path(url: str) -> str:
    parsed = urlparse(url)
    path = parsed.path or "/"
    if parsed.query:
        path = f"{path}?{parsed.query}"
    return path


def get_contact_related_pages(sample_pages: list[PageSnapshot]) -> list[PageSnapshot]:
    found: list[PageSnapshot] = []
    seen: set[str] = set()
    for snapshot in sample_pages:
        parsed = urlparse(snapshot.url)
        haystack = f"{parsed.path} {parsed.query}".lower()
        if snapshot.has_forms or any(token in haystack for token in CONTACT_PATH_KEYWORDS):
            if snapshot.url not in seen:
                seen.add(snapshot.url)
                found.append(snapshot)
    return found


def get_indexable_query_pages(sample_pages: list[PageSnapshot]) -> list[PageSnapshot]:
    pages: list[PageSnapshot] = []
    for snapshot in sample_pages:
        parsed = urlparse(snapshot.url)
        if not parsed.query:
            continue
        robots_flags = f"{snapshot.meta_robots} {snapshot.x_robots_tag}".lower()
        if "noindex" in robots_flags:
            continue
        pages.append(snapshot)
    return pages


def infer_project_profile(audit: dict) -> dict:
    sample_pages: list[PageSnapshot] = audit["sample_pages"]
    product_pages = [snapshot for snapshot in sample_pages if snapshot.page_type == "Товар" or "Product" in snapshot.schema_types]
    category_pages = [snapshot for snapshot in sample_pages if snapshot.page_type in ("Категория", "Подкатегория")]
    form_pages = [snapshot for snapshot in sample_pages if snapshot.has_forms]
    return {
        "product_pages": product_pages,
        "category_pages": category_pages,
        "form_pages": form_pages,
        "is_catalog": bool(product_pages or category_pages),
    }


def dynamic_build_issue_list(audit: dict) -> list[AuditIssue]:
    issues: list[AuditIssue] = []
    robots_lines = audit["robots_lines"]
    sample_pages: list[PageSnapshot] = audit["sample_pages"]
    problematic_titles = [snapshot for snapshot in sample_pages if len(snapshot.title) > 70]
    problematic_descriptions = [
        snapshot for snapshot in sample_pages if len(snapshot.description) > 160 or (0 < len(snapshot.description) < 120)
    ]
    alt_gaps = [snapshot for snapshot in sample_pages if snapshot.missing_alt_count > 0]
    redirect_chains = [item for item in audit["redirect_checks"] if len(item["chain"]) > 1]
    contact_pages = get_contact_related_pages(sample_pages)
    indexable_query_pages = get_indexable_query_pages(sample_pages)

    disallow_sitemap_lines = [line for line in robots_lines if "sitemap.xml" in line.lower() and "disallow" in line.lower()]
    sitemap_directive = next((line for line in robots_lines if line.lower().startswith("sitemap:")), "")

    if disallow_sitemap_lines:
        evidence = [f"В robots.txt найдено правило `{disallow_sitemap_lines[0]}`."]
        if sitemap_directive:
            evidence.append(f"Одновременно файл содержит `{sitemap_directive}`.")
        issues.append(
            AuditIssue(
                severity="Critical",
                title="robots.txt конфликтует с картой сайта",
                why_it_matters=(
                    "Когда robots.txt одновременно запрещает sitemap.xml и сам же ссылается на карту сайта, "
                    "поисковики получают конфликтующий сигнал. Это мешает чистой и предсказуемой индексации."
                ),
                evidence=evidence,
                recommendation=(
                    "Убрать запрет на sitemap.xml, оставить рабочую директиву Sitemap и синхронизировать robots.txt "
                    "с каноническим доменом проекта."
                ),
            )
        )

    weak_contact_pages: list[tuple[PageSnapshot, list[str]]] = []
    for snapshot in contact_pages:
        missing = []
        if not snapshot.h1s:
            missing.append("H1")
        if not snapshot.title:
            missing.append("title")
        if not snapshot.description:
            missing.append("description")
        if not snapshot.canonical:
            missing.append("canonical")
        if missing:
            weak_contact_pages.append((snapshot, missing))

    if weak_contact_pages:
        evidence = [f"На `{human_path(snapshot.url)}` не хватает: {', '.join(missing)}." for snapshot, missing in weak_contact_pages[:3]]
        issues.append(
            AuditIssue(
                severity="High",
                title="Контактные и lead-страницы недооформлены как SEO-посадочные",
                why_it_matters=(
                    "Страницы контактов и заявок участвуют не только в конверсии, но и в доверии, брендовой выдаче "
                    "и понимании бизнеса поисковиками."
                ),
                evidence=evidence,
                recommendation=(
                    "Собрать полноценные страницы контакта и заявки: H1, title до 70 символов, description 140–160 символов, "
                    "canonical, блоки доверия, адреса, телефоны и понятный CTA."
                ),
            )
        )

    weak_query_pages = [
        snapshot for snapshot in indexable_query_pages if not snapshot.title or not snapshot.description or not snapshot.h1s
    ]
    if weak_query_pages:
        evidence = []
        for snapshot in weak_query_pages[:3]:
            missing = []
            if not snapshot.title:
                missing.append("title")
            if not snapshot.description:
                missing.append("description")
            if not snapshot.h1s:
                missing.append("H1")
            evidence.append(f"URL `{human_path(snapshot.url)}` доступен для обхода, но не хватает: {', '.join(missing)}.")
        issues.append(
            AuditIssue(
                severity="High",
                title="В выборке есть индексируемые служебные или query-URL без нормальной SEO-обвязки",
                why_it_matters=(
                    "Служебные route-страницы и query-URL без title, description и H1 создают шум в индексе, "
                    "размывают релевантность и тратят crawl budget."
                ),
                evidence=evidence,
                recommendation=(
                    "Либо закрыть такие URL от индексации и убрать прямые ссылки на них, либо перевести их на нормальные SEO-friendly страницы "
                    "с полноценным мета-оформлением."
                ),
            )
        )

    if problematic_titles:
        examples = [f"{human_path(snapshot.url)} — {len(snapshot.title)} симв." for snapshot in problematic_titles[:4]]
        issues.append(
            AuditIssue(
                severity="High",
                title="На части страниц title выходят за рабочую длину",
                why_it_matters=(
                    "Слишком длинные title режутся в выдаче, ухудшают CTR и снижают контроль над тем, "
                    "какой оффер поисковик покажет пользователю."
                ),
                evidence=[
                    f"В выборке {len(problematic_titles)} из {len(sample_pages)} страниц имеют title длиннее 70 символов.",
                    *examples,
                ],
                recommendation=(
                    "Пересобрать шаблоны title: сначала ключ и тип страницы, затем ценностный оффер и бренд. "
                    "Ориентир — диапазон 55–70 символов."
                ),
            )
        )

    if problematic_descriptions:
        examples = [f"{human_path(snapshot.url)} — {len(snapshot.description)} симв." for snapshot in problematic_descriptions[:4]]
        issues.append(
            AuditIssue(
                severity="Medium",
                title="Meta description на части страниц вне рабочего диапазона",
                why_it_matters=(
                    "Description — это управляемый оффер в сниппете. Когда он слишком короткий или перегруженный, "
                    "поисковик чаще берет случайный кусок текста со страницы."
                ),
                evidence=[
                    f"В выборке {len(problematic_descriptions)} из {len(sample_pages)} страниц имеют description вне комфортного диапазона.",
                    *examples,
                ],
                recommendation=(
                    "Собрать шаблоны description по типам страниц: ключ, ценность, доверие, регион и призыв. "
                    "Ориентир — 140–160 символов."
                ),
            )
        )

    if alt_gaps:
        issues.append(
            AuditIssue(
                severity="Medium",
                title="Изображения теряют SEO-сигналы из-за пустых alt",
                why_it_matters=(
                    "Alt важен и для поиска по картинкам, и для понимания контекста страницы, и для доступности. "
                    "Когда у изображений нет описаний, сайт теряет дополнительный слой релевантности."
                ),
                evidence=[
                    f"На {len(alt_gaps)} из {len(sample_pages)} проверенных страниц есть изображения без alt.",
                    f"Всего в выборке найдено {audit['total_missing_alt']} изображений без описаний.",
                ],
                recommendation="Ввести шаблонную генерацию alt по типу страницы и типу изображения: объект, интент, модель и бренд.",
            )
        )

    if redirect_chains:
        longest_chain = max(redirect_chains, key=lambda item: len(item["chain"]))
        issues.append(
            AuditIssue(
                severity="Medium",
                title="Есть лишние redirect-цепочки у доменных вариантов",
                why_it_matters=(
                    "Дополнительные редиректы увеличивают задержку на входе и создают лишнюю техническую сложность для ботов и пользователей."
                ),
                evidence=[
                    f"Путь `{longest_chain['url']}` отдает {len(longest_chain['chain'])} последовательных redirect.",
                    f"Финальный URL — `{longest_chain['final_url']}`.",
                ],
                recommendation="Свести все доменные варианты к одному прямому 301-редиректу на канонический HTTPS-домен.",
            )
        )

    if audit["home_page"].has_meta_keywords:
        issues.append(
            AuditIssue(
                severity="Low",
                title="На части шаблона остался meta keywords",
                why_it_matters=(
                    "Сам по себе тег уже не дает SEO-ценности, но показывает, что шаблон метаданных не дочищен "
                    "и стоит привести его к современному виду."
                ),
                evidence=["На главной найден тег meta keywords."],
                recommendation="Убрать meta keywords из шаблона и сосредоточиться на title, description, H1, canonical и schema.",
            )
        )

    if audit["sitemap_url_count"] > 5000:
        issues.append(
            AuditIssue(
                severity="Medium",
                title="Карта сайта уже большая и требует сегментации",
                why_it_matters=(
                    "Когда в sitemap несколько тысяч URL в одном потоке, сложнее контролировать индексацию категорий, карточек, "
                    "служебных страниц и отдельных типов контента."
                ),
                evidence=[
                    f"В sitemap обнаружено {audit['sitemap_url_count']} уникальных URL.",
                    "При таком объеме удобнее управлять индексом через отдельные sitemap по типам страниц.",
                ],
                recommendation="Разделить sitemap минимум по основным типам страниц и отдельно контролировать покрытие каждого набора.",
            )
        )

    if audit.get("sitemap_total_entries", 0) > audit["sitemap_url_count"] * 1.3:
        duplicate_entries = audit["sitemap_total_entries"] - audit["sitemap_url_count"]
        issues.append(
            AuditIssue(
                severity="Medium",
                title="В sitemap много повторяющихся URL",
                why_it_matters=(
                    "Когда один и тот же URL повторяется в карте сайта много раз, поисковики получают лишний шум вместо чистого сигнала."
                ),
                evidence=[
                    f"В sitemap найдено {audit['sitemap_total_entries']} записей, но только {audit['sitemap_url_count']} уникальных URL.",
                    f"Повторов: {duplicate_entries}.",
                ],
                recommendation="Пересобрать генерацию sitemap так, чтобы каждый индексируемый URL попадал туда один раз и без дублей.",
            )
        )

    severity_order = {"Critical": 0, "High": 1, "Medium": 2, "Low": 3}
    issues.sort(key=lambda issue: severity_order.get(issue.severity, 4))
    return issues


def dynamic_build_strengths(audit: dict) -> list[str]:
    strengths: list[str] = []
    profile = infer_project_profile(audit)
    if audit["home_page"].status_code == 200:
        strengths.append("Главная страница стабильно открывается по HTTPS и отдает 200 код без JS-заглушки.")
    if audit["average_response_ms"] and audit["average_response_ms"] < 1200:
        strengths.append(f"Средний ответ по выборке — {audit['average_response_ms']} ms: техническая база не выглядит перегруженной.")
    if audit["sitemap_url_count"]:
        strengths.append(f"У сайта уже есть карта сайта с {audit['sitemap_url_count']} уникальными URL, а значит база для управляемой индексации уже существует.")
    if audit.get("canonical_coverage_ratio", 0) >= 0.6:
        strengths.append(
            f"У {math.floor(audit['canonical_coverage_ratio'] * 100)}% страниц в выборке уже проставлен canonical, это хороший фундамент для чистой индексации."
        )
    if audit["schema_coverage_ratio"] >= 0.4:
        strengths.append(f"Schema-разметка уже используется на {math.floor(audit['schema_coverage_ratio'] * 100)}% страниц выборки.")
    if audit["h1_coverage_ratio"] >= 0.8:
        strengths.append(f"У {math.floor(audit['h1_coverage_ratio'] * 100)}% проверенных страниц есть H1 — структура документов уже не выглядит хаотичной.")
    if profile["is_catalog"]:
        strengths.append("У проекта уже есть каталог или кластерная URL-структура, которую можно усиливать без полной смены архитектуры.")
    else:
        strengths.append("У проекта уже есть базовый набор посадочных страниц, который можно докручивать точечно, а не пересобирать с нуля.")
    if audit["llms_exists"]:
        strengths.append("У проекта уже есть llms.txt, а значит можно отдельно усиливать видимость в ИИ-ответах и branded-покрытие.")
    return strengths[:6]


def dynamic_build_growth_points(audit: dict) -> list[str]:
    profile = infer_project_profile(audit)
    points: list[str] = []

    if profile["is_catalog"]:
        points.append("Усилить категории и подкатегории: интро-блоки, FAQ, условия покупки, блоки доверия и перелинковку на карточки.")
        points.append("Пересобрать шаблоны карточек и листингов: короткие title, рабочие description, canonical, alt, schema и коммерческие CTA.")
    else:
        points.append("Развести ключевые интенты по отдельным посадочным страницам, а не держать несколько тем внутри одного документа.")
        points.append("Усилить страницы услуг и лид-страницы блоками доверия, кейсами, FAQ, CTA и answer-first фрагментами.")

    points.append("Собрать единый слой шаблонов для title, description, H1 и canonical по всем типам страниц.")

    if audit["total_missing_alt"] > 0:
        points.append("Развернуть image SEO: alt-шаблоны, подписи, контроль lazy-load и понятную связь изображения с интентом страницы.")

    if get_contact_related_pages(audit["sample_pages"]):
        points.append("Доделать контактные и заявочные страницы как полноценные SEO-документы, а не как технические формы.")

    points.append("Добавить answer-first блоки, FAQ и внутреннюю перелинковку между важными разделами для обычной и ИИ-выдачи.")

    if audit["sitemap_url_count"] > 2000 or audit.get("sitemap_total_entries", 0) > audit["sitemap_url_count"] * 1.2:
        points.append("Сегментировать sitemap и отдельно контролировать индексацию по типам страниц, чтобы быстрее находить сбои и дубли.")

    unique_points: list[str] = []
    for point in points:
        if point not in unique_points:
            unique_points.append(point)
    return unique_points[:6]


def dynamic_build_roadmap(audit: dict) -> list[tuple[str, list[str]]]:
    profile = infer_project_profile(audit)
    robots_conflict = any("sitemap.xml" in line.lower() and "disallow" in line.lower() for line in audit["robots_lines"])
    query_pages = get_indexable_query_pages(audit["sample_pages"])
    redirect_chains = [item for item in audit["redirect_checks"] if len(item["chain"]) > 1]

    sprint_1 = []
    if robots_conflict:
        sprint_1.append("Убрать конфликт в robots.txt и синхронизировать Sitemap, Host и канонический домен.")
    if redirect_chains:
        sprint_1.append("Свести все доменные варианты к одному прямому 301-редиректу.")
    if query_pages:
        sprint_1.append("Закрыть или нормализовать индексируемые query- и route-страницы с техническими формами.")
    sprint_1.append("Подготовить единое ТЗ на title, description, H1 и canonical для основных типов страниц.")

    sprint_2 = [
        "Внедрить alt-шаблоны, проверить lazy-load и подчистить image SEO на ключевых страницах.",
        "Разделить sitemap по типам страниц и подать отдельные карты в Яндекс.Вебмастер и GSC.",
        "Обновить шаблоны сниппетов и проверить рост CTR по приоритетным страницам.",
    ]

    if profile["is_catalog"]:
        sprint_3 = [
            "Усилить категории и подкатегории контентом, FAQ, блоками доверия и перелинковкой.",
            "Пересобрать карточки и листинги так, чтобы они лучше конвертировали SEO-трафик в заявки и продажи.",
            "Добавить answer-first фрагменты и контент под ИИ-выдачу на главные спросовые кластеры.",
        ]
    else:
        sprint_3 = [
            "Усилить посадочные страницы услуг, кейсов и контактов блоками доверия, CTA и answer-first контентом.",
            "Развести ключевые кластеры спроса по отдельным страницам и выстроить между ними перелинковку.",
            "Добавить FAQ и короткие экспертные блоки под обычную и ИИ-выдачу.",
        ]

    return [("0-14 дней", sprint_1[:4]), ("15-30 дней", sprint_2), ("31-60 дней", sprint_3)]


def build_executive_summary_dynamic(audit: dict) -> list[str]:
    profile = infer_project_profile(audit)
    top_issues = audit.get("issues", [])[:3]
    top_issue_titles = "; ".join(issue.title for issue in top_issues) if top_issues else "технические и шаблонные ограничения"
    project_shape = "каталог и кластерную структуру URL" if profile["is_catalog"] else "набор посадочных и лид-страниц"
    growth_target = (
        "лучше раскрыть спрос через категории, карточки и связанные кластеры"
        if profile["is_catalog"]
        else "сильнее забирать спрос через отдельные посадочные страницы и экспертные блоки"
    )

    return [
        (
            f"У {audit['company_name']} уже есть рабочий фундамент: сайт отвечает по HTTPS, в выборке видны sitemap, "
            f"H1-покрытие {math.floor(audit['h1_coverage_ratio'] * 100)}%, schema-покрытие {math.floor(audit['schema_coverage_ratio'] * 100)}% "
            f"и {project_shape}, которую можно усиливать без полной пересборки проекта."
        ),
        (
            f"Основные потери сейчас идут не из-за отсутствия спроса, а из-за слоя индексации и шаблонов: {top_issue_titles}. "
            "Именно эти ограничения сильнее всего влияют на crawl budget, CTR и чистоту коммерческой выдачи."
        ),
        (
            f"Если сначала убрать технический шум, а затем пересобрать шаблоны и приоритетные страницы, проект сможет {growth_target} "
            "и превратить текущую структуру сайта в более сильный источник SEO-трафика и заявок."
        ),
    ]


def select_representative_urls(base_url: str, home_links: list[str], sitemap_urls: list[str], sample_size: int) -> list[str]:
    selected: list[str] = []
    seen: set[str] = set()

    def normalize(url: str) -> str:
        return url.rstrip("/") or url

    def add(url: str) -> None:
        normalized = normalize(url)
        if not normalized or normalized in seen:
            return
        seen.add(normalized)
        selected.append(normalized)

    add(base_url)
    for url in home_links[:10]:
        add(url)

    buckets: dict[str, list[str]] = {
        "contact": [],
        "query": [],
        "blog": [],
        "root": [],
        "mid": [],
        "deep": [],
        "other": [],
    }
    for url in sitemap_urls:
        parsed = urlparse(url)
        path = parsed.path.lower()
        depth = len([segment for segment in parsed.path.split("/") if segment])
        if parsed.query:
            buckets["query"].append(url)
        elif any(token in path for token in CONTACT_PATH_KEYWORDS):
            buckets["contact"].append(url)
        elif any(token in path for token in BLOG_PATH_KEYWORDS):
            buckets["blog"].append(url)
        elif depth <= 1:
            buckets["root"].append(url)
        elif depth == 2:
            buckets["mid"].append(url)
        elif depth >= 3:
            buckets["deep"].append(url)
        else:
            buckets["other"].append(url)

    quotas = {
        "contact": 2,
        "query": 2,
        "blog": 3,
        "root": 4,
        "mid": max(6, sample_size // 2),
        "deep": max(6, sample_size // 2),
        "other": 4,
    }
    for bucket_name in ("contact", "query", "blog", "root", "mid", "deep", "other"):
        for url in buckets[bucket_name][: quotas[bucket_name]]:
            add(url)

    for bucket_name in ("contact", "query", "blog", "root", "mid", "deep", "other"):
        for url in buckets[bucket_name]:
            if len(selected) >= sample_size + 10:
                break
            add(url)

    return selected[: sample_size + 10]


def infer_issue_owner(issue: AuditIssue) -> str:
    haystack = f"{issue.title} {issue.recommendation}".lower()
    if any(token in haystack for token in ("robots", "sitemap", "redirect", "canonical", "query-url", "route", "host")):
        return "Backend / SEO"
    if any(token in haystack for token in ("schema", "json", "title", "description", "h1", "alt", "image", "snippet")):
        return "Frontend / SEO"
    if any(token in haystack for token in ("контакт", "lead", "cta", "content", "faq", "перелинков")):
        return "SEO / Marketing"
    return "SEO"


def build_priority_matrix(audit: dict) -> list[dict]:
    rows: list[dict] = []
    severity_base = {
        "Critical": (10, 9, 10),
        "High": (8, 7, 8),
        "Medium": (6, 5, 6),
        "Low": (3, 3, 4),
    }
    for issue in audit.get("issues", [])[:8]:
        impact, risk, business = severity_base.get(issue.severity, (4, 4, 4))
        haystack = f"{issue.title} {issue.recommendation}".lower()
        if any(token in haystack for token in ("robots", "sitemap", "индекса", "canonical", "redirect")):
            impact = min(10, impact + 1)
        if any(token in haystack for token in ("title", "description", "ctr", "snippet", "schema")):
            business = min(10, business + 1)
        if any(token in haystack for token in ("контакт", "lead", "route", "query-url")):
            risk = min(10, risk + 1)
        rows.append(
            {
                "problem": issue.title,
                "severity": issue.severity,
                "impact": impact,
                "risk": risk,
                "business": business,
                "total": impact + risk + business,
                "owner": infer_issue_owner(issue),
            }
        )
    return rows


def build_critical_errors(audit: dict) -> list[dict]:
    return [asdict(issue) for issue in audit.get("issues", []) if issue.severity in ("Critical", "High")][:4]


def build_quick_wins(audit: dict) -> list[dict]:
    quick_wins: list[dict] = []
    issue_titles = {issue.title for issue in audit.get("issues", [])}

    if any("robots.txt" in title for title in issue_titles):
        quick_wins.append(
            {
                "title": "Починить конфликт robots.txt и sitemap.xml",
                "effort": "10-20 минут",
                "impact": "Снимет конфликт сигналов для Яндекса и Google",
                "action": "Убрать запрет на sitemap.xml и оставить одну корректную директиву Sitemap.",
            }
        )

    if any("redirect" in title.lower() for title in issue_titles):
        quick_wins.append(
            {
                "title": "Свести доменные редиректы к одному шагу",
                "effort": "15-30 минут",
                "impact": "Уберет лишнюю задержку и технический шум на входе",
                "action": "Оставить единый 301 сразу на канонический HTTPS-домен без промежуточных хопов.",
            }
        )

    weak_contacts = audit.get("weak_contact_pages", [])
    if weak_contacts:
        quick_wins.append(
            {
                "title": "Нормально оформить контакты и лид-страницы",
                "effort": "30-60 минут",
                "impact": "Поднимет доверие, брендовый запрос и конверсию",
                "action": "Добавить H1, title, description, canonical и блоки доверия на страницу контактов/формы.",
            }
        )

    if audit.get("invalid_schema_count", 0):
        quick_wins.append(
            {
                "title": "Исправить битую JSON-LD разметку",
                "effort": "15-40 минут",
                "impact": "Вернет валидную structured data в индекс",
                "action": "Проверить синтаксис JSON-LD и пересобрать проблемные блоки schema на ключевых страницах.",
            }
        )

    if audit.get("title_missing_count", 0) or audit.get("description_missing_count", 0):
        quick_wins.append(
            {
                "title": "Закрыть дыры в title и description",
                "effort": "1-2 часа",
                "impact": "Даст быстрый прирост управляемости сниппетов",
                "action": "Дописать шаблоны генерации title/description для страниц без SEO-обвязки.",
            }
        )

    if audit.get("indexable_query_count", 0):
        quick_wins.append(
            {
                "title": "Разрулить индексируемые query и route URL",
                "effort": "30-90 минут",
                "impact": "Сократит шум в индексе и освободит crawl budget",
                "action": "Закрыть служебные query-страницы от индексации или перевести их на чистые SEO-friendly URL.",
            }
        )

    if audit.get("total_missing_alt", 0):
        quick_wins.append(
            {
                "title": "Запустить шаблон alt для изображений",
                "effort": "1-2 часа",
                "impact": "Усилит image SEO и понятность карточек",
                "action": "Собрать правила alt по типу страницы, товару, категории и ключевой сущности изображения.",
            }
        )

    return quick_wins[:6]


def build_strategic_moves(audit: dict) -> list[dict]:
    profile = infer_project_profile(audit)
    moves = [
        {
            "title": "Пересобрать шаблоны коммерческих страниц как growth-layer",
            "impact": "Высокое",
            "effort": "5-10 дней",
            "details": "Собрать единые требования к H1, title, description, canonical, FAQ, CTA, trust-блокам и перелинковке по всем ключевым типам страниц.",
        },
        {
            "title": "Сделать управляемую архитектуру индексации",
            "impact": "Высокое",
            "effort": "3-7 дней",
            "details": "Разделить sitemap по типам страниц, зачистить служебные route/query URL и настроить единый контроль над каноническими доменами и редиректами.",
        },
        {
            "title": "Усилить structured data и entity-сигналы",
            "impact": "Среднее / высокое",
            "effort": "2-5 дней",
            "details": "Покрыть ключевые страницы валидной schema-разметкой и собрать данные так, чтобы сайт был понятнее обычной и ИИ-выдаче.",
        },
    ]
    if profile["is_catalog"]:
        moves.append(
            {
                "title": "Развить спросовые кластеры через категории и карточки",
                "impact": "Высокое",
                "effort": "2-4 недели",
                "details": "Собрать отдельные посадочные под главные кластеры спроса, усилить категории FAQ и ответами на выбор, а карточки сделать более конверсионными.",
            }
        )
    else:
        moves.append(
            {
                "title": "Развести услуги по отдельным SEO-посадочным",
                "impact": "Высокое",
                "effort": "1-3 недели",
                "details": "Вынести ключевые интенты в самостоятельные посадочные страницы и связать их перелинковкой, кейсами, FAQ и экспертными блоками.",
            }
        )
    return moves


def build_phase_sections(audit: dict) -> list[dict]:
    sample_pages: list[PageSnapshot] = audit["sample_pages"]
    page_type_counter = Counter(page.page_type for page in sample_pages)
    status_counter = Counter(page.status_code for page in sample_pages)
    schema_counter = Counter(
        schema_type
        for page in sample_pages
        for schema_type in page.schema_types
        if schema_type and schema_type != "Invalid JSON-LD"
    )
    contact_pages = get_contact_related_pages(sample_pages)
    query_pages = get_indexable_query_pages(sample_pages)
    invalid_schema_pages = [page for page in sample_pages if "Invalid JSON-LD" in page.schema_types]
    missing_title_pages = [page for page in sample_pages if not page.title]
    missing_description_pages = [page for page in sample_pages if not page.description]
    missing_h1_pages = [page for page in sample_pages if not page.h1s]
    low_link_pages = sorted(sample_pages, key=lambda page: page.internal_links)[:3]
    long_path_pages = [page for page in sample_pages if len(urlparse(page.url).path) > 75]
    thin_pages = [page for page in sample_pages if 0 < page.word_count < 250]
    weak_contact_pages = []
    for page in contact_pages:
        gaps = []
        if not page.h1s:
            gaps.append("H1")
        if not page.title:
            gaps.append("title")
        if not page.description:
            gaps.append("description")
        if not page.canonical:
            gaps.append("canonical")
        if gaps:
            weak_contact_pages.append({"url": page.url, "missing": gaps})
    audit["weak_contact_pages"] = weak_contact_pages
    audit["invalid_schema_count"] = len(invalid_schema_pages)
    audit["title_missing_count"] = len(missing_title_pages)
    audit["description_missing_count"] = len(missing_description_pages)
    audit["indexable_query_count"] = len(query_pages)

    average_internal_links = round(statistics.mean([page.internal_links for page in sample_pages]), 1) if sample_pages else 0
    total_lazy_gaps = sum(page.lazy_missing_count for page in sample_pages)
    total_dimension_gaps = sum(page.missing_dimensions_count for page in sample_pages)
    commercial_pages = [
        page
        for page in sample_pages
        if page.page_type in ("Главная", "Категория", "Подкатегория", "Товар", "Внутренняя") or page.has_forms
    ]
    missing_schema_commercial = [page for page in commercial_pages if not page.schema_types]
    average_commercial_words = (
        round(statistics.mean([page.word_count for page in commercial_pages if page.word_count]), 1)
        if commercial_pages
        else 0
    )

    return [
        {
            "title": "Этап 1 — Crawl & Indexability",
            "intro": "Проверяю, насколько чисто сайт отдает поисковикам сигналы для обхода и индексации.",
            "checks": [
                {
                    "name": "robots.txt и карта сайта",
                    "checked": "Доступность robots.txt, директивы, sitemap, чистота сигналов для робота.",
                    "method": "HTTP-запрос + разбор robots.txt и XML sitemap.",
                    "metrics": [
                        ("robots.txt", f"{audit['robots_status']}"),
                        ("Уникальных URL в sitemap", str(audit["sitemap_url_count"])),
                        ("Всего записей в sitemap", str(audit.get("sitemap_total_entries", audit["sitemap_url_count"]))),
                        ("Файлов sitemap обработано", str(len(audit.get("processed_sitemaps", [])))),
                    ],
                    "findings": [
                        "Есть конфликт между robots.txt и sitemap.xml." if any("robots.txt" in issue.title for issue in audit["issues"]) else "Критичного конфликта между robots.txt и sitemap.xml в выборке не видно.",
                        "Карта сайта раздута дублями." if audit.get("sitemap_total_entries", 0) > audit["sitemap_url_count"] * 1.3 else "Сильного раздувания sitemap дублями в выборке не видно.",
                        "Есть llms.txt, значит сайт уже можно дожимать и под ИИ-видимость." if audit.get("llms_exists") else "Отдельного llms.txt не найдено.",
                    ],
                    "priority": "HIGH" if any(issue.severity == "Critical" for issue in audit["issues"]) else "MEDIUM",
                    "owner": "Backend / SEO",
                    "recommendation": "Синхронизировать robots.txt, sitemap и канонический домен так, чтобы робот видел один непротиворечивый сценарий обхода.",
                },
                {
                    "name": "Статус-коды, редиректы и каноникализация",
                    "checked": "HTTP-коды ключевых URL, доменные редиректы, покрытие canonical.",
                    "method": "HTTP-проверка доменных вариантов + парсинг rel=canonical по выборке страниц.",
                    "metrics": [
                        ("Страниц 200 в выборке", str(status_counter.get(200, 0))),
                        ("Redirect-цепочек > 1 шага", str(len([item for item in audit["redirect_checks"] if len(item["chain"]) > 1]))),
                        ("Canonical coverage", f"{math.floor(audit['canonical_coverage_ratio'] * 100)}%"),
                        ("Индексируемых query-URL", str(len(query_pages))),
                    ],
                    "findings": [
                        f"В выборке {status_counter.get(200, 0)} страниц отвечают кодом 200." if status_counter else "Статус-коды в выборке проверить не удалось.",
                        "Есть лишняя redirect-цепочка на доменных вариантах." if any("redirect" in issue.title.lower() for issue in audit["issues"]) else "Лишних доменных redirect-цепочек в ключевых вариантах не обнаружено.",
                        "Есть индексируемые query- или route-URL, которые лучше почистить." if query_pages else "Шума от индексируемых query-страниц в выборке почти нет.",
                    ],
                    "priority": "HIGH" if query_pages else "MEDIUM",
                    "owner": "Backend / SEO",
                    "recommendation": "Свести все доменные варианты к одному канону и либо закрыть служебные URL от индексации, либо перевести их на чистые SEO-friendly маршруты.",
                },
            ],
        },
        {
            "title": "Этап 2 — Архитектура и внутренняя структура",
            "intro": "Смотрю, насколько понятна архитектура сайта и как распределяются ссылки внутри выборки.",
            "checks": [
                {
                    "name": "Типы страниц и покрытие выборки",
                    "checked": "Какие типы URL реально попали в разбор и как сайт дробит спрос.",
                    "method": "Классификация URL по глубине, query-параметрам и типам schema.",
                    "metrics": [
                        ("Главная", str(page_type_counter.get("Главная", 0))),
                        ("Категории / подкатегории", str(page_type_counter.get("Категория", 0) + page_type_counter.get("Подкатегория", 0))),
                        ("Внутренние страницы", str(page_type_counter.get("Внутренняя", 0))),
                        ("Служебные URL", str(page_type_counter.get("Служебная", 0))),
                    ],
                    "findings": [
                        "Выборка уже покрывает разные уровни структуры, поэтому видно не только главную, но и шаблоны внутренних страниц.",
                        "В архитектуре есть служебные или route-страницы, которые смешиваются с коммерческими URL." if page_type_counter.get("Служебная", 0) else "Явного давления служебных URL на выборку почти нет.",
                        f"Длинных путей в выборке: {len(long_path_pages)}." if long_path_pages else "Сильного перекоса в сторону слишком длинных URL в выборке не видно.",
                    ],
                    "priority": "MEDIUM",
                    "owner": "SEO / Backend",
                    "recommendation": "Держать архитектуру спроса отдельной от служебной логики и не смешивать route/query URL с посадочными и коммерческими страницами.",
                },
                {
                    "name": "Внутренняя перелинковка и видимость ключевых страниц",
                    "checked": "Сколько внутренних ссылок получают страницы и где есть просадки по вниманию сайта.",
                    "method": "Подсчет внутренних ссылок на каждой странице выборки.",
                    "metrics": [
                        ("Среднее число внутренних ссылок", str(average_internal_links)),
                        ("Минимум внутренних ссылок", str(low_link_pages[0].internal_links if low_link_pages else 0)),
                        ("Максимум внутренних ссылок", str(max([page.internal_links for page in sample_pages], default=0))),
                        ("Контактных/lead-страниц", str(len(contact_pages))),
                    ],
                    "findings": [
                        f"Слабее всего по внутренним ссылкам выглядят: {', '.join(human_path(page.url) for page in low_link_pages if page.url)}." if low_link_pages else "Слабые страницы по перелинковке не выделяются.",
                        "Контактные страницы есть, но часть из них недооформлена как полноценные SEO-посадки." if weak_contact_pages else "Контактная зона в выборке выглядит цельно.",
                        "Разумно добавить больше контекстных ссылок между близкими услугами, кейсами, блогом и лид-страницами.",
                    ],
                    "priority": "MEDIUM",
                    "owner": "SEO / Marketing",
                    "recommendation": "Усилить перелинковку вокруг приоритетных услуг и лид-страниц: связать спросовые страницы, кейсы, FAQ и CTA, а не надеяться только на меню и футер.",
                },
            ],
        },
        {
            "title": "Этап 3 — On-Page SEO",
            "intro": "Разбираю шаблоны title, description, H1 и то, насколько страницы готовы к нормальному сниппету.",
            "checks": [
                {
                    "name": "Title и meta description",
                    "checked": "Покрытие, длина и пригодность сниппетов к управляемой выдаче.",
                    "method": "Парсинг title и meta description по репрезентативной выборке страниц.",
                    "metrics": [
                        ("Title > 70 символов", str(len([page for page in sample_pages if len(page.title) > 70]))),
                        ("Title отсутствует", str(len(missing_title_pages))),
                        ("Description отсутствует", str(len(missing_description_pages))),
                        ("Description вне диапазона", str(len([page for page in sample_pages if len(page.description) > 160 or (0 < len(page.description) < 120)]))),
                    ],
                    "findings": [
                        "Шаблоны title на части страниц перегружены по длине." if any("title" in issue.title.lower() for issue in audit["issues"]) else "Критической ямы по title в выборке не видно.",
                        "Есть страницы без description, из-за чего сниппет будет собираться случайно." if missing_description_pages else "Description покрыты достаточно ровно.",
                        f"Пустой title найден на: {', '.join(human_path(page.url) for page in missing_title_pages[:3])}." if missing_title_pages else "Пустых title в выборке почти нет.",
                    ],
                    "priority": "HIGH",
                    "owner": "SEO / Frontend",
                    "recommendation": "Пересобрать правила генерации title и description под каждый тип страницы: коротко, конкретно, с ключом, оффером и контролем длины.",
                },
                {
                    "name": "H1, контентный каркас и тонкие страницы",
                    "checked": "Наличие H1, плотность текстового слоя и качество базового on-page каркаса.",
                    "method": "Парсинг H1 и подсчет слов в видимом контенте.",
                    "metrics": [
                        ("H1 coverage", f"{math.floor(audit['h1_coverage_ratio'] * 100)}%"),
                        ("Страниц без H1", str(len(missing_h1_pages))),
                        ("Среднее число слов", str(audit.get("average_words", 0))),
                        ("Тонких страниц (<250 слов)", str(len(thin_pages))),
                    ],
                    "findings": [
                        "У части страниц нет H1, поэтому поисковику сложнее понять главный интент URL." if missing_h1_pages else "По H1 каркас у выборки в целом собран неплохо.",
                        "Есть тонкие страницы с минимальным текстовым слоем." if thin_pages else "Сильно пустых страниц в выборке немного.",
                        "Даже при нормальном объеме текста нужно отдельно проверить, насколько хорошо он поддерживает коммерческий интент и FAQ-слой.",
                    ],
                    "priority": "MEDIUM",
                    "owner": "SEO / Content",
                    "recommendation": "На каждом ключевом URL закрепить понятный H1, интро, ответы на частые вопросы и короткие коммерческие блоки, чтобы страница работала не только на индекс, но и на конверсию.",
                },
            ],
        },
        {
            "title": "Этап 4 — Performance и CWV",
            "intro": "Смотрю на скорость ответа, вес HTML и то, как медиа-слой может мешать загрузке.",
            "checks": [
                {
                    "name": "Ответ сервера и вес страниц",
                    "checked": "TTFB-подобная скорость ответа и примерный вес HTML по выборке.",
                    "method": "HTTP-ответы по ключевым URL без отдельного Lighthouse-прогона.",
                    "metrics": [
                        ("Средний ответ", f"{audit.get('average_response_ms', 0)} ms"),
                        ("Средний HTML", f"{audit.get('average_html_kb', 0)} KB"),
                        ("Максимум изображений на странице", str(max([page.image_count for page in sample_pages], default=0))),
                        ("Страниц в выборке", str(len(sample_pages))),
                    ],
                    "findings": [
                        "Скорость ответа сервера сама по себе не выглядит главным стоп-фактором." if audit.get("average_response_ms", 0) < 600 else "Средний ответ уже стоит держать в зоне внимания.",
                        "Реальные риски здесь чаще сидят в медиа-слое, шаблонах и клиентском рендеринге, чем в голом TTFB.",
                    ],
                    "priority": "MEDIUM",
                    "owner": "Frontend / Backend",
                    "recommendation": "Проверить приоритетные страницы отдельным CWV-прогоном и зафиксировать LCP/CLS/INP после чистки медиа и шаблонов.",
                },
                {
                    "name": "Изображения, lazy loading и атрибуты размеров",
                    "checked": "Насколько медиа-слой помогает или мешает SEO и стабильности верстки.",
                    "method": "Парсинг img-тегов по репрезентативной выборке страниц.",
                    "metrics": [
                        ("Всего пропусков alt", str(audit.get("total_missing_alt", 0))),
                        ("Пропусков lazy loading", str(total_lazy_gaps)),
                        ("Изображений без width/height", str(total_dimension_gaps)),
                        ("Изображений на главной", str(audit["home_page"].image_count)),
                    ],
                    "findings": [
                        "Изображения уже теряют SEO-сигналы из-за пропусков alt." if audit.get("total_missing_alt", 0) else "Массового провала по alt в выборке не видно.",
                        "Отсутствие width/height повышает риск CLS и визуальной нестабильности." if total_dimension_gaps else "Атрибуты размеров на картинках в целом присутствуют.",
                        "Lazy loading стоит выровнять шаблонно, а не править вручную по одной странице." if total_lazy_gaps else "Явной массовой проблемы по lazy loading в выборке не видно.",
                    ],
                    "priority": "MEDIUM",
                    "owner": "Frontend / SEO",
                    "recommendation": "Сделать единый image-шаблон: alt, width/height, lazy loading и, при необходимости, отдельную image-схему/карту сайта.",
                },
            ],
        },
        {
            "title": "Этап 5 — Structured Data",
            "intro": "Проверяю, насколько хорошо сайт объясняет поисковику сущности бизнеса, страниц и предложений.",
            "checks": [
                {
                    "name": "Покрытие schema-разметкой",
                    "checked": "Какие типы schema реально встречаются и насколько широко они покрывают выборку.",
                    "method": "Парсинг application/ld+json и сбор @type по ключевым URL.",
                    "metrics": [
                        ("Schema coverage", f"{math.floor(audit['schema_coverage_ratio'] * 100)}%"),
                        ("Страниц с битой JSON-LD", str(len(invalid_schema_pages))),
                        ("Страниц без schema", str(len([page for page in sample_pages if not page.schema_types]))),
                        ("Топ schema types", ", ".join(f"{name} ({count})" for name, count in schema_counter.most_common(3)) or "нет"),
                    ],
                    "findings": [
                        "Есть страницы с невалидной JSON-LD." if invalid_schema_pages else "Явных поломок JSON-LD в выборке не видно.",
                        "Часть коммерческих страниц пока без schema-разметки." if missing_schema_commercial else "Коммерческие страницы в выборке уже неплохо покрыты schema.",
                        "Даже при наличии schema важно, чтобы она соответствовала типу страницы и была валидной по синтаксису.",
                    ],
                    "priority": "HIGH" if invalid_schema_pages else "MEDIUM",
                    "owner": "Frontend / SEO",
                    "recommendation": "Покрыть ключевые шаблоны валидной schema-разметкой и держать ее синхронной с реальным типом страницы: Organization, Service, Product, BreadcrumbList, FAQ, Article.",
                },
            ],
        },
        {
            "title": "Этап 6 — Коммерческие страницы и контент",
            "intro": "Смотрю, насколько сайт готов не только собирать индекс, но и превращать спрос в заявку.",
            "checks": [
                {
                    "name": "Контактные и лид-страницы",
                    "checked": "Есть ли на сайте страницы, которые можно продвигать как точки входа в заявку.",
                    "method": "Поиск форм, контактных URL и базовой SEO-обвязки этих страниц.",
                    "metrics": [
                        ("Контактных/lead-страниц", str(len(contact_pages))),
                        ("Форм в выборке", str(len([page for page in sample_pages if page.has_forms]))),
                        ("Слабых contact-страниц", str(len(weak_contact_pages))),
                        ("Индексируемых route/query-страниц", str(len(query_pages))),
                    ],
                    "findings": [
                        "Контактная зона уже есть, но часть страниц не оформлена как полноценные SEO-посадки." if weak_contact_pages else "Контактные страницы в выборке выглядят собранно.",
                        "Есть формы, но нужно проверять, насколько вокруг них собран доверительный и коммерческий слой.",
                        "Служебные query/route URL не должны конкурировать с нормальными посадочными страницами." if query_pages else "Шума от служебных лид-URL в выборке немного.",
                    ],
                    "priority": "HIGH",
                    "owner": "SEO / Marketing",
                    "recommendation": "Сделать из контактов и заявки сильные посадочные: с оффером, ответами на возражения, блоками доверия, FAQ и аккуратной SEO-обвязкой.",
                },
                {
                    "name": "Контентная глубина приоритетных страниц",
                    "checked": "Хватает ли страницам фактуры, чтобы закрывать интент, а не просто существовать в индексе.",
                    "method": "Подсчет слов и просмотр коммерческих шаблонов внутри репрезентативной выборки.",
                    "metrics": [
                        ("Коммерческих страниц в выборке", str(len(commercial_pages))),
                        ("Среднее число слов", str(average_commercial_words)),
                        ("Тонких страниц", str(len(thin_pages))),
                        ("Страниц без schema среди коммерческих", str(len(missing_schema_commercial))),
                    ],
                    "findings": [
                        "Одного объема текста недостаточно: страницы должны объяснять выбор, цену, процесс, сроки и следующий шаг.",
                        "Часть страниц остается тонкой по фактуре." if thin_pages else "Сильно пустых коммерческих страниц в выборке немного.",
                        "Потенциал роста лежит не только в SEO-текстах, но и в блоках доверия, FAQ, таблицах сравнения и ответах на спрос.",
                    ],
                    "priority": "MEDIUM",
                    "owner": "SEO / Content / Marketing",
                    "recommendation": "Пересобрать приоритетные посадочные под коммерческий интент: добавить доказательства, FAQ, answer-first блоки, цены/сценарии и перелинковку на соседние точки спроса.",
                },
            ],
        },
    ]


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
        urljoin(f"{base_url}/", "contacts"),
        urljoin(f"{base_url}/", "index.php?route=information/contactform"),
        *home_links[:10],
    ]
    unique_urls = select_representative_urls(
        base_url,
        preferred_urls,
        sitemap_urls,
        max(sample_size, 18),
    )
    snapshots = [analyse_page(session, item, base_domain) for item in unique_urls]
    html_pages = [snapshot for snapshot in snapshots if snapshot.status_code == 200 and "html" in snapshot.content_type]

    title_long = [snapshot for snapshot in html_pages if len(snapshot.title) > 70]
    description_problem = [
        snapshot for snapshot in html_pages if len(snapshot.description) > 160 or (0 < len(snapshot.description) < 120)
    ]
    schema_pages = [snapshot for snapshot in html_pages if snapshot.schema_types]
    h1_pages = [snapshot for snapshot in html_pages if snapshot.h1s]
    canonical_pages = [snapshot for snapshot in html_pages if snapshot.canonical]
    total_missing_alt = sum(snapshot.missing_alt_count for snapshot in html_pages)
    redirect_checks = analyze_redirects(session, base_url)
    company = company_name or re.sub(r"^www\.", "", base_domain)

    audit = {
        "generator_version": 2,
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
        "home_links_count": len(home_links),
        "sample_pages": html_pages,
        "raw_sampled_urls": unique_urls,
        "title_long_ratio": (len(title_long) / len(html_pages)) if html_pages else 0,
        "description_problem_ratio": (len(description_problem) / len(html_pages)) if html_pages else 0,
        "schema_coverage_ratio": (len(schema_pages) / len(html_pages)) if html_pages else 0,
        "h1_coverage_ratio": (len(h1_pages) / len(html_pages)) if html_pages else 0,
        "canonical_coverage_ratio": (len(canonical_pages) / len(html_pages)) if html_pages else 0,
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
    issues = dynamic_build_issue_list(audit)
    audit["issues"] = issues
    audit["strengths"] = dynamic_build_strengths(audit)
    audit["growth_points"] = dynamic_build_growth_points(audit)
    audit["roadmap"] = dynamic_build_roadmap(audit)
    audit["priority_matrix"] = build_priority_matrix(audit)
    audit["critical_errors"] = build_critical_errors(audit)
    audit["phase_sections"] = build_phase_sections(audit)
    audit["quick_wins"] = build_quick_wins(audit)
    audit["strategic_moves"] = build_strategic_moves(audit)
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


def add_priority_matrix_table(doc: Document, rows: list[dict]) -> None:
    if not rows:
        return
    table = doc.add_table(rows=1, cols=7)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    remove_table_borders(table)
    headers = ["Проблема", "Impact", "Risk", "Business", "Итог", "Приоритет", "Ответственный"]
    for idx, header in enumerate(headers):
        cell = table.rows[0].cells[idx]
        set_cell_shading(cell, BRAND_DARK)
        set_cell_margins(cell, 80, 70, 80, 70)
        paragraph = cell.paragraphs[0]
        paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = paragraph.add_run(header)
        set_font(run, size=8.7, bold=True, color="FFFFFF")
    for row_data in rows:
        row = table.add_row().cells
        values = [
            row_data.get("problem", ""),
            str(row_data.get("impact", "")),
            str(row_data.get("risk", "")),
            str(row_data.get("business", "")),
            str(row_data.get("total", "")),
            row_data.get("severity", ""),
            row_data.get("owner", ""),
        ]
        for idx, value in enumerate(values):
            cell = row[idx]
            set_cell_shading(cell, BRAND_SOFT if idx % 2 == 0 else "FFFFFF")
            set_cell_margins(cell, 70, 70, 70, 70)
            paragraph = cell.paragraphs[0]
            if idx in (1, 2, 3, 4):
                paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
            run = paragraph.add_run(value)
            set_font(run, size=8.9, color=BRAND_TEXT)


def add_metrics_list(container, metrics: list[tuple[str, str]]) -> None:
    for label, value in metrics:
        paragraph = container.add_paragraph()
        paragraph.paragraph_format.space_after = Pt(2)
        key_run = paragraph.add_run(f"{label}: ")
        set_font(key_run, size=10.1, bold=True, color=BRAND_TEXT)
        value_run = paragraph.add_run(value)
        set_font(value_run, size=10.1, color=BRAND_MUTED)


def add_phase_sections_doc(doc: Document, phase_sections: list[dict]) -> None:
    for section in phase_sections:
        add_section_heading(doc, "Глубокий разбор", section.get("title", ""), section.get("intro"))
        for idx, check in enumerate(section.get("checks", []), start=1):
            card = doc.add_table(rows=2, cols=1)
            card.alignment = WD_TABLE_ALIGNMENT.CENTER
            remove_table_borders(card)
            head = card.rows[0].cells[0]
            body = card.rows[1].cells[0]
            set_cell_shading(head, BRAND_SOFT)
            set_cell_shading(body, "FFFFFF")
            set_cell_margins(head, 90, 110, 80, 110)
            set_cell_margins(body, 100, 110, 110, 110)
            title_run = head.paragraphs[0].add_run(f"{idx}. {check.get('name', '')}")
            set_font(title_run, size=11.4, bold=True, color=BRAND_TEXT)

            add_text_paragraph(body, f"Что проверялось: {check.get('checked', '')}", size=10.7, color=BRAND_TEXT, space_after=3)
            add_text_paragraph(body, f"Как проверялось: {check.get('method', '')}", size=10.5, color=BRAND_MUTED, space_after=4)
            add_metrics_list(body, check.get("metrics", []))
            add_text_paragraph(body, "Что нашли:", size=10.5, bold=True, color=BRAND_TEXT, space_after=3)
            add_bullet_list(body, check.get("findings", []), size=10.4)
            add_text_paragraph(
                body,
                f"Приоритет: {check.get('priority', '')}  |  Ответственный: {check.get('owner', '')}",
                size=10.2,
                bold=True,
                color=BRAND_ORANGE,
                space_after=3,
            )
            add_text_paragraph(body, f"Что делать: {check.get('recommendation', '')}", size=10.4, color=BRAND_TEXT, bold=True, space_after=4)
            doc.add_paragraph().paragraph_format.space_after = Pt(4)


def add_action_cards_doc(doc: Document, items: list[dict], value_key: str, extra_key: str) -> None:
    if not items:
        return
    for item in items:
        card = doc.add_table(rows=2, cols=1)
        card.alignment = WD_TABLE_ALIGNMENT.CENTER
        remove_table_borders(card)
        head = card.rows[0].cells[0]
        body = card.rows[1].cells[0]
        set_cell_shading(head, BRAND_ACCENT_SOFT)
        set_cell_shading(body, "FFFFFF")
        set_cell_margins(head, 90, 110, 80, 110)
        set_cell_margins(body, 100, 110, 110, 110)
        title_run = head.paragraphs[0].add_run(item.get("title", ""))
        set_font(title_run, size=11.2, bold=True, color=BRAND_TEXT)
        add_text_paragraph(body, f"{value_key.capitalize()}: {item.get(value_key.lower(), item.get(value_key, ''))}", size=10.2, color=BRAND_ORANGE, bold=True, space_after=2)
        add_text_paragraph(body, f"{extra_key.capitalize()}: {item.get(extra_key.lower(), item.get(extra_key, ''))}", size=10.2, color=BRAND_MUTED, bold=True, space_after=3)
        main_text = item.get("action") or item.get("details") or ""
        add_text_paragraph(body, main_text, size=10.5, color=BRAND_TEXT, space_after=4)
        doc.add_paragraph().paragraph_format.space_after = Pt(4)


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


def add_screenshot_gallery(doc: Document, screenshots: list[dict]) -> None:
    if not screenshots:
        return
    add_section_heading(
        doc,
        "Скриншоты",
        "Автоскриншоты ключевых страниц",
        "Эти изображения помогают быстро увидеть контекст: как выглядит главная, контакты, категория и карточка товара в момент аудита.",
    )
    for screenshot in screenshots:
        image_path = Path(screenshot["path"])
        if not image_path.exists():
            continue
        card = doc.add_table(rows=2, cols=1)
        card.alignment = WD_TABLE_ALIGNMENT.CENTER
        remove_table_borders(card)
        head = card.rows[0].cells[0]
        body = card.rows[1].cells[0]
        set_cell_shading(head, BRAND_SOFT)
        set_cell_shading(body, "FFFFFF")
        set_cell_margins(head, 90, 110, 80, 110)
        set_cell_margins(body, 110, 110, 110, 110)
        title_run = head.paragraphs[0].add_run(f"{screenshot.get('label', 'Страница')}  |  {shorten_path(screenshot.get('url', ''), 72)}")
        set_font(title_run, size=10.6, bold=True, color=BRAND_TEXT)
        picture_run = body.paragraphs[0].add_run()
        picture_run.add_picture(str(image_path), width=Inches(6.25))
        doc.add_paragraph().paragraph_format.space_after = Pt(4)


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
        "Ниже не просто список замечаний, а концентрат тех зон, которые сильнее всего влияют на индекс, сниппеты, спрос и конверсию.",
    )
    for paragraph in build_executive_summary_dynamic(audit):
        add_text_paragraph(doc, paragraph, size=11.4, color=BRAND_TEXT, space_after=6)
    add_metric_grid(doc, audit)

    add_section_heading(doc, "Сильные стороны", "Что уже работает в плюс проекту")
    add_bullet_list(doc, audit["strengths"], size=11.1)

    add_section_heading(
        doc,
        "Таблица приоритетов",
        "Матрица проблем по влиянию на рост",
        "Здесь задачи не просто перечислены, а разложены по impact, risk и business-effect, чтобы было понятно, что делать первым.",
    )
    add_priority_matrix_table(doc, audit.get("priority_matrix", []))

    add_section_heading(
        doc,
        "Критические ошибки",
        "Что сейчас реально блокирует рост",
        "Это не весь backlog, а ограничения, которые первыми режут индекс, сниппеты, crawl budget и способность сайта забирать спрос.",
    )
    critical_issue_cards = [AuditIssue(**item) for item in audit.get("critical_errors", [])] or audit["issues"][:4]
    add_issue_cards(doc, critical_issue_cards)

    add_section_heading(
        doc,
        "Фазы аудита",
        "Глубокий разбор по ключевым слоям сайта",
        "Ниже аудит разобран по этапам, чтобы было видно не только список ошибок, но и реальную логику проверки проекта.",
    )
    add_phase_sections_doc(doc, audit.get("phase_sections", []))

    add_section_heading(
        doc,
        "Quick wins",
        "Быстрые победы на ближайший спринт",
        "Эти правки можно внедрить быстро и получить заметный эффект без большой перестройки проекта.",
    )
    add_action_cards_doc(doc, audit.get("quick_wins", []), "effort", "impact")

    add_section_heading(
        doc,
        "Стратегические улучшения",
        "Что усилит проект поверх базовых фиксов",
        "Это уже не тушение пожара, а слой изменений, который превращает сайт в более сильный источник заявок и роста видимости.",
    )
    add_action_cards_doc(doc, audit.get("strategic_moves", []), "impact", "effort")

    add_section_heading(doc, "Точки роста", "Куда масштабировать проект после фиксов")
    add_bullet_list(doc, audit["growth_points"], size=11.1)

    add_section_heading(
        doc,
        "Roadmap",
        "План внедрения на 60 дней",
        "Порядок выстроен так, чтобы сначала снять технические стоп-факторы, потом усилить шаблоны и только после этого наращивать слой роста.",
    )
    add_roadmap_table(doc, audit["roadmap"])

    add_section_heading(
        doc,
        "Приложение",
        "Какие страницы реально легли в основу разбора",
        "Это не случайная выборка: сюда собраны главная, коммерческие, контактные, служебные и глубинные URL, по которым видно качество шаблонов проекта.",
    )
    add_snapshot_table(doc, audit["sample_pages"])

    output_path.parent.mkdir(parents=True, exist_ok=True)
    doc.save(str(output_path))


def serialize_audit(audit: dict) -> dict:
    payload = dict(audit)
    payload["home_page"] = asdict(audit["home_page"])
    payload["sample_pages"] = [asdict(item) for item in audit["sample_pages"]]
    payload["issues"] = [asdict(item) for item in audit["issues"]]
    payload["screenshots"] = audit.get("screenshots", [])
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
    parser.add_argument("--no-preview", action="store_true", help="Do not save HTML preview next to the DOCX")
    parser.add_argument("--no-pdf", action="store_true", help="Do not save PDF preview next to the DOCX")
    parser.add_argument("--no-screenshots", action="store_true", help="Deprecated: screenshots block has been removed from the audit")
    args = parser.parse_args()

    BRAND_NAME = args.brand

    target = normalize_base_url(args.url)
    today = datetime.now().strftime("%Y-%m-%d")
    output = Path(args.output) if args.output else Path("audits") / f"{slugify_for_filename(target)}-{today}.docx"

    audit = build_audit(target, args.company, args.sample_size)
    audit["screenshots"] = []
    logo_path = Path("public") / "android-chrome-512x512.png"
    generate_docx(audit, output, logo_path)
    audit_payload = serialize_audit(audit)
    if not args.no_json:
        json_path = output.with_suffix(".json")
        json_path.write_text(json.dumps(audit_payload, ensure_ascii=False, indent=2), encoding="utf-8")
    html_path = output.with_suffix(".html")
    pdf_path = output.with_suffix(".pdf")
    should_write_html = not args.no_preview or not args.no_pdf

    if should_write_html:
        write_preview_html(audit_payload, html_path)

    if not args.no_pdf:
        write_preview_pdf(html_path, pdf_path)
    print(f"Audit ready: {output}")


if __name__ == "__main__":
    main()
