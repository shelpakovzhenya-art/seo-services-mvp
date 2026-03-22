#!/usr/bin/env python
from __future__ import annotations

import argparse
from collections import Counter
from concurrent.futures import ThreadPoolExecutor, as_completed
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
        run = paragraph.add_run(f"вЂў {item}")
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
        return "Р“Р»Р°РІРЅР°СЏ"
    if "Product" in schema_types:
        return "РўРѕРІР°СЂ"
    if parsed.query:
        return "РЎР»СѓР¶РµР±РЅР°СЏ"
    segments = [segment for segment in parsed.path.split("/") if segment]
    if len(segments) == 1:
        return "РљР°С‚РµРіРѕСЂРёСЏ"
    if len(segments) == 2:
        return "РџРѕРґРєР°С‚РµРіРѕСЂРёСЏ"
    return "Р’РЅСѓС‚СЂРµРЅРЅСЏСЏ"


def analyse_page(session: requests.Session, url: str, base_domain: str) -> PageSnapshot:
    response, error = safe_get(session, url)
    if error or response is None:
        return PageSnapshot(
            url=url,
            page_type="РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё",
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
    product_pages = [snapshot for snapshot in sample_pages if snapshot.page_type == "РўРѕРІР°СЂ" or "Product" in snapshot.schema_types]
    category_pages = [snapshot for snapshot in sample_pages if snapshot.page_type in ("РљР°С‚РµРіРѕСЂРёСЏ", "РџРѕРґРєР°С‚РµРіРѕСЂРёСЏ")]
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
        evidence = [f"Р’ robots.txt РЅР°Р№РґРµРЅРѕ РїСЂР°РІРёР»Рѕ `{disallow_sitemap_lines[0]}`."]
        if sitemap_directive:
            evidence.append(f"РћРґРЅРѕРІСЂРµРјРµРЅРЅРѕ С„Р°Р№Р» СЃРѕРґРµСЂР¶РёС‚ `{sitemap_directive}`.")
        issues.append(
            AuditIssue(
                severity="Critical",
                title="robots.txt РєРѕРЅС„Р»РёРєС‚СѓРµС‚ СЃ РєР°СЂС‚РѕР№ СЃР°Р№С‚Р°",
                why_it_matters=(
                    "РљРѕРіРґР° robots.txt РѕРґРЅРѕРІСЂРµРјРµРЅРЅРѕ Р·Р°РїСЂРµС‰Р°РµС‚ sitemap.xml Рё СЃР°Рј Р¶Рµ СЃСЃС‹Р»Р°РµС‚СЃСЏ РЅР° РєР°СЂС‚Сѓ СЃР°Р№С‚Р°, "
                    "РїРѕРёСЃРєРѕРІРёРєРё РїРѕР»СѓС‡Р°СЋС‚ РєРѕРЅС„Р»РёРєС‚СѓСЋС‰РёР№ СЃРёРіРЅР°Р». Р­С‚Рѕ РјРµС€Р°РµС‚ С‡РёСЃС‚РѕР№ Рё РїСЂРµРґСЃРєР°Р·СѓРµРјРѕР№ РёРЅРґРµРєСЃР°С†РёРё."
                ),
                evidence=evidence,
                recommendation=(
                    "РЈР±СЂР°С‚СЊ Р·Р°РїСЂРµС‚ РЅР° sitemap.xml, РѕСЃС‚Р°РІРёС‚СЊ СЂР°Р±РѕС‡СѓСЋ РґРёСЂРµРєС‚РёРІСѓ Sitemap Рё СЃРёРЅС…СЂРѕРЅРёР·РёСЂРѕРІР°С‚СЊ robots.txt "
                    "СЃ РєР°РЅРѕРЅРёС‡РµСЃРєРёРј РґРѕРјРµРЅРѕРј РїСЂРѕРµРєС‚Р°."
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
        evidence = [f"РќР° `{human_path(snapshot.url)}` РЅРµ С…РІР°С‚Р°РµС‚: {', '.join(missing)}." for snapshot, missing in weak_contact_pages[:3]]
        issues.append(
            AuditIssue(
                severity="High",
                title="РљРѕРЅС‚Р°РєС‚РЅС‹Рµ Рё lead-СЃС‚СЂР°РЅРёС†С‹ РЅРµРґРѕРѕС„РѕСЂРјР»РµРЅС‹ РєР°Рє SEO-РїРѕСЃР°РґРѕС‡РЅС‹Рµ",
                why_it_matters=(
                    "РЎС‚СЂР°РЅРёС†С‹ РєРѕРЅС‚Р°РєС‚РѕРІ Рё Р·Р°СЏРІРѕРє СѓС‡Р°СЃС‚РІСѓСЋС‚ РЅРµ С‚РѕР»СЊРєРѕ РІ РєРѕРЅРІРµСЂСЃРёРё, РЅРѕ Рё РІ РґРѕРІРµСЂРёРё, Р±СЂРµРЅРґРѕРІРѕР№ РІС‹РґР°С‡Рµ "
                    "Рё РїРѕРЅРёРјР°РЅРёРё Р±РёР·РЅРµСЃР° РїРѕРёСЃРєРѕРІРёРєР°РјРё."
                ),
                evidence=evidence,
                recommendation=(
                    "РЎРѕР±СЂР°С‚СЊ РїРѕР»РЅРѕС†РµРЅРЅС‹Рµ СЃС‚СЂР°РЅРёС†С‹ РєРѕРЅС‚Р°РєС‚Р° Рё Р·Р°СЏРІРєРё: H1, title РґРѕ 70 СЃРёРјРІРѕР»РѕРІ, description 140вЂ“160 СЃРёРјРІРѕР»РѕРІ, "
                    "canonical, Р±Р»РѕРєРё РґРѕРІРµСЂРёСЏ, Р°РґСЂРµСЃР°, С‚РµР»РµС„РѕРЅС‹ Рё РїРѕРЅСЏС‚РЅС‹Р№ CTA."
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
            evidence.append(f"URL `{human_path(snapshot.url)}` РґРѕСЃС‚СѓРїРµРЅ РґР»СЏ РѕР±С…РѕРґР°, РЅРѕ РЅРµ С…РІР°С‚Р°РµС‚: {', '.join(missing)}.")
        issues.append(
            AuditIssue(
                severity="High",
                title="Р’ РІС‹Р±РѕСЂРєРµ РµСЃС‚СЊ РёРЅРґРµРєСЃРёСЂСѓРµРјС‹Рµ СЃР»СѓР¶РµР±РЅС‹Рµ РёР»Рё query-URL Р±РµР· РЅРѕСЂРјР°Р»СЊРЅРѕР№ SEO-РѕР±РІСЏР·РєРё",
                why_it_matters=(
                    "РЎР»СѓР¶РµР±РЅС‹Рµ route-СЃС‚СЂР°РЅРёС†С‹ Рё query-URL Р±РµР· title, description Рё H1 СЃРѕР·РґР°СЋС‚ С€СѓРј РІ РёРЅРґРµРєСЃРµ, "
                    "СЂР°Р·РјС‹РІР°СЋС‚ СЂРµР»РµРІР°РЅС‚РЅРѕСЃС‚СЊ Рё С‚СЂР°С‚СЏС‚ crawl budget."
                ),
                evidence=evidence,
                recommendation=(
                    "Р›РёР±Рѕ Р·Р°РєСЂС‹С‚СЊ С‚Р°РєРёРµ URL РѕС‚ РёРЅРґРµРєСЃР°С†РёРё Рё СѓР±СЂР°С‚СЊ РїСЂСЏРјС‹Рµ СЃСЃС‹Р»РєРё РЅР° РЅРёС…, Р»РёР±Рѕ РїРµСЂРµРІРµСЃС‚Рё РёС… РЅР° РЅРѕСЂРјР°Р»СЊРЅС‹Рµ SEO-friendly СЃС‚СЂР°РЅРёС†С‹ "
                    "СЃ РїРѕР»РЅРѕС†РµРЅРЅС‹Рј РјРµС‚Р°-РѕС„РѕСЂРјР»РµРЅРёРµРј."
                ),
            )
        )

    if problematic_titles:
        examples = [f"{human_path(snapshot.url)} вЂ” {len(snapshot.title)} СЃРёРјРІ." for snapshot in problematic_titles[:4]]
        issues.append(
            AuditIssue(
                severity="High",
                title="РќР° С‡Р°СЃС‚Рё СЃС‚СЂР°РЅРёС† title РІС‹С…РѕРґСЏС‚ Р·Р° СЂР°Р±РѕС‡СѓСЋ РґР»РёРЅСѓ",
                why_it_matters=(
                    "РЎР»РёС€РєРѕРј РґР»РёРЅРЅС‹Рµ title СЂРµР¶СѓС‚СЃСЏ РІ РІС‹РґР°С‡Рµ, СѓС…СѓРґС€Р°СЋС‚ CTR Рё СЃРЅРёР¶Р°СЋС‚ РєРѕРЅС‚СЂРѕР»СЊ РЅР°Рґ С‚РµРј, "
                    "РєР°РєРѕР№ РѕС„С„РµСЂ РїРѕРёСЃРєРѕРІРёРє РїРѕРєР°Р¶РµС‚ РїРѕР»СЊР·РѕРІР°С‚РµР»СЋ."
                ),
                evidence=[
                    f"Р’ РІС‹Р±РѕСЂРєРµ {len(problematic_titles)} РёР· {len(sample_pages)} СЃС‚СЂР°РЅРёС† РёРјРµСЋС‚ title РґР»РёРЅРЅРµРµ 70 СЃРёРјРІРѕР»РѕРІ.",
                    *examples,
                ],
                recommendation=(
                    "РџРµСЂРµСЃРѕР±СЂР°С‚СЊ С€Р°Р±Р»РѕРЅС‹ title: СЃРЅР°С‡Р°Р»Р° РєР»СЋС‡ Рё С‚РёРї СЃС‚СЂР°РЅРёС†С‹, Р·Р°С‚РµРј С†РµРЅРЅРѕСЃС‚РЅС‹Р№ РѕС„С„РµСЂ Рё Р±СЂРµРЅРґ. "
                    "РћСЂРёРµРЅС‚РёСЂ вЂ” РґРёР°РїР°Р·РѕРЅ 55вЂ“70 СЃРёРјРІРѕР»РѕРІ."
                ),
            )
        )

    if problematic_descriptions:
        examples = [f"{human_path(snapshot.url)} вЂ” {len(snapshot.description)} СЃРёРјРІ." for snapshot in problematic_descriptions[:4]]
        issues.append(
            AuditIssue(
                severity="Medium",
                title="Meta description РЅР° С‡Р°СЃС‚Рё СЃС‚СЂР°РЅРёС† РІРЅРµ СЂР°Р±РѕС‡РµРіРѕ РґРёР°РїР°Р·РѕРЅР°",
                why_it_matters=(
                    "Description вЂ” СЌС‚Рѕ СѓРїСЂР°РІР»СЏРµРјС‹Р№ РѕС„С„РµСЂ РІ СЃРЅРёРїРїРµС‚Рµ. РљРѕРіРґР° РѕРЅ СЃР»РёС€РєРѕРј РєРѕСЂРѕС‚РєРёР№ РёР»Рё РїРµСЂРµРіСЂСѓР¶РµРЅРЅС‹Р№, "
                    "РїРѕРёСЃРєРѕРІРёРє С‡Р°С‰Рµ Р±РµСЂРµС‚ СЃР»СѓС‡Р°Р№РЅС‹Р№ РєСѓСЃРѕРє С‚РµРєСЃС‚Р° СЃРѕ СЃС‚СЂР°РЅРёС†С‹."
                ),
                evidence=[
                    f"Р’ РІС‹Р±РѕСЂРєРµ {len(problematic_descriptions)} РёР· {len(sample_pages)} СЃС‚СЂР°РЅРёС† РёРјРµСЋС‚ description РІРЅРµ РєРѕРјС„РѕСЂС‚РЅРѕРіРѕ РґРёР°РїР°Р·РѕРЅР°.",
                    *examples,
                ],
                recommendation=(
                    "РЎРѕР±СЂР°С‚СЊ С€Р°Р±Р»РѕРЅС‹ description РїРѕ С‚РёРїР°Рј СЃС‚СЂР°РЅРёС†: РєР»СЋС‡, С†РµРЅРЅРѕСЃС‚СЊ, РґРѕРІРµСЂРёРµ, СЂРµРіРёРѕРЅ Рё РїСЂРёР·С‹РІ. "
                    "РћСЂРёРµРЅС‚РёСЂ вЂ” 140вЂ“160 СЃРёРјРІРѕР»РѕРІ."
                ),
            )
        )

    if alt_gaps:
        issues.append(
            AuditIssue(
                severity="Medium",
                title="РР·РѕР±СЂР°Р¶РµРЅРёСЏ С‚РµСЂСЏСЋС‚ SEO-СЃРёРіРЅР°Р»С‹ РёР·-Р·Р° РїСѓСЃС‚С‹С… alt",
                why_it_matters=(
                    "Alt РІР°Р¶РµРЅ Рё РґР»СЏ РїРѕРёСЃРєР° РїРѕ РєР°СЂС‚РёРЅРєР°Рј, Рё РґР»СЏ РїРѕРЅРёРјР°РЅРёСЏ РєРѕРЅС‚РµРєСЃС‚Р° СЃС‚СЂР°РЅРёС†С‹, Рё РґР»СЏ РґРѕСЃС‚СѓРїРЅРѕСЃС‚Рё. "
                    "РљРѕРіРґР° Сѓ РёР·РѕР±СЂР°Р¶РµРЅРёР№ РЅРµС‚ РѕРїРёСЃР°РЅРёР№, СЃР°Р№С‚ С‚РµСЂСЏРµС‚ РґРѕРїРѕР»РЅРёС‚РµР»СЊРЅС‹Р№ СЃР»РѕР№ СЂРµР»РµРІР°РЅС‚РЅРѕСЃС‚Рё."
                ),
                evidence=[
                    f"РќР° {len(alt_gaps)} РёР· {len(sample_pages)} РїСЂРѕРІРµСЂРµРЅРЅС‹С… СЃС‚СЂР°РЅРёС† РµСЃС‚СЊ РёР·РѕР±СЂР°Р¶РµРЅРёСЏ Р±РµР· alt.",
                    f"Р’СЃРµРіРѕ РІ РІС‹Р±РѕСЂРєРµ РЅР°Р№РґРµРЅРѕ {audit['total_missing_alt']} РёР·РѕР±СЂР°Р¶РµРЅРёР№ Р±РµР· РѕРїРёСЃР°РЅРёР№.",
                ],
                recommendation="Р’РІРµСЃС‚Рё С€Р°Р±Р»РѕРЅРЅСѓСЋ РіРµРЅРµСЂР°С†РёСЋ alt РїРѕ С‚РёРїСѓ СЃС‚СЂР°РЅРёС†С‹ Рё С‚РёРїСѓ РёР·РѕР±СЂР°Р¶РµРЅРёСЏ: РѕР±СЉРµРєС‚, РёРЅС‚РµРЅС‚, РјРѕРґРµР»СЊ Рё Р±СЂРµРЅРґ.",
            )
        )

    if redirect_chains:
        longest_chain = max(redirect_chains, key=lambda item: len(item["chain"]))
        issues.append(
            AuditIssue(
                severity="Medium",
                title="Р•СЃС‚СЊ Р»РёС€РЅРёРµ redirect-С†РµРїРѕС‡РєРё Сѓ РґРѕРјРµРЅРЅС‹С… РІР°СЂРёР°РЅС‚РѕРІ",
                why_it_matters=(
                    "Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅС‹Рµ СЂРµРґРёСЂРµРєС‚С‹ СѓРІРµР»РёС‡РёРІР°СЋС‚ Р·Р°РґРµСЂР¶РєСѓ РЅР° РІС…РѕРґРµ Рё СЃРѕР·РґР°СЋС‚ Р»РёС€РЅСЋСЋ С‚РµС…РЅРёС‡РµСЃРєСѓСЋ СЃР»РѕР¶РЅРѕСЃС‚СЊ РґР»СЏ Р±РѕС‚РѕРІ Рё РїРѕР»СЊР·РѕРІР°С‚РµР»РµР№."
                ),
                evidence=[
                    f"РџСѓС‚СЊ `{longest_chain['url']}` РѕС‚РґР°РµС‚ {len(longest_chain['chain'])} РїРѕСЃР»РµРґРѕРІР°С‚РµР»СЊРЅС‹С… redirect.",
                    f"Р¤РёРЅР°Р»СЊРЅС‹Р№ URL вЂ” `{longest_chain['final_url']}`.",
                ],
                recommendation="РЎРІРµСЃС‚Рё РІСЃРµ РґРѕРјРµРЅРЅС‹Рµ РІР°СЂРёР°РЅС‚С‹ Рє РѕРґРЅРѕРјСѓ РїСЂСЏРјРѕРјСѓ 301-СЂРµРґРёСЂРµРєС‚Сѓ РЅР° РєР°РЅРѕРЅРёС‡РµСЃРєРёР№ HTTPS-РґРѕРјРµРЅ.",
            )
        )

    if audit["home_page"].has_meta_keywords:
        issues.append(
            AuditIssue(
                severity="Low",
                title="РќР° С‡Р°СЃС‚Рё С€Р°Р±Р»РѕРЅР° РѕСЃС‚Р°Р»СЃСЏ meta keywords",
                why_it_matters=(
                    "РЎР°Рј РїРѕ СЃРµР±Рµ С‚РµРі СѓР¶Рµ РЅРµ РґР°РµС‚ SEO-С†РµРЅРЅРѕСЃС‚Рё, РЅРѕ РїРѕРєР°Р·С‹РІР°РµС‚, С‡С‚Рѕ С€Р°Р±Р»РѕРЅ РјРµС‚Р°РґР°РЅРЅС‹С… РЅРµ РґРѕС‡РёС‰РµРЅ "
                    "Рё СЃС‚РѕРёС‚ РїСЂРёРІРµСЃС‚Рё РµРіРѕ Рє СЃРѕРІСЂРµРјРµРЅРЅРѕРјСѓ РІРёРґСѓ."
                ),
                evidence=["РќР° РіР»Р°РІРЅРѕР№ РЅР°Р№РґРµРЅ С‚РµРі meta keywords."],
                recommendation="РЈР±СЂР°С‚СЊ meta keywords РёР· С€Р°Р±Р»РѕРЅР° Рё СЃРѕСЃСЂРµРґРѕС‚РѕС‡РёС‚СЊСЃСЏ РЅР° title, description, H1, canonical Рё schema.",
            )
        )

    if audit["sitemap_url_count"] > 5000:
        issues.append(
            AuditIssue(
                severity="Medium",
                title="РљР°СЂС‚Р° СЃР°Р№С‚Р° СѓР¶Рµ Р±РѕР»СЊС€Р°СЏ Рё С‚СЂРµР±СѓРµС‚ СЃРµРіРјРµРЅС‚Р°С†РёРё",
                why_it_matters=(
                    "РљРѕРіРґР° РІ sitemap РЅРµСЃРєРѕР»СЊРєРѕ С‚С‹СЃСЏС‡ URL РІ РѕРґРЅРѕРј РїРѕС‚РѕРєРµ, СЃР»РѕР¶РЅРµРµ РєРѕРЅС‚СЂРѕР»РёСЂРѕРІР°С‚СЊ РёРЅРґРµРєСЃР°С†РёСЋ РєР°С‚РµРіРѕСЂРёР№, РєР°СЂС‚РѕС‡РµРє, "
                    "СЃР»СѓР¶РµР±РЅС‹С… СЃС‚СЂР°РЅРёС† Рё РѕС‚РґРµР»СЊРЅС‹С… С‚РёРїРѕРІ РєРѕРЅС‚РµРЅС‚Р°."
                ),
                evidence=[
                    f"Р’ sitemap РѕР±РЅР°СЂСѓР¶РµРЅРѕ {audit['sitemap_url_count']} СѓРЅРёРєР°Р»СЊРЅС‹С… URL.",
                    "РџСЂРё С‚Р°РєРѕРј РѕР±СЉРµРјРµ СѓРґРѕР±РЅРµРµ СѓРїСЂР°РІР»СЏС‚СЊ РёРЅРґРµРєСЃРѕРј С‡РµСЂРµР· РѕС‚РґРµР»СЊРЅС‹Рµ sitemap РїРѕ С‚РёРїР°Рј СЃС‚СЂР°РЅРёС†.",
                ],
                recommendation="Р Р°Р·РґРµР»РёС‚СЊ sitemap РјРёРЅРёРјСѓРј РїРѕ РѕСЃРЅРѕРІРЅС‹Рј С‚РёРїР°Рј СЃС‚СЂР°РЅРёС† Рё РѕС‚РґРµР»СЊРЅРѕ РєРѕРЅС‚СЂРѕР»РёСЂРѕРІР°С‚СЊ РїРѕРєСЂС‹С‚РёРµ РєР°Р¶РґРѕРіРѕ РЅР°Р±РѕСЂР°.",
            )
        )

    if audit.get("sitemap_total_entries", 0) > audit["sitemap_url_count"] * 1.3:
        duplicate_entries = audit["sitemap_total_entries"] - audit["sitemap_url_count"]
        issues.append(
            AuditIssue(
                severity="Medium",
                title="Р’ sitemap РјРЅРѕРіРѕ РїРѕРІС‚РѕСЂСЏСЋС‰РёС…СЃСЏ URL",
                why_it_matters=(
                    "РљРѕРіРґР° РѕРґРёРЅ Рё С‚РѕС‚ Р¶Рµ URL РїРѕРІС‚РѕСЂСЏРµС‚СЃСЏ РІ РєР°СЂС‚Рµ СЃР°Р№С‚Р° РјРЅРѕРіРѕ СЂР°Р·, РїРѕРёСЃРєРѕРІРёРєРё РїРѕР»СѓС‡Р°СЋС‚ Р»РёС€РЅРёР№ С€СѓРј РІРјРµСЃС‚Рѕ С‡РёСЃС‚РѕРіРѕ СЃРёРіРЅР°Р»Р°."
                ),
                evidence=[
                    f"Р’ sitemap РЅР°Р№РґРµРЅРѕ {audit['sitemap_total_entries']} Р·Р°РїРёСЃРµР№, РЅРѕ С‚РѕР»СЊРєРѕ {audit['sitemap_url_count']} СѓРЅРёРєР°Р»СЊРЅС‹С… URL.",
                    f"РџРѕРІС‚РѕСЂРѕРІ: {duplicate_entries}.",
                ],
                recommendation="РџРµСЂРµСЃРѕР±СЂР°С‚СЊ РіРµРЅРµСЂР°С†РёСЋ sitemap С‚Р°Рє, С‡С‚РѕР±С‹ РєР°Р¶РґС‹Р№ РёРЅРґРµРєСЃРёСЂСѓРµРјС‹Р№ URL РїРѕРїР°РґР°Р» С‚СѓРґР° РѕРґРёРЅ СЂР°Р· Рё Р±РµР· РґСѓР±Р»РµР№.",
            )
        )

    severity_order = {"Critical": 0, "High": 1, "Medium": 2, "Low": 3}
    issues.sort(key=lambda issue: severity_order.get(issue.severity, 4))
    return issues


def dynamic_build_strengths(audit: dict) -> list[str]:
    strengths: list[str] = []
    profile = infer_project_profile(audit)
    if audit["home_page"].status_code == 200:
        strengths.append("Р“Р»Р°РІРЅР°СЏ СЃС‚СЂР°РЅРёС†Р° СЃС‚Р°Р±РёР»СЊРЅРѕ РѕС‚РєСЂС‹РІР°РµС‚СЃСЏ РїРѕ HTTPS Рё РѕС‚РґР°РµС‚ 200 РєРѕРґ Р±РµР· JS-Р·Р°РіР»СѓС€РєРё.")
    if audit["average_response_ms"] and audit["average_response_ms"] < 1200:
        strengths.append(f"РЎСЂРµРґРЅРёР№ РѕС‚РІРµС‚ РїРѕ РІС‹Р±РѕСЂРєРµ вЂ” {audit['average_response_ms']} ms: С‚РµС…РЅРёС‡РµСЃРєР°СЏ Р±Р°Р·Р° РЅРµ РІС‹РіР»СЏРґРёС‚ РїРµСЂРµРіСЂСѓР¶РµРЅРЅРѕР№.")
    if audit["sitemap_url_count"]:
        strengths.append(f"РЈ СЃР°Р№С‚Р° СѓР¶Рµ РµСЃС‚СЊ РєР°СЂС‚Р° СЃР°Р№С‚Р° СЃ {audit['sitemap_url_count']} СѓРЅРёРєР°Р»СЊРЅС‹РјРё URL, Р° Р·РЅР°С‡РёС‚ Р±Р°Р·Р° РґР»СЏ СѓРїСЂР°РІР»СЏРµРјРѕР№ РёРЅРґРµРєСЃР°С†РёРё СѓР¶Рµ СЃСѓС‰РµСЃС‚РІСѓРµС‚.")
    if audit.get("canonical_coverage_ratio", 0) >= 0.6:
        strengths.append(
            f"РЈ {math.floor(audit['canonical_coverage_ratio'] * 100)}% СЃС‚СЂР°РЅРёС† РІ РІС‹Р±РѕСЂРєРµ СѓР¶Рµ РїСЂРѕСЃС‚Р°РІР»РµРЅ canonical, СЌС‚Рѕ С…РѕСЂРѕС€РёР№ С„СѓРЅРґР°РјРµРЅС‚ РґР»СЏ С‡РёСЃС‚РѕР№ РёРЅРґРµРєСЃР°С†РёРё."
        )
    if audit["schema_coverage_ratio"] >= 0.4:
        strengths.append(f"Schema-СЂР°Р·РјРµС‚РєР° СѓР¶Рµ РёСЃРїРѕР»СЊР·СѓРµС‚СЃСЏ РЅР° {math.floor(audit['schema_coverage_ratio'] * 100)}% СЃС‚СЂР°РЅРёС† РІС‹Р±РѕСЂРєРё.")
    if audit["h1_coverage_ratio"] >= 0.8:
        strengths.append(f"РЈ {math.floor(audit['h1_coverage_ratio'] * 100)}% РїСЂРѕРІРµСЂРµРЅРЅС‹С… СЃС‚СЂР°РЅРёС† РµСЃС‚СЊ H1 вЂ” СЃС‚СЂСѓРєС‚СѓСЂР° РґРѕРєСѓРјРµРЅС‚РѕРІ СѓР¶Рµ РЅРµ РІС‹РіР»СЏРґРёС‚ С…Р°РѕС‚РёС‡РЅРѕР№.")
    if profile["is_catalog"]:
        strengths.append("РЈ РїСЂРѕРµРєС‚Р° СѓР¶Рµ РµСЃС‚СЊ РєР°С‚Р°Р»РѕРі РёР»Рё РєР»Р°СЃС‚РµСЂРЅР°СЏ URL-СЃС‚СЂСѓРєС‚СѓСЂР°, РєРѕС‚РѕСЂСѓСЋ РјРѕР¶РЅРѕ СѓСЃРёР»РёРІР°С‚СЊ Р±РµР· РїРѕР»РЅРѕР№ СЃРјРµРЅС‹ Р°СЂС…РёС‚РµРєС‚СѓСЂС‹.")
    else:
        strengths.append("РЈ РїСЂРѕРµРєС‚Р° СѓР¶Рµ РµСЃС‚СЊ Р±Р°Р·РѕРІС‹Р№ РЅР°Р±РѕСЂ РїРѕСЃР°РґРѕС‡РЅС‹С… СЃС‚СЂР°РЅРёС†, РєРѕС‚РѕСЂС‹Р№ РјРѕР¶РЅРѕ РґРѕРєСЂСѓС‡РёРІР°С‚СЊ С‚РѕС‡РµС‡РЅРѕ, Р° РЅРµ РїРµСЂРµСЃРѕР±РёСЂР°С‚СЊ СЃ РЅСѓР»СЏ.")
    if audit["llms_exists"]:
        strengths.append("РЈ РїСЂРѕРµРєС‚Р° СѓР¶Рµ РµСЃС‚СЊ llms.txt, Р° Р·РЅР°С‡РёС‚ РјРѕР¶РЅРѕ РѕС‚РґРµР»СЊРЅРѕ СѓСЃРёР»РёРІР°С‚СЊ РІРёРґРёРјРѕСЃС‚СЊ РІ РР-РѕС‚РІРµС‚Р°С… Рё branded-РїРѕРєСЂС‹С‚РёРµ.")
    return strengths[:6]


def dynamic_build_growth_points(audit: dict) -> list[str]:
    profile = infer_project_profile(audit)
    points: list[str] = []

    if profile["is_catalog"]:
        points.append("РЈСЃРёР»РёС‚СЊ РєР°С‚РµРіРѕСЂРёРё Рё РїРѕРґРєР°С‚РµРіРѕСЂРёРё: РёРЅС‚СЂРѕ-Р±Р»РѕРєРё, FAQ, СѓСЃР»РѕРІРёСЏ РїРѕРєСѓРїРєРё, Р±Р»РѕРєРё РґРѕРІРµСЂРёСЏ Рё РїРµСЂРµР»РёРЅРєРѕРІРєСѓ РЅР° РєР°СЂС‚РѕС‡РєРё.")
        points.append("РџРµСЂРµСЃРѕР±СЂР°С‚СЊ С€Р°Р±Р»РѕРЅС‹ РєР°СЂС‚РѕС‡РµРє Рё Р»РёСЃС‚РёРЅРіРѕРІ: РєРѕСЂРѕС‚РєРёРµ title, СЂР°Р±РѕС‡РёРµ description, canonical, alt, schema Рё РєРѕРјРјРµСЂС‡РµСЃРєРёРµ CTA.")
    else:
        points.append("Р Р°Р·РІРµСЃС‚Рё РєР»СЋС‡РµРІС‹Рµ РёРЅС‚РµРЅС‚С‹ РїРѕ РѕС‚РґРµР»СЊРЅС‹Рј РїРѕСЃР°РґРѕС‡РЅС‹Рј СЃС‚СЂР°РЅРёС†Р°Рј, Р° РЅРµ РґРµСЂР¶Р°С‚СЊ РЅРµСЃРєРѕР»СЊРєРѕ С‚РµРј РІРЅСѓС‚СЂРё РѕРґРЅРѕРіРѕ РґРѕРєСѓРјРµРЅС‚Р°.")
        points.append("РЈСЃРёР»РёС‚СЊ СЃС‚СЂР°РЅРёС†С‹ СѓСЃР»СѓРі Рё Р»РёРґ-СЃС‚СЂР°РЅРёС†С‹ Р±Р»РѕРєР°РјРё РґРѕРІРµСЂРёСЏ, РєРµР№СЃР°РјРё, FAQ, CTA Рё answer-first С„СЂР°РіРјРµРЅС‚Р°РјРё.")

    points.append("РЎРѕР±СЂР°С‚СЊ РµРґРёРЅС‹Р№ СЃР»РѕР№ С€Р°Р±Р»РѕРЅРѕРІ РґР»СЏ title, description, H1 Рё canonical РїРѕ РІСЃРµРј С‚РёРїР°Рј СЃС‚СЂР°РЅРёС†.")

    if audit["total_missing_alt"] > 0:
        points.append("Р Р°Р·РІРµСЂРЅСѓС‚СЊ image SEO: alt-С€Р°Р±Р»РѕРЅС‹, РїРѕРґРїРёСЃРё, РєРѕРЅС‚СЂРѕР»СЊ lazy-load Рё РїРѕРЅСЏС‚РЅСѓСЋ СЃРІСЏР·СЊ РёР·РѕР±СЂР°Р¶РµРЅРёСЏ СЃ РёРЅС‚РµРЅС‚РѕРј СЃС‚СЂР°РЅРёС†С‹.")

    if get_contact_related_pages(audit["sample_pages"]):
        points.append("Р”РѕРґРµР»Р°С‚СЊ РєРѕРЅС‚Р°РєС‚РЅС‹Рµ Рё Р·Р°СЏРІРѕС‡РЅС‹Рµ СЃС‚СЂР°РЅРёС†С‹ РєР°Рє РїРѕР»РЅРѕС†РµРЅРЅС‹Рµ SEO-РґРѕРєСѓРјРµРЅС‚С‹, Р° РЅРµ РєР°Рє С‚РµС…РЅРёС‡РµСЃРєРёРµ С„РѕСЂРјС‹.")

    points.append("Р”РѕР±Р°РІРёС‚СЊ answer-first Р±Р»РѕРєРё, FAQ Рё РІРЅСѓС‚СЂРµРЅРЅСЋСЋ РїРµСЂРµР»РёРЅРєРѕРІРєСѓ РјРµР¶РґСѓ РІР°Р¶РЅС‹РјРё СЂР°Р·РґРµР»Р°РјРё РґР»СЏ РѕР±С‹С‡РЅРѕР№ Рё РР-РІС‹РґР°С‡Рё.")

    if audit["sitemap_url_count"] > 2000 or audit.get("sitemap_total_entries", 0) > audit["sitemap_url_count"] * 1.2:
        points.append("РЎРµРіРјРµРЅС‚РёСЂРѕРІР°С‚СЊ sitemap Рё РѕС‚РґРµР»СЊРЅРѕ РєРѕРЅС‚СЂРѕР»РёСЂРѕРІР°С‚СЊ РёРЅРґРµРєСЃР°С†РёСЋ РїРѕ С‚РёРїР°Рј СЃС‚СЂР°РЅРёС†, С‡С‚РѕР±С‹ Р±С‹СЃС‚СЂРµРµ РЅР°С…РѕРґРёС‚СЊ СЃР±РѕРё Рё РґСѓР±Р»Рё.")

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
        sprint_1.append("РЈР±СЂР°С‚СЊ РєРѕРЅС„Р»РёРєС‚ РІ robots.txt Рё СЃРёРЅС…СЂРѕРЅРёР·РёСЂРѕРІР°С‚СЊ Sitemap, Host Рё РєР°РЅРѕРЅРёС‡РµСЃРєРёР№ РґРѕРјРµРЅ.")
    if redirect_chains:
        sprint_1.append("РЎРІРµСЃС‚Рё РІСЃРµ РґРѕРјРµРЅРЅС‹Рµ РІР°СЂРёР°РЅС‚С‹ Рє РѕРґРЅРѕРјСѓ РїСЂСЏРјРѕРјСѓ 301-СЂРµРґРёСЂРµРєС‚Сѓ.")
    if query_pages:
        sprint_1.append("Р—Р°РєСЂС‹С‚СЊ РёР»Рё РЅРѕСЂРјР°Р»РёР·РѕРІР°С‚СЊ РёРЅРґРµРєСЃРёСЂСѓРµРјС‹Рµ query- Рё route-СЃС‚СЂР°РЅРёС†С‹ СЃ С‚РµС…РЅРёС‡РµСЃРєРёРјРё С„РѕСЂРјР°РјРё.")
    sprint_1.append("РџРѕРґРіРѕС‚РѕРІРёС‚СЊ РµРґРёРЅРѕРµ РўР— РЅР° title, description, H1 Рё canonical РґР»СЏ РѕСЃРЅРѕРІРЅС‹С… С‚РёРїРѕРІ СЃС‚СЂР°РЅРёС†.")

    sprint_2 = [
        "Р’РЅРµРґСЂРёС‚СЊ alt-С€Р°Р±Р»РѕРЅС‹, РїСЂРѕРІРµСЂРёС‚СЊ lazy-load Рё РїРѕРґС‡РёСЃС‚РёС‚СЊ image SEO РЅР° РєР»СЋС‡РµРІС‹С… СЃС‚СЂР°РЅРёС†Р°С….",
        "Р Р°Р·РґРµР»РёС‚СЊ sitemap РїРѕ С‚РёРїР°Рј СЃС‚СЂР°РЅРёС† Рё РїРѕРґР°С‚СЊ РѕС‚РґРµР»СЊРЅС‹Рµ РєР°СЂС‚С‹ РІ РЇРЅРґРµРєСЃ.Р’РµР±РјР°СЃС‚РµСЂ Рё GSC.",
        "РћР±РЅРѕРІРёС‚СЊ С€Р°Р±Р»РѕРЅС‹ СЃРЅРёРїРїРµС‚РѕРІ Рё РїСЂРѕРІРµСЂРёС‚СЊ СЂРѕСЃС‚ CTR РїРѕ РїСЂРёРѕСЂРёС‚РµС‚РЅС‹Рј СЃС‚СЂР°РЅРёС†Р°Рј.",
    ]

    if profile["is_catalog"]:
        sprint_3 = [
            "РЈСЃРёР»РёС‚СЊ РєР°С‚РµРіРѕСЂРёРё Рё РїРѕРґРєР°С‚РµРіРѕСЂРёРё РєРѕРЅС‚РµРЅС‚РѕРј, FAQ, Р±Р»РѕРєР°РјРё РґРѕРІРµСЂРёСЏ Рё РїРµСЂРµР»РёРЅРєРѕРІРєРѕР№.",
            "РџРµСЂРµСЃРѕР±СЂР°С‚СЊ РєР°СЂС‚РѕС‡РєРё Рё Р»РёСЃС‚РёРЅРіРё С‚Р°Рє, С‡С‚РѕР±С‹ РѕРЅРё Р»СѓС‡С€Рµ РєРѕРЅРІРµСЂС‚РёСЂРѕРІР°Р»Рё SEO-С‚СЂР°С„РёРє РІ Р·Р°СЏРІРєРё Рё РїСЂРѕРґР°Р¶Рё.",
            "Р”РѕР±Р°РІРёС‚СЊ answer-first С„СЂР°РіРјРµРЅС‚С‹ Рё РєРѕРЅС‚РµРЅС‚ РїРѕРґ РР-РІС‹РґР°С‡Сѓ РЅР° РіР»Р°РІРЅС‹Рµ СЃРїСЂРѕСЃРѕРІС‹Рµ РєР»Р°СЃС‚РµСЂС‹.",
        ]
    else:
        sprint_3 = [
            "РЈСЃРёР»РёС‚СЊ РїРѕСЃР°РґРѕС‡РЅС‹Рµ СЃС‚СЂР°РЅРёС†С‹ СѓСЃР»СѓРі, РєРµР№СЃРѕРІ Рё РєРѕРЅС‚Р°РєС‚РѕРІ Р±Р»РѕРєР°РјРё РґРѕРІРµСЂРёСЏ, CTA Рё answer-first РєРѕРЅС‚РµРЅС‚РѕРј.",
            "Р Р°Р·РІРµСЃС‚Рё РєР»СЋС‡РµРІС‹Рµ РєР»Р°СЃС‚РµСЂС‹ СЃРїСЂРѕСЃР° РїРѕ РѕС‚РґРµР»СЊРЅС‹Рј СЃС‚СЂР°РЅРёС†Р°Рј Рё РІС‹СЃС‚СЂРѕРёС‚СЊ РјРµР¶РґСѓ РЅРёРјРё РїРµСЂРµР»РёРЅРєРѕРІРєСѓ.",
            "Р”РѕР±Р°РІРёС‚СЊ FAQ Рё РєРѕСЂРѕС‚РєРёРµ СЌРєСЃРїРµСЂС‚РЅС‹Рµ Р±Р»РѕРєРё РїРѕРґ РѕР±С‹С‡РЅСѓСЋ Рё РР-РІС‹РґР°С‡Сѓ.",
        ]

    return [("0-14 РґРЅРµР№", sprint_1[:4]), ("15-30 РґРЅРµР№", sprint_2), ("31-60 РґРЅРµР№", sprint_3)]


def build_executive_summary_dynamic(audit: dict) -> list[str]:
    profile = infer_project_profile(audit)
    top_issues = audit.get("issues", [])[:3]
    top_issue_titles = "; ".join(issue.title for issue in top_issues) if top_issues else "С‚РµС…РЅРёС‡РµСЃРєРёРµ Рё С€Р°Р±Р»РѕРЅРЅС‹Рµ РѕРіСЂР°РЅРёС‡РµРЅРёСЏ"
    project_shape = "РєР°С‚Р°Р»РѕРі Рё РєР»Р°СЃС‚РµСЂРЅСѓСЋ СЃС‚СЂСѓРєС‚СѓСЂСѓ URL" if profile["is_catalog"] else "РЅР°Р±РѕСЂ РїРѕСЃР°РґРѕС‡РЅС‹С… Рё Р»РёРґ-СЃС‚СЂР°РЅРёС†"
    growth_target = (
        "Р»СѓС‡С€Рµ СЂР°СЃРєСЂС‹С‚СЊ СЃРїСЂРѕСЃ С‡РµСЂРµР· РєР°С‚РµРіРѕСЂРёРё, РєР°СЂС‚РѕС‡РєРё Рё СЃРІСЏР·Р°РЅРЅС‹Рµ РєР»Р°СЃС‚РµСЂС‹"
        if profile["is_catalog"]
        else "СЃРёР»СЊРЅРµРµ Р·Р°Р±РёСЂР°С‚СЊ СЃРїСЂРѕСЃ С‡РµСЂРµР· РѕС‚РґРµР»СЊРЅС‹Рµ РїРѕСЃР°РґРѕС‡РЅС‹Рµ СЃС‚СЂР°РЅРёС†С‹ Рё СЌРєСЃРїРµСЂС‚РЅС‹Рµ Р±Р»РѕРєРё"
    )

    return [
        (
            f"РЈ {audit['company_name']} СѓР¶Рµ РµСЃС‚СЊ СЂР°Р±РѕС‡РёР№ С„СѓРЅРґР°РјРµРЅС‚: СЃР°Р№С‚ РѕС‚РІРµС‡Р°РµС‚ РїРѕ HTTPS, РІ РІС‹Р±РѕСЂРєРµ РІРёРґРЅС‹ sitemap, "
            f"H1-РїРѕРєСЂС‹С‚РёРµ {math.floor(audit['h1_coverage_ratio'] * 100)}%, schema-РїРѕРєСЂС‹С‚РёРµ {math.floor(audit['schema_coverage_ratio'] * 100)}% "
            f"Рё {project_shape}, РєРѕС‚РѕСЂСѓСЋ РјРѕР¶РЅРѕ СѓСЃРёР»РёРІР°С‚СЊ Р±РµР· РїРѕР»РЅРѕР№ РїРµСЂРµСЃР±РѕСЂРєРё РїСЂРѕРµРєС‚Р°."
        ),
        (
            f"РћСЃРЅРѕРІРЅС‹Рµ РїРѕС‚РµСЂРё СЃРµР№С‡Р°СЃ РёРґСѓС‚ РЅРµ РёР·-Р·Р° РѕС‚СЃСѓС‚СЃС‚РІРёСЏ СЃРїСЂРѕСЃР°, Р° РёР·-Р·Р° СЃР»РѕСЏ РёРЅРґРµРєСЃР°С†РёРё Рё С€Р°Р±Р»РѕРЅРѕРІ: {top_issue_titles}. "
            "РРјРµРЅРЅРѕ СЌС‚Рё РѕРіСЂР°РЅРёС‡РµРЅРёСЏ СЃРёР»СЊРЅРµРµ РІСЃРµРіРѕ РІР»РёСЏСЋС‚ РЅР° crawl budget, CTR Рё С‡РёСЃС‚РѕС‚Сѓ РєРѕРјРјРµСЂС‡РµСЃРєРѕР№ РІС‹РґР°С‡Рё."
        ),
        (
            f"Р•СЃР»Рё СЃРЅР°С‡Р°Р»Р° СѓР±СЂР°С‚СЊ С‚РµС…РЅРёС‡РµСЃРєРёР№ С€СѓРј, Р° Р·Р°С‚РµРј РїРµСЂРµСЃРѕР±СЂР°С‚СЊ С€Р°Р±Р»РѕРЅС‹ Рё РїСЂРёРѕСЂРёС‚РµС‚РЅС‹Рµ СЃС‚СЂР°РЅРёС†С‹, РїСЂРѕРµРєС‚ СЃРјРѕР¶РµС‚ {growth_target} "
            "Рё РїСЂРµРІСЂР°С‚РёС‚СЊ С‚РµРєСѓС‰СѓСЋ СЃС‚СЂСѓРєС‚СѓСЂСѓ СЃР°Р№С‚Р° РІ Р±РѕР»РµРµ СЃРёР»СЊРЅС‹Р№ РёСЃС‚РѕС‡РЅРёРє SEO-С‚СЂР°С„РёРєР° Рё Р·Р°СЏРІРѕРє."
        ),
    ]


def normalize_page_url(url: str) -> str:
    parsed = urlparse(url.strip())
    normalized_path = parsed.path.rstrip("/") or "/"
    cleaned = parsed._replace(path=normalized_path, params="", fragment="")
    return cleaned.geturl()


def select_representative_urls(base_url: str, home_links: list[str], sitemap_urls: list[str], sample_size: int) -> list[str]:
    selected: list[str] = []
    seen: set[str] = set()

    def add(url: str) -> None:
        normalized = normalize_page_url(url)
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


def discover_page_links(session: requests.Session, url: str, base_domain: str) -> list[str]:
    response, error = safe_get(session, url, timeout=30)
    if error or response is None or response.status_code >= 400:
        return []

    content_type = response.headers.get("content-type", "")
    if "html" not in content_type:
        return []

    soup = BeautifulSoup(response.text, "lxml")
    discovered: list[str] = []
    seen: set[str] = set()

    for anchor in soup.find_all("a", href=True):
        href = anchor.get("href", "").strip()
        if not href or href.startswith(("#", "mailto:", "tel:", "javascript:")):
            continue

        absolute = normalize_page_url(urljoin(url, href))
        parsed = urlparse(absolute)
        if parsed.netloc != base_domain:
            continue
        if re.search(r"\.(pdf|jpg|jpeg|png|webp|svg|zip|doc|docx|xls|xlsx|ppt|pptx)$", parsed.path.lower()):
            continue
        if absolute in seen:
            continue

        seen.add(absolute)
        discovered.append(absolute)

    return discovered


def crawl_internal_urls(
    base_url: str,
    seed_urls: list[str],
    base_domain: str,
    page_limit: int,
) -> list[str]:
    session = make_session()
    queue = [base_url, *seed_urls]
    discovered: list[str] = []
    queued: set[str] = set()
    visited: set[str] = set()
    effective_limit = page_limit if page_limit > 0 else 400

    for url in queue:
        normalized = normalize_page_url(url)
        queued.add(normalized)

    while queue and len(discovered) < effective_limit:
        current = normalize_page_url(queue.pop(0))
        if current in visited:
            continue

        visited.add(current)
        discovered.append(current)

        for linked_url in discover_page_links(session, current, base_domain):
            if linked_url in visited or linked_url in queued:
                continue
            queued.add(linked_url)
            queue.append(linked_url)
            if len(queued) >= effective_limit:
                break

    return discovered


def build_audit_url_inventory(
    base_url: str,
    preferred_urls: list[str],
    sitemap_urls: list[str],
    base_domain: str,
    requested_limit: int,
) -> list[str]:
    selected: list[str] = []
    seen: set[str] = set()

    def add(url: str) -> None:
        normalized = normalize_page_url(url)
        if not normalized or normalized in seen:
            return
        seen.add(normalized)
        selected.append(normalized)

    add(base_url)
    for url in preferred_urls:
        add(url)

    if sitemap_urls:
        for url in sitemap_urls:
            add(url)
        if requested_limit == 0:
            supplemental_urls = crawl_internal_urls(base_url, preferred_urls[:12], base_domain, min(max(len(preferred_urls) * 12, 180), 480))
            for url in supplemental_urls:
                add(url)
        if requested_limit > 0:
            return selected[:requested_limit]
        return selected

    crawled_urls = crawl_internal_urls(base_url, preferred_urls, base_domain, requested_limit)
    for url in crawled_urls:
        add(url)

    if requested_limit > 0:
        return selected[:requested_limit]
    return selected


def analyse_pages_parallel(urls: list[str], base_domain: str, max_workers: int = 10) -> list[PageSnapshot]:
    if not urls:
        return []

    results: list[PageSnapshot | None] = [None] * len(urls)

    def worker(index: int, page_url: str) -> tuple[int, PageSnapshot]:
        session = make_session()
        return index, analyse_page(session, page_url, base_domain)

    worker_count = max(1, min(max_workers, len(urls)))
    with ThreadPoolExecutor(max_workers=worker_count) as executor:
        futures = [executor.submit(worker, index, page_url) for index, page_url in enumerate(urls)]
        for future in as_completed(futures):
            index, snapshot = future.result()
            results[index] = snapshot

    return [snapshot for snapshot in results if snapshot is not None]


def infer_issue_owner(issue: AuditIssue) -> str:
    haystack = f"{issue.title} {issue.recommendation}".lower()
    if any(token in haystack for token in ("robots", "sitemap", "redirect", "canonical", "query-url", "route", "host")):
        return "Backend / SEO"
    if any(token in haystack for token in ("schema", "json", "title", "description", "h1", "alt", "image", "snippet")):
        return "Frontend / SEO"
    if any(token in haystack for token in ("РєРѕРЅС‚Р°РєС‚", "lead", "cta", "content", "faq", "РїРµСЂРµР»РёРЅРєРѕРІ")):
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
        if any(token in haystack for token in ("robots", "sitemap", "РёРЅРґРµРєСЃР°", "canonical", "redirect")):
            impact = min(10, impact + 1)
        if any(token in haystack for token in ("title", "description", "ctr", "snippet", "schema")):
            business = min(10, business + 1)
        if any(token in haystack for token in ("РєРѕРЅС‚Р°РєС‚", "lead", "route", "query-url")):
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
                "title": "РџРѕС‡РёРЅРёС‚СЊ РєРѕРЅС„Р»РёРєС‚ robots.txt Рё sitemap.xml",
                "effort": "10-20 РјРёРЅСѓС‚",
                "impact": "РЎРЅРёРјРµС‚ РєРѕРЅС„Р»РёРєС‚ СЃРёРіРЅР°Р»РѕРІ РґР»СЏ РЇРЅРґРµРєСЃР° Рё Google",
                "action": "РЈР±СЂР°С‚СЊ Р·Р°РїСЂРµС‚ РЅР° sitemap.xml Рё РѕСЃС‚Р°РІРёС‚СЊ РѕРґРЅСѓ РєРѕСЂСЂРµРєС‚РЅСѓСЋ РґРёСЂРµРєС‚РёРІСѓ Sitemap.",
            }
        )

    if any("redirect" in title.lower() for title in issue_titles):
        quick_wins.append(
            {
                "title": "РЎРІРµСЃС‚Рё РґРѕРјРµРЅРЅС‹Рµ СЂРµРґРёСЂРµРєС‚С‹ Рє РѕРґРЅРѕРјСѓ С€Р°РіСѓ",
                "effort": "15-30 РјРёРЅСѓС‚",
                "impact": "РЈР±РµСЂРµС‚ Р»РёС€РЅСЋСЋ Р·Р°РґРµСЂР¶РєСѓ Рё С‚РµС…РЅРёС‡РµСЃРєРёР№ С€СѓРј РЅР° РІС…РѕРґРµ",
                "action": "РћСЃС‚Р°РІРёС‚СЊ РµРґРёРЅС‹Р№ 301 СЃСЂР°Р·Сѓ РЅР° РєР°РЅРѕРЅРёС‡РµСЃРєРёР№ HTTPS-РґРѕРјРµРЅ Р±РµР· РїСЂРѕРјРµР¶СѓС‚РѕС‡РЅС‹С… С…РѕРїРѕРІ.",
            }
        )

    weak_contacts = audit.get("weak_contact_pages", [])
    if weak_contacts:
        quick_wins.append(
            {
                "title": "РќРѕСЂРјР°Р»СЊРЅРѕ РѕС„РѕСЂРјРёС‚СЊ РєРѕРЅС‚Р°РєС‚С‹ Рё Р»РёРґ-СЃС‚СЂР°РЅРёС†С‹",
                "effort": "30-60 РјРёРЅСѓС‚",
                "impact": "РџРѕРґРЅРёРјРµС‚ РґРѕРІРµСЂРёРµ, Р±СЂРµРЅРґРѕРІС‹Р№ Р·Р°РїСЂРѕСЃ Рё РєРѕРЅРІРµСЂСЃРёСЋ",
                "action": "Р”РѕР±Р°РІРёС‚СЊ H1, title, description, canonical Рё Р±Р»РѕРєРё РґРѕРІРµСЂРёСЏ РЅР° СЃС‚СЂР°РЅРёС†Сѓ РєРѕРЅС‚Р°РєС‚РѕРІ/С„РѕСЂРјС‹.",
            }
        )

    if audit.get("invalid_schema_count", 0):
        quick_wins.append(
            {
                "title": "РСЃРїСЂР°РІРёС‚СЊ Р±РёС‚СѓСЋ JSON-LD СЂР°Р·РјРµС‚РєСѓ",
                "effort": "15-40 РјРёРЅСѓС‚",
                "impact": "Р’РµСЂРЅРµС‚ РІР°Р»РёРґРЅСѓСЋ structured data РІ РёРЅРґРµРєСЃ",
                "action": "РџСЂРѕРІРµСЂРёС‚СЊ СЃРёРЅС‚Р°РєСЃРёСЃ JSON-LD Рё РїРµСЂРµСЃРѕР±СЂР°С‚СЊ РїСЂРѕР±Р»РµРјРЅС‹Рµ Р±Р»РѕРєРё schema РЅР° РєР»СЋС‡РµРІС‹С… СЃС‚СЂР°РЅРёС†Р°С….",
            }
        )

    if audit.get("title_missing_count", 0) or audit.get("description_missing_count", 0):
        quick_wins.append(
            {
                "title": "Р—Р°РєСЂС‹С‚СЊ РґС‹СЂС‹ РІ title Рё description",
                "effort": "1-2 С‡Р°СЃР°",
                "impact": "Р”Р°СЃС‚ Р±С‹СЃС‚СЂС‹Р№ РїСЂРёСЂРѕСЃС‚ СѓРїСЂР°РІР»СЏРµРјРѕСЃС‚Рё СЃРЅРёРїРїРµС‚РѕРІ",
                "action": "Р”РѕРїРёСЃР°С‚СЊ С€Р°Р±Р»РѕРЅС‹ РіРµРЅРµСЂР°С†РёРё title/description РґР»СЏ СЃС‚СЂР°РЅРёС† Р±РµР· SEO-РѕР±РІСЏР·РєРё.",
            }
        )

    if audit.get("indexable_query_count", 0):
        quick_wins.append(
            {
                "title": "Р Р°Р·СЂСѓР»РёС‚СЊ РёРЅРґРµРєСЃРёСЂСѓРµРјС‹Рµ query Рё route URL",
                "effort": "30-90 РјРёРЅСѓС‚",
                "impact": "РЎРѕРєСЂР°С‚РёС‚ С€СѓРј РІ РёРЅРґРµРєСЃРµ Рё РѕСЃРІРѕР±РѕРґРёС‚ crawl budget",
                "action": "Р—Р°РєСЂС‹С‚СЊ СЃР»СѓР¶РµР±РЅС‹Рµ query-СЃС‚СЂР°РЅРёС†С‹ РѕС‚ РёРЅРґРµРєСЃР°С†РёРё РёР»Рё РїРµСЂРµРІРµСЃС‚Рё РёС… РЅР° С‡РёСЃС‚С‹Рµ SEO-friendly URL.",
            }
        )

    if audit.get("total_missing_alt", 0):
        quick_wins.append(
            {
                "title": "Р—Р°РїСѓСЃС‚РёС‚СЊ С€Р°Р±Р»РѕРЅ alt РґР»СЏ РёР·РѕР±СЂР°Р¶РµРЅРёР№",
                "effort": "1-2 С‡Р°СЃР°",
                "impact": "РЈСЃРёР»РёС‚ image SEO Рё РїРѕРЅСЏС‚РЅРѕСЃС‚СЊ РєР°СЂС‚РѕС‡РµРє",
                "action": "РЎРѕР±СЂР°С‚СЊ РїСЂР°РІРёР»Р° alt РїРѕ С‚РёРїСѓ СЃС‚СЂР°РЅРёС†С‹, С‚РѕРІР°СЂСѓ, РєР°С‚РµРіРѕСЂРёРё Рё РєР»СЋС‡РµРІРѕР№ СЃСѓС‰РЅРѕСЃС‚Рё РёР·РѕР±СЂР°Р¶РµРЅРёСЏ.",
            }
        )

    return quick_wins[:6]


def build_strategic_moves(audit: dict) -> list[dict]:
    profile = infer_project_profile(audit)
    moves = [
        {
            "title": "РџРµСЂРµСЃРѕР±СЂР°С‚СЊ С€Р°Р±Р»РѕРЅС‹ РєРѕРјРјРµСЂС‡РµСЃРєРёС… СЃС‚СЂР°РЅРёС† РєР°Рє growth-layer",
            "impact": "Р’С‹СЃРѕРєРѕРµ",
            "effort": "5-10 РґРЅРµР№",
            "details": "РЎРѕР±СЂР°С‚СЊ РµРґРёРЅС‹Рµ С‚СЂРµР±РѕРІР°РЅРёСЏ Рє H1, title, description, canonical, FAQ, CTA, trust-Р±Р»РѕРєР°Рј Рё РїРµСЂРµР»РёРЅРєРѕРІРєРµ РїРѕ РІСЃРµРј РєР»СЋС‡РµРІС‹Рј С‚РёРїР°Рј СЃС‚СЂР°РЅРёС†.",
        },
        {
            "title": "РЎРґРµР»Р°С‚СЊ СѓРїСЂР°РІР»СЏРµРјСѓСЋ Р°СЂС…РёС‚РµРєС‚СѓСЂСѓ РёРЅРґРµРєСЃР°С†РёРё",
            "impact": "Р’С‹СЃРѕРєРѕРµ",
            "effort": "3-7 РґРЅРµР№",
            "details": "Р Р°Р·РґРµР»РёС‚СЊ sitemap РїРѕ С‚РёРїР°Рј СЃС‚СЂР°РЅРёС†, Р·Р°С‡РёСЃС‚РёС‚СЊ СЃР»СѓР¶РµР±РЅС‹Рµ route/query URL Рё РЅР°СЃС‚СЂРѕРёС‚СЊ РµРґРёРЅС‹Р№ РєРѕРЅС‚СЂРѕР»СЊ РЅР°Рґ РєР°РЅРѕРЅРёС‡РµСЃРєРёРјРё РґРѕРјРµРЅР°РјРё Рё СЂРµРґРёСЂРµРєС‚Р°РјРё.",
        },
        {
            "title": "РЈСЃРёР»РёС‚СЊ structured data Рё entity-СЃРёРіРЅР°Р»С‹",
            "impact": "РЎСЂРµРґРЅРµРµ / РІС‹СЃРѕРєРѕРµ",
            "effort": "2-5 РґРЅРµР№",
            "details": "РџРѕРєСЂС‹С‚СЊ РєР»СЋС‡РµРІС‹Рµ СЃС‚СЂР°РЅРёС†С‹ РІР°Р»РёРґРЅРѕР№ schema-СЂР°Р·РјРµС‚РєРѕР№ Рё СЃРѕР±СЂР°С‚СЊ РґР°РЅРЅС‹Рµ С‚Р°Рє, С‡С‚РѕР±С‹ СЃР°Р№С‚ Р±С‹Р» РїРѕРЅСЏС‚РЅРµРµ РѕР±С‹С‡РЅРѕР№ Рё РР-РІС‹РґР°С‡Рµ.",
        },
    ]
    if profile["is_catalog"]:
        moves.append(
            {
                "title": "Р Р°Р·РІРёС‚СЊ СЃРїСЂРѕСЃРѕРІС‹Рµ РєР»Р°СЃС‚РµСЂС‹ С‡РµСЂРµР· РєР°С‚РµРіРѕСЂРёРё Рё РєР°СЂС‚РѕС‡РєРё",
                "impact": "Р’С‹СЃРѕРєРѕРµ",
                "effort": "2-4 РЅРµРґРµР»Рё",
                "details": "РЎРѕР±СЂР°С‚СЊ РѕС‚РґРµР»СЊРЅС‹Рµ РїРѕСЃР°РґРѕС‡РЅС‹Рµ РїРѕРґ РіР»Р°РІРЅС‹Рµ РєР»Р°СЃС‚РµСЂС‹ СЃРїСЂРѕСЃР°, СѓСЃРёР»РёС‚СЊ РєР°С‚РµРіРѕСЂРёРё FAQ Рё РѕС‚РІРµС‚Р°РјРё РЅР° РІС‹Р±РѕСЂ, Р° РєР°СЂС‚РѕС‡РєРё СЃРґРµР»Р°С‚СЊ Р±РѕР»РµРµ РєРѕРЅРІРµСЂСЃРёРѕРЅРЅС‹РјРё.",
            }
        )
    else:
        moves.append(
            {
                "title": "Р Р°Р·РІРµСЃС‚Рё СѓСЃР»СѓРіРё РїРѕ РѕС‚РґРµР»СЊРЅС‹Рј SEO-РїРѕСЃР°РґРѕС‡РЅС‹Рј",
                "impact": "Р’С‹СЃРѕРєРѕРµ",
                "effort": "1-3 РЅРµРґРµР»Рё",
                "details": "Р’С‹РЅРµСЃС‚Рё РєР»СЋС‡РµРІС‹Рµ РёРЅС‚РµРЅС‚С‹ РІ СЃР°РјРѕСЃС‚РѕСЏС‚РµР»СЊРЅС‹Рµ РїРѕСЃР°РґРѕС‡РЅС‹Рµ СЃС‚СЂР°РЅРёС†С‹ Рё СЃРІСЏР·Р°С‚СЊ РёС… РїРµСЂРµР»РёРЅРєРѕРІРєРѕР№, РєРµР№СЃР°РјРё, FAQ Рё СЌРєСЃРїРµСЂС‚РЅС‹РјРё Р±Р»РѕРєР°РјРё.",
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
        if page.page_type in ("Р“Р»Р°РІРЅР°СЏ", "РљР°С‚РµРіРѕСЂРёСЏ", "РџРѕРґРєР°С‚РµРіРѕСЂРёСЏ", "РўРѕРІР°СЂ", "Р’РЅСѓС‚СЂРµРЅРЅСЏСЏ") or page.has_forms
    ]
    missing_schema_commercial = [page for page in commercial_pages if not page.schema_types]
    average_commercial_words = (
        round(statistics.mean([page.word_count for page in commercial_pages if page.word_count]), 1)
        if commercial_pages
        else 0
    )

    return [
        {
            "title": "Р­С‚Р°Рї 1 вЂ” Crawl & Indexability",
            "intro": "РџСЂРѕРІРµСЂСЏСЋ, РЅР°СЃРєРѕР»СЊРєРѕ С‡РёСЃС‚Рѕ СЃР°Р№С‚ РѕС‚РґР°РµС‚ РїРѕРёСЃРєРѕРІРёРєР°Рј СЃРёРіРЅР°Р»С‹ РґР»СЏ РѕР±С…РѕРґР° Рё РёРЅРґРµРєСЃР°С†РёРё.",
            "checks": [
                {
                    "name": "robots.txt Рё РєР°СЂС‚Р° СЃР°Р№С‚Р°",
                    "checked": "Р”РѕСЃС‚СѓРїРЅРѕСЃС‚СЊ robots.txt, РґРёСЂРµРєС‚РёРІС‹, sitemap, С‡РёСЃС‚РѕС‚Р° СЃРёРіРЅР°Р»РѕРІ РґР»СЏ СЂРѕР±РѕС‚Р°.",
                    "method": "HTTP-Р·Р°РїСЂРѕСЃ + СЂР°Р·Р±РѕСЂ robots.txt Рё XML sitemap.",
                    "metrics": [
                        ("robots.txt", f"{audit['robots_status']}"),
                        ("РЈРЅРёРєР°Р»СЊРЅС‹С… URL РІ sitemap", str(audit["sitemap_url_count"])),
                        ("Р’СЃРµРіРѕ Р·Р°РїРёСЃРµР№ РІ sitemap", str(audit.get("sitemap_total_entries", audit["sitemap_url_count"]))),
                        ("Р¤Р°Р№Р»РѕРІ sitemap РѕР±СЂР°Р±РѕС‚Р°РЅРѕ", str(len(audit.get("processed_sitemaps", [])))),
                    ],
                    "findings": [
                        "Р•СЃС‚СЊ РєРѕРЅС„Р»РёРєС‚ РјРµР¶РґСѓ robots.txt Рё sitemap.xml." if any("robots.txt" in issue.title for issue in audit["issues"]) else "РљСЂРёС‚РёС‡РЅРѕРіРѕ РєРѕРЅС„Р»РёРєС‚Р° РјРµР¶РґСѓ robots.txt Рё sitemap.xml РІ РІС‹Р±РѕСЂРєРµ РЅРµ РІРёРґРЅРѕ.",
                        "РљР°СЂС‚Р° СЃР°Р№С‚Р° СЂР°Р·РґСѓС‚Р° РґСѓР±Р»СЏРјРё." if audit.get("sitemap_total_entries", 0) > audit["sitemap_url_count"] * 1.3 else "РЎРёР»СЊРЅРѕРіРѕ СЂР°Р·РґСѓРІР°РЅРёСЏ sitemap РґСѓР±Р»СЏРјРё РІ РІС‹Р±РѕСЂРєРµ РЅРµ РІРёРґРЅРѕ.",
                        "Р•СЃС‚СЊ llms.txt, Р·РЅР°С‡РёС‚ СЃР°Р№С‚ СѓР¶Рµ РјРѕР¶РЅРѕ РґРѕР¶РёРјР°С‚СЊ Рё РїРѕРґ РР-РІРёРґРёРјРѕСЃС‚СЊ." if audit.get("llms_exists") else "РћС‚РґРµР»СЊРЅРѕРіРѕ llms.txt РЅРµ РЅР°Р№РґРµРЅРѕ.",
                    ],
                    "priority": "HIGH" if any(issue.severity == "Critical" for issue in audit["issues"]) else "MEDIUM",
                    "owner": "Backend / SEO",
                    "recommendation": "РЎРёРЅС…СЂРѕРЅРёР·РёСЂРѕРІР°С‚СЊ robots.txt, sitemap Рё РєР°РЅРѕРЅРёС‡РµСЃРєРёР№ РґРѕРјРµРЅ С‚Р°Рє, С‡С‚РѕР±С‹ СЂРѕР±РѕС‚ РІРёРґРµР» РѕРґРёРЅ РЅРµРїСЂРѕС‚РёРІРѕСЂРµС‡РёРІС‹Р№ СЃС†РµРЅР°СЂРёР№ РѕР±С…РѕРґР°.",
                },
                {
                    "name": "РЎС‚Р°С‚СѓСЃ-РєРѕРґС‹, СЂРµРґРёСЂРµРєС‚С‹ Рё РєР°РЅРѕРЅРёРєР°Р»РёР·Р°С†РёСЏ",
                    "checked": "HTTP-РєРѕРґС‹ РєР»СЋС‡РµРІС‹С… URL, РґРѕРјРµРЅРЅС‹Рµ СЂРµРґРёСЂРµРєС‚С‹, РїРѕРєСЂС‹С‚РёРµ canonical.",
                    "method": "HTTP-РїСЂРѕРІРµСЂРєР° РґРѕРјРµРЅРЅС‹С… РІР°СЂРёР°РЅС‚РѕРІ + РїР°СЂСЃРёРЅРі rel=canonical РїРѕ РІС‹Р±РѕСЂРєРµ СЃС‚СЂР°РЅРёС†.",
                    "metrics": [
                        ("РЎС‚СЂР°РЅРёС† 200 РІ РІС‹Р±РѕСЂРєРµ", str(status_counter.get(200, 0))),
                        ("Redirect-С†РµРїРѕС‡РµРє > 1 С€Р°РіР°", str(len([item for item in audit["redirect_checks"] if len(item["chain"]) > 1]))),
                        ("Canonical coverage", f"{math.floor(audit['canonical_coverage_ratio'] * 100)}%"),
                        ("РРЅРґРµРєСЃРёСЂСѓРµРјС‹С… query-URL", str(len(query_pages))),
                    ],
                    "findings": [
                        f"Р’ РІС‹Р±РѕСЂРєРµ {status_counter.get(200, 0)} СЃС‚СЂР°РЅРёС† РѕС‚РІРµС‡Р°СЋС‚ РєРѕРґРѕРј 200." if status_counter else "РЎС‚Р°С‚СѓСЃ-РєРѕРґС‹ РІ РІС‹Р±РѕСЂРєРµ РїСЂРѕРІРµСЂРёС‚СЊ РЅРµ СѓРґР°Р»РѕСЃСЊ.",
                        "Р•СЃС‚СЊ Р»РёС€РЅСЏСЏ redirect-С†РµРїРѕС‡РєР° РЅР° РґРѕРјРµРЅРЅС‹С… РІР°СЂРёР°РЅС‚Р°С…." if any("redirect" in issue.title.lower() for issue in audit["issues"]) else "Р›РёС€РЅРёС… РґРѕРјРµРЅРЅС‹С… redirect-С†РµРїРѕС‡РµРє РІ РєР»СЋС‡РµРІС‹С… РІР°СЂРёР°РЅС‚Р°С… РЅРµ РѕР±РЅР°СЂСѓР¶РµРЅРѕ.",
                        "Р•СЃС‚СЊ РёРЅРґРµРєСЃРёСЂСѓРµРјС‹Рµ query- РёР»Рё route-URL, РєРѕС‚РѕСЂС‹Рµ Р»СѓС‡С€Рµ РїРѕС‡РёСЃС‚РёС‚СЊ." if query_pages else "РЁСѓРјР° РѕС‚ РёРЅРґРµРєСЃРёСЂСѓРµРјС‹С… query-СЃС‚СЂР°РЅРёС† РІ РІС‹Р±РѕСЂРєРµ РїРѕС‡С‚Рё РЅРµС‚.",
                    ],
                    "priority": "HIGH" if query_pages else "MEDIUM",
                    "owner": "Backend / SEO",
                    "recommendation": "РЎРІРµСЃС‚Рё РІСЃРµ РґРѕРјРµРЅРЅС‹Рµ РІР°СЂРёР°РЅС‚С‹ Рє РѕРґРЅРѕРјСѓ РєР°РЅРѕРЅСѓ Рё Р»РёР±Рѕ Р·Р°РєСЂС‹С‚СЊ СЃР»СѓР¶РµР±РЅС‹Рµ URL РѕС‚ РёРЅРґРµРєСЃР°С†РёРё, Р»РёР±Рѕ РїРµСЂРµРІРµСЃС‚Рё РёС… РЅР° С‡РёСЃС‚С‹Рµ SEO-friendly РјР°СЂС€СЂСѓС‚С‹.",
                },
            ],
        },
        {
            "title": "Р­С‚Р°Рї 2 вЂ” РђСЂС…РёС‚РµРєС‚СѓСЂР° Рё РІРЅСѓС‚СЂРµРЅРЅСЏСЏ СЃС‚СЂСѓРєС‚СѓСЂР°",
            "intro": "РЎРјРѕС‚СЂСЋ, РЅР°СЃРєРѕР»СЊРєРѕ РїРѕРЅСЏС‚РЅР° Р°СЂС…РёС‚РµРєС‚СѓСЂР° СЃР°Р№С‚Р° Рё РєР°Рє СЂР°СЃРїСЂРµРґРµР»СЏСЋС‚СЃСЏ СЃСЃС‹Р»РєРё РІРЅСѓС‚СЂРё РІС‹Р±РѕСЂРєРё.",
            "checks": [
                {
                    "name": "РўРёРїС‹ СЃС‚СЂР°РЅРёС† Рё РїРѕРєСЂС‹С‚РёРµ РІС‹Р±РѕСЂРєРё",
                    "checked": "РљР°РєРёРµ С‚РёРїС‹ URL СЂРµР°Р»СЊРЅРѕ РїРѕРїР°Р»Рё РІ СЂР°Р·Р±РѕСЂ Рё РєР°Рє СЃР°Р№С‚ РґСЂРѕР±РёС‚ СЃРїСЂРѕСЃ.",
                    "method": "РљР»Р°СЃСЃРёС„РёРєР°С†РёСЏ URL РїРѕ РіР»СѓР±РёРЅРµ, query-РїР°СЂР°РјРµС‚СЂР°Рј Рё С‚РёРїР°Рј schema.",
                    "metrics": [
                        ("Р“Р»Р°РІРЅР°СЏ", str(page_type_counter.get("Р“Р»Р°РІРЅР°СЏ", 0))),
                        ("РљР°С‚РµРіРѕСЂРёРё / РїРѕРґРєР°С‚РµРіРѕСЂРёРё", str(page_type_counter.get("РљР°С‚РµРіРѕСЂРёСЏ", 0) + page_type_counter.get("РџРѕРґРєР°С‚РµРіРѕСЂРёСЏ", 0))),
                        ("Р’РЅСѓС‚СЂРµРЅРЅРёРµ СЃС‚СЂР°РЅРёС†С‹", str(page_type_counter.get("Р’РЅСѓС‚СЂРµРЅРЅСЏСЏ", 0))),
                        ("РЎР»СѓР¶РµР±РЅС‹Рµ URL", str(page_type_counter.get("РЎР»СѓР¶РµР±РЅР°СЏ", 0))),
                    ],
                    "findings": [
                        "Р’С‹Р±РѕСЂРєР° СѓР¶Рµ РїРѕРєСЂС‹РІР°РµС‚ СЂР°Р·РЅС‹Рµ СѓСЂРѕРІРЅРё СЃС‚СЂСѓРєС‚СѓСЂС‹, РїРѕСЌС‚РѕРјСѓ РІРёРґРЅРѕ РЅРµ С‚РѕР»СЊРєРѕ РіР»Р°РІРЅСѓСЋ, РЅРѕ Рё С€Р°Р±Р»РѕРЅС‹ РІРЅСѓС‚СЂРµРЅРЅРёС… СЃС‚СЂР°РЅРёС†.",
                        "Р’ Р°СЂС…РёС‚РµРєС‚СѓСЂРµ РµСЃС‚СЊ СЃР»СѓР¶РµР±РЅС‹Рµ РёР»Рё route-СЃС‚СЂР°РЅРёС†С‹, РєРѕС‚РѕСЂС‹Рµ СЃРјРµС€РёРІР°СЋС‚СЃСЏ СЃ РєРѕРјРјРµСЂС‡РµСЃРєРёРјРё URL." if page_type_counter.get("РЎР»СѓР¶РµР±РЅР°СЏ", 0) else "РЇРІРЅРѕРіРѕ РґР°РІР»РµРЅРёСЏ СЃР»СѓР¶РµР±РЅС‹С… URL РЅР° РІС‹Р±РѕСЂРєСѓ РїРѕС‡С‚Рё РЅРµС‚.",
                        f"Р”Р»РёРЅРЅС‹С… РїСѓС‚РµР№ РІ РІС‹Р±РѕСЂРєРµ: {len(long_path_pages)}." if long_path_pages else "РЎРёР»СЊРЅРѕРіРѕ РїРµСЂРµРєРѕСЃР° РІ СЃС‚РѕСЂРѕРЅСѓ СЃР»РёС€РєРѕРј РґР»РёРЅРЅС‹С… URL РІ РІС‹Р±РѕСЂРєРµ РЅРµ РІРёРґРЅРѕ.",
                    ],
                    "priority": "MEDIUM",
                    "owner": "SEO / Backend",
                    "recommendation": "Р”РµСЂР¶Р°С‚СЊ Р°СЂС…РёС‚РµРєС‚СѓСЂСѓ СЃРїСЂРѕСЃР° РѕС‚РґРµР»СЊРЅРѕР№ РѕС‚ СЃР»СѓР¶РµР±РЅРѕР№ Р»РѕРіРёРєРё Рё РЅРµ СЃРјРµС€РёРІР°С‚СЊ route/query URL СЃ РїРѕСЃР°РґРѕС‡РЅС‹РјРё Рё РєРѕРјРјРµСЂС‡РµСЃРєРёРјРё СЃС‚СЂР°РЅРёС†Р°РјРё.",
                },
                {
                    "name": "Р’РЅСѓС‚СЂРµРЅРЅСЏСЏ РїРµСЂРµР»РёРЅРєРѕРІРєР° Рё РІРёРґРёРјРѕСЃС‚СЊ РєР»СЋС‡РµРІС‹С… СЃС‚СЂР°РЅРёС†",
                    "checked": "РЎРєРѕР»СЊРєРѕ РІРЅСѓС‚СЂРµРЅРЅРёС… СЃСЃС‹Р»РѕРє РїРѕР»СѓС‡Р°СЋС‚ СЃС‚СЂР°РЅРёС†С‹ Рё РіРґРµ РµСЃС‚СЊ РїСЂРѕСЃР°РґРєРё РїРѕ РІРЅРёРјР°РЅРёСЋ СЃР°Р№С‚Р°.",
                    "method": "РџРѕРґСЃС‡РµС‚ РІРЅСѓС‚СЂРµРЅРЅРёС… СЃСЃС‹Р»РѕРє РЅР° РєР°Р¶РґРѕР№ СЃС‚СЂР°РЅРёС†Рµ РІС‹Р±РѕСЂРєРё.",
                    "metrics": [
                        ("РЎСЂРµРґРЅРµРµ С‡РёСЃР»Рѕ РІРЅСѓС‚СЂРµРЅРЅРёС… СЃСЃС‹Р»РѕРє", str(average_internal_links)),
                        ("РњРёРЅРёРјСѓРј РІРЅСѓС‚СЂРµРЅРЅРёС… СЃСЃС‹Р»РѕРє", str(low_link_pages[0].internal_links if low_link_pages else 0)),
                        ("РњР°РєСЃРёРјСѓРј РІРЅСѓС‚СЂРµРЅРЅРёС… СЃСЃС‹Р»РѕРє", str(max([page.internal_links for page in sample_pages], default=0))),
                        ("РљРѕРЅС‚Р°РєС‚РЅС‹С…/lead-СЃС‚СЂР°РЅРёС†", str(len(contact_pages))),
                    ],
                    "findings": [
                        f"РЎР»Р°Р±РµРµ РІСЃРµРіРѕ РїРѕ РІРЅСѓС‚СЂРµРЅРЅРёРј СЃСЃС‹Р»РєР°Рј РІС‹РіР»СЏРґСЏС‚: {', '.join(human_path(page.url) for page in low_link_pages if page.url)}." if low_link_pages else "РЎР»Р°Р±С‹Рµ СЃС‚СЂР°РЅРёС†С‹ РїРѕ РїРµСЂРµР»РёРЅРєРѕРІРєРµ РЅРµ РІС‹РґРµР»СЏСЋС‚СЃСЏ.",
                        "РљРѕРЅС‚Р°РєС‚РЅС‹Рµ СЃС‚СЂР°РЅРёС†С‹ РµСЃС‚СЊ, РЅРѕ С‡Р°СЃС‚СЊ РёР· РЅРёС… РЅРµРґРѕРѕС„РѕСЂРјР»РµРЅР° РєР°Рє РїРѕР»РЅРѕС†РµРЅРЅС‹Рµ SEO-РїРѕСЃР°РґРєРё." if weak_contact_pages else "РљРѕРЅС‚Р°РєС‚РЅР°СЏ Р·РѕРЅР° РІ РІС‹Р±РѕСЂРєРµ РІС‹РіР»СЏРґРёС‚ С†РµР»СЊРЅРѕ.",
                        "Р Р°Р·СѓРјРЅРѕ РґРѕР±Р°РІРёС‚СЊ Р±РѕР»СЊС€Рµ РєРѕРЅС‚РµРєСЃС‚РЅС‹С… СЃСЃС‹Р»РѕРє РјРµР¶РґСѓ Р±Р»РёР·РєРёРјРё СѓСЃР»СѓРіР°РјРё, РєРµР№СЃР°РјРё, Р±Р»РѕРіРѕРј Рё Р»РёРґ-СЃС‚СЂР°РЅРёС†Р°РјРё.",
                    ],
                    "priority": "MEDIUM",
                    "owner": "SEO / Marketing",
                    "recommendation": "РЈСЃРёР»РёС‚СЊ РїРµСЂРµР»РёРЅРєРѕРІРєСѓ РІРѕРєСЂСѓРі РїСЂРёРѕСЂРёС‚РµС‚РЅС‹С… СѓСЃР»СѓРі Рё Р»РёРґ-СЃС‚СЂР°РЅРёС†: СЃРІСЏР·Р°С‚СЊ СЃРїСЂРѕСЃРѕРІС‹Рµ СЃС‚СЂР°РЅРёС†С‹, РєРµР№СЃС‹, FAQ Рё CTA, Р° РЅРµ РЅР°РґРµСЏС‚СЊСЃСЏ С‚РѕР»СЊРєРѕ РЅР° РјРµРЅСЋ Рё С„СѓС‚РµСЂ.",
                },
            ],
        },
        {
            "title": "Р­С‚Р°Рї 3 вЂ” On-Page SEO",
            "intro": "Р Р°Р·Р±РёСЂР°СЋ С€Р°Р±Р»РѕРЅС‹ title, description, H1 Рё С‚Рѕ, РЅР°СЃРєРѕР»СЊРєРѕ СЃС‚СЂР°РЅРёС†С‹ РіРѕС‚РѕРІС‹ Рє РЅРѕСЂРјР°Р»СЊРЅРѕРјСѓ СЃРЅРёРїРїРµС‚Сѓ.",
            "checks": [
                {
                    "name": "Title Рё meta description",
                    "checked": "РџРѕРєСЂС‹С‚РёРµ, РґР»РёРЅР° Рё РїСЂРёРіРѕРґРЅРѕСЃС‚СЊ СЃРЅРёРїРїРµС‚РѕРІ Рє СѓРїСЂР°РІР»СЏРµРјРѕР№ РІС‹РґР°С‡Рµ.",
                    "method": "РџР°СЂСЃРёРЅРі title Рё meta description РїРѕ СЂРµРїСЂРµР·РµРЅС‚Р°С‚РёРІРЅРѕР№ РІС‹Р±РѕСЂРєРµ СЃС‚СЂР°РЅРёС†.",
                    "metrics": [
                        ("Title > 70 СЃРёРјРІРѕР»РѕРІ", str(len([page for page in sample_pages if len(page.title) > 70]))),
                        ("Title РѕС‚СЃСѓС‚СЃС‚РІСѓРµС‚", str(len(missing_title_pages))),
                        ("Description РѕС‚СЃСѓС‚СЃС‚РІСѓРµС‚", str(len(missing_description_pages))),
                        ("Description РІРЅРµ РґРёР°РїР°Р·РѕРЅР°", str(len([page for page in sample_pages if len(page.description) > 160 or (0 < len(page.description) < 120)]))),
                    ],
                    "findings": [
                        "РЁР°Р±Р»РѕРЅС‹ title РЅР° С‡Р°СЃС‚Рё СЃС‚СЂР°РЅРёС† РїРµСЂРµРіСЂСѓР¶РµРЅС‹ РїРѕ РґР»РёРЅРµ." if any("title" in issue.title.lower() for issue in audit["issues"]) else "РљСЂРёС‚РёС‡РµСЃРєРѕР№ СЏРјС‹ РїРѕ title РІ РІС‹Р±РѕСЂРєРµ РЅРµ РІРёРґРЅРѕ.",
                        "Р•СЃС‚СЊ СЃС‚СЂР°РЅРёС†С‹ Р±РµР· description, РёР·-Р·Р° С‡РµРіРѕ СЃРЅРёРїРїРµС‚ Р±СѓРґРµС‚ СЃРѕР±РёСЂР°С‚СЊСЃСЏ СЃР»СѓС‡Р°Р№РЅРѕ." if missing_description_pages else "Description РїРѕРєСЂС‹С‚С‹ РґРѕСЃС‚Р°С‚РѕС‡РЅРѕ СЂРѕРІРЅРѕ.",
                        f"РџСѓСЃС‚РѕР№ title РЅР°Р№РґРµРЅ РЅР°: {', '.join(human_path(page.url) for page in missing_title_pages[:3])}." if missing_title_pages else "РџСѓСЃС‚С‹С… title РІ РІС‹Р±РѕСЂРєРµ РїРѕС‡С‚Рё РЅРµС‚.",
                    ],
                    "priority": "HIGH",
                    "owner": "SEO / Frontend",
                    "recommendation": "РџРµСЂРµСЃРѕР±СЂР°С‚СЊ РїСЂР°РІРёР»Р° РіРµРЅРµСЂР°С†РёРё title Рё description РїРѕРґ РєР°Р¶РґС‹Р№ С‚РёРї СЃС‚СЂР°РЅРёС†С‹: РєРѕСЂРѕС‚РєРѕ, РєРѕРЅРєСЂРµС‚РЅРѕ, СЃ РєР»СЋС‡РѕРј, РѕС„С„РµСЂРѕРј Рё РєРѕРЅС‚СЂРѕР»РµРј РґР»РёРЅС‹.",
                },
                {
                    "name": "H1, РєРѕРЅС‚РµРЅС‚РЅС‹Р№ РєР°СЂРєР°СЃ Рё С‚РѕРЅРєРёРµ СЃС‚СЂР°РЅРёС†С‹",
                    "checked": "РќР°Р»РёС‡РёРµ H1, РїР»РѕС‚РЅРѕСЃС‚СЊ С‚РµРєСЃС‚РѕРІРѕРіРѕ СЃР»РѕСЏ Рё РєР°С‡РµСЃС‚РІРѕ Р±Р°Р·РѕРІРѕРіРѕ on-page РєР°СЂРєР°СЃР°.",
                    "method": "РџР°СЂСЃРёРЅРі H1 Рё РїРѕРґСЃС‡РµС‚ СЃР»РѕРІ РІ РІРёРґРёРјРѕРј РєРѕРЅС‚РµРЅС‚Рµ.",
                    "metrics": [
                        ("H1 coverage", f"{math.floor(audit['h1_coverage_ratio'] * 100)}%"),
                        ("РЎС‚СЂР°РЅРёС† Р±РµР· H1", str(len(missing_h1_pages))),
                        ("РЎСЂРµРґРЅРµРµ С‡РёСЃР»Рѕ СЃР»РѕРІ", str(audit.get("average_words", 0))),
                        ("РўРѕРЅРєРёС… СЃС‚СЂР°РЅРёС† (<250 СЃР»РѕРІ)", str(len(thin_pages))),
                    ],
                    "findings": [
                        "РЈ С‡Р°СЃС‚Рё СЃС‚СЂР°РЅРёС† РЅРµС‚ H1, РїРѕСЌС‚РѕРјСѓ РїРѕРёСЃРєРѕРІРёРєСѓ СЃР»РѕР¶РЅРµРµ РїРѕРЅСЏС‚СЊ РіР»Р°РІРЅС‹Р№ РёРЅС‚РµРЅС‚ URL." if missing_h1_pages else "РџРѕ H1 РєР°СЂРєР°СЃ Сѓ РІС‹Р±РѕСЂРєРё РІ С†РµР»РѕРј СЃРѕР±СЂР°РЅ РЅРµРїР»РѕС…Рѕ.",
                        "Р•СЃС‚СЊ С‚РѕРЅРєРёРµ СЃС‚СЂР°РЅРёС†С‹ СЃ РјРёРЅРёРјР°Р»СЊРЅС‹Рј С‚РµРєСЃС‚РѕРІС‹Рј СЃР»РѕРµРј." if thin_pages else "РЎРёР»СЊРЅРѕ РїСѓСЃС‚С‹С… СЃС‚СЂР°РЅРёС† РІ РІС‹Р±РѕСЂРєРµ РЅРµРјРЅРѕРіРѕ.",
                        "Р”Р°Р¶Рµ РїСЂРё РЅРѕСЂРјР°Р»СЊРЅРѕРј РѕР±СЉРµРјРµ С‚РµРєСЃС‚Р° РЅСѓР¶РЅРѕ РѕС‚РґРµР»СЊРЅРѕ РїСЂРѕРІРµСЂРёС‚СЊ, РЅР°СЃРєРѕР»СЊРєРѕ С…РѕСЂРѕС€Рѕ РѕРЅ РїРѕРґРґРµСЂР¶РёРІР°РµС‚ РєРѕРјРјРµСЂС‡РµСЃРєРёР№ РёРЅС‚РµРЅС‚ Рё FAQ-СЃР»РѕР№.",
                    ],
                    "priority": "MEDIUM",
                    "owner": "SEO / Content",
                    "recommendation": "РќР° РєР°Р¶РґРѕРј РєР»СЋС‡РµРІРѕРј URL Р·Р°РєСЂРµРїРёС‚СЊ РїРѕРЅСЏС‚РЅС‹Р№ H1, РёРЅС‚СЂРѕ, РѕС‚РІРµС‚С‹ РЅР° С‡Р°СЃС‚С‹Рµ РІРѕРїСЂРѕСЃС‹ Рё РєРѕСЂРѕС‚РєРёРµ РєРѕРјРјРµСЂС‡РµСЃРєРёРµ Р±Р»РѕРєРё, С‡С‚РѕР±С‹ СЃС‚СЂР°РЅРёС†Р° СЂР°Р±РѕС‚Р°Р»Р° РЅРµ С‚РѕР»СЊРєРѕ РЅР° РёРЅРґРµРєСЃ, РЅРѕ Рё РЅР° РєРѕРЅРІРµСЂСЃРёСЋ.",
                },
            ],
        },
        {
            "title": "Р­С‚Р°Рї 4 вЂ” Performance Рё CWV",
            "intro": "РЎРјРѕС‚СЂСЋ РЅР° СЃРєРѕСЂРѕСЃС‚СЊ РѕС‚РІРµС‚Р°, РІРµСЃ HTML Рё С‚Рѕ, РєР°Рє РјРµРґРёР°-СЃР»РѕР№ РјРѕР¶РµС‚ РјРµС€Р°С‚СЊ Р·Р°РіСЂСѓР·РєРµ.",
            "checks": [
                {
                    "name": "РћС‚РІРµС‚ СЃРµСЂРІРµСЂР° Рё РІРµСЃ СЃС‚СЂР°РЅРёС†",
                    "checked": "TTFB-РїРѕРґРѕР±РЅР°СЏ СЃРєРѕСЂРѕСЃС‚СЊ РѕС‚РІРµС‚Р° Рё РїСЂРёРјРµСЂРЅС‹Р№ РІРµСЃ HTML РїРѕ РІС‹Р±РѕСЂРєРµ.",
                    "method": "HTTP-РѕС‚РІРµС‚С‹ РїРѕ РєР»СЋС‡РµРІС‹Рј URL Р±РµР· РѕС‚РґРµР»СЊРЅРѕРіРѕ Lighthouse-РїСЂРѕРіРѕРЅР°.",
                    "metrics": [
                        ("РЎСЂРµРґРЅРёР№ РѕС‚РІРµС‚", f"{audit.get('average_response_ms', 0)} ms"),
                        ("РЎСЂРµРґРЅРёР№ HTML", f"{audit.get('average_html_kb', 0)} KB"),
                        ("РњР°РєСЃРёРјСѓРј РёР·РѕР±СЂР°Р¶РµРЅРёР№ РЅР° СЃС‚СЂР°РЅРёС†Рµ", str(max([page.image_count for page in sample_pages], default=0))),
                        ("РЎС‚СЂР°РЅРёС† РІ РІС‹Р±РѕСЂРєРµ", str(len(sample_pages))),
                    ],
                    "findings": [
                        "РЎРєРѕСЂРѕСЃС‚СЊ РѕС‚РІРµС‚Р° СЃРµСЂРІРµСЂР° СЃР°РјР° РїРѕ СЃРµР±Рµ РЅРµ РІС‹РіР»СЏРґРёС‚ РіР»Р°РІРЅС‹Рј СЃС‚РѕРї-С„Р°РєС‚РѕСЂРѕРј." if audit.get("average_response_ms", 0) < 600 else "РЎСЂРµРґРЅРёР№ РѕС‚РІРµС‚ СѓР¶Рµ СЃС‚РѕРёС‚ РґРµСЂР¶Р°С‚СЊ РІ Р·РѕРЅРµ РІРЅРёРјР°РЅРёСЏ.",
                        "Р РµР°Р»СЊРЅС‹Рµ СЂРёСЃРєРё Р·РґРµСЃСЊ С‡Р°С‰Рµ СЃРёРґСЏС‚ РІ РјРµРґРёР°-СЃР»РѕРµ, С€Р°Р±Р»РѕРЅР°С… Рё РєР»РёРµРЅС‚СЃРєРѕРј СЂРµРЅРґРµСЂРёРЅРіРµ, С‡РµРј РІ РіРѕР»РѕРј TTFB.",
                    ],
                    "priority": "MEDIUM",
                    "owner": "Frontend / Backend",
                    "recommendation": "РџСЂРѕРІРµСЂРёС‚СЊ РїСЂРёРѕСЂРёС‚РµС‚РЅС‹Рµ СЃС‚СЂР°РЅРёС†С‹ РѕС‚РґРµР»СЊРЅС‹Рј CWV-РїСЂРѕРіРѕРЅРѕРј Рё Р·Р°С„РёРєСЃРёСЂРѕРІР°С‚СЊ LCP/CLS/INP РїРѕСЃР»Рµ С‡РёСЃС‚РєРё РјРµРґРёР° Рё С€Р°Р±Р»РѕРЅРѕРІ.",
                },
                {
                    "name": "РР·РѕР±СЂР°Р¶РµРЅРёСЏ, lazy loading Рё Р°С‚СЂРёР±СѓС‚С‹ СЂР°Р·РјРµСЂРѕРІ",
                    "checked": "РќР°СЃРєРѕР»СЊРєРѕ РјРµРґРёР°-СЃР»РѕР№ РїРѕРјРѕРіР°РµС‚ РёР»Рё РјРµС€Р°РµС‚ SEO Рё СЃС‚Р°Р±РёР»СЊРЅРѕСЃС‚Рё РІРµСЂСЃС‚РєРё.",
                    "method": "РџР°СЂСЃРёРЅРі img-С‚РµРіРѕРІ РїРѕ СЂРµРїСЂРµР·РµРЅС‚Р°С‚РёРІРЅРѕР№ РІС‹Р±РѕСЂРєРµ СЃС‚СЂР°РЅРёС†.",
                    "metrics": [
                        ("Р’СЃРµРіРѕ РїСЂРѕРїСѓСЃРєРѕРІ alt", str(audit.get("total_missing_alt", 0))),
                        ("РџСЂРѕРїСѓСЃРєРѕРІ lazy loading", str(total_lazy_gaps)),
                        ("РР·РѕР±СЂР°Р¶РµРЅРёР№ Р±РµР· width/height", str(total_dimension_gaps)),
                        ("РР·РѕР±СЂР°Р¶РµРЅРёР№ РЅР° РіР»Р°РІРЅРѕР№", str(audit["home_page"].image_count)),
                    ],
                    "findings": [
                        "РР·РѕР±СЂР°Р¶РµРЅРёСЏ СѓР¶Рµ С‚РµСЂСЏСЋС‚ SEO-СЃРёРіРЅР°Р»С‹ РёР·-Р·Р° РїСЂРѕРїСѓСЃРєРѕРІ alt." if audit.get("total_missing_alt", 0) else "РњР°СЃСЃРѕРІРѕРіРѕ РїСЂРѕРІР°Р»Р° РїРѕ alt РІ РІС‹Р±РѕСЂРєРµ РЅРµ РІРёРґРЅРѕ.",
                        "РћС‚СЃСѓС‚СЃС‚РІРёРµ width/height РїРѕРІС‹С€Р°РµС‚ СЂРёСЃРє CLS Рё РІРёР·СѓР°Р»СЊРЅРѕР№ РЅРµСЃС‚Р°Р±РёР»СЊРЅРѕСЃС‚Рё." if total_dimension_gaps else "РђС‚СЂРёР±СѓС‚С‹ СЂР°Р·РјРµСЂРѕРІ РЅР° РєР°СЂС‚РёРЅРєР°С… РІ С†РµР»РѕРј РїСЂРёСЃСѓС‚СЃС‚РІСѓСЋС‚.",
                        "Lazy loading СЃС‚РѕРёС‚ РІС‹СЂРѕРІРЅСЏС‚СЊ С€Р°Р±Р»РѕРЅРЅРѕ, Р° РЅРµ РїСЂР°РІРёС‚СЊ РІСЂСѓС‡РЅСѓСЋ РїРѕ РѕРґРЅРѕР№ СЃС‚СЂР°РЅРёС†Рµ." if total_lazy_gaps else "РЇРІРЅРѕР№ РјР°СЃСЃРѕРІРѕР№ РїСЂРѕР±Р»РµРјС‹ РїРѕ lazy loading РІ РІС‹Р±РѕСЂРєРµ РЅРµ РІРёРґРЅРѕ.",
                    ],
                    "priority": "MEDIUM",
                    "owner": "Frontend / SEO",
                    "recommendation": "РЎРґРµР»Р°С‚СЊ РµРґРёРЅС‹Р№ image-С€Р°Р±Р»РѕРЅ: alt, width/height, lazy loading Рё, РїСЂРё РЅРµРѕР±С…РѕРґРёРјРѕСЃС‚Рё, РѕС‚РґРµР»СЊРЅСѓСЋ image-СЃС…РµРјСѓ/РєР°СЂС‚Сѓ СЃР°Р№С‚Р°.",
                },
            ],
        },
        {
            "title": "Р­С‚Р°Рї 5 вЂ” Structured Data",
            "intro": "РџСЂРѕРІРµСЂСЏСЋ, РЅР°СЃРєРѕР»СЊРєРѕ С…РѕСЂРѕС€Рѕ СЃР°Р№С‚ РѕР±СЉСЏСЃРЅСЏРµС‚ РїРѕРёСЃРєРѕРІРёРєСѓ СЃСѓС‰РЅРѕСЃС‚Рё Р±РёР·РЅРµСЃР°, СЃС‚СЂР°РЅРёС† Рё РїСЂРµРґР»РѕР¶РµРЅРёР№.",
            "checks": [
                {
                    "name": "РџРѕРєСЂС‹С‚РёРµ schema-СЂР°Р·РјРµС‚РєРѕР№",
                    "checked": "РљР°РєРёРµ С‚РёРїС‹ schema СЂРµР°Р»СЊРЅРѕ РІСЃС‚СЂРµС‡Р°СЋС‚СЃСЏ Рё РЅР°СЃРєРѕР»СЊРєРѕ С€РёСЂРѕРєРѕ РѕРЅРё РїРѕРєСЂС‹РІР°СЋС‚ РІС‹Р±РѕСЂРєСѓ.",
                    "method": "РџР°СЂСЃРёРЅРі application/ld+json Рё СЃР±РѕСЂ @type РїРѕ РєР»СЋС‡РµРІС‹Рј URL.",
                    "metrics": [
                        ("Schema coverage", f"{math.floor(audit['schema_coverage_ratio'] * 100)}%"),
                        ("РЎС‚СЂР°РЅРёС† СЃ Р±РёС‚РѕР№ JSON-LD", str(len(invalid_schema_pages))),
                        ("РЎС‚СЂР°РЅРёС† Р±РµР· schema", str(len([page for page in sample_pages if not page.schema_types]))),
                        ("РўРѕРї schema types", ", ".join(f"{name} ({count})" for name, count in schema_counter.most_common(3)) or "РЅРµС‚"),
                    ],
                    "findings": [
                        "Р•СЃС‚СЊ СЃС‚СЂР°РЅРёС†С‹ СЃ РЅРµРІР°Р»РёРґРЅРѕР№ JSON-LD." if invalid_schema_pages else "РЇРІРЅС‹С… РїРѕР»РѕРјРѕРє JSON-LD РІ РІС‹Р±РѕСЂРєРµ РЅРµ РІРёРґРЅРѕ.",
                        "Р§Р°СЃС‚СЊ РєРѕРјРјРµСЂС‡РµСЃРєРёС… СЃС‚СЂР°РЅРёС† РїРѕРєР° Р±РµР· schema-СЂР°Р·РјРµС‚РєРё." if missing_schema_commercial else "РљРѕРјРјРµСЂС‡РµСЃРєРёРµ СЃС‚СЂР°РЅРёС†С‹ РІ РІС‹Р±РѕСЂРєРµ СѓР¶Рµ РЅРµРїР»РѕС…Рѕ РїРѕРєСЂС‹С‚С‹ schema.",
                        "Р”Р°Р¶Рµ РїСЂРё РЅР°Р»РёС‡РёРё schema РІР°Р¶РЅРѕ, С‡С‚РѕР±С‹ РѕРЅР° СЃРѕРѕС‚РІРµС‚СЃС‚РІРѕРІР°Р»Р° С‚РёРїСѓ СЃС‚СЂР°РЅРёС†С‹ Рё Р±С‹Р»Р° РІР°Р»РёРґРЅРѕР№ РїРѕ СЃРёРЅС‚Р°РєСЃРёСЃСѓ.",
                    ],
                    "priority": "HIGH" if invalid_schema_pages else "MEDIUM",
                    "owner": "Frontend / SEO",
                    "recommendation": "РџРѕРєСЂС‹С‚СЊ РєР»СЋС‡РµРІС‹Рµ С€Р°Р±Р»РѕРЅС‹ РІР°Р»РёРґРЅРѕР№ schema-СЂР°Р·РјРµС‚РєРѕР№ Рё РґРµСЂР¶Р°С‚СЊ РµРµ СЃРёРЅС…СЂРѕРЅРЅРѕР№ СЃ СЂРµР°Р»СЊРЅС‹Рј С‚РёРїРѕРј СЃС‚СЂР°РЅРёС†С‹: Organization, Service, Product, BreadcrumbList, FAQ, Article.",
                },
            ],
        },
        {
            "title": "Р­С‚Р°Рї 6 вЂ” РљРѕРјРјРµСЂС‡РµСЃРєРёРµ СЃС‚СЂР°РЅРёС†С‹ Рё РєРѕРЅС‚РµРЅС‚",
            "intro": "РЎРјРѕС‚СЂСЋ, РЅР°СЃРєРѕР»СЊРєРѕ СЃР°Р№С‚ РіРѕС‚РѕРІ РЅРµ С‚РѕР»СЊРєРѕ СЃРѕР±РёСЂР°С‚СЊ РёРЅРґРµРєСЃ, РЅРѕ Рё РїСЂРµРІСЂР°С‰Р°С‚СЊ СЃРїСЂРѕСЃ РІ Р·Р°СЏРІРєСѓ.",
            "checks": [
                {
                    "name": "РљРѕРЅС‚Р°РєС‚РЅС‹Рµ Рё Р»РёРґ-СЃС‚СЂР°РЅРёС†С‹",
                    "checked": "Р•СЃС‚СЊ Р»Рё РЅР° СЃР°Р№С‚Рµ СЃС‚СЂР°РЅРёС†С‹, РєРѕС‚РѕСЂС‹Рµ РјРѕР¶РЅРѕ РїСЂРѕРґРІРёРіР°С‚СЊ РєР°Рє С‚РѕС‡РєРё РІС…РѕРґР° РІ Р·Р°СЏРІРєСѓ.",
                    "method": "РџРѕРёСЃРє С„РѕСЂРј, РєРѕРЅС‚Р°РєС‚РЅС‹С… URL Рё Р±Р°Р·РѕРІРѕР№ SEO-РѕР±РІСЏР·РєРё СЌС‚РёС… СЃС‚СЂР°РЅРёС†.",
                    "metrics": [
                        ("РљРѕРЅС‚Р°РєС‚РЅС‹С…/lead-СЃС‚СЂР°РЅРёС†", str(len(contact_pages))),
                        ("Р¤РѕСЂРј РІ РІС‹Р±РѕСЂРєРµ", str(len([page for page in sample_pages if page.has_forms]))),
                        ("РЎР»Р°Р±С‹С… contact-СЃС‚СЂР°РЅРёС†", str(len(weak_contact_pages))),
                        ("РРЅРґРµРєСЃРёСЂСѓРµРјС‹С… route/query-СЃС‚СЂР°РЅРёС†", str(len(query_pages))),
                    ],
                    "findings": [
                        "РљРѕРЅС‚Р°РєС‚РЅР°СЏ Р·РѕРЅР° СѓР¶Рµ РµСЃС‚СЊ, РЅРѕ С‡Р°СЃС‚СЊ СЃС‚СЂР°РЅРёС† РЅРµ РѕС„РѕСЂРјР»РµРЅР° РєР°Рє РїРѕР»РЅРѕС†РµРЅРЅС‹Рµ SEO-РїРѕСЃР°РґРєРё." if weak_contact_pages else "РљРѕРЅС‚Р°РєС‚РЅС‹Рµ СЃС‚СЂР°РЅРёС†С‹ РІ РІС‹Р±РѕСЂРєРµ РІС‹РіР»СЏРґСЏС‚ СЃРѕР±СЂР°РЅРЅРѕ.",
                        "Р•СЃС‚СЊ С„РѕСЂРјС‹, РЅРѕ РЅСѓР¶РЅРѕ РїСЂРѕРІРµСЂСЏС‚СЊ, РЅР°СЃРєРѕР»СЊРєРѕ РІРѕРєСЂСѓРі РЅРёС… СЃРѕР±СЂР°РЅ РґРѕРІРµСЂРёС‚РµР»СЊРЅС‹Р№ Рё РєРѕРјРјРµСЂС‡РµСЃРєРёР№ СЃР»РѕР№.",
                        "РЎР»СѓР¶РµР±РЅС‹Рµ query/route URL РЅРµ РґРѕР»Р¶РЅС‹ РєРѕРЅРєСѓСЂРёСЂРѕРІР°С‚СЊ СЃ РЅРѕСЂРјР°Р»СЊРЅС‹РјРё РїРѕСЃР°РґРѕС‡РЅС‹РјРё СЃС‚СЂР°РЅРёС†Р°РјРё." if query_pages else "РЁСѓРјР° РѕС‚ СЃР»СѓР¶РµР±РЅС‹С… Р»РёРґ-URL РІ РІС‹Р±РѕСЂРєРµ РЅРµРјРЅРѕРіРѕ.",
                    ],
                    "priority": "HIGH",
                    "owner": "SEO / Marketing",
                    "recommendation": "РЎРґРµР»Р°С‚СЊ РёР· РєРѕРЅС‚Р°РєС‚РѕРІ Рё Р·Р°СЏРІРєРё СЃРёР»СЊРЅС‹Рµ РїРѕСЃР°РґРѕС‡РЅС‹Рµ: СЃ РѕС„С„РµСЂРѕРј, РѕС‚РІРµС‚Р°РјРё РЅР° РІРѕР·СЂР°Р¶РµРЅРёСЏ, Р±Р»РѕРєР°РјРё РґРѕРІРµСЂРёСЏ, FAQ Рё Р°РєРєСѓСЂР°С‚РЅРѕР№ SEO-РѕР±РІСЏР·РєРѕР№.",
                },
                {
                    "name": "РљРѕРЅС‚РµРЅС‚РЅР°СЏ РіР»СѓР±РёРЅР° РїСЂРёРѕСЂРёС‚РµС‚РЅС‹С… СЃС‚СЂР°РЅРёС†",
                    "checked": "РҐРІР°С‚Р°РµС‚ Р»Рё СЃС‚СЂР°РЅРёС†Р°Рј С„Р°РєС‚СѓСЂС‹, С‡С‚РѕР±С‹ Р·Р°РєСЂС‹РІР°С‚СЊ РёРЅС‚РµРЅС‚, Р° РЅРµ РїСЂРѕСЃС‚Рѕ СЃСѓС‰РµСЃС‚РІРѕРІР°С‚СЊ РІ РёРЅРґРµРєСЃРµ.",
                    "method": "РџРѕРґСЃС‡РµС‚ СЃР»РѕРІ Рё РїСЂРѕСЃРјРѕС‚СЂ РєРѕРјРјРµСЂС‡РµСЃРєРёС… С€Р°Р±Р»РѕРЅРѕРІ РІРЅСѓС‚СЂРё СЂРµРїСЂРµР·РµРЅС‚Р°С‚РёРІРЅРѕР№ РІС‹Р±РѕСЂРєРё.",
                    "metrics": [
                        ("РљРѕРјРјРµСЂС‡РµСЃРєРёС… СЃС‚СЂР°РЅРёС† РІ РІС‹Р±РѕСЂРєРµ", str(len(commercial_pages))),
                        ("РЎСЂРµРґРЅРµРµ С‡РёСЃР»Рѕ СЃР»РѕРІ", str(average_commercial_words)),
                        ("РўРѕРЅРєРёС… СЃС‚СЂР°РЅРёС†", str(len(thin_pages))),
                        ("РЎС‚СЂР°РЅРёС† Р±РµР· schema СЃСЂРµРґРё РєРѕРјРјРµСЂС‡РµСЃРєРёС…", str(len(missing_schema_commercial))),
                    ],
                    "findings": [
                        "РћРґРЅРѕРіРѕ РѕР±СЉРµРјР° С‚РµРєСЃС‚Р° РЅРµРґРѕСЃС‚Р°С‚РѕС‡РЅРѕ: СЃС‚СЂР°РЅРёС†С‹ РґРѕР»Р¶РЅС‹ РѕР±СЉСЏСЃРЅСЏС‚СЊ РІС‹Р±РѕСЂ, С†РµРЅСѓ, РїСЂРѕС†РµСЃСЃ, СЃСЂРѕРєРё Рё СЃР»РµРґСѓСЋС‰РёР№ С€Р°Рі.",
                        "Р§Р°СЃС‚СЊ СЃС‚СЂР°РЅРёС† РѕСЃС‚Р°РµС‚СЃСЏ С‚РѕРЅРєРѕР№ РїРѕ С„Р°РєС‚СѓСЂРµ." if thin_pages else "РЎРёР»СЊРЅРѕ РїСѓСЃС‚С‹С… РєРѕРјРјРµСЂС‡РµСЃРєРёС… СЃС‚СЂР°РЅРёС† РІ РІС‹Р±РѕСЂРєРµ РЅРµРјРЅРѕРіРѕ.",
                        "РџРѕС‚РµРЅС†РёР°Р» СЂРѕСЃС‚Р° Р»РµР¶РёС‚ РЅРµ С‚РѕР»СЊРєРѕ РІ SEO-С‚РµРєСЃС‚Р°С…, РЅРѕ Рё РІ Р±Р»РѕРєР°С… РґРѕРІРµСЂРёСЏ, FAQ, С‚Р°Р±Р»РёС†Р°С… СЃСЂР°РІРЅРµРЅРёСЏ Рё РѕС‚РІРµС‚Р°С… РЅР° СЃРїСЂРѕСЃ.",
                    ],
                    "priority": "MEDIUM",
                    "owner": "SEO / Content / Marketing",
                    "recommendation": "РџРµСЂРµСЃРѕР±СЂР°С‚СЊ РїСЂРёРѕСЂРёС‚РµС‚РЅС‹Рµ РїРѕСЃР°РґРѕС‡РЅС‹Рµ РїРѕРґ РєРѕРјРјРµСЂС‡РµСЃРєРёР№ РёРЅС‚РµРЅС‚: РґРѕР±Р°РІРёС‚СЊ РґРѕРєР°Р·Р°С‚РµР»СЊСЃС‚РІР°, FAQ, answer-first Р±Р»РѕРєРё, С†РµРЅС‹/СЃС†РµРЅР°СЂРёРё Рё РїРµСЂРµР»РёРЅРєРѕРІРєСѓ РЅР° СЃРѕСЃРµРґРЅРёРµ С‚РѕС‡РєРё СЃРїСЂРѕСЃР°.",
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
                title="robots.txt РєРѕРЅС„Р»РёРєС‚СѓРµС‚ СЃ СЃРѕР±СЃС‚РІРµРЅРЅРѕР№ РєР°СЂС‚РѕР№ СЃР°Р№С‚Р°",
                why_it_matters=(
                    "РЎРµР№С‡Р°СЃ РІ robots.txt РѕРґРЅРѕРІСЂРµРјРµРЅРЅРѕ СѓРєР°Р·Р°РЅ Sitemap Рё СЃС‚РѕРёС‚ Disallow РЅР° sitemap.xml. "
                    "Р”Р»СЏ РЇРЅРґРµРєСЃР° Рё С‡Р°СЃС‚Рё СЃРµСЂРІРёСЃРѕРІ СЌС‚Рѕ РІС‹РіР»СЏРґРёС‚ РєР°Рє РєРѕРЅС„Р»РёРєС‚ СЃРёРіРЅР°Р»РѕРІ Рё РјРµС€Р°РµС‚ С‡РёСЃС‚РѕР№ РёРЅРґРµРєСЃР°С†РёРё."
                ),
                evidence=[
                    "Р’ robots.txt РЅР°Р№РґРµРЅРѕ РїСЂР°РІРёР»Рѕ `Disallow: *sitemap.xml`.",
                    "РћРґРЅРѕРІСЂРµРјРµРЅРЅРѕ С„Р°Р№Р» СЃРѕРґРµСЂР¶РёС‚ `Sitemap: https://akvarium-akvas.ru/sitemap.xml`.",
                ],
                recommendation=(
                    "РЈРґР°Р»РёС‚СЊ Р·Р°РїСЂРµС‚ РЅР° sitemap.xml, РѕСЃС‚Р°РІРёС‚СЊ С‚РѕР»СЊРєРѕ РґРёСЂРµРєС‚РёРІСѓ Sitemap Рё РїСЂРёРІРµСЃС‚Рё Host Рє С‡РёСЃС‚РѕРјСѓ РґРѕРјРµРЅСѓ Р±РµР· РїСЂРѕС‚РѕРєРѕР»Р°."
                ),
            )
        )

    contact_page = key_pages.get(urljoin(f"{audit['base_url']}/", "contacts"))
    route_contact_page = key_pages.get(urljoin(f"{audit['base_url']}/", "index.php?route=information/contactform"))
    if contact_page and (not contact_page.h1s or not contact_page.description or not contact_page.canonical):
        evidence = []
        if not contact_page.h1s:
            evidence.append("РЎС‚СЂР°РЅРёС†Р° /contacts РѕС‚РєСЂС‹РІР°РµС‚СЃСЏ Р±РµР· H1.")
        if not contact_page.description:
            evidence.append("РќР° /contacts РѕС‚СЃСѓС‚СЃС‚РІСѓРµС‚ meta description.")
        if not contact_page.canonical:
            evidence.append("РќР° /contacts РѕС‚СЃСѓС‚СЃС‚РІСѓРµС‚ canonical.")
        issues.append(
            AuditIssue(
                severity="High",
                title="РљРѕРЅС‚Р°РєС‚РЅС‹Рµ Рё lead-СЃС‚СЂР°РЅРёС†С‹ РЅРµРґРѕРѕРїС‚РёРјРёР·РёСЂРѕРІР°РЅС‹",
                why_it_matters=(
                    "РљРѕРЅС‚Р°РєС‚РЅС‹Рµ СЃС‚СЂР°РЅРёС†С‹ СѓС‡Р°СЃС‚РІСѓСЋС‚ РІ РґРѕРІРµСЂРёРё, РєРѕРЅРІРµСЂСЃРёРё Рё Р±СЂРµРЅРґРѕРІРѕР№ РІС‹РґР°С‡Рµ. "
                    "РљРѕРіРґР° Сѓ РЅРёС… РЅРµС‚ Р±Р°Р·РѕРІРѕР№ SEO-СЂР°Р·РјРµС‚РєРё, СЃР°Р№С‚ С‚РµСЂСЏРµС‚ Рё РєР»РёРєР°Р±РµР»СЊРЅРѕСЃС‚СЊ, Рё РєР°С‡РµСЃС‚РІРѕ РёРЅРґРµРєСЃР°."
                ),
                evidence=evidence or ["РљРѕРЅС‚Р°РєС‚РЅР°СЏ Р·РѕРЅР° СЃР°Р№С‚Р° РЅРµ РѕС„РѕСЂРјР»РµРЅР° РєР°Рє РїРѕР»РЅРѕС†РµРЅРЅР°СЏ РїРѕСЃР°РґРѕС‡РЅР°СЏ СЃС‚СЂР°РЅРёС†Р°."],
                recommendation=(
                    "РЎРґРµР»Р°С‚СЊ РїРѕР»РЅРѕС†РµРЅРЅСѓСЋ РєРѕРЅС‚Р°РєС‚РЅСѓСЋ СЃС‚СЂР°РЅРёС†Сѓ: H1, title РґРѕ 70 СЃРёРјРІРѕР»РѕРІ, description 140-160 СЃРёРјРІРѕР»РѕРІ, canonical, "
                    "РєРѕРЅС‚РµРЅС‚ РїСЂРѕ РїСЂРѕРёР·РІРѕРґСЃС‚РІРѕ, РґРѕСЃС‚Р°РІРєСѓ, РіР°СЂР°РЅС‚РёСЋ, Р°РґСЂРµСЃ, С‚РµР»РµС„РѕРЅС‹ Рё CTA."
                ),
            )
        )
    if route_contact_page and not route_contact_page.title and not route_contact_page.description:
        issues.append(
            AuditIssue(
                severity="High",
                title="Р’РЅСѓС‚СЂРµРЅРЅРёР№ СЃР»СѓР¶РµР±РЅС‹Р№ URL СЃ С„РѕСЂРјРѕР№ РѕР±СЂР°С‚РЅРѕРіРѕ Р·РІРѕРЅРєР° РґРѕСЃС‚СѓРїРµРЅ Р±РµР· SEO-РєРѕРЅС‚СЂРѕР»СЏ",
                why_it_matters=(
                    "Indexable-СЃС‚СЂР°РЅРёС†С‹ Р±РµР· title, description Рё H1 СЃРѕР·РґР°СЋС‚ С€СѓРј РІ РёРЅРґРµРєСЃРµ, СЂР°Р·РјС‹РІР°СЋС‚ СЂРµР»РµРІР°РЅС‚РЅРѕСЃС‚СЊ Рё С‚СЏРЅСѓС‚ crawl budget."
                ),
                evidence=[
                    "URL `/index.php?route=information/contactform` РґРѕСЃС‚СѓРїРµРЅ РїРѕ 200.",
                    "РќР° СЃС‚СЂР°РЅРёС†Рµ РЅРµС‚ title, description Рё H1.",
                    "РЎСЃС‹Р»РєР° РЅР° СЌС‚РѕС‚ URL РµСЃС‚СЊ РІ С€Р°РїРєРµ РєР°Рє `РћР±СЂР°С‚РЅС‹Р№ Р·РІРѕРЅРѕРє`.",
                ],
                recommendation=(
                    "Р›РёР±Рѕ Р·Р°РєСЂС‹С‚СЊ route-СЃС‚СЂР°РЅРёС†Сѓ РѕС‚ РёРЅРґРµРєСЃР°С†РёРё Рё СѓР±СЂР°С‚СЊ РїСЂСЏРјС‹Рµ СЃСЃС‹Р»РєРё, Р»РёР±Рѕ РїРµСЂРµРІРµСЃС‚Рё РµРµ РЅР° РЅРѕСЂРјР°Р»СЊРЅС‹Р№ SEO-friendly URL СЃ РѕС„РѕСЂРјР»РµРЅРёРµРј."
                ),
            )
        )

    if problematic_titles:
        examples = [f"{urlparse(snapshot.url).path or '/'} вЂ” {len(snapshot.title)} СЃРёРјРІ." for snapshot in problematic_titles[:4]]
        issues.append(
            AuditIssue(
                severity="High",
                title="РЁР°Р±Р»РѕРЅС‹ title РЅР° С‚РѕРІР°СЂР°С… Рё РєР°С‚РµРіРѕСЂРёСЏС… СЃР»РёС€РєРѕРј РґР»РёРЅРЅС‹Рµ",
                why_it_matters=(
                    "Р”Р»РёРЅРЅС‹Рµ title СЂРµР¶СѓС‚СЃСЏ РІ РІС‹РґР°С‡Рµ, СѓС…СѓРґС€Р°СЋС‚ CTR Рё СЃРЅРёР¶Р°СЋС‚ РєРѕРЅС‚СЂРѕР»СЊ РЅР°Рґ С‚РµРј, РєР°РєРѕР№ РѕС„С„РµСЂ РїРѕРёСЃРєРѕРІРёРє РїРѕРєР°Р¶РµС‚ РїРѕР»СЊР·РѕРІР°С‚РµР»СЋ."
                ),
                evidence=[
                    f"Р’ РІС‹Р±РѕСЂРєРµ {len(problematic_titles)} РёР· {len(sample_pages)} СЃС‚СЂР°РЅРёС† РёРјРµСЋС‚ title РґР»РёРЅРЅРµРµ 70 СЃРёРјРІРѕР»РѕРІ.",
                    *examples,
                ],
                recommendation=(
                    "РџРµСЂРµСЃРѕР±СЂР°С‚СЊ С€Р°Р±Р»РѕРЅС‹ title: СЃРЅР°С‡Р°Р»Р° РєР»СЋС‡ + РјРѕРґРµР»СЊ/РєР°С‚РµРіРѕСЂРёСЏ, Р·Р°С‚РµРј РѕС„С„РµСЂ Рё Р±СЂРµРЅРґ. "
                    "Р”Р»СЏ РєР°С‚Р°Р»РѕРіР° РґРµСЂР¶Р°С‚СЊ РґРёР°РїР°Р·РѕРЅ 55-70 СЃРёРјРІРѕР»РѕРІ."
                ),
            )
        )

    if problematic_descriptions:
        examples = [
            f"{urlparse(snapshot.url).path or '/'} вЂ” {len(snapshot.description)} СЃРёРјРІ."
            for snapshot in problematic_descriptions[:4]
        ]
        issues.append(
            AuditIssue(
                severity="Medium",
                title="Meta description РЅР° С‡Р°СЃС‚Рё СЃС‚СЂР°РЅРёС† РѕР±СЂРµР·Р°РµС‚СЃСЏ РёР»Рё РЅРµ РґРѕС‚СЏРіРёРІР°РµС‚ РґРѕ РЅРѕСЂРјР°Р»СЊРЅРѕРіРѕ СЃРЅРёРїРїРµС‚Р°",
                why_it_matters=(
                    "РЎРЅРёРїРїРµС‚ вЂ” СЌС‚Рѕ РєРѕРјРјРµСЂС‡РµСЃРєРёР№ РѕС„С„РµСЂ РІ РІС‹РґР°С‡Рµ. "
                    "РљРѕРіРґР° description СЃР»РёС€РєРѕРј РєРѕСЂРѕС‚РєРёР№ РёР»Рё РїРµСЂРµРіСЂСѓР¶РµРЅРЅС‹Р№, РїРѕРёСЃРєРѕРІРёРє С‡Р°С‰Рµ Р±РµСЂРµС‚ СЃР»СѓС‡Р°Р№РЅС‹Р№ РєСѓСЃРѕРє С‚РµРєСЃС‚Р° СЃРѕ СЃС‚СЂР°РЅРёС†С‹."
                ),
                evidence=[
                    f"Р’ РІС‹Р±РѕСЂРєРµ {len(problematic_descriptions)} РёР· {len(sample_pages)} СЃС‚СЂР°РЅРёС† РёРјРµСЋС‚ description РІРЅРµ РєРѕРјС„РѕСЂС‚РЅРѕРіРѕ РґРёР°РїР°Р·РѕРЅР°.",
                    *examples,
                ],
                recommendation=(
                    "РЎРѕР±СЂР°С‚СЊ С€Р°Р±Р»РѕРЅС‹ description РїРѕРґ С‚РёРїС‹ СЃС‚СЂР°РЅРёС†: РєР»СЋС‡, С†РµРЅРЅРѕСЃС‚СЊ, РґРѕСЃС‚Р°РІРєР°/РіР°СЂР°РЅС‚РёСЏ, СЂРµРіРёРѕРЅ, РїСЂРёР·С‹РІ. "
                    "РћСЂРёРµРЅС‚РёСЂ вЂ” 140-160 СЃРёРјРІРѕР»РѕРІ."
                ),
            )
        )

    if alt_gaps:
        issues.append(
            AuditIssue(
                severity="Medium",
                title="РР·РѕР±СЂР°Р¶РµРЅРёСЏ С‚РµСЂСЏСЋС‚ РїРѕРёСЃРєРѕРІС‹Р№ С‚СЂР°С„РёРє Рё РєРѕРЅС‚РµРєСЃС‚ РєР°СЂС‚РѕС‡РµРє",
                why_it_matters="Р”Р»СЏ С‚РѕРІР°СЂРЅРѕРіРѕ РїСЂРѕРµРєС‚Р° alt РІР»РёСЏРµС‚ Рё РЅР° РєР°СЂС‚РёРЅРєРё, Рё РЅР° РїРѕРЅРёРјР°РЅРёРµ Р°СЃСЃРѕСЂС‚РёРјРµРЅС‚Р°, Рё РЅР° РґРѕСЃС‚СѓРїРЅРѕСЃС‚СЊ.",
                evidence=[
                    f"РќР° {len(alt_gaps)} РёР· {len(sample_pages)} РїСЂРѕРІРµСЂРµРЅРЅС‹С… СЃС‚СЂР°РЅРёС† РµСЃС‚СЊ РёР·РѕР±СЂР°Р¶РµРЅРёСЏ Р±РµР· alt.",
                    f"РќР° РіР»Р°РІРЅРѕР№ РЅР°Р№РґРµРЅРѕ {audit['home_page'].missing_alt_count} РёР·РѕР±СЂР°Р¶РµРЅРёР№ Р±РµР· alt.",
                ],
                recommendation=(
                    "Р’РІРµСЃС‚Рё С€Р°Р±Р»РѕРЅРЅСѓСЋ РіРµРЅРµСЂР°С†РёСЋ alt РїРѕ С‚РёРїСѓ РєР°СЂС‚РѕС‡РєРё: С‚РѕРІР°СЂ + РѕР±СЉРµРј/СЂР°Р·РјРµСЂ + Р±СЂРµРЅРґ/СЃРµСЂРёСЏ, "
                    "Р° РґР»СЏ РєР°С‚РµРіРѕСЂРёР№ вЂ” РѕР±С‰РёР№ РёРЅС‚РµРЅС‚ СЃС‚СЂР°РЅРёС†С‹."
                ),
            )
        )

    if redirect_chains:
        issues.append(
            AuditIssue(
                severity="Medium",
                title="Р•СЃС‚СЊ Р»РёС€РЅСЏСЏ redirect-С†РµРїРѕС‡РєР° Сѓ С‡Р°СЃС‚Рё РґРѕРјРµРЅРЅС‹С… РІР°СЂРёР°РЅС‚РѕРІ",
                why_it_matters=(
                    "Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅС‹Р№ СЂРµРґРёСЂРµРєС‚ РґРѕР±Р°РІР»СЏРµС‚ Р·Р°РґРµСЂР¶РєСѓ РЅР° РІС…РѕРґРµ Рё СЃРѕР·РґР°РµС‚ РЅРµРЅСѓР¶РЅСѓСЋ С‚РµС…РЅРёС‡РµСЃРєСѓСЋ СЃР»РѕР¶РЅРѕСЃС‚СЊ РґР»СЏ Р±РѕС‚РѕРІ Рё РїРѕР»СЊР·РѕРІР°С‚РµР»РµР№."
                ),
                evidence=[
                    "РџСѓС‚СЊ `http://www.akvarium-akvas.ru/` РѕС‚РґР°РµС‚ РґРІРµ РїРѕСЃР»РµРґРѕРІР°С‚РµР»СЊРЅС‹Рµ 301-РїРµСЂРµР°РґСЂРµСЃР°С†РёРё.",
                    "Р¤РёРЅР°Р»СЊРЅС‹Р№ РєР°РЅРѕРЅРёС‡РµСЃРєРёР№ РґРѕРјРµРЅ вЂ” `https://akvarium-akvas.ru/`.",
                ],
                recommendation=(
                    "РЎРІРµСЃС‚Рё РІСЃРµ РІР°СЂРёР°РЅС‚С‹ РґРѕРјРµРЅР° Рє РѕРґРЅРѕРјСѓ 301-СЂРµРґРёСЂРµРєС‚Сѓ РЅР°РїСЂСЏРјСѓСЋ РЅР° РєР°РЅРѕРЅРёС‡РµСЃРєРёР№ HTTPS Р±РµР· РїСЂРѕРјРµР¶СѓС‚РѕС‡РЅРѕРіРѕ `https://www`."
                ),
            )
        )

    if audit["home_page"].has_meta_keywords:
        issues.append(
            AuditIssue(
                severity="Low",
                title="РќР° РіР»Р°РІРЅРѕР№ РѕСЃС‚Р°Р»СЃСЏ meta keywords, РєРѕС‚РѕСЂС‹Р№ СѓР¶Рµ РЅРµ РґР°РµС‚ SEO-С†РµРЅРЅРѕСЃС‚Рё",
                why_it_matters="РЎР°Рј РїРѕ СЃРµР±Рµ С‚РµРі РЅРµ РІСЂРµРґРёС‚, РЅРѕ СЌС‚Рѕ СЃРёРіРЅР°Р», С‡С‚Рѕ С€Р°Р±Р»РѕРЅ РјРµС‚С‹ СЃС‚РѕРёС‚ РїРѕС‡РёСЃС‚РёС‚СЊ Рё РїРѕРґРґРµСЂР¶РёРІР°С‚СЊ РІ Р°РєС‚СѓР°Р»СЊРЅРѕРј РІРёРґРµ.",
                evidence=["РќР° РіР»Р°РІРЅРѕР№ РЅР°Р№РґРµРЅ С‚РµРі meta keywords."],
                recommendation="РЈР±СЂР°С‚СЊ meta keywords РёР· С€Р°Р±Р»РѕРЅР° Рё СЃРѕСЃСЂРµРґРѕС‚РѕС‡РёС‚СЊСЃСЏ РЅР° title, description, H1, schema Рё РєРѕРјРјРµСЂС‡РµСЃРєРёС… Р±Р»РѕРєР°С….",
            )
        )

    if audit["sitemap_url_count"] > 5000:
        issues.append(
            AuditIssue(
                severity="Medium",
                title="РљР°СЂС‚Р° СЃР°Р№С‚Р° СѓР¶Рµ Р±РѕР»СЊС€Р°СЏ Рё С‚СЂРµР±СѓРµС‚ Р±РѕР»РµРµ СѓРїСЂР°РІР»СЏРµРјРѕР№ СЃС‚СЂСѓРєС‚СѓСЂС‹",
                why_it_matters=(
                    "РљРѕРіРґР° URL РїРѕС‡С‚Рё 7000 Рё РІСЃРµ Р»РµР¶РёС‚ РІ РѕРґРЅРѕРј РїРѕС‚РѕРєРµ, СЃР»РѕР¶РЅРµРµ РѕС‚СЃР»РµР¶РёРІР°С‚СЊ РёРЅРґРµРєСЃР°С†РёСЋ РєР°С‚РµРіРѕСЂРёР№, С‚РѕРІР°СЂРѕРІ Рё СЃР»СѓР¶РµР±РЅС‹С… СЃС‚СЂР°РЅРёС† РѕС‚РґРµР»СЊРЅРѕ."
                ),
                evidence=[
                    f"Р’ sitemap РѕР±РЅР°СЂСѓР¶РµРЅРѕ {audit['sitemap_url_count']} URL.",
                    "РЎРµР№С‡Р°СЃ СѓРґРѕР±РЅРµРµ СѓРїСЂР°РІР»СЏС‚СЊ РёРЅРґРµРєСЃРѕРј С‡РµСЂРµР· СЂР°Р·РґРµР»СЊРЅС‹Рµ sitemap РїРѕ С‚РёРїР°Рј СЃС‚СЂР°РЅРёС†.",
                ],
                recommendation=(
                    "Р Р°Р·РґРµР»РёС‚СЊ sitemap РјРёРЅРёРјСѓРј РЅР° С‚РѕРІР°СЂС‹, РєР°С‚РµРіРѕСЂРёРё, СЃР»СѓР¶РµР±РЅС‹Рµ СЃС‚СЂР°РЅРёС†С‹ Рё РјРµРґРёР°/СЃС‚Р°С‚СЊРё, "
                    "С‡С‚РѕР±С‹ РїСЂРѕС‰Рµ РєРѕРЅС‚СЂРѕР»РёСЂРѕРІР°С‚СЊ РїРѕРєСЂС‹С‚РёРµ Рё РїРµСЂРµРѕР±С…РѕРґ."
                ),
            )
        )

    if audit.get("sitemap_total_entries", 0) > audit["sitemap_url_count"] * 1.3:
        duplicate_entries = audit["sitemap_total_entries"] - audit["sitemap_url_count"]
        issues.append(
            AuditIssue(
                severity="Medium",
                title="РљР°СЂС‚Р° СЃР°Р№С‚Р° СЂР°Р·РґСѓС‚Р° РїРѕРІС‚РѕСЂСЏСЋС‰РёРјРёСЃСЏ URL",
                why_it_matters=(
                    "РљРѕРіРґР° РѕРґРёРЅ Рё С‚РѕС‚ Р¶Рµ URL РїРѕРІС‚РѕСЂСЏРµС‚СЃСЏ РІ sitemap РјРЅРѕРіРѕ СЂР°Р·, РїРѕРёСЃРєРѕРІРёРєРё РїРѕР»СѓС‡Р°СЋС‚ Р»РёС€РЅРёР№ С€СѓРј РІРјРµСЃС‚Рѕ С‡РёСЃС‚РѕРіРѕ СЃРёРіРЅР°Р»Р°, "
                    "Р° Р°РЅР°Р»РёР· РёРЅРґРµРєСЃР°С†РёРё СЃС‚Р°РЅРѕРІРёС‚СЃСЏ РјРµРЅРµРµ СѓРїСЂР°РІР»СЏРµРјС‹Рј."
                ),
                evidence=[
                    f"Р’ sitemap РЅР°Р№РґРµРЅРѕ {audit['sitemap_total_entries']} Р·Р°РїРёСЃРµР№, РЅРѕ С‚РѕР»СЊРєРѕ {audit['sitemap_url_count']} СѓРЅРёРєР°Р»СЊРЅС‹С… URL.",
                    f"РџРѕРІС‚РѕСЂРѕРІ: {duplicate_entries}.",
                ],
                recommendation=(
                    "РџРµСЂРµСЃРѕР±СЂР°С‚СЊ РіРµРЅРµСЂР°С†РёСЋ sitemap С‚Р°Рє, С‡С‚РѕР±С‹ РєР°Р¶РґС‹Р№ РёРЅРґРµРєСЃРёСЂСѓРµРјС‹Р№ URL РїРѕРїР°РґР°Р» С‚СѓРґР° РѕРґРёРЅ СЂР°Р·, "
                    "Р° РєР°СЂС‚Р° СЃР°Р№С‚Р° РѕС‚СЂР°Р¶Р°Р»Р° СЂРµР°Р»СЊРЅСѓСЋ СЃС‚СЂСѓРєС‚СѓСЂСѓ РїСЂРѕРµРєС‚Р° Р±РµР· РґСѓР±Р»РµР№."
                ),
            )
        )

    severity_order = {"Critical": 0, "High": 1, "Medium": 2, "Low": 3}
    issues.sort(key=lambda issue: severity_order.get(issue.severity, 4))
    return issues


def build_strengths(audit: dict) -> list[str]:
    strengths = []
    if audit["home_page"].status_code == 200:
        strengths.append("РЎР°Р№С‚ СЃС‚Р°Р±РёР»СЊРЅРѕ РѕС‚РІРµС‡Р°РµС‚ РїРѕ HTTPS Рё РіР»Р°РІРЅР°СЏ СЃС‚СЂР°РЅРёС†Р° РѕС‚РґР°РµС‚ 200 РєРѕРґ Р±РµР· JS-Р·Р°РіР»СѓС€РєРё.")
    if audit["sitemap_url_count"]:
        strengths.append(
            f"РЎР°Р№С‚ СѓР¶Рµ РёРјРµРµС‚ РёРЅРґРµРєСЃРёСЂСѓРµРјСѓСЋ РєР°СЂС‚Сѓ СЃР°Р№С‚Р° СЃ {audit['sitemap_url_count']} URL Рё image-С‚РµРіР°РјРё РґР»СЏ РєР°СЂС‚РѕС‡РµРє."
        )
    if audit["home_page"].canonical:
        strengths.append("РќР° РєР»СЋС‡РµРІС‹С… РєРѕРјРјРµСЂС‡РµСЃРєРёС… СЃС‚СЂР°РЅРёС†Р°С… РїСЂРѕСЃС‚Р°РІР»РµРЅС‹ canonical, С‡С‚Рѕ РїРѕРјРѕРіР°РµС‚ СѓРґРµСЂР¶РёРІР°С‚СЊ РѕСЃРЅРѕРІРЅРѕР№ URL.")
    if audit["schema_coverage_ratio"] >= 0.7:
        strengths.append("РќР° С‚РѕРІР°СЂР°С… Рё РєР°С‚РµРіРѕСЂРёСЏС… СѓР¶Рµ РёСЃРїРѕР»СЊР·СѓРµС‚СЃСЏ schema-СЂР°Р·РјРµС‚РєР° (Product / BreadcrumbList / LocalBusiness).")
    if audit["h1_coverage_ratio"] >= 0.8:
        strengths.append("РЈ Р±РѕР»СЊС€РёРЅСЃС‚РІР° РїСЂРѕРІРµСЂРµРЅРЅС‹С… РєРѕРјРјРµСЂС‡РµСЃРєРёС… СЃС‚СЂР°РЅРёС† РµСЃС‚СЊ H1, С‡С‚Рѕ С…РѕСЂРѕС€Рѕ РґР»СЏ РјР°СЃС€С‚Р°Р±РЅРѕРіРѕ РєР°С‚Р°Р»РѕРіР°.")
    strengths.append("URL-СЃС‚СЂСѓРєС‚СѓСЂР° РІ РєР°С‚Р°Р»РѕРіРµ РїРѕРЅСЏС‚РЅР°СЏ Рё С…РѕСЂРѕС€Рѕ РґСЂРѕР±РёС‚ СЃРїСЂРѕСЃ РїРѕ Р»РёС‚СЂР°Р¶Сѓ, С„РѕСЂРјРµ, РЅР°Р·РЅР°С‡РµРЅРёСЋ Рё РєРѕРјРїР»РµРєС‚Р°С†РёРё.")
    if audit["llms_exists"]:
        strengths.append("РЈ РїСЂРѕРµРєС‚Р° СѓР¶Рµ РµСЃС‚СЊ llms.txt, Р° Р·РЅР°С‡РёС‚ РјРѕР¶РЅРѕ РґРѕРїРѕР»РЅРёС‚РµР»СЊРЅРѕ СѓСЃРёР»РёРІР°С‚СЊ AI-РІРёРґРёРјРѕСЃС‚СЊ Рё branded-РѕС‚РІРµС‚С‹.")
    return strengths


def build_growth_points() -> list[str]:
    return [
        "РЈСЃРёР»РёС‚СЊ СЃС‚СЂР°РЅРёС†С‹ РєР°С‚РµРіРѕСЂРёР№ СѓРЅРёРєР°Р»СЊРЅС‹РјРё РёРЅС‚СЂРѕ-Р±Р»РѕРєР°РјРё, FAQ, РґРѕСЃС‚Р°РІРєРѕР№, РіР°СЂР°РЅС‚РёРµР№, СЃСЂРѕРєР°РјРё РїСЂРѕРёР·РІРѕРґСЃС‚РІР° Рё РѕР±СЉСЏСЃРЅРµРЅРёРµРј, РєР°Рє РІС‹Р±СЂР°С‚СЊ РјРѕРґРµР»СЊ.",
        "РЎРґРµР»Р°С‚СЊ РѕС‚РґРµР»СЊРЅС‹Рµ РїРѕСЃР°РґРѕС‡РЅС‹Рµ РїРѕРґ РІС‹СЃРѕРєРёР№ СЃРїСЂРѕСЃ: РїРѕ Р»РёС‚СЂР°Р¶Сѓ, С„РѕСЂРјРµ, РЅР°Р·РЅР°С‡РµРЅРёСЋ, С‚РёРїСѓ РєРѕРјРїР»РµРєС‚Р°С†РёРё Рё РіРѕС‚РѕРІС‹Рј СЂРµС€РµРЅРёСЏРј РїРѕРґ РєР»СЋС‡.",
        "Р”РѕР±Р°РІРёС‚СЊ РІ РєР°С‚РµРіРѕСЂРёРё Рё РєР°СЂС‚РѕС‡РєРё Р±Р»РѕРєРё РґРѕРІРµСЂРёСЏ: РїСЂРѕРёР·РІРѕРґСЃС‚РІРѕ РІ Р РѕСЃСЃРёРё, РіР°СЂР°РЅС‚РёСЏ, РґРѕСЃС‚Р°РІРєР° РїРѕ Р Р¤, РєР°СЃС‚РѕРјРёР·Р°С†РёСЏ СЂР°Р·РјРµСЂРѕРІ, РєРѕРјРїР»РµРєС‚Р°С†РёСЏ.",
        "Р Р°Р·РІРµСЂРЅСѓС‚СЊ image SEO: alt-С€Р°Р±Р»РѕРЅС‹, РїРѕРґРїРёСЃРё, structured data Рё РїРѕРґР±РѕСЂ РІРёР·СѓР°Р»РѕРІ РїРѕРґ РїРѕРёСЃРєРѕРІС‹Р№ СЃРїСЂРѕСЃ РїРѕ Р°РєРІР°СЂРёСѓРјР°Рј Рё С‚РµСЂСЂР°СЂРёСѓРјР°Рј.",
        "РЎРѕР±СЂР°С‚СЊ С€Р°Р±Р»РѕРЅРЅС‹Р№ СЃР»РѕР№ СЃРЅРёРїРїРµС‚РѕРІ: РєРѕСЂРѕС‚РєРёРµ title, РєРѕРјРјРµСЂС‡РµСЃРєРёРµ description, Р°РєРєСѓСЂР°С‚РЅС‹Р№ canonical Рё РїРѕРЅСЏС‚РЅС‹Рµ H1 РЅР° РІСЃРµС… С‚РёРїР°С… СЃС‚СЂР°РЅРёС†.",
        "РЎРµРіРјРµРЅС‚РёСЂРѕРІР°С‚СЊ sitemap Рё РїР°СЂР°Р»Р»РµР»СЊРЅРѕ РЅР°СЃС‚СЂРѕРёС‚СЊ РєРѕРЅС‚СЂРѕР»СЊ РёРЅРґРµРєСЃР°С†РёРё РєР°С‚РµРіРѕСЂРёР№, С‚РѕРІР°СЂРѕРІ, С„РёР»СЊС‚СЂРѕРІ Рё СЃР»СѓР¶РµР±РЅС‹С… route-СЃС‚СЂР°РЅРёС†.",
    ]


def build_roadmap() -> list[tuple[str, list[str]]]:
    return [
        (
            "0-14 РґРЅРµР№",
            [
                "РСЃРїСЂР°РІРёС‚СЊ robots.txt: СѓР±СЂР°С‚СЊ РєРѕРЅС„Р»РёРєС‚ СЃ sitemap.xml Рё РЅРѕСЂРјР°Р»РёР·РѕРІР°С‚СЊ Host.",
                "Р—Р°РєСЂС‹С‚СЊ РёР»Рё РїРµСЂРµСЂР°Р±РѕС‚Р°С‚СЊ `/index.php?route=information/contactform`.",
                "Р”РѕРґРµР»Р°С‚СЊ SEO-С€Р°Р±Р»РѕРЅ СЃС‚СЂР°РЅРёС†С‹ РєРѕРЅС‚Р°РєС‚РѕРІ: H1, title, description, canonical, РєРѕРјРјРµСЂС‡РµСЃРєРёР№ РєРѕРЅС‚РµРЅС‚.",
                "РџРѕРґРіРѕС‚РѕРІРёС‚СЊ РЅРѕРІРѕРµ РїСЂР°РІРёР»Рѕ РіРµРЅРµСЂР°С†РёРё title Рё description РґР»СЏ С‚РѕРІР°СЂРѕРІ Рё РєР°С‚РµРіРѕСЂРёР№.",
            ],
        ),
        (
            "15-30 РґРЅРµР№",
            [
                "Р’РЅРµРґСЂРёС‚СЊ alt-С€Р°Р±Р»РѕРЅС‹ РґР»СЏ РєР°СЂС‚РѕС‡РµРє Рё РєР°С‚РµРіРѕСЂРёР№.",
                "РЎРІРµСЃС‚Рё РґРѕРјРµРЅРЅС‹Рµ СЂРµРґРёСЂРµРєС‚С‹ Рє РѕРґРЅРѕРјСѓ С€Р°РіСѓ РЅР° РєР°РЅРѕРЅРёС‡РµСЃРєРёР№ HTTPS.",
                "Р Р°Р·РґРµР»РёС‚СЊ sitemap РїРѕ С‚РёРїР°Рј СЃС‚СЂР°РЅРёС† Рё РїРѕРґР°С‚СЊ РёС… РѕС‚РґРµР»СЊРЅРѕ РІ РЇРЅРґРµРєСЃ Р’РµР±РјР°СЃС‚РµСЂ Рё GSC.",
                "РћР±РЅРѕРІРёС‚СЊ СЃРЅРёРїРїРµС‚С‹ Рё РїСЂРѕС‚РµСЃС‚РёСЂРѕРІР°С‚СЊ СЂРѕСЃС‚ CTR РїРѕ РєР°С‚РµРіРѕСЂРёСЏРј Рё С‚РѕРІР°СЂРЅС‹Рј РєР»Р°СЃС‚РµСЂР°Рј.",
            ],
        ),
        (
            "31-60 РґРЅРµР№",
            [
                "РЈСЃРёР»РёС‚СЊ СЃРїСЂРѕСЃРѕРІС‹Рµ РєР°С‚РµРіРѕСЂРёРё РєРѕРЅС‚РµРЅС‚РѕРј, FAQ, РєРѕРјРјРµСЂС‡РµСЃРєРёРјРё Р±Р»РѕРєР°РјРё Рё РїРµСЂРµР»РёРЅРєРѕРІРєРѕР№.",
                "РЎРѕР±СЂР°С‚СЊ РїРѕСЃР°РґРѕС‡РЅС‹Рµ РїРѕРґ РєР»СЋС‡РµРІС‹Рµ РєР»Р°СЃС‚РµСЂС‹ СЃРїСЂРѕСЃР°: Р»РёС‚СЂР°Р¶, С„РѕСЂРјР°, СЃС†РµРЅР°СЂРёР№ РёСЃРїРѕР»СЊР·РѕРІР°РЅРёСЏ, РєРѕРјРїР»РµРєС‚Р°С†РёСЏ.",
                "Р”РѕР±Р°РІРёС‚СЊ РєРѕРЅС‚РµРЅС‚-СЃР»РѕР№ РїРѕРґ AI-РѕС‚РІРµС‚С‹: РєСЂР°С‚РєРёРµ РѕРїСЂРµРґРµР»РµРЅРёСЏ, С‚Р°Р±Р»РёС†С‹ СЃСЂР°РІРЅРµРЅРёСЏ, РѕС‚РІРµС‚С‹ РЅР° С‡Р°СЃС‚С‹Рµ РІРѕРїСЂРѕСЃС‹.",
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
    return f"{path[: max_length - 1]}вЂ¦"


def build_audit(url: str, company_name: str | None, sample_size: int) -> dict:
    base_url = normalize_base_url(url)
    parsed = urlparse(base_url)
    base_domain = parsed.netloc
    session = make_session()
    requested_limit = max(sample_size, 0)

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
    unique_urls = build_audit_url_inventory(
        base_url,
        preferred_urls,
        sitemap_urls,
        base_domain,
        requested_limit,
    )
    snapshots = analyse_pages_parallel(unique_urls, base_domain, max_workers=12)
    html_pages = [snapshot for snapshot in snapshots if snapshot.status_code == 200 and "html" in snapshot.content_type]
    appendix_urls = select_representative_urls(base_url, preferred_urls, [snapshot.url for snapshot in html_pages], 18)
    pages_by_url = {normalize_page_url(snapshot.url): snapshot for snapshot in html_pages}
    appendix_pages = [pages_by_url[url] for url in appendix_urls if url in pages_by_url][:18]

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
        "appendix_pages": appendix_pages,
        "raw_sampled_urls": unique_urls,
        "requested_page_limit": requested_limit,
        "crawl_scope": "full" if requested_limit == 0 else "limited",
        "analyzed_pages_count": len(html_pages),
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
    tag_run = p_tag.add_run("SEO AUDIT / РўРћР§РљР Р РћРЎРўРђ")
    set_font(tag_run, size=10.5, bold=True, color=BRAND_CYAN)

    p_title = left.add_paragraph()
    p_title.paragraph_format.space_before = Pt(10)
    title_run = p_title.add_run(f"SEO-Р°СѓРґРёС‚ СЃР°Р№С‚Р°\n{audit['domain']}")
    set_font(title_run, size=26, bold=True, color="FFFFFF")

    p_subtitle = left.add_paragraph()
    subtitle_run = p_subtitle.add_run(
        "Р”РѕРєСѓРјРµРЅС‚ РґР»СЏ РїСЂРѕРґР°Р¶Рё СѓСЃР»СѓРіРё Рё РІРЅРµРґСЂРµРЅРёСЏ СЂРµР°Р»СЊРЅС‹С… SEO-С‚РѕС‡РµРє СЂРѕСЃС‚Р°. "
        "РќРµ РїСЂРѕСЃС‚Рѕ СЃРїРёСЃРѕРє Р·Р°РјРµС‡Р°РЅРёР№, Р° РїР»Р°РЅ С‚РѕРіРѕ, РєР°Рє Р±С‹СЃС‚СЂРµРµ СѓСЃРёР»РёС‚СЊ РІРёРґРёРјРѕСЃС‚СЊ, РёРЅРґРµРєСЃ Рё РєРѕРјРјРµСЂС‡РµСЃРєРёР№ С‚СЂР°С„РёРє."
    )
    set_font(subtitle_run, size=11.4, color="E8EEF6")
    p_subtitle.paragraph_format.space_after = Pt(18)

    callout = left.add_table(rows=1, cols=1)
    remove_table_borders(callout)
    callout_cell = callout.rows[0].cells[0]
    set_cell_shading(callout_cell, BRAND_DARK_ALT)
    set_cell_margins(callout_cell, 110, 130, 110, 130)
    callout_run = callout_cell.paragraphs[0].add_run(
        "Р’РЅСѓС‚СЂРё: РёРЅРґРµРєСЃР°С†РёСЏ, robots/sitemap, С€Р°Р±Р»РѕРЅС‹ title/description, РєР°С‚РµРіРѕСЂРёРё, "
        "С‚РѕРІР°СЂРЅС‹Рµ РєР°СЂС‚РѕС‡РєРё, РёР·РѕР±СЂР°Р¶РµРЅРёСЏ, РєРѕРјРјРµСЂС‡РµСЃРєРёРµ Р±Р»РѕРєРё Рё 60-РґРЅРµРІРЅС‹Р№ roadmap."
    )
    set_font(callout_run, size=10.8, color="FFFFFF")

    run = right.paragraphs[0].add_run("РџР°СЃРїРѕСЂС‚ РїСЂРѕРµРєС‚Р°")
    set_font(run, size=14, bold=True, color=BRAND_TEXT)
    add_text_paragraph(right, f"Р‘СЂРµРЅРґ: {audit['company_name']}", size=11.4)
    add_text_paragraph(right, f"Р”РѕРјРµРЅ: {audit['base_url']}", size=11.2)
    add_text_paragraph(right, f"Р”Р°С‚Р°: {audit['generated_at']}", size=11.2)
    add_text_paragraph(right, "Р¤РѕСЂРјР°С‚: SEO-Р°СѓРґРёС‚ / growth map", size=11.2)
    add_text_paragraph(right, f"РСЃРїРѕР»РЅРёС‚РµР»СЊ: {BRAND_NAME}", size=11.2, bold=True)
    add_text_paragraph(
        right,
        "Р¤РѕРєСѓСЃ Р°СѓРґРёС‚Р°: РёРЅРґРµРєСЃР°С†РёСЏ, СЃС‚СЂСѓРєС‚СѓСЂР° РєР°С‚Р°Р»РѕРіР°, С€Р°Р±Р»РѕРЅС‹ РјРµС‚Р°РґР°РЅРЅС‹С…, РёР·РѕР±СЂР°Р¶РµРЅРёСЏ, "
        "РєРѕРЅС‚Р°РєС‚РЅС‹Рµ СЃС‚СЂР°РЅРёС†С‹ Рё РїРѕС‚РµРЅС†РёР°Р» СЂРѕСЃС‚Р° РєР»Р°СЃС‚РµСЂРѕРІ СЃРїСЂРѕСЃР°.",
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
    label_run = score_label.add_run("РРЅРґРµРєСЃ SEO-РіРѕС‚РѕРІРЅРѕСЃС‚Рё")
    set_font(label_run, size=10.2, bold=True, color=BRAND_MUTED)
    score_value = score_cell.add_paragraph()
    score_value.alignment = WD_ALIGN_PARAGRAPH.CENTER
    score_run = score_value.add_run(str(audit["score"]))
    set_font(score_run, size=28, bold=True, color=BRAND_TEXT)
    score_hint = score_cell.add_paragraph()
    score_hint.alignment = WD_ALIGN_PARAGRAPH.CENTER
    hint_run = score_hint.add_run("РёР· 100")
    set_font(hint_run, size=10.2, color=BRAND_MUTED)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)


def add_metric_grid(doc: Document, audit: dict) -> None:
    metrics = [
        ("Sitemap unique", str(audit["sitemap_url_count"])),
        ("Sitemap entries", str(audit.get("sitemap_total_entries", audit["sitemap_url_count"]))),
        ("РЎСЂРµРґРЅРёР№ РѕС‚РІРµС‚", f"{audit['average_response_ms']} ms"),
        ("РЎСЂРµРґРЅРёР№ HTML", f"{audit['average_html_kb']} KB"),
        ("Title > 70", f"{math.floor(audit['title_long_ratio'] * 100)}%"),
        ("Desc РІРЅРµ РґРёР°РїР°Р·РѕРЅР°", f"{math.floor(audit['description_problem_ratio'] * 100)}%"),
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
        recommendation_run = recommendation.add_run(f"Р§С‚Рѕ РґРµР»Р°С‚СЊ: {issue.recommendation}")
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
    headers = ["РџСѓС‚СЊ", "РўРёРї", "РљРѕРґ", "Title", "Desc", "H1", "Schema"]
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
            ", ".join(snapshot.schema_types[:2]) or "вЂ”",
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
    headers = ["РџСЂРѕР±Р»РµРјР°", "Impact", "Risk", "Business", "РС‚РѕРі", "РџСЂРёРѕСЂРёС‚РµС‚", "РћС‚РІРµС‚СЃС‚РІРµРЅРЅС‹Р№"]
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
        add_section_heading(doc, "Р“Р»СѓР±РѕРєРёР№ СЂР°Р·Р±РѕСЂ", section.get("title", ""), section.get("intro"))
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

            add_text_paragraph(body, f"Р§С‚Рѕ РїСЂРѕРІРµСЂСЏР»РѕСЃСЊ: {check.get('checked', '')}", size=10.7, color=BRAND_TEXT, space_after=3)
            add_text_paragraph(body, f"РљР°Рє РїСЂРѕРІРµСЂСЏР»РѕСЃСЊ: {check.get('method', '')}", size=10.5, color=BRAND_MUTED, space_after=4)
            add_metrics_list(body, check.get("metrics", []))
            add_text_paragraph(body, "Р§С‚Рѕ РЅР°С€Р»Рё:", size=10.5, bold=True, color=BRAND_TEXT, space_after=3)
            add_bullet_list(body, check.get("findings", []), size=10.4)
            add_text_paragraph(
                body,
                f"РџСЂРёРѕСЂРёС‚РµС‚: {check.get('priority', '')}  |  РћС‚РІРµС‚СЃС‚РІРµРЅРЅС‹Р№: {check.get('owner', '')}",
                size=10.2,
                bold=True,
                color=BRAND_ORANGE,
                space_after=3,
            )
            add_text_paragraph(body, f"Р§С‚Рѕ РґРµР»Р°С‚СЊ: {check.get('recommendation', '')}", size=10.4, color=BRAND_TEXT, bold=True, space_after=4)
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
            f"{audit['company_name']} СѓР¶Рµ РёРјРµРµС‚ СЃРёР»СЊРЅС‹Р№ С„СѓРЅРґР°РјРµРЅС‚ РґР»СЏ СЂРѕСЃС‚Р°: С‡РёСЃС‚С‹Р№ HTTPS-РґРѕРјРµРЅ, "
            f"Р±РѕР»СЊС€РѕР№ РєР°С‚Р°Р»РѕРі СЃРїСЂРѕСЃР°, СЂР°Р±РѕС‡РёР№ sitemap, schema РЅР° С‚РѕРІР°СЂР°С… Рё РєР°С‚РµРіРѕСЂРёСЏС… Рё С€РёСЂРѕРєСѓСЋ URL-СЃС‚СЂСѓРєС‚СѓСЂСѓ РїРѕРґ РєР»Р°СЃС‚РµСЂС‹."
        ),
        (
            "РќРѕ СЃРµР№С‡Р°СЃ РїСЂРѕРµРєС‚ С‚РµСЂСЏРµС‚ С‡Р°СЃС‚СЊ РІРёРґРёРјРѕСЃС‚Рё РЅРµ РёР·-Р·Р° РѕС‚СЃСѓС‚СЃС‚РІРёСЏ Р°СЃСЃРѕСЂС‚РёРјРµРЅС‚Р°, Р° РёР·-Р·Р° С‚РµС…РЅРёС‡РµСЃРєРёС… Рё С€Р°Р±Р»РѕРЅРЅС‹С… РѕРіСЂР°РЅРёС‡РµРЅРёР№: "
            "robots.txt РєРѕРЅС„Р»РёРєС‚СѓРµС‚ СЃ РєР°СЂС‚РѕР№ СЃР°Р№С‚Р°, РјРµС‚Р°РґР°РЅРЅС‹Рµ Сѓ С‚РѕРІР°СЂРЅС‹С… Рё РєР°С‚РµРіРѕСЂРёР№РЅС‹С… С€Р°Р±Р»РѕРЅРѕРІ С‡Р°СЃС‚Рѕ СЃР»РёС€РєРѕРј РґР»РёРЅРЅС‹Рµ, "
            "РєРѕРЅС‚Р°РєС‚РЅС‹Рµ СЃС‚СЂР°РЅРёС†С‹ РЅРµРґРѕРѕС„РѕСЂРјР»РµРЅС‹, Р° РёР·РѕР±СЂР°Р¶РµРЅРёСЏ РЅРµ РґРѕР±РёСЂР°СЋС‚ SEO-СЃРёРіРЅР°Р»С‹ С‡РµСЂРµР· alt."
        ),
        (
            "Р•СЃР»Рё СѓР±СЂР°С‚СЊ СЌС‚РѕС‚ С‚РµС…РЅРёС‡РµСЃРєРёР№ С€СѓРј Рё РїРµСЂРµСЃРѕР±СЂР°С‚СЊ РєРѕРјРјРµСЂС‡РµСЃРєРёРµ С€Р°Р±Р»РѕРЅС‹, СЃР°Р№С‚ СЃРјРѕР¶РµС‚ Р·Р°РјРµС‚РЅРѕ СЃРёР»СЊРЅРµРµ СЂР°СЃРєСЂС‹С‚СЊ СЃРїСЂРѕСЃ "
            "РїРѕ Р°РєРІР°СЂРёСѓРјР°Рј, С‚РµСЂСЂР°СЂРёСѓРјР°Рј, С‚СѓРјР±Р°Рј Рё Р°РєСЃРµСЃСЃСѓР°СЂР°Рј Р±РµР· РїРѕР»РЅРѕР№ РїРµСЂРµРґРµР»РєРё РїР»Р°С‚С„РѕСЂРјС‹."
        ),
    ]


def add_screenshot_gallery(doc: Document, screenshots: list[dict]) -> None:
    if not screenshots:
        return
    add_section_heading(
        doc,
        "РЎРєСЂРёРЅС€РѕС‚С‹",
        "РђРІС‚РѕСЃРєСЂРёРЅС€РѕС‚С‹ РєР»СЋС‡РµРІС‹С… СЃС‚СЂР°РЅРёС†",
        "Р­С‚Рё РёР·РѕР±СЂР°Р¶РµРЅРёСЏ РїРѕРјРѕРіР°СЋС‚ Р±С‹СЃС‚СЂРѕ СѓРІРёРґРµС‚СЊ РєРѕРЅС‚РµРєСЃС‚: РєР°Рє РІС‹РіР»СЏРґРёС‚ РіР»Р°РІРЅР°СЏ, РєРѕРЅС‚Р°РєС‚С‹, РєР°С‚РµРіРѕСЂРёСЏ Рё РєР°СЂС‚РѕС‡РєР° С‚РѕРІР°СЂР° РІ РјРѕРјРµРЅС‚ Р°СѓРґРёС‚Р°.",
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
        title_run = head.paragraphs[0].add_run(f"{screenshot.get('label', 'РЎС‚СЂР°РЅРёС†Р°')}  |  {shorten_path(screenshot.get('url', ''), 72)}")
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
        "Р“РґРµ РїСЂРѕРµРєС‚ СѓР¶Рµ СЃРёР»С‘РЅ Рё РіРґРµ РѕРЅ С‚РµСЂСЏРµС‚ СЂРѕСЃС‚",
        "РќРёР¶Рµ РЅРµ РїСЂРѕСЃС‚Рѕ СЃРїРёСЃРѕРє Р·Р°РјРµС‡Р°РЅРёР№, Р° РєРѕРЅС†РµРЅС‚СЂР°С‚ С‚РµС… Р·РѕРЅ, РєРѕС‚РѕСЂС‹Рµ СЃРёР»СЊРЅРµРµ РІСЃРµРіРѕ РІР»РёСЏСЋС‚ РЅР° РёРЅРґРµРєСЃ, СЃРЅРёРїРїРµС‚С‹, СЃРїСЂРѕСЃ Рё РєРѕРЅРІРµСЂСЃРёСЋ.",
    )
    for paragraph in build_executive_summary_dynamic(audit):
        add_text_paragraph(doc, paragraph, size=11.4, color=BRAND_TEXT, space_after=6)
    add_metric_grid(doc, audit)

    add_section_heading(doc, "РЎРёР»СЊРЅС‹Рµ СЃС‚РѕСЂРѕРЅС‹", "Р§С‚Рѕ СѓР¶Рµ СЂР°Р±РѕС‚Р°РµС‚ РІ РїР»СЋСЃ РїСЂРѕРµРєС‚Сѓ")
    add_bullet_list(doc, audit["strengths"], size=11.1)

    add_section_heading(
        doc,
        "РўР°Р±Р»РёС†Р° РїСЂРёРѕСЂРёС‚РµС‚РѕРІ",
        "РњР°С‚СЂРёС†Р° РїСЂРѕР±Р»РµРј РїРѕ РІР»РёСЏРЅРёСЋ РЅР° СЂРѕСЃС‚",
        "Р—РґРµСЃСЊ Р·Р°РґР°С‡Рё РЅРµ РїСЂРѕСЃС‚Рѕ РїРµСЂРµС‡РёСЃР»РµРЅС‹, Р° СЂР°Р·Р»РѕР¶РµРЅС‹ РїРѕ impact, risk Рё business-effect, С‡С‚РѕР±С‹ Р±С‹Р»Рѕ РїРѕРЅСЏС‚РЅРѕ, С‡С‚Рѕ РґРµР»Р°С‚СЊ РїРµСЂРІС‹Рј.",
    )
    add_priority_matrix_table(doc, audit.get("priority_matrix", []))

    add_section_heading(
        doc,
        "РљСЂРёС‚РёС‡РµСЃРєРёРµ РѕС€РёР±РєРё",
        "Р§С‚Рѕ СЃРµР№С‡Р°СЃ СЂРµР°Р»СЊРЅРѕ Р±Р»РѕРєРёСЂСѓРµС‚ СЂРѕСЃС‚",
        "Р­С‚Рѕ РЅРµ РІРµСЃСЊ backlog, Р° РѕРіСЂР°РЅРёС‡РµРЅРёСЏ, РєРѕС‚РѕСЂС‹Рµ РїРµСЂРІС‹РјРё СЂРµР¶СѓС‚ РёРЅРґРµРєСЃ, СЃРЅРёРїРїРµС‚С‹, crawl budget Рё СЃРїРѕСЃРѕР±РЅРѕСЃС‚СЊ СЃР°Р№С‚Р° Р·Р°Р±РёСЂР°С‚СЊ СЃРїСЂРѕСЃ.",
    )
    critical_issue_cards = [AuditIssue(**item) for item in audit.get("critical_errors", [])] or audit["issues"][:4]
    add_issue_cards(doc, critical_issue_cards)

    add_section_heading(
        doc,
        "Р¤Р°Р·С‹ Р°СѓРґРёС‚Р°",
        "Р“Р»СѓР±РѕРєРёР№ СЂР°Р·Р±РѕСЂ РїРѕ РєР»СЋС‡РµРІС‹Рј СЃР»РѕСЏРј СЃР°Р№С‚Р°",
        "РќРёР¶Рµ Р°СѓРґРёС‚ СЂР°Р·РѕР±СЂР°РЅ РїРѕ СЌС‚Р°РїР°Рј, С‡С‚РѕР±С‹ Р±С‹Р»Рѕ РІРёРґРЅРѕ РЅРµ С‚РѕР»СЊРєРѕ СЃРїРёСЃРѕРє РѕС€РёР±РѕРє, РЅРѕ Рё СЂРµР°Р»СЊРЅСѓСЋ Р»РѕРіРёРєСѓ РїСЂРѕРІРµСЂРєРё РїСЂРѕРµРєС‚Р°.",
    )
    add_phase_sections_doc(doc, audit.get("phase_sections", []))

    add_section_heading(
        doc,
        "Quick wins",
        "Р‘С‹СЃС‚СЂС‹Рµ РїРѕР±РµРґС‹ РЅР° Р±Р»РёР¶Р°Р№С€РёР№ СЃРїСЂРёРЅС‚",
        "Р­С‚Рё РїСЂР°РІРєРё РјРѕР¶РЅРѕ РІРЅРµРґСЂРёС‚СЊ Р±С‹СЃС‚СЂРѕ Рё РїРѕР»СѓС‡РёС‚СЊ Р·Р°РјРµС‚РЅС‹Р№ СЌС„С„РµРєС‚ Р±РµР· Р±РѕР»СЊС€РѕР№ РїРµСЂРµСЃС‚СЂРѕР№РєРё РїСЂРѕРµРєС‚Р°.",
    )
    add_action_cards_doc(doc, audit.get("quick_wins", []), "effort", "impact")

    add_section_heading(
        doc,
        "РЎС‚СЂР°С‚РµРіРёС‡РµСЃРєРёРµ СѓР»СѓС‡С€РµРЅРёСЏ",
        "Р§С‚Рѕ СѓСЃРёР»РёС‚ РїСЂРѕРµРєС‚ РїРѕРІРµСЂС… Р±Р°Р·РѕРІС‹С… С„РёРєСЃРѕРІ",
        "Р­С‚Рѕ СѓР¶Рµ РЅРµ С‚СѓС€РµРЅРёРµ РїРѕР¶Р°СЂР°, Р° СЃР»РѕР№ РёР·РјРµРЅРµРЅРёР№, РєРѕС‚РѕСЂС‹Р№ РїСЂРµРІСЂР°С‰Р°РµС‚ СЃР°Р№С‚ РІ Р±РѕР»РµРµ СЃРёР»СЊРЅС‹Р№ РёСЃС‚РѕС‡РЅРёРє Р·Р°СЏРІРѕРє Рё СЂРѕСЃС‚Р° РІРёРґРёРјРѕСЃС‚Рё.",
    )
    add_action_cards_doc(doc, audit.get("strategic_moves", []), "impact", "effort")

    add_section_heading(doc, "РўРѕС‡РєРё СЂРѕСЃС‚Р°", "РљСѓРґР° РјР°СЃС€С‚Р°Р±РёСЂРѕРІР°С‚СЊ РїСЂРѕРµРєС‚ РїРѕСЃР»Рµ С„РёРєСЃРѕРІ")
    add_bullet_list(doc, audit["growth_points"], size=11.1)

    add_section_heading(
        doc,
        "Roadmap",
        "РџР»Р°РЅ РІРЅРµРґСЂРµРЅРёСЏ РЅР° 60 РґРЅРµР№",
        "РџРѕСЂСЏРґРѕРє РІС‹СЃС‚СЂРѕРµРЅ С‚Р°Рє, С‡С‚РѕР±С‹ СЃРЅР°С‡Р°Р»Р° СЃРЅСЏС‚СЊ С‚РµС…РЅРёС‡РµСЃРєРёРµ СЃС‚РѕРї-С„Р°РєС‚РѕСЂС‹, РїРѕС‚РѕРј СѓСЃРёР»РёС‚СЊ С€Р°Р±Р»РѕРЅС‹ Рё С‚РѕР»СЊРєРѕ РїРѕСЃР»Рµ СЌС‚РѕРіРѕ РЅР°СЂР°С‰РёРІР°С‚СЊ СЃР»РѕР№ СЂРѕСЃС‚Р°.",
    )
    add_roadmap_table(doc, audit["roadmap"])

    add_section_heading(
        doc,
        "РџСЂРёР»РѕР¶РµРЅРёРµ",
        "РљР°РєРёРµ СЃС‚СЂР°РЅРёС†С‹ СЂРµР°Р»СЊРЅРѕ Р»РµРіР»Рё РІ РѕСЃРЅРѕРІСѓ СЂР°Р·Р±РѕСЂР°",
        "Р­С‚Рѕ РЅРµ СЃР»СѓС‡Р°Р№РЅР°СЏ РІС‹Р±РѕСЂРєР°: СЃСЋРґР° СЃРѕР±СЂР°РЅС‹ РіР»Р°РІРЅР°СЏ, РєРѕРјРјРµСЂС‡РµСЃРєРёРµ, РєРѕРЅС‚Р°РєС‚РЅС‹Рµ, СЃР»СѓР¶РµР±РЅС‹Рµ Рё РіР»СѓР±РёРЅРЅС‹Рµ URL, РїРѕ РєРѕС‚РѕСЂС‹Рј РІРёРґРЅРѕ РєР°С‡РµСЃС‚РІРѕ С€Р°Р±Р»РѕРЅРѕРІ РїСЂРѕРµРєС‚Р°.",
    )
    add_snapshot_table(doc, audit.get("appendix_pages") or audit["sample_pages"])

    output_path.parent.mkdir(parents=True, exist_ok=True)
    doc.save(str(output_path))


def serialize_audit(audit: dict) -> dict:
    payload = dict(audit)
    payload["home_page"] = asdict(audit["home_page"])
    payload["sample_pages"] = [asdict(item) for item in audit["sample_pages"]]
    payload["appendix_pages"] = [asdict(item) for item in audit.get("appendix_pages", [])]
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
    parser.add_argument("--sample-size", type=int, default=0, help="How many pages to analyze from the website; 0 = full crawl")
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
        write_preview_pdf(audit_payload, pdf_path)
    print(f"Audit ready: {output}")


if __name__ == "__main__":
    main()

