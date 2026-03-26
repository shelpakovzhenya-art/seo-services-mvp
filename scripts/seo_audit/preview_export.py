from __future__ import annotations

from html import escape
from pathlib import Path
from urllib.parse import urlparse

from text_utils import normalize_output_text, normalize_structure

try:
    from reportlab.lib import colors
    from reportlab.lib.enums import TA_CENTER
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
    from reportlab.lib.units import mm
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    from reportlab.platypus import KeepTogether, PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle
except Exception:  # pragma: no cover - optional runtime dependency
    colors = None
    TA_CENTER = None
    A4 = None
    ParagraphStyle = None
    getSampleStyleSheet = None
    mm = None
    pdfmetrics = None
    TTFont = None
    KeepTogether = None
    PageBreak = None
    Paragraph = None
    SimpleDocTemplate = None
    Spacer = None
    Table = None
    TableStyle = None


BRAND_DARK = "#101C2B"
BRAND_TEXT = "#102035"
BRAND_MUTED = "#5D6B82"
BRAND_LINE = "#D8E7F6"
BRAND_CYAN = "#69D3FF"
BRAND_ORANGE = "#F28B34"
BRAND_SOFT = "#F6F9FC"
BRAND_ACCENT_SOFT = "#FFF3E6"
SEVERITY_COLORS = {
    "Critical": "#FFE3E3",
    "High": "#FFF1E6",
    "Medium": "#EEF7FF",
    "Low": "#F4F6FA",
}

_REGISTERED_PDF_FONTS: tuple[str, str] | None = None


def _find_font_paths() -> tuple[Path | None, Path | None]:
    regular_candidates = [
        Path(r"C:\Windows\Fonts\arial.ttf"),
        Path(r"C:\Windows\Fonts\Arial.ttf"),
        Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
        Path("/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf"),
    ]
    bold_candidates = [
        Path(r"C:\Windows\Fonts\arialbd.ttf"),
        Path(r"C:\Windows\Fonts\Arialbd.ttf"),
        Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"),
        Path("/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf"),
    ]

    regular = next((path for path in regular_candidates if path.exists()), None)
    bold = next((path for path in bold_candidates if path.exists()), None)
    return regular, bold


def _ensure_pdf_fonts() -> tuple[str, str]:
    global _REGISTERED_PDF_FONTS

    if _REGISTERED_PDF_FONTS is not None:
        return _REGISTERED_PDF_FONTS

    regular_path, bold_path = _find_font_paths()
    if pdfmetrics and TTFont and regular_path and bold_path:
        try:
            pdfmetrics.registerFont(TTFont("AuditSans", str(regular_path)))
            pdfmetrics.registerFont(TTFont("AuditSans-Bold", str(bold_path)))
            _REGISTERED_PDF_FONTS = ("AuditSans", "AuditSans-Bold")
            return _REGISTERED_PDF_FONTS
        except Exception:
            pass

    _REGISTERED_PDF_FONTS = ("Helvetica", "Helvetica-Bold")
    return _REGISTERED_PDF_FONTS


def _escape_pdf_text(value: object) -> str:
    text = normalize_output_text(value)
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("\n", "<br/>")
    )


def _escape_html_text(value: object) -> str:
    return escape(normalize_output_text(value))


def _compact_url_label(url: object, max_length: int = 42) -> str:
    parsed = urlparse(normalize_output_text(url))
    path = parsed.path or "/"
    if parsed.query:
        path = f"{path}?{parsed.query}"
    if len(path) <= max_length:
        return path
    return f"{path[: max(1, max_length - 3)]}..."


def _build_pdf_styles():
    regular_font, bold_font = _ensure_pdf_fonts()
    styles = getSampleStyleSheet()

    base = ParagraphStyle(
        "AuditBase",
        parent=styles["Normal"],
        fontName=regular_font,
        fontSize=10.4,
        leading=14,
        textColor=colors.HexColor(BRAND_TEXT),
        spaceAfter=6,
    )

    return {
        "base": base,
        "muted": ParagraphStyle("AuditMuted", parent=base, textColor=colors.HexColor(BRAND_MUTED)),
        "small": ParagraphStyle("AuditSmall", parent=base, fontSize=8.8, leading=11.5, textColor=colors.HexColor(BRAND_MUTED)),
        "kicker": ParagraphStyle(
            "AuditKicker",
            parent=base,
            fontName=bold_font,
            fontSize=8.8,
            leading=11,
            textColor=colors.HexColor(BRAND_ORANGE),
            spaceAfter=6,
        ),
        "coverTag": ParagraphStyle(
            "AuditCoverTag",
            parent=base,
            fontName=bold_font,
            fontSize=9.2,
            leading=12,
            textColor=colors.HexColor(BRAND_CYAN),
            spaceAfter=12,
        ),
        "coverTitle": ParagraphStyle(
            "AuditCoverTitle",
            parent=base,
            fontName=bold_font,
            fontSize=28,
            leading=31,
            textColor=colors.white,
            spaceAfter=12,
        ),
        "coverBody": ParagraphStyle(
            "AuditCoverBody",
            parent=base,
            fontSize=11.2,
            leading=15.5,
            textColor=colors.white,
            spaceAfter=8,
        ),
        "passportKicker": ParagraphStyle(
            "AuditPassportKicker",
            parent=base,
            fontName=bold_font,
            fontSize=8.8,
            leading=11,
            textColor=colors.HexColor(BRAND_ORANGE),
            spaceAfter=6,
        ),
        "passportTitle": ParagraphStyle(
            "AuditPassportTitle",
            parent=base,
            fontName=bold_font,
            fontSize=23,
            leading=27,
            textColor=colors.HexColor(BRAND_TEXT),
            spaceAfter=8,
        ),
        "passportScore": ParagraphStyle(
            "AuditPassportScore",
            parent=base,
            fontName=bold_font,
            fontSize=42,
            leading=46,
            textColor=colors.HexColor(BRAND_TEXT),
            spaceAfter=0,
        ),
        "sectionTitle": ParagraphStyle(
            "AuditSectionTitle",
            parent=base,
            fontName=bold_font,
            fontSize=20,
            leading=24,
            textColor=colors.HexColor(BRAND_TEXT),
            spaceAfter=8,
        ),
        "cardTitle": ParagraphStyle(
            "AuditCardTitle",
            parent=base,
            fontName=bold_font,
            fontSize=12.6,
            leading=16,
            textColor=colors.HexColor(BRAND_TEXT),
            spaceAfter=6,
        ),
        "metricLabel": ParagraphStyle(
            "AuditMetricLabel",
            parent=base,
            alignment=TA_CENTER,
            fontName=bold_font,
            fontSize=8.4,
            leading=10.2,
            textColor=colors.HexColor(BRAND_MUTED),
            spaceAfter=4,
        ),
        "metricValue": ParagraphStyle(
            "AuditMetricValue",
            parent=base,
            alignment=TA_CENTER,
            fontName=bold_font,
            fontSize=20,
            leading=23,
            textColor=colors.HexColor(BRAND_TEXT),
            spaceAfter=0,
        ),
    }


def _issue_style(severity: str) -> str:
    return SEVERITY_COLORS.get(severity or "", SEVERITY_COLORS["Low"])


def _metric_card(label: str, value: object, styles: dict) -> Table:
    table = Table(
        [
            [Paragraph(_escape_pdf_text(label), styles["metricLabel"])],
            [Paragraph(_escape_pdf_text(value), styles["metricValue"])],
        ],
        colWidths=[42 * mm],
    )
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                ("BOX", (0, 0), (-1, -1), 1, colors.HexColor(BRAND_LINE)),
                ("ROUNDEDCORNERS", [14, 14, 14, 14]),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ]
        )
    )
    return table


def _paragraph_list(items: list[str], styles: dict) -> list:
    flowables = []
    for item in items:
        flowables.append(Paragraph(f"• {_escape_pdf_text(item)}", styles["base"]))
    return flowables


def _section_header(story: list, kicker: str, title: str, lead: str, styles: dict) -> None:
    story.append(Paragraph(_escape_pdf_text(kicker.upper()), styles["kicker"]))
    story.append(Paragraph(_escape_pdf_text(title), styles["sectionTitle"]))
    story.append(Paragraph(_escape_pdf_text(lead), styles["muted"]))
    story.append(Spacer(1, 4))


def _action_meta_label(key: str) -> str:
    return {
        "impact": "Ожидаемый эффект",
        "effort": "Сколько займет времени",
    }.get(key, normalize_output_text(key))


def _severity_label(severity: str) -> str:
    return {
        "Critical": "Критично",
        "CRITICAL": "Критично",
        "High": "Высокий приоритет",
        "HIGH": "Высокий приоритет",
        "Medium": "Средний приоритет",
        "MEDIUM": "Средний приоритет",
        "Low": "Низкий приоритет",
        "LOW": "Низкий приоритет",
    }.get(severity or "", normalize_output_text(severity))


def _append_issue_cards(story: list, issues: list[dict], styles: dict) -> None:
    for issue in issues:
        evidence_html = "".join(f"<br/>• {_escape_pdf_text(item)}" for item in issue.get("evidence", []))
        severity_label = _escape_pdf_text(_severity_label(str(issue.get("severity", ""))))
        content = [
            [Paragraph(_escape_pdf_text(f"{severity_label}  |  {issue.get('title', '')}"), styles["cardTitle"])],
            [Paragraph(_escape_pdf_text(issue.get("why_it_matters", "")), styles["base"])],
            [Paragraph(f"<b>Что нашли:</b>{evidence_html or '<br/>• Без дополнительных примеров.'}", styles["base"])],
            [Paragraph(f"<b>Что делать:</b> {_escape_pdf_text(issue.get('recommendation', ''))}", styles["base"])],
        ]
        card = Table(content, colWidths=[180 * mm])
        card.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor(_issue_style(str(issue.get("severity", ""))))),
                    ("BACKGROUND", (0, 1), (-1, -1), colors.white),
                    ("BOX", (0, 0), (-1, -1), 1, colors.HexColor(BRAND_LINE)),
                    ("ROUNDEDCORNERS", [14, 14, 14, 14]),
                    ("LEFTPADDING", (0, 0), (-1, -1), 12),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                    ("TOPPADDING", (0, 0), (-1, -1), 10),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
                ]
            )
        )
        story.append(card)
        story.append(Spacer(1, 10))


def _append_action_cards(story: list, items: list[dict], kicker: str, title: str, lead: str, styles: dict) -> None:
    _section_header(story, kicker, title, lead, styles)
    for item in items:
        card = Table(
            [
                [Paragraph(_escape_pdf_text(item.get("title", "")), styles["cardTitle"])],
                [Paragraph(f"<b>{_escape_pdf_text(_action_meta_label('impact'))}:</b> {_escape_pdf_text(item.get('impact', ''))} &nbsp;&nbsp; <b>{_escape_pdf_text(_action_meta_label('effort'))}:</b> {_escape_pdf_text(item.get('effort', ''))}", styles["small"])],
                [Paragraph(_escape_pdf_text(item.get("action") or item.get("details") or ""), styles["base"])],
            ],
            colWidths=[180 * mm],
        )
        card.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                    ("BOX", (0, 0), (-1, -1), 1, colors.HexColor(BRAND_LINE)),
                    ("ROUNDEDCORNERS", [14, 14, 14, 14]),
                    ("LEFTPADDING", (0, 0), (-1, -1), 12),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                    ("TOPPADDING", (0, 0), (-1, -1), 10),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
                ]
            )
        )
        story.append(card)
        story.append(Spacer(1, 10))


def _append_phase_sections(story: list, phase_sections: list[dict], styles: dict) -> None:
    for section in phase_sections:
        header_story: list = []
        _section_header(header_story, "Подробный разбор", str(section.get("title", "")), str(section.get("intro", "")), styles)
        checks = section.get("checks", [])
        if not checks:
            story.extend(header_story)
            story.append(Paragraph("По этому этапу в выборке не нашлось данных для подробного блока.", styles["muted"]))
            story.append(Spacer(1, 10))
            continue
        for idx, check in enumerate(checks):
            metrics = "<br/>".join(
                f"<b>{_escape_pdf_text(label)}:</b> {_escape_pdf_text(value)}"
                for label, value in check.get("metrics", [])
            )
            findings = "<br/>".join(f"• {_escape_pdf_text(item)}" for item in check.get("findings", []))
            card = Table(
                [
                    [Paragraph(_escape_pdf_text(check.get("name", "")), styles["cardTitle"])],
                    [Paragraph(f"<b>Что проверялось:</b> {_escape_pdf_text(check.get('checked', ''))}", styles["base"])],
                    [Paragraph(f"<b>Как проверялось:</b> {_escape_pdf_text(check.get('method', ''))}", styles["small"])],
                    [
                        Table(
                            [
                                [
                                    Table(
                                        [
                                            [Paragraph("Ключевые метрики", styles["small"])],
                                            [Paragraph(metrics or "—", styles["base"])],
                                        ],
                                        colWidths=[84 * mm],
                                    ),
                                    Table(
                                        [
                                            [Paragraph("Что нашли", styles["small"])],
                                            [Paragraph(findings or "—", styles["base"])],
                                        ],
                                        colWidths=[84 * mm],
                                    ),
                                ]
                            ]
                        )
                    ],
                    [Paragraph(f"<b>Приоритет:</b> {_escape_pdf_text(_severity_label(str(check.get('priority', ''))))} &nbsp;&nbsp; <b>Ответственный:</b> {_escape_pdf_text(check.get('owner', ''))}", styles["small"])],
                    [Paragraph(f"<b>Что делать:</b> {_escape_pdf_text(check.get('recommendation', ''))}", styles["base"])],
                ],
                colWidths=[180 * mm],
            )
            card.setStyle(
                TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                        ("BOX", (0, 0), (-1, -1), 1, colors.HexColor(BRAND_LINE)),
                        ("ROUNDEDCORNERS", [14, 14, 14, 14]),
                        ("LEFTPADDING", (0, 0), (-1, -1), 12),
                        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                        ("TOPPADDING", (0, 0), (-1, -1), 10),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
                    ]
                )
            )
            if idx == 0:
                story.append(KeepTogether(header_story + [card, Spacer(1, 10)]))
            else:
                story.append(card)
                story.append(Spacer(1, 10))


def _append_phase_sections_v2(story: list, phase_sections: list[dict], styles: dict) -> None:
    for section in phase_sections:
        header_story: list = []
        _section_header(
            header_story,
            "РџРѕРґСЂРѕР±РЅС‹Р№ СЂР°Р·Р±РѕСЂ",
            str(section.get("title", "")),
            str(section.get("intro", "")),
            styles,
        )
        story.extend(header_story)
        checks = section.get("checks", [])
        if not checks:
            story.append(Paragraph("РџРѕ СЌС‚РѕРјСѓ СЌС‚Р°РїСѓ РІ РІС‹Р±РѕСЂРєРµ РЅРµ РЅР°С€Р»РѕСЃСЊ РґР°РЅРЅС‹С… РґР»СЏ РїРѕРґСЂРѕР±РЅРѕРіРѕ Р±Р»РѕРєР°.", styles["muted"]))
            story.append(Spacer(1, 10))
            continue

        for check in checks:
            metrics = "<br/>".join(
                f"<b>{_escape_pdf_text(label)}:</b> {_escape_pdf_text(value)}"
                for label, value in check.get("metrics", [])
            )
            findings = "<br/>".join(f"вЂў {_escape_pdf_text(item)}" for item in check.get("findings", []))
            detail_grid = Table(
                [
                    [
                        Paragraph("РљР»СЋС‡РµРІС‹Рµ РјРµС‚СЂРёРєРё", styles["small"]),
                        Paragraph("Р§С‚Рѕ РЅР°С€Р»Рё", styles["small"]),
                    ],
                    [
                        Paragraph(metrics or "вЂ”", styles["base"]),
                        Paragraph(findings or "вЂ”", styles["base"]),
                    ],
                ],
                colWidths=[76 * mm, 76 * mm],
            )
            detail_grid.setStyle(
                TableStyle(
                    [
                        ("VALIGN", (0, 0), (-1, -1), "TOP"),
                        ("LEFTPADDING", (0, 0), (-1, -1), 0),
                        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                        ("TOPPADDING", (0, 0), (-1, -1), 0),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
                    ]
                )
            )
            card = Table(
                [
                    [Paragraph(_escape_pdf_text(check.get("name", "")), styles["cardTitle"])],
                    [Paragraph(f"<b>Р§С‚Рѕ РїСЂРѕРІРµСЂСЏР»РѕСЃСЊ:</b> {_escape_pdf_text(check.get('checked', ''))}", styles["base"])],
                    [Paragraph(f"<b>РљР°Рє РїСЂРѕРІРµСЂСЏР»РѕСЃСЊ:</b> {_escape_pdf_text(check.get('method', ''))}", styles["small"])],
                    [detail_grid],
                    [Paragraph(f"<b>РџСЂРёРѕСЂРёС‚РµС‚:</b> {_escape_pdf_text(_severity_label(str(check.get('priority', ''))))} &nbsp;&nbsp; <b>РћС‚РІРµС‚СЃС‚РІРµРЅРЅС‹Р№:</b> {_escape_pdf_text(check.get('owner', ''))}", styles["small"])],
                    [Paragraph(f"<b>Р§С‚Рѕ РґРµР»Р°С‚СЊ:</b> {_escape_pdf_text(check.get('recommendation', ''))}", styles["base"])],
                ],
                colWidths=[180 * mm],
            )
            card.setStyle(
                TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                        ("BOX", (0, 0), (-1, -1), 1, colors.HexColor(BRAND_LINE)),
                        ("ROUNDEDCORNERS", [14, 14, 14, 14]),
                        ("LEFTPADDING", (0, 0), (-1, -1), 12),
                        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                        ("TOPPADDING", (0, 0), (-1, -1), 10),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
                    ]
                )
            )
            story.append(card)
            story.append(Spacer(1, 10))


def _append_phase_sections_v3(story: list, phase_sections: list[dict], styles: dict) -> None:
    for section in phase_sections:
        header_story: list = []
        _section_header(header_story, "Подробный разбор", str(section.get("title", "")), str(section.get("intro", "")), styles)
        story.extend(header_story)
        checks = section.get("checks", [])
        if not checks:
            story.append(Paragraph("По этому этапу в выборке не нашлось данных для подробного блока.", styles["muted"]))
            story.append(Spacer(1, 10))
            continue

        for check in checks:
            metrics = "<br/>".join(
                f"<b>{_escape_pdf_text(label)}:</b> {_escape_pdf_text(value)}"
                for label, value in check.get("metrics", [])
            )
            findings = "<br/>".join(f"• {_escape_pdf_text(item)}" for item in check.get("findings", []))
            detail_grid = Table(
                [
                    [
                        Paragraph(_escape_pdf_text("Ключевые метрики"), styles["small"]),
                        Paragraph(_escape_pdf_text("Что нашли"), styles["small"]),
                    ],
                    [
                        Paragraph(metrics or "—", styles["base"]),
                        Paragraph(findings or "—", styles["base"]),
                    ],
                ],
                colWidths=[76 * mm, 76 * mm],
            )
            detail_grid.setStyle(
                TableStyle(
                    [
                        ("VALIGN", (0, 0), (-1, -1), "TOP"),
                        ("LEFTPADDING", (0, 0), (-1, -1), 0),
                        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                        ("TOPPADDING", (0, 0), (-1, -1), 0),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
                    ]
                )
            )
            card = Table(
                [
                    [Paragraph(_escape_pdf_text(check.get("name", "")), styles["cardTitle"])],
                    [Paragraph(f"<b>{_escape_pdf_text('Что проверялось')}:</b> {_escape_pdf_text(check.get('checked', ''))}", styles["base"])],
                    [Paragraph(f"<b>{_escape_pdf_text('Как проверялось')}:</b> {_escape_pdf_text(check.get('method', ''))}", styles["small"])],
                    [detail_grid],
                    [Paragraph(f"<b>{_escape_pdf_text('Приоритет')}:</b> {_escape_pdf_text(_severity_label(str(check.get('priority', ''))))} &nbsp;&nbsp; <b>{_escape_pdf_text('Ответственный')}:</b> {_escape_pdf_text(check.get('owner', ''))}", styles["small"])],
                    [Paragraph(f"<b>{_escape_pdf_text('Что делать')}:</b> {_escape_pdf_text(check.get('recommendation', ''))}", styles["base"])],
                ],
                colWidths=[180 * mm],
            )
            card.setStyle(
                TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                        ("BOX", (0, 0), (-1, -1), 1, colors.HexColor(BRAND_LINE)),
                        ("ROUNDEDCORNERS", [14, 14, 14, 14]),
                        ("LEFTPADDING", (0, 0), (-1, -1), 12),
                        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                        ("TOPPADDING", (0, 0), (-1, -1), 10),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
                    ]
                )
            )
            story.append(card)
            story.append(Spacer(1, 10))


def _append_competitor_comparison(story: list, comparison: dict, styles: dict) -> None:
    _section_header(
        story,
        "Сравнение с конкурентами",
        "Чего не хватает на фоне сильных конкурентов",
        "Сравнили ключевые шаблоны с конкурентами и оставили только те разрывы, которые можно превратить в понятное ТЗ на внедрение.",
        styles,
    )

    summary = comparison.get("summary", [])
    if summary:
        story.extend(_paragraph_list(summary, styles))
        story.append(Spacer(1, 8))


    for competitor in comparison.get("competitors", []):
        highlights_html = "".join(f"<br/>- {_escape_pdf_text(item)}" for item in competitor.get("highlights", []))
        factor_html = "".join(f"<br/>- {_escape_pdf_text(item)}" for item in competitor.get("factor_summary", []))
        template_rows_html = "".join(f"<br/>- {_escape_pdf_text(item)}" for item in competitor.get("template_rows", []))
        template_html = "".join(f"<br/>- {_escape_pdf_text(item)}" for item in competitor.get("template_findings", []))
        snippet_html = "".join(f"<br/>- {_escape_pdf_text(item)}" for item in competitor.get("snippet_findings", []))
        commercial_html = "".join(f"<br/>- {_escape_pdf_text(item)}" for item in competitor.get("commercial_findings", []))
        examples = competitor.get("sample_paths", [])[:3]
        card_rows = [
            [Paragraph(_escape_pdf_text(f"{competitor.get('domain', '')} | проверено страниц: {competitor.get('pages_checked', 0)}"), styles["cardTitle"])],
        ]
        if highlights_html:
            card_rows.append([Paragraph(f"<b>{_escape_pdf_text('Коротко')}:</b>{highlights_html}", styles["base"])])
        if factor_html:
            card_rows.append([Paragraph(f"<b>{_escape_pdf_text('Ключевые факторы')}:</b>{factor_html}", styles["base"])])
        if template_rows_html:
            card_rows.append([Paragraph(f"<b>{_escape_pdf_text('Ключевые различия по шаблонам')}:</b>{template_rows_html}", styles["base"])])
        if template_html:
            card_rows.append([Paragraph(f"<b>{_escape_pdf_text('По шаблонам')}:</b>{template_html}", styles["base"])])
        if snippet_html:
            card_rows.append([Paragraph(f"<b>{_escape_pdf_text('По сниппетам')}:</b>{snippet_html}", styles["base"])])
        if commercial_html:
            card_rows.append([Paragraph(f"<b>{_escape_pdf_text('По FAQ, доверию и коммерческому слою')}:</b>{commercial_html}", styles["base"])])
        if examples:
            card_rows.append([Paragraph(f"<b>{_escape_pdf_text('Где это видно')}:</b> {_escape_pdf_text(', '.join(examples))}", styles["small"])])
        card = Table(card_rows, colWidths=[180 * mm])
        card.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                    ("BOX", (0, 0), (-1, -1), 1, colors.HexColor(BRAND_LINE)),
                    ("ROUNDEDCORNERS", [14, 14, 14, 14]),
                    ("LEFTPADDING", (0, 0), (-1, -1), 12),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                    ("TOPPADDING", (0, 0), (-1, -1), 10),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
                ]
            )
        )
        story.append(card)
        story.append(Spacer(1, 10))

    for item in comparison.get("gap_items", []):
        examples_html = "".join(f"<br/>• {_escape_pdf_text(example)}" for example in item.get("examples", []))
        card = Table(
            [
                [Paragraph(_escape_pdf_text(item.get("title", "")), styles["cardTitle"])],
                [Paragraph(f"<b>Приоритет:</b> {_escape_pdf_text(item.get('priority', ''))} &nbsp;&nbsp; <b>Ответственный:</b> {_escape_pdf_text(item.get('owner', ''))}", styles["small"])],
                [Paragraph(f"<b>Что сейчас:</b> {_escape_pdf_text(item.get('current_state', ''))}", styles["base"])],
                [Paragraph(f"<b>Что видно у конкурентов:</b> {_escape_pdf_text(item.get('competitor_state', ''))}", styles["base"])],
                [Paragraph(f"<b>Примеры:</b>{examples_html or '<br/>—'}", styles["base"])],
                [Paragraph(f"<b>Короткое ТЗ:</b> {_escape_pdf_text(item.get('task', ''))}", styles["base"])],
                [Paragraph(f"<b>Что это даст:</b> {_escape_pdf_text(item.get('benefit', ''))}", styles["small"])],
            ],
            colWidths=[180 * mm],
        )
        card.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                    ("BOX", (0, 0), (-1, -1), 1, colors.HexColor(BRAND_LINE)),
                    ("ROUNDEDCORNERS", [14, 14, 14, 14]),
                    ("LEFTPADDING", (0, 0), (-1, -1), 12),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                    ("TOPPADDING", (0, 0), (-1, -1), 10),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
                ]
            )
        )
        story.append(card)
        story.append(Spacer(1, 10))

    failures = comparison.get("failures", [])
    if failures:
        story.append(Paragraph("Не по всем конкурентам удалось собрать рабочую выборку страниц.", styles["muted"]))
        story.extend(_paragraph_list([f"{item.get('url', '')}: {item.get('error', '')}" for item in failures], styles))
        story.append(Spacer(1, 8))


def _append_competitor_comparison_v2(story: list, comparison: dict, styles: dict) -> None:
    _section_header(
        story,
        "Сравнение с конкурентами",
        "Чего не хватает на фоне сильных конкурентов",
        "Сравнение показывает, какие шаблоны, блоки и коммерческие сигналы конкуренты используют лучше и что стоит внедрить в первую очередь.",
        styles,
    )

    summary = comparison.get("summary", [])
    if summary:
        story.extend(_paragraph_list(summary, styles))
        story.append(Spacer(1, 8))

    for competitor in comparison.get("competitors", []):
        highlights_html = "".join(f"<br/>• {_escape_pdf_text(item)}" for item in competitor.get("highlights", []))
        template_html = "".join(f"<br/>• {_escape_pdf_text(item)}" for item in competitor.get("template_findings", []))
        snippet_html = "".join(f"<br/>• {_escape_pdf_text(item)}" for item in competitor.get("snippet_findings", []))
        commercial_html = "".join(f"<br/>• {_escape_pdf_text(item)}" for item in competitor.get("commercial_findings", []))
        examples = competitor.get("sample_paths", [])[:3]
        card = Table(
            [
                [Paragraph(_escape_pdf_text(f"{competitor.get('domain', '')} | проверено страниц: {competitor.get('pages_checked', 0)}"), styles["cardTitle"])],
                [Paragraph(f"<b>Коротко:</b>{highlights_html or '<br/>—'}", styles["base"])],
                [Paragraph(f"<b>По шаблонам:</b>{template_html or '<br/>—'}", styles["base"])],
                [Paragraph(f"<b>По сниппетам:</b>{snippet_html or '<br/>—'}", styles["base"])],
                [Paragraph(f"<b>По FAQ, доверию и коммерческому слою:</b>{commercial_html or '<br/>—'}", styles["base"])],
                [Paragraph(f"<b>Где это видно:</b> {_escape_pdf_text(', '.join(examples) or '—')}", styles["small"])],
            ],
            colWidths=[180 * mm],
        )
        card.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                    ("BOX", (0, 0), (-1, -1), 1, colors.HexColor(BRAND_LINE)),
                    ("ROUNDEDCORNERS", [14, 14, 14, 14]),
                    ("LEFTPADDING", (0, 0), (-1, -1), 12),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                    ("TOPPADDING", (0, 0), (-1, -1), 10),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
                ]
            )
        )
        story.append(card)
        story.append(Spacer(1, 10))

    for item in comparison.get("gap_items", []):
        examples_html = "".join(f"<br/>• {_escape_pdf_text(example)}" for example in item.get("examples", []))
        card = Table(
            [
                [Paragraph(_escape_pdf_text(item.get("title", "")), styles["cardTitle"])],
                [Paragraph(f"<b>Приоритет:</b> {_escape_pdf_text(item.get('priority', ''))} &nbsp;&nbsp; <b>Ответственный:</b> {_escape_pdf_text(item.get('owner', ''))}", styles["small"])],
                [Paragraph(f"<b>Что сейчас:</b> {_escape_pdf_text(item.get('current_state', ''))}", styles["base"])],
                [Paragraph(f"<b>Что видно у конкурентов:</b> {_escape_pdf_text(item.get('competitor_state', ''))}", styles["base"])],
                [Paragraph(f"<b>Примеры:</b>{examples_html or '<br/>—'}", styles["base"])],
                [Paragraph(f"<b>Короткое ТЗ:</b> {_escape_pdf_text(item.get('task', ''))}", styles["base"])],
                [Paragraph(f"<b>Что это даст:</b> {_escape_pdf_text(item.get('benefit', ''))}", styles["small"])],
            ],
            colWidths=[180 * mm],
        )
        card.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                    ("BOX", (0, 0), (-1, -1), 1, colors.HexColor(BRAND_LINE)),
                    ("ROUNDEDCORNERS", [14, 14, 14, 14]),
                    ("LEFTPADDING", (0, 0), (-1, -1), 12),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                    ("TOPPADDING", (0, 0), (-1, -1), 10),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
                ]
            )
        )
        story.append(card)
        story.append(Spacer(1, 10))

    failures = comparison.get("failures", [])
    if failures:
        story.append(Paragraph("Не по всем конкурентам удалось собрать рабочую выборку страниц.", styles["muted"]))
        story.extend(_paragraph_list([f"{item.get('url', '')}: {item.get('error', '')}" for item in failures], styles))
        story.append(Spacer(1, 8))


def _append_competitor_comparison_v3(story: list, comparison: dict, styles: dict) -> None:
    _section_header(
        story,
        "РЎСЂР°РІРЅРµРЅРёРµ СЃ РєРѕРЅРєСѓСЂРµРЅС‚Р°РјРё",
        "Р§РµРіРѕ РЅРµ С…РІР°С‚Р°РµС‚ РЅР° С„РѕРЅРµ СЃРёР»СЊРЅС‹С… РєРѕРЅРєСѓСЂРµРЅС‚РѕРІ",
        "РЎСЂР°РІРЅРёР»Рё С€Р°Р±Р»РѕРЅС‹ СЃС‚СЂР°РЅРёС†, СЃРЅРёРїРїРµС‚С‹, FAQ, РґРѕРІРµСЂРёРµ Рё РєРѕРјРјРµСЂС‡РµСЃРєРёР№ СЃР»РѕР№. РќРёР¶Рµ РѕСЃС‚Р°РІР»РµРЅС‹ С‚РѕР»СЊРєРѕ С‚Рµ СЂР°Р·СЂС‹РІС‹, РєРѕС‚РѕСЂС‹Рµ РјРѕР¶РЅРѕ РїСЂРµРІСЂР°С‚РёС‚СЊ РІ РїРѕРЅСЏС‚РЅРѕРµ РўР— РЅР° РІРЅРµРґСЂРµРЅРёРµ.",
        styles,
    )

    summary = comparison.get("summary", [])
    if summary:
        story.extend(_paragraph_list(summary, styles))
        story.append(Spacer(1, 8))

    for competitor in comparison.get("competitors", []):
        highlights_html = "".join(f"<br/>вЂў {_escape_pdf_text(item)}" for item in competitor.get("highlights", []))
        factor_html = "".join(f"<br/>вЂў {_escape_pdf_text(item)}" for item in competitor.get("factor_summary", []))
        template_rows_html = "".join(f"<br/>вЂў {_escape_pdf_text(item)}" for item in competitor.get("template_rows", []))
        template_html = "".join(f"<br/>вЂў {_escape_pdf_text(item)}" for item in competitor.get("template_findings", []))
        snippet_html = "".join(f"<br/>вЂў {_escape_pdf_text(item)}" for item in competitor.get("snippet_findings", []))
        commercial_html = "".join(f"<br/>вЂў {_escape_pdf_text(item)}" for item in competitor.get("commercial_findings", []))
        examples = competitor.get("sample_paths", [])[:3]
        card = Table(
            [
                [Paragraph(_escape_pdf_text(f"{competitor.get('domain', '')} | РїСЂРѕРІРµСЂРµРЅРѕ СЃС‚СЂР°РЅРёС†: {competitor.get('pages_checked', 0)}"), styles["cardTitle"])],
                [Paragraph(f"<b>РљРѕСЂРѕС‚РєРѕ:</b>{highlights_html or '<br/>вЂ”'}", styles["base"])],
                [Paragraph(f"<b>РљР»СЋС‡РµРІС‹Рµ С„Р°РєС‚РѕСЂС‹:</b>{factor_html or '<br/>вЂ”'}", styles["base"])],
                [Paragraph(f"<b>РџРѕ С€Р°Р±Р»РѕРЅР°Рј РєРѕСЂРѕС‡Рµ:</b>{template_rows_html or '<br/>вЂ”'}", styles["base"])],
                [Paragraph(f"<b>РџРѕ С€Р°Р±Р»РѕРЅР°Рј:</b>{template_html or '<br/>вЂ”'}", styles["base"])],
                [Paragraph(f"<b>РџРѕ СЃРЅРёРїРїРµС‚Р°Рј:</b>{snippet_html or '<br/>вЂ”'}", styles["base"])],
                [Paragraph(f"<b>РџРѕ FAQ, РґРѕРІРµСЂРёСЋ Рё РєРѕРјРјРµСЂС‡РµСЃРєРѕРјСѓ СЃР»РѕСЋ:</b>{commercial_html or '<br/>вЂ”'}", styles["base"])],
                [Paragraph(f"<b>Р“РґРµ СЌС‚Рѕ РІРёРґРЅРѕ:</b> {_escape_pdf_text(', '.join(examples) or 'вЂ”')}", styles["small"])],
            ],
            colWidths=[180 * mm],
        )
        card.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                    ("BOX", (0, 0), (-1, -1), 1, colors.HexColor(BRAND_LINE)),
                    ("ROUNDEDCORNERS", [14, 14, 14, 14]),
                    ("LEFTPADDING", (0, 0), (-1, -1), 12),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                    ("TOPPADDING", (0, 0), (-1, -1), 10),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
                ]
            )
        )
        story.append(card)
        story.append(Spacer(1, 10))

    for item in comparison.get("gap_items", []):
        examples_html = "".join(f"<br/>вЂў {_escape_pdf_text(example)}" for example in item.get("examples", []))
        steps_html = "".join(f"<br/>вЂў {_escape_pdf_text(step)}" for step in item.get("implementation_steps", []))
        impact_html = "".join(f"<br/>вЂў {_escape_pdf_text(point)}" for point in item.get("impact_points", []))
        scope = ", ".join(item.get("where_to_implement", []) or [])
        card = Table(
            [
                [Paragraph(_escape_pdf_text(item.get("title", "")), styles["cardTitle"])],
                [Paragraph(f"<b>РџСЂРёРѕСЂРёС‚РµС‚:</b> {_escape_pdf_text(item.get('priority', ''))} &nbsp;&nbsp; <b>РћС‚РІРµС‚СЃС‚РІРµРЅРЅС‹Р№:</b> {_escape_pdf_text(item.get('owner', ''))}", styles["small"])],
                [Paragraph(f"<b>Р§С‚Рѕ СЃРµР№С‡Р°СЃ:</b> {_escape_pdf_text(item.get('current_state', ''))}", styles["base"])],
                [Paragraph(f"<b>Р§С‚Рѕ РІРёРґРЅРѕ Сѓ РєРѕРЅРєСѓСЂРµРЅС‚РѕРІ:</b> {_escape_pdf_text(item.get('competitor_state', ''))}", styles["base"])],
                [Paragraph(f"<b>РџСЂРёРјРµСЂС‹:</b>{examples_html or '<br/>вЂ”'}", styles["base"])],
                [Paragraph(f"<b>Р“РґРµ РІРЅРµРґСЂСЏС‚СЊ:</b> {_escape_pdf_text(scope or 'РіР»Р°РІРЅР°СЏ, СѓСЃР»СѓРіРё, РєР°С‚РµРіРѕСЂРёРё Рё СЃС‚СЂР°РЅРёС†С‹ Р·Р°СЏРІРѕРє')}", styles["base"])],
                [Paragraph(f"<b>Р Р°СЃС€РёСЂРµРЅРЅРѕРµ РўР—:</b> {_escape_pdf_text(item.get('task', ''))}", styles["base"])],
                [Paragraph(f"<b>РЁР°РіРё РІРЅРµРґСЂРµРЅРёСЏ:</b>{steps_html or '<br/>вЂ”'}", styles["base"])],
                [Paragraph(f"<b>Р§С‚Рѕ СЌС‚Рѕ РґР°СЃС‚:</b> {_escape_pdf_text(item.get('benefit', ''))}", styles["base"])],
                [Paragraph(f"<b>РћР¶РёРґР°РµРјС‹Р№ СЌС„С„РµРєС‚:</b>{impact_html or '<br/>вЂ”'}", styles["small"])],
            ],
            colWidths=[180 * mm],
        )
        card.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                    ("BOX", (0, 0), (-1, -1), 1, colors.HexColor(BRAND_LINE)),
                    ("ROUNDEDCORNERS", [14, 14, 14, 14]),
                    ("LEFTPADDING", (0, 0), (-1, -1), 12),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                    ("TOPPADDING", (0, 0), (-1, -1), 10),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
                ]
            )
        )
        story.append(card)
        story.append(Spacer(1, 10))

    failures = comparison.get("failures", [])
    if failures:
        story.append(Paragraph("РќРµ РїРѕ РІСЃРµРј РєРѕРЅРєСѓСЂРµРЅС‚Р°Рј СѓРґР°Р»РѕСЃСЊ СЃРѕР±СЂР°С‚СЊ СЂР°Р±РѕС‡СѓСЋ РІС‹Р±РѕСЂРєСѓ СЃС‚СЂР°РЅРёС†.", styles["muted"]))
        story.extend(_paragraph_list([f"{item.get('url', '')}: {item.get('error', '')}" for item in failures], styles))
        story.append(Spacer(1, 8))


def _append_competitor_comparison_v4(story: list, comparison: dict, styles: dict) -> None:
    _section_header(
        story,
        "Сравнение с конкурентами",
        "Чего не хватает на фоне сильных конкурентов",
        "Сравнение показывает, какие шаблоны, блоки и коммерческие сигналы конкуренты используют лучше и что стоит внедрить в первую очередь.",
        styles,
    )

    summary = comparison.get("summary", [])
    if summary:
        story.extend(_paragraph_list(summary, styles))
        story.append(Spacer(1, 8))
    for competitor in comparison.get("competitors", []):
        highlights_html = "".join(f"<br/>- {_escape_pdf_text(item)}" for item in competitor.get("highlights", []))
        factor_html = "".join(f"<br/>- {_escape_pdf_text(item)}" for item in competitor.get("factor_summary", []))
        template_rows_html = "".join(f"<br/>- {_escape_pdf_text(item)}" for item in competitor.get("template_rows", []))
        template_html = "".join(f"<br/>- {_escape_pdf_text(item)}" for item in competitor.get("template_findings", []))
        snippet_html = "".join(f"<br/>- {_escape_pdf_text(item)}" for item in competitor.get("snippet_findings", []))
        commercial_html = "".join(f"<br/>- {_escape_pdf_text(item)}" for item in competitor.get("commercial_findings", []))
        examples = competitor.get("sample_paths", [])[:3]
        card_rows = [
            [Paragraph(_escape_pdf_text(f"{competitor.get('domain', '')} | проверено страниц: {competitor.get('pages_checked', 0)}"), styles["cardTitle"])],
        ]
        if highlights_html:
            card_rows.append([Paragraph(f"<b>{_escape_pdf_text('Коротко')}:</b>{highlights_html}", styles["base"])])
        if factor_html:
            card_rows.append([Paragraph(f"<b>{_escape_pdf_text('Ключевые факторы')}:</b>{factor_html}", styles["base"])])
        if template_rows_html:
            card_rows.append([Paragraph(f"<b>{_escape_pdf_text('Ключевые различия по шаблонам')}:</b>{template_rows_html}", styles["base"])])
        if template_html:
            card_rows.append([Paragraph(f"<b>{_escape_pdf_text('По шаблонам')}:</b>{template_html}", styles["base"])])
        if snippet_html:
            card_rows.append([Paragraph(f"<b>{_escape_pdf_text('По сниппетам')}:</b>{snippet_html}", styles["base"])])
        if commercial_html:
            card_rows.append([Paragraph(f"<b>{_escape_pdf_text('По FAQ, доверию и коммерческому слою')}:</b>{commercial_html}", styles["base"])])
        if examples:
            card_rows.append([Paragraph(f"<b>{_escape_pdf_text('Где это видно')}:</b> {_escape_pdf_text(', '.join(examples))}", styles["small"])])
        card = Table(card_rows, colWidths=[180 * mm])
        card.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                    ("BOX", (0, 0), (-1, -1), 1, colors.HexColor(BRAND_LINE)),
                    ("ROUNDEDCORNERS", [14, 14, 14, 14]),
                    ("LEFTPADDING", (0, 0), (-1, -1), 12),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                    ("TOPPADDING", (0, 0), (-1, -1), 10),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
                ]
            )
        )
        story.append(card)
        story.append(Spacer(1, 10))

    for item in comparison.get("gap_items", []):
        examples_html = "".join(f"<br/>• {_escape_pdf_text(example)}" for example in item.get("examples", []))
        steps_html = "".join(f"<br/>• {_escape_pdf_text(step)}" for step in item.get("implementation_steps", []))
        impact_html = "".join(f"<br/>• {_escape_pdf_text(point)}" for point in item.get("impact_points", []))
        scope = ", ".join(item.get("where_to_implement", []) or [])
        card = Table(
            [
                [Paragraph(_escape_pdf_text(item.get("title", "")), styles["cardTitle"])],
                [Paragraph(f"<b>{_escape_pdf_text('Приоритет')}:</b> {_escape_pdf_text(item.get('priority', ''))} &nbsp;&nbsp; <b>{_escape_pdf_text('Ответственный')}:</b> {_escape_pdf_text(item.get('owner', ''))}", styles["small"])],
                [Paragraph(f"<b>{_escape_pdf_text('Что сейчас')}:</b> {_escape_pdf_text(item.get('current_state', ''))}", styles["base"])],
                [Paragraph(f"<b>{_escape_pdf_text('Что видно у конкурентов')}:</b> {_escape_pdf_text(item.get('competitor_state', ''))}", styles["base"])],
                [Paragraph(f"<b>{_escape_pdf_text('Примеры')}:</b>{examples_html or '<br/>—'}", styles["base"])],
                [Paragraph(f"<b>{_escape_pdf_text('Где внедрять')}:</b> {_escape_pdf_text(scope or 'главная, услуги, категории и страницы заявок')}", styles["base"])],
                [Paragraph(f"<b>{_escape_pdf_text('Техническое задание')}:</b> {_escape_pdf_text(item.get('task', ''))}", styles["base"])],
                [Paragraph(f"<b>{_escape_pdf_text('Шаги внедрения')}:</b>{steps_html or '<br/>—'}", styles["base"])],
                [Paragraph(f"<b>{_escape_pdf_text('Что это даст')}:</b> {_escape_pdf_text(item.get('benefit', ''))}", styles["base"])],
                [Paragraph(f"<b>{_escape_pdf_text('Ожидаемый эффект')}:</b>{impact_html or '<br/>—'}", styles["small"])],
            ],
            colWidths=[180 * mm],
        )
        card.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                    ("BOX", (0, 0), (-1, -1), 1, colors.HexColor(BRAND_LINE)),
                    ("ROUNDEDCORNERS", [14, 14, 14, 14]),
                    ("LEFTPADDING", (0, 0), (-1, -1), 12),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                    ("TOPPADDING", (0, 0), (-1, -1), 10),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
                ]
            )
        )
        story.append(card)
        story.append(Spacer(1, 10))

    failures = comparison.get("failures", [])
    if failures:
        story.append(Paragraph("Не по всем конкурентам удалось собрать рабочую выборку страниц.", styles["muted"]))
        story.extend(_paragraph_list([f"{item.get('url', '')}: {item.get('error', '')}" for item in failures], styles))
        story.append(Spacer(1, 8))


def _append_roadmap(story: list, roadmap: list[list], styles: dict) -> None:
    _section_header(
        story,
        "План работ",
        "План внедрения на 60 дней",
        "Сначала снимаем технические ограничения, потом усиливаем шаблоны и только после этого масштабируем рост.",
        styles,
    )
    cards = []
    for period, tasks in roadmap:
        task_html = "".join(f"<br/>• {_escape_pdf_text(task)}" for task in tasks)
        card = Table(
            [
                [Paragraph(_escape_pdf_text(period), styles["kicker"])],
                [Paragraph(task_html.lstrip("<br/>") or "—", styles["base"])],
            ],
            colWidths=[58 * mm],
        )
        card.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                    ("BOX", (0, 0), (-1, -1), 1, colors.HexColor(BRAND_LINE)),
                    ("ROUNDEDCORNERS", [14, 14, 14, 14]),
                    ("LEFTPADDING", (0, 0), (-1, -1), 12),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                    ("TOPPADDING", (0, 0), (-1, -1), 10),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
                ]
            )
        )
        cards.append(card)
    story.append(Table([cards], colWidths=[60 * mm, 60 * mm, 60 * mm], hAlign="LEFT"))


def _append_appendix(story: list, appendix_pages: list[dict], styles: dict) -> None:
    _section_header(
        story,
        "Приложение",
        "Ключевые URL, которые вошли в разбор",
        "Здесь собраны основные страницы, по которым проще всего понять качество шаблонов, SEO-обвязки и коммерческих блоков сайта.",
        styles,
    )
    rows = [["Путь", "Тип", "Код", "Title", "Desc", "H1", "Schema"]]
    for snapshot in appendix_pages[:18]:
        schema_value = ", ".join(snapshot.get("schema_types", [])[:2]) or "—"
        rows.append(
            [
                _escape_pdf_text(snapshot.get("url", "")),
                _escape_pdf_text(snapshot.get("page_type", "")),
                str(snapshot.get("status_code", "")),
                str(len(str(snapshot.get("title", "")))),
                str(len(str(snapshot.get("description", "")))),
                str(len(snapshot.get("h1s", []))),
                _escape_pdf_text(schema_value),
            ]
        )
    table = Table(rows, repeatRows=1, colWidths=[58 * mm, 25 * mm, 14 * mm, 18 * mm, 18 * mm, 14 * mm, 33 * mm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor(BRAND_DARK)),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), _ensure_pdf_fonts()[1]),
                ("FONTSIZE", (0, 0), (-1, 0), 8),
                ("BACKGROUND", (0, 1), (-1, -1), colors.white),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor(BRAND_SOFT), colors.white]),
                ("GRID", (0, 0), (-1, -1), 0.6, colors.HexColor(BRAND_LINE)),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("FONTSIZE", (0, 1), (-1, -1), 7.8),
                ("LEADING", (0, 1), (-1, -1), 9.2),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(table)


def _append_appendix_v2(story: list, appendix_pages: list[dict], styles: dict) -> None:
    _section_header(
        story,
        "РџСЂРёР»РѕР¶РµРЅРёРµ",
        "РљР»СЋС‡РµРІС‹Рµ URL, РєРѕС‚РѕСЂС‹Рµ РІРѕС€Р»Рё РІ СЂР°Р·Р±РѕСЂ",
        "Р—РґРµСЃСЊ СЃРѕР±СЂР°РЅС‹ РѕСЃРЅРѕРІРЅС‹Рµ СЃС‚СЂР°РЅРёС†С‹, РїРѕ РєРѕС‚РѕСЂС‹Рј РїСЂРѕС‰Рµ РІСЃРµРіРѕ РїРѕРЅСЏС‚СЊ РєР°С‡РµСЃС‚РІРѕ С€Р°Р±Р»РѕРЅРѕРІ, SEO-РѕР±РІСЏР·РєРё Рё РєРѕРјРјРµСЂС‡РµСЃРєРёС… Р±Р»РѕРєРѕРІ СЃР°Р№С‚Р°.",
        styles,
    )
    rows = [["РџСѓС‚СЊ", "РўРёРї", "РљРѕРґ", "Title", "Desc", "H1", "Schema"]]
    for snapshot in appendix_pages[:18]:
        schema_value = ", ".join(snapshot.get("schema_types", [])[:2]) or "вЂ”"
        rows.append(
            [
                Paragraph(_escape_pdf_text(_compact_url_label(snapshot.get("url", ""))), styles["small"]),
                Paragraph(_escape_pdf_text(snapshot.get("page_type", "")), styles["small"]),
                str(snapshot.get("status_code", "")),
                str(len(str(snapshot.get("title", "")))),
                str(len(str(snapshot.get("description", "")))),
                str(len(snapshot.get("h1s", []))),
                Paragraph(_escape_pdf_text(schema_value), styles["small"]),
            ]
        )
    table = Table(rows, repeatRows=1, colWidths=[72 * mm, 24 * mm, 12 * mm, 14 * mm, 14 * mm, 10 * mm, 24 * mm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor(BRAND_DARK)),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), _ensure_pdf_fonts()[1]),
                ("FONTSIZE", (0, 0), (-1, 0), 8),
                ("BACKGROUND", (0, 1), (-1, -1), colors.white),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor(BRAND_SOFT), colors.white]),
                ("GRID", (0, 0), (-1, -1), 0.6, colors.HexColor(BRAND_LINE)),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("WORDWRAP", (0, 1), (0, -1), "CJK"),
                ("WORDWRAP", (6, 1), (6, -1), "CJK"),
                ("FONTSIZE", (0, 1), (-1, -1), 7.8),
                ("LEADING", (0, 1), (-1, -1), 9.2),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(table)


def _append_appendix_v3(story: list, appendix_pages: list[dict], styles: dict) -> None:
    _section_header(
        story,
        "Приложение",
        "Ключевые URL, которые вошли в разбор",
        "Здесь собраны основные страницы, по которым проще всего понять качество шаблонов, SEO-оформления и коммерческих блоков сайта.",
        styles,
    )
    rows = [["Путь", "Тип", "Код", "Title", "Desc", "H1", "Schema"]]
    for snapshot in appendix_pages[:18]:
        schema_value = ", ".join(snapshot.get("schema_types", [])[:2]) or "—"
        rows.append(
            [
                Paragraph(_escape_pdf_text(_compact_url_label(snapshot.get("url", ""))), styles["small"]),
                Paragraph(_escape_pdf_text(snapshot.get("page_type", "")), styles["small"]),
                str(snapshot.get("status_code", "")),
                str(len(str(snapshot.get("title", "")))),
                str(len(str(snapshot.get("description", "")))),
                str(len(snapshot.get("h1s", []))),
                Paragraph(_escape_pdf_text(schema_value), styles["small"]),
            ]
        )
    table = Table(rows, repeatRows=1, colWidths=[72 * mm, 24 * mm, 12 * mm, 14 * mm, 14 * mm, 10 * mm, 24 * mm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor(BRAND_DARK)),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), _ensure_pdf_fonts()[1]),
                ("FONTSIZE", (0, 0), (-1, 0), 8),
                ("BACKGROUND", (0, 1), (-1, -1), colors.white),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor(BRAND_SOFT), colors.white]),
                ("GRID", (0, 0), (-1, -1), 0.6, colors.HexColor(BRAND_LINE)),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("WORDWRAP", (0, 1), (0, -1), "CJK"),
                ("WORDWRAP", (6, 1), (6, -1), "CJK"),
                ("FONTSIZE", (0, 1), (-1, -1), 7.8),
                ("LEADING", (0, 1), (-1, -1), 9.2),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(table)


def _draw_pdf_chrome(domain: str, brand_name: str, regular_font: str, bold_font: str):
    def _callback(canvas, doc):
        canvas.saveState()
        page_width, page_height = A4
        canvas.setFillColor(colors.HexColor(BRAND_ORANGE))
        canvas.rect(0, 0, 5 * mm, page_height, fill=1, stroke=0)
        canvas.setStrokeColor(colors.HexColor(BRAND_LINE))
        canvas.setLineWidth(0.8)
        canvas.line(doc.leftMargin, page_height - 14 * mm, page_width - doc.rightMargin, page_height - 14 * mm)
        canvas.setFont(bold_font, 9)
        canvas.setFillColor(colors.HexColor(BRAND_DARK))
        canvas.drawString(doc.leftMargin, page_height - 10.5 * mm, brand_name)
        canvas.setFont(regular_font, 8.6)
        canvas.setFillColor(colors.HexColor(BRAND_MUTED))
        canvas.drawString(doc.leftMargin, 9 * mm, f"{domain} | Audit by {brand_name}")
        canvas.drawRightString(page_width - doc.rightMargin, 9 * mm, f"Стр. {canvas.getPageNumber()}")
        canvas.restoreState()

    return _callback


def write_preview_pdf(audit_payload: dict, pdf_path: Path) -> bool:
    if not all(
        [
            colors,
            A4,
            ParagraphStyle,
            getSampleStyleSheet,
            mm,
            Paragraph,
            SimpleDocTemplate,
            Spacer,
            Table,
            TableStyle,
        ]
    ):
        return False

    try:
        audit_payload = normalize_structure(audit_payload)
        regular_font, bold_font = _ensure_pdf_fonts()
        styles = _build_pdf_styles()
        pdf_path.parent.mkdir(parents=True, exist_ok=True)

        doc = SimpleDocTemplate(
            str(pdf_path),
            pagesize=A4,
            leftMargin=14 * mm,
            rightMargin=14 * mm,
            topMargin=18 * mm,
            bottomMargin=16 * mm,
        )
        story: list = []

        cover_left = [
            Paragraph("SHELPAKOV DIGITAL", styles["coverTag"]),
            Paragraph(f"SEO-аудит<br/>{_escape_pdf_text(audit_payload.get('domain', ''))}", styles["coverTitle"]),
        ]
        cover_right = [
            Paragraph("Паспорт проекта", styles["passportKicker"]),
            Paragraph(
                _escape_pdf_text(
                    audit_payload.get("company_name")
                    or audit_payload.get("company")
                    or audit_payload.get("domain", "")
                ),
                styles["passportTitle"],
            ),
            Paragraph(
                f"Дата: {_escape_pdf_text(audit_payload.get('generated_at', ''))}<br/>"
                f"Домен: https://{_escape_pdf_text(audit_payload.get('domain', ''))}",
                styles["small"],
            ),
            Paragraph(_escape_pdf_text(audit_payload.get("score", 0)), styles["passportScore"]),
            Paragraph("Индекс SEO-готовности из 100", styles["muted"]),
        ]
        cover = Table([[cover_left, cover_right]], colWidths=[118 * mm, 62 * mm])
        cover.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (0, 0), colors.HexColor(BRAND_DARK)),
                    ("BACKGROUND", (1, 0), (1, 0), colors.HexColor(BRAND_ACCENT_SOFT)),
                    ("BOX", (0, 0), (-1, -1), 0.8, colors.HexColor(BRAND_LINE)),
                    ("ROUNDEDCORNERS", [18, 18, 18, 18]),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 16),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 16),
                    ("TOPPADDING", (0, 0), (-1, -1), 18),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 18),
                ]
            )
        )
        story.append(cover)
        story.append(Spacer(1, 14))

        metrics = [
            ("URL в sitemap", audit_payload.get("sitemap_url_count", 0)),
            ("Записей в sitemap", audit_payload.get("sitemap_total_entries", 0)),
            ("Средний ответ", f"{audit_payload.get('average_response_ms', 0)} ms"),
            ("Средний HTML", f"{audit_payload.get('average_html_kb', 0)} KB"),
        ]
        metric_cards = [_metric_card(label, value, styles) for label, value in metrics]
        story.append(Table([metric_cards[:2], metric_cards[2:]], colWidths=[86 * mm, 86 * mm]))
        story.append(PageBreak())

        _section_header(
            story,
            "Краткий вывод",
            "Факторы, которые не дают сайту конкурировать",
            "Ниже коротко: какие шаблоны и сигналы мешают сайту конкурировать в выдаче и на чём стоит сосредоточиться в первую очередь.",
            styles,
        )
        story.extend(_paragraph_list(audit_payload.get("executive_summary", []), styles))
        story.append(Spacer(1, 10))

        _section_header(
            story,
            "Вектор роста",
            "Что переработать после базовых исправлений",
            "Ниже направления, которые усиливают структуру, коммерческий интент и качество контента после базовых исправлений.",
            styles,
        )
        story.extend(_paragraph_list(audit_payload.get("growth_points", []), styles))
        story.append(Spacer(1, 14))

        _section_header(
            story,
            "Приоритеты",
            "Какие задачи делать в первую очередь",
            "Сначала закрываем критичные и массовые проблемы, которые сильнее всего бьют по индексации, сниппетам и ключевым страницам сайта.",
            styles,
        )
        for row in audit_payload.get("priority_matrix", [])[:12]:
            story.append(
                Table(
                    [
                        [Paragraph(_escape_pdf_text(row.get("problem", "")), styles["cardTitle"])],
                        [
                            Paragraph(
                                _escape_pdf_text(
                                    f"Влияние: {row.get('impact', '')} | Риск: {row.get('risk', '')} | Польза: {row.get('business', '')} | Итог: {row.get('total', '')}"
                                ),
                                styles["small"],
                            )
                        ],
                        [Paragraph(f"<b>Приоритет:</b> {_escape_pdf_text(_severity_label(str(row.get('severity', ''))))} &nbsp;&nbsp; <b>Ответственный:</b> {_escape_pdf_text(row.get('owner', ''))}", styles["base"])],
                    ],
                    colWidths=[180 * mm],
                    style=TableStyle(
                        [
                            ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                            ("BOX", (0, 0), (-1, -1), 1, colors.HexColor(BRAND_LINE)),
                            ("ROUNDEDCORNERS", [14, 14, 14, 14]),
                            ("LEFTPADDING", (0, 0), (-1, -1), 12),
                            ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                            ("TOPPADDING", (0, 0), (-1, -1), 10),
                            ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
                        ]
                    ),
                )
            )
            story.append(Spacer(1, 10))

        _section_header(
            story,
            "Критические ошибки",
            "Что сейчас реально блокирует рост",
            "Здесь только те проблемы, которые заметно влияют на индекс, сниппеты, трафик и заявки.",
            styles,
        )
        _append_issue_cards(story, audit_payload.get("critical_errors") or audit_payload.get("issues", []), styles)
        _append_phase_sections_v3(story, audit_payload.get("phase_sections", []), styles)
        competitor_comparison = audit_payload.get("competitor_comparison") or {}
        if competitor_comparison and (
            competitor_comparison.get("competitors")
            or competitor_comparison.get("gap_items")
            or competitor_comparison.get("failures")
        ):
            _append_competitor_comparison_v4(story, competitor_comparison, styles)
        _append_action_cards(
            story,
            audit_payload.get("quick_wins", []),
            "Быстрые исправления",
            "Что можно исправить в ближайшее время",
            "Это задачи, которые можно внедрить быстро и без большой переделки сайта.",
            styles,
        )
        _append_action_cards(
            story,
            audit_payload.get("strategic_moves", []),
            "Стратегические улучшения",
            "Что даст рост после базовых исправлений",
            "Это более крупные изменения, которые усиливают сайт в поиске и помогают получать больше заявок.",
            styles,
        )
        _append_roadmap(story, audit_payload.get("roadmap", []), styles)

        doc.build(
            story,
            onFirstPage=_draw_pdf_chrome(str(audit_payload.get("domain", "")), "Shelpakov Digital", regular_font, bold_font),
            onLaterPages=_draw_pdf_chrome(str(audit_payload.get("domain", "")), "Shelpakov Digital", regular_font, bold_font),
        )
        return True
    except Exception:
        return False


def _issue_card(issue: dict) -> str:
    severity_raw = str(issue.get("severity", ""))
    severity = _escape_html_text(_severity_label(severity_raw))
    title = _escape_html_text(issue.get("title", ""))
    why = _escape_html_text(issue.get("why_it_matters", ""))
    recommendation = _escape_html_text(issue.get("recommendation", ""))
    evidence_items = "".join(f"<li>{_escape_html_text(item)}</li>" for item in issue.get("evidence", []))
    return f"""
    <article class="issue-card issue-{severity_raw.lower()}">
      <div class="issue-head"><span>{severity}</span><strong>{title}</strong></div>
      <div class="issue-body">
        <p>{why}</p>
        {'<ul>' + evidence_items + '</ul>' if evidence_items else '<p class="empty-note">Примеры страниц в выборке не найдены.</p>'}
        <p class="recommendation"><strong>Что делать:</strong> {recommendation}</p>
      </div>
    </article>
    """


def _priority_table(rows: list[dict]) -> str:
    if not rows:
        return "<p class='empty-note'>Матрица приоритетов будет доступна после генерации аудита.</p>"
    body = []
    for row in rows:
        body.append(
            "<tr>"
            f"<td>{_escape_html_text(row.get('problem', ''))}</td>"
            f"<td>{_escape_html_text(row.get('impact', ''))}</td>"
            f"<td>{_escape_html_text(row.get('risk', ''))}</td>"
            f"<td>{_escape_html_text(row.get('business', ''))}</td>"
            f"<td>{_escape_html_text(row.get('total', ''))}</td>"
            f"<td>{_escape_html_text(_severity_label(str(row.get('severity', ''))))}</td>"
            f"<td>{_escape_html_text(row.get('owner', ''))}</td>"
            "</tr>"
        )
    return (
        "<div class='table-wrap'><table class='priority-table'>"
        "<thead><tr><th>Проблема</th><th>Влияние</th><th>Риск</th><th>Польза</th><th>Итог</th><th>Приоритет</th><th>Ответственный</th></tr></thead>"
        f"<tbody>{''.join(body)}</tbody></table></div>"
    )


def _phase_checks_html(phase_sections: list[dict]) -> str:
    blocks = []
    for section in phase_sections:
        checks_html = []
        for check in section.get("checks", []):
            metrics = "".join(
                f"<li><strong>{_escape_html_text(label)}:</strong> {_escape_html_text(value)}</li>"
                for label, value in check.get("metrics", [])
            )
            findings = "".join(f"<li>{_escape_html_text(item)}</li>" for item in check.get("findings", []))
            checks_html.append(
                f"""
                <article class="phase-check">
                  <h3>{_escape_html_text(check.get('name', ''))}</h3>
                  <p><strong>Что проверялось:</strong> {_escape_html_text(check.get('checked', ''))}</p>
                  <p><strong>Как проверялось:</strong> {_escape_html_text(check.get('method', ''))}</p>
                  <div class="phase-grid">
                    <div class="phase-box">
                      <div class="phase-box-title">Ключевые метрики</div>
                      {'<ul>' + metrics + '</ul>' if metrics else '<p class="empty-note">Нет данных по метрикам.</p>'}
                    </div>
                    <div class="phase-box">
                      <div class="phase-box-title">Что нашли</div>
                      {'<ul>' + findings + '</ul>' if findings else '<p class="empty-note">Явных проблем в выборке не найдено.</p>'}
                    </div>
                  </div>
                  <p class="phase-meta"><strong>Приоритет:</strong> {_escape_html_text(_severity_label(str(check.get('priority', ''))))} <span>•</span> <strong>Ответственный:</strong> {_escape_html_text(check.get('owner', ''))}</p>
                  <p class="recommendation"><strong>Что делать:</strong> {_escape_html_text(check.get('recommendation', ''))}</p>
                </article>
                """
            )
        if not checks_html:
            checks_html.append("<p class='empty-note'>По этому этапу в выборке не нашлось данных для подробного блока.</p>")
        blocks.append(
            f"""
            <section class="phase-section">
              <div class="section-kicker">Подробный разбор</div>
              <h2>{_escape_html_text(section.get('title', ''))}</h2>
              <p class="lead">{_escape_html_text(section.get('intro', ''))}</p>
              <div class="phase-checks">{''.join(checks_html)}</div>
            </section>
            """
        )
    return "".join(blocks)


def _roadmap_columns(roadmap: list[list]) -> str:
    chunks = []
    for period, tasks in roadmap:
        items = "".join(f"<li>{_escape_html_text(task)}</li>" for task in tasks)
        chunks.append(
            f"""
            <div class="roadmap-card">
              <div class="roadmap-period">{_escape_html_text(period)}</div>
              <ul>{items}</ul>
            </div>
            """
        )
    return "".join(chunks)


def _action_cards(items: list[dict], value_key: str, extra_key: str) -> str:
    if not items:
        return "<p class='empty-note'>Для этого блока пока нет задач в выборке.</p>"
    cards = []
    for item in items:
        cards.append(
            f"""
            <article class="action-card">
              <h3>{_escape_html_text(item.get('title', ''))}</h3>
              <p class="action-meta"><strong>{_escape_html_text(_action_meta_label(value_key))}:</strong> {_escape_html_text(item.get(value_key, ''))}</p>
              <p class="action-meta"><strong>{_escape_html_text(_action_meta_label(extra_key))}:</strong> {_escape_html_text(item.get(extra_key, ''))}</p>
              <p>{_escape_html_text(item.get('action') or item.get('details') or 'Подробности появятся после следующего прогона аудита.')}</p>
            </article>
            """
        )
    return "".join(cards)


def _competitor_comparison_html(comparison: dict) -> str:
    competitors = comparison.get("competitors", [])
    gap_items = comparison.get("gap_items", [])
    failures = comparison.get("failures", [])
    summary = comparison.get("summary", [])

    if not competitors and not gap_items and not failures:
        return ""

    summary_html = "".join(f"<li>{_escape_html_text(item)}</li>" for item in summary)
    competitor_cards = []

    for competitor in competitors:
        highlights_html = "".join(f"<li>{_escape_html_text(item)}</li>" for item in competitor.get("highlights", []))
        factor_html = "".join(f"<li>{_escape_html_text(item)}</li>" for item in competitor.get("factor_summary", []))
        template_rows_html = "".join(f"<li>{_escape_html_text(item)}</li>" for item in competitor.get("template_rows", []))
        template_html = "".join(f"<li>{_escape_html_text(item)}</li>" for item in competitor.get("template_findings", []))
        snippet_html = "".join(f"<li>{_escape_html_text(item)}</li>" for item in competitor.get("snippet_findings", []))
        commercial_html = "".join(f"<li>{_escape_html_text(item)}</li>" for item in competitor.get("commercial_findings", []))
        sample_paths = ", ".join(competitor.get("sample_paths", [])[:3])
        sections_html: list[str] = []
        if highlights_html:
            sections_html.append(f"<h4>Коротко</h4><ul>{highlights_html}</ul>")
        if factor_html:
            sections_html.append(f"<h4>Ключевые факторы</h4><ul>{factor_html}</ul>")
        if template_rows_html:
            sections_html.append(f"<h4>Ключевые различия по шаблонам</h4><ul>{template_rows_html}</ul>")
        if template_html:
            sections_html.append(f"<h4>По шаблонам</h4><ul>{template_html}</ul>")
        if snippet_html:
            sections_html.append(f"<h4>По сниппетам</h4><ul>{snippet_html}</ul>")
        if commercial_html:
            sections_html.append(f"<h4>По FAQ, доверию и коммерческому слою</h4><ul>{commercial_html}</ul>")
        sample_paths_html = (
            f'<p class="action-meta"><strong>Где это видно:</strong> {_escape_html_text(sample_paths)}</p>'
            if sample_paths
            else ""
        )
        competitor_cards.append(
            f"""
            <article class="competitor-card">
              <h3>{_escape_html_text(competitor.get('domain', ''))}</h3>
              <p class="action-meta"><strong>Проверено страниц:</strong> {_escape_html_text(competitor.get('pages_checked', 0))}</p>
              {''.join(sections_html)}
              {sample_paths_html}
            </article>
            """
        )

    gap_cards = []
    for item in gap_items:
        examples_html = "".join(f"<li>{_escape_html_text(example)}</li>" for example in item.get("examples", []))
        gap_cards.append(
            f"""
            <article class="action-card competitor-gap-card">
              <h3>{_escape_html_text(item.get('title', ''))}</h3>
              <p class="action-meta"><strong>Приоритет:</strong> {_escape_html_text(item.get('priority', ''))}</p>
              <p class="action-meta"><strong>Ответственный:</strong> {_escape_html_text(item.get('owner', ''))}</p>
              <p><strong>Что сейчас:</strong> {_escape_html_text(item.get('current_state', ''))}</p>
              <p><strong>Что видно у конкурентов:</strong> {_escape_html_text(item.get('competitor_state', ''))}</p>
              {'<ul>' + examples_html + '</ul>' if examples_html else ''}
              <p class="recommendation"><strong>Короткое ТЗ:</strong> {_escape_html_text(item.get('task', ''))}</p>
              <p><strong>Что это даст:</strong> {_escape_html_text(item.get('benefit', ''))}</p>
            </article>
            """
        )

    failure_html = ""
    if failures:
        failure_items = "".join(
            f"<li>{_escape_html_text(item.get('url', ''))}: {_escape_html_text(item.get('error', ''))}</li>"
            for item in failures
        )
        failure_html = f"<div class='list-card'><div class='section-kicker' style='margin-bottom:8px;'>Не удалось проверить</div><ul>{failure_items}</ul></div>"

    return f"""
    <section class="competitor-section">
      <div class="section-kicker">Сравнение с конкурентами</div>
      <h2>Чего не хватает на фоне сильных конкурентов</h2>
      <p class="lead">Сравнили ключевые шаблоны с конкурентами и оставили только те разрывы, которые можно превратить в понятное ТЗ на внедрение.</p>
      <div class="list-card"><ul class="insight-list">{summary_html}</ul></div>
      <div class="competitor-grid">{''.join(competitor_cards)}</div>
      <div class="action-grid competitor-gap-grid">{''.join(gap_cards) if gap_cards else "<p class='empty-note'>Сильных разрывов по конкурентам в этой выборке не нашли.</p>"}</div>
      {failure_html}
    </section>
    """


def _competitor_comparison_html_v2(comparison: dict) -> str:
    competitors = comparison.get("competitors", [])
    gap_items = comparison.get("gap_items", [])
    failures = comparison.get("failures", [])
    summary = comparison.get("summary", [])

    if not competitors and not gap_items and not failures:
        return ""

    summary_html = "".join(f"<li>{_escape_html_text(item)}</li>" for item in summary)
    competitor_cards = []
    for competitor in competitors:
        highlights_html = "".join(f"<li>{_escape_html_text(item)}</li>" for item in competitor.get("highlights", []))
        template_html = "".join(f"<li>{_escape_html_text(item)}</li>" for item in competitor.get("template_findings", []))
        snippet_html = "".join(f"<li>{_escape_html_text(item)}</li>" for item in competitor.get("snippet_findings", []))
        commercial_html = "".join(f"<li>{_escape_html_text(item)}</li>" for item in competitor.get("commercial_findings", []))
        sample_paths = ", ".join(competitor.get("sample_paths", [])[:3])
        competitor_cards.append(
            f"""
            <article class="competitor-card">
              <h3>{_escape_html_text(competitor.get('domain', ''))}</h3>
              <p class="action-meta"><strong>Проверено страниц:</strong> {_escape_html_text(competitor.get('pages_checked', 0))}</p>
              <h4>Коротко</h4>
              {'<ul>' + highlights_html + '</ul>' if highlights_html else '<p class="action-meta">—</p>'}
              <h4>По шаблонам</h4>
              {'<ul>' + template_html + '</ul>' if template_html else '<p class="action-meta">—</p>'}
              <h4>По сниппетам</h4>
              {'<ul>' + snippet_html + '</ul>' if snippet_html else '<p class="action-meta">—</p>'}
              <h4>По FAQ, доверию и коммерческому слою</h4>
              {'<ul>' + commercial_html + '</ul>' if commercial_html else '<p class="action-meta">—</p>'}
              <p class="action-meta"><strong>Где это видно:</strong> {_escape_html_text(sample_paths or '—')}</p>
            </article>
            """
        )

    gap_cards = []
    for item in gap_items:
        examples_html = "".join(f"<li>{_escape_html_text(example)}</li>" for example in item.get("examples", []))
        gap_cards.append(
            f"""
            <article class="action-card competitor-gap-card">
              <h3>{_escape_html_text(item.get('title', ''))}</h3>
              <p class="action-meta"><strong>Приоритет:</strong> {_escape_html_text(item.get('priority', ''))}</p>
              <p class="action-meta"><strong>Ответственный:</strong> {_escape_html_text(item.get('owner', ''))}</p>
              <p><strong>Что сейчас:</strong> {_escape_html_text(item.get('current_state', ''))}</p>
              <p><strong>Что видно у конкурентов:</strong> {_escape_html_text(item.get('competitor_state', ''))}</p>
              {'<ul>' + examples_html + '</ul>' if examples_html else ''}
              <p class="recommendation"><strong>Короткое ТЗ:</strong> {_escape_html_text(item.get('task', ''))}</p>
              <p><strong>Что это даст:</strong> {_escape_html_text(item.get('benefit', ''))}</p>
            </article>
            """
        )

    failure_html = ""
    if failures:
        failure_items = "".join(
            f"<li>{_escape_html_text(item.get('url', ''))}: {_escape_html_text(item.get('error', ''))}</li>"
            for item in failures
        )
        failure_html = f"<div class='list-card'><div class='section-kicker' style='margin-bottom:8px;'>Не удалось проверить</div><ul>{failure_items}</ul></div>"

    return f"""
    <section class="competitor-section">
      <div class="section-kicker">Сравнение с конкурентами</div>
      <h2>Чего не хватает на фоне сильных конкурентов</h2>
      <p class="lead">Сравнение показывает, какие шаблоны, блоки и коммерческие сигналы конкуренты используют лучше и что стоит внедрить в первую очередь.</p>
      <div class="list-card"><ul class="insight-list">{summary_html}</ul></div>
      <div class="competitor-grid">{''.join(competitor_cards)}</div>
      <div class="action-grid competitor-gap-grid">{''.join(gap_cards) if gap_cards else "<p class='empty-note'>Сильных разрывов по конкурентам в этой выборке не нашли.</p>"}</div>
      {failure_html}
    </section>
    """


def _competitor_comparison_html_v3(comparison: dict) -> str:
    competitors = comparison.get("competitors", [])
    gap_items = comparison.get("gap_items", [])
    failures = comparison.get("failures", [])
    summary = comparison.get("summary", [])

    if not competitors and not gap_items and not failures:
        return ""

    summary_html = "".join(f"<li>{_escape_html_text(item)}</li>" for item in summary)
    competitor_cards = []
    for competitor in competitors:
        highlights_html = "".join(f"<li>{_escape_html_text(item)}</li>" for item in competitor.get("highlights", []))
        factor_html = "".join(f"<li>{_escape_html_text(item)}</li>" for item in competitor.get("factor_summary", []))
        template_rows_html = "".join(f"<li>{_escape_html_text(item)}</li>" for item in competitor.get("template_rows", []))
        template_html = "".join(f"<li>{_escape_html_text(item)}</li>" for item in competitor.get("template_findings", []))
        snippet_html = "".join(f"<li>{_escape_html_text(item)}</li>" for item in competitor.get("snippet_findings", []))
        commercial_html = "".join(f"<li>{_escape_html_text(item)}</li>" for item in competitor.get("commercial_findings", []))
        sample_paths = ", ".join(competitor.get("sample_paths", [])[:3])
        competitor_cards.append(
            f"""
            <article class="competitor-card">
              <h3>{_escape_html_text(competitor.get('domain', ''))}</h3>
              <p class="action-meta"><strong>РџСЂРѕРІРµСЂРµРЅРѕ СЃС‚СЂР°РЅРёС†:</strong> {_escape_html_text(competitor.get('pages_checked', 0))}</p>
              <h4>РљРѕСЂРѕС‚РєРѕ</h4>
              {'<ul>' + highlights_html + '</ul>' if highlights_html else '<p class="action-meta">вЂ”</p>'}
              <h4>РљР»СЋС‡РµРІС‹Рµ С„Р°РєС‚РѕСЂС‹</h4>
              {'<ul>' + factor_html + '</ul>' if factor_html else '<p class="action-meta">вЂ”</p>'}
              <h4>РџРѕ С€Р°Р±Р»РѕРЅР°Рј РєРѕСЂРѕС‡Рµ</h4>
              {'<ul>' + template_rows_html + '</ul>' if template_rows_html else '<p class="action-meta">вЂ”</p>'}
              <h4>РџРѕ С€Р°Р±Р»РѕРЅР°Рј</h4>
              {'<ul>' + template_html + '</ul>' if template_html else '<p class="action-meta">вЂ”</p>'}
              <h4>РџРѕ СЃРЅРёРїРїРµС‚Р°Рј</h4>
              {'<ul>' + snippet_html + '</ul>' if snippet_html else '<p class="action-meta">вЂ”</p>'}
              <h4>РџРѕ FAQ, РґРѕРІРµСЂРёСЋ Рё РєРѕРјРјРµСЂС‡РµСЃРєРѕРјСѓ СЃР»РѕСЋ</h4>
              {'<ul>' + commercial_html + '</ul>' if commercial_html else '<p class="action-meta">вЂ”</p>'}
              <p class="action-meta"><strong>Р“РґРµ СЌС‚Рѕ РІРёРґРЅРѕ:</strong> {_escape_html_text(sample_paths or 'вЂ”')}</p>
            </article>
            """
        )

    gap_cards = []
    for item in gap_items:
        examples_html = "".join(f"<li>{_escape_html_text(example)}</li>" for example in item.get("examples", []))
        steps_html = "".join(f"<li>{_escape_html_text(step)}</li>" for step in item.get("implementation_steps", []))
        impact_html = "".join(f"<li>{_escape_html_text(point)}</li>" for point in item.get("impact_points", []))
        scope = ", ".join(item.get("where_to_implement", []) or [])
        gap_cards.append(
            f"""
            <article class="action-card competitor-gap-card">
              <h3>{_escape_html_text(item.get('title', ''))}</h3>
              <p class="action-meta"><strong>РџСЂРёРѕСЂРёС‚РµС‚:</strong> {_escape_html_text(item.get('priority', ''))}</p>
              <p class="action-meta"><strong>РћС‚РІРµС‚СЃС‚РІРµРЅРЅС‹Р№:</strong> {_escape_html_text(item.get('owner', ''))}</p>
              <p><strong>Р§С‚Рѕ СЃРµР№С‡Р°СЃ:</strong> {_escape_html_text(item.get('current_state', ''))}</p>
              <p><strong>Р§С‚Рѕ РІРёРґРЅРѕ Сѓ РєРѕРЅРєСѓСЂРµРЅС‚РѕРІ:</strong> {_escape_html_text(item.get('competitor_state', ''))}</p>
              {'<ul>' + examples_html + '</ul>' if examples_html else ''}
              <p><strong>Р“РґРµ РІРЅРµРґСЂСЏС‚СЊ:</strong> {_escape_html_text(scope or 'РіР»Р°РІРЅР°СЏ, СѓСЃР»СѓРіРё, РєР°С‚РµРіРѕСЂРёРё Рё СЃС‚СЂР°РЅРёС†С‹ Р·Р°СЏРІРѕРє')}</p>
              <p class="recommendation"><strong>Р Р°СЃС€РёСЂРµРЅРЅРѕРµ РўР—:</strong> {_escape_html_text(item.get('task', ''))}</p>
              {'<div><strong>РЁР°РіРё РІРЅРµРґСЂРµРЅРёСЏ:</strong><ul>' + steps_html + '</ul></div>' if steps_html else ''}
              <p><strong>Р§С‚Рѕ СЌС‚Рѕ РґР°СЃС‚:</strong> {_escape_html_text(item.get('benefit', ''))}</p>
              {'<div><strong>РћР¶РёРґР°РµРјС‹Р№ СЌС„С„РµРєС‚:</strong><ul>' + impact_html + '</ul></div>' if impact_html else ''}
            </article>
            """
        )

    failure_html = ""
    if failures:
        failure_items = "".join(
            f"<li>{_escape_html_text(item.get('url', ''))}: {_escape_html_text(item.get('error', ''))}</li>"
            for item in failures
        )
        failure_html = f"<div class='list-card'><div class='section-kicker' style='margin-bottom:8px;'>РќРµ СѓРґР°Р»РѕСЃСЊ РїСЂРѕРІРµСЂРёС‚СЊ</div><ul>{failure_items}</ul></div>"

    return f"""
    <section class="competitor-section">
      <div class="section-kicker">РЎСЂР°РІРЅРµРЅРёРµ СЃ РєРѕРЅРєСѓСЂРµРЅС‚Р°РјРё</div>
      <h2>Р§РµРіРѕ РЅРµ С…РІР°С‚Р°РµС‚ РЅР° С„РѕРЅРµ СЃРёР»СЊРЅС‹С… РєРѕРЅРєСѓСЂРµРЅС‚РѕРІ</h2>
      <p class="lead">РЎСЂР°РІРЅРёР»Рё С€Р°Р±Р»РѕРЅС‹ СЃС‚СЂР°РЅРёС†, СЃРЅРёРїРїРµС‚С‹, FAQ, РґРѕРІРµСЂРёРµ Рё РєРѕРјРјРµСЂС‡РµСЃРєРёР№ СЃР»РѕР№. РќРёР¶Рµ С‚РѕР»СЊРєРѕ С‚Рµ СЂР°Р·СЂС‹РІС‹, РєРѕС‚РѕСЂС‹Рµ РјРѕР¶РЅРѕ РїСЂРµРІСЂР°С‚РёС‚СЊ РІ РїРѕРЅСЏС‚РЅРѕРµ РўР— РЅР° РІРЅРµРґСЂРµРЅРёРµ.</p>
      <div class="list-card"><ul class="insight-list">{summary_html}</ul></div>
      <div class="competitor-grid">{''.join(competitor_cards)}</div>
      <div class="action-grid competitor-gap-grid">{''.join(gap_cards) if gap_cards else "<p class='empty-note'>РЎРёР»СЊРЅС‹С… СЂР°Р·СЂС‹РІРѕРІ РїРѕ РєРѕРЅРєСѓСЂРµРЅС‚Р°Рј РІ СЌС‚РѕР№ РІС‹Р±РѕСЂРєРµ РЅРµ РЅР°С€Р»Рё.</p>"}</div>
      {failure_html}
    </section>
    """


def _competitor_comparison_html_v4(comparison: dict) -> str:
    competitors = comparison.get("competitors", [])
    gap_items = comparison.get("gap_items", [])
    failures = comparison.get("failures", [])
    summary = comparison.get("summary", [])

    if not competitors and not gap_items and not failures:
        return ""

    summary_html = "".join(f"<li>{_escape_html_text(item)}</li>" for item in summary)
    competitor_cards = []
    for competitor in competitors:
        highlights_html = "".join(f"<li>{_escape_html_text(item)}</li>" for item in competitor.get("highlights", []))
        factor_html = "".join(f"<li>{_escape_html_text(item)}</li>" for item in competitor.get("factor_summary", []))
        template_rows_html = "".join(f"<li>{_escape_html_text(item)}</li>" for item in competitor.get("template_rows", []))
        template_html = "".join(f"<li>{_escape_html_text(item)}</li>" for item in competitor.get("template_findings", []))
        snippet_html = "".join(f"<li>{_escape_html_text(item)}</li>" for item in competitor.get("snippet_findings", []))
        commercial_html = "".join(f"<li>{_escape_html_text(item)}</li>" for item in competitor.get("commercial_findings", []))
        sample_paths = ", ".join(competitor.get("sample_paths", [])[:3])
        sections_html: list[str] = []
        if highlights_html:
            sections_html.append(f"<h4>Коротко</h4><ul>{highlights_html}</ul>")
        if factor_html:
            sections_html.append(f"<h4>Ключевые факторы</h4><ul>{factor_html}</ul>")
        if template_rows_html:
            sections_html.append(f"<h4>Ключевые различия по шаблонам</h4><ul>{template_rows_html}</ul>")
        if template_html:
            sections_html.append(f"<h4>По шаблонам</h4><ul>{template_html}</ul>")
        if snippet_html:
            sections_html.append(f"<h4>По сниппетам</h4><ul>{snippet_html}</ul>")
        if commercial_html:
            sections_html.append(f"<h4>По FAQ, доверию и коммерческому слою</h4><ul>{commercial_html}</ul>")
        sample_paths_html = (
            f'<p class="action-meta"><strong>Где это видно:</strong> {_escape_html_text(sample_paths)}</p>'
            if sample_paths
            else ""
        )
        competitor_cards.append(
            f"""
            <article class="competitor-card">
              <h3>{_escape_html_text(competitor.get('domain', ''))}</h3>
              <p class="action-meta"><strong>Проверено страниц:</strong> {_escape_html_text(competitor.get('pages_checked', 0))}</p>
              {''.join(sections_html)}
              {sample_paths_html}
            </article>
            """
        )

    gap_cards = []
    for item in gap_items:
        examples_html = "".join(f"<li>{_escape_html_text(example)}</li>" for example in item.get("examples", []))
        steps_html = "".join(f"<li>{_escape_html_text(step)}</li>" for step in item.get("implementation_steps", []))
        impact_html = "".join(f"<li>{_escape_html_text(point)}</li>" for point in item.get("impact_points", []))
        scope = ", ".join(item.get("where_to_implement", []) or [])
        gap_cards.append(
            f"""
            <article class="action-card competitor-gap-card">
              <h3>{_escape_html_text(item.get('title', ''))}</h3>
              <p class="action-meta"><strong>Приоритет:</strong> {_escape_html_text(item.get('priority', ''))}</p>
              <p class="action-meta"><strong>Ответственный:</strong> {_escape_html_text(item.get('owner', ''))}</p>
              <p><strong>Что сейчас:</strong> {_escape_html_text(item.get('current_state', ''))}</p>
              <p><strong>Что видно у конкурентов:</strong> {_escape_html_text(item.get('competitor_state', ''))}</p>
              {'<ul>' + examples_html + '</ul>' if examples_html else ''}
              <p><strong>Где внедрять:</strong> {_escape_html_text(scope or 'главная, услуги, категории и страницы заявок')}</p>
              <p class="recommendation"><strong>Техническое задание:</strong> {_escape_html_text(item.get('task', ''))}</p>
              {'<div><strong>Шаги внедрения:</strong><ul>' + steps_html + '</ul></div>' if steps_html else ''}
              <p><strong>Что это даст:</strong> {_escape_html_text(item.get('benefit', ''))}</p>
              {'<div><strong>Ожидаемый эффект:</strong><ul>' + impact_html + '</ul></div>' if impact_html else ''}
            </article>
            """
        )

    failure_html = ""
    if failures:
        failure_items = "".join(
            f"<li>{_escape_html_text(item.get('url', ''))}: {_escape_html_text(item.get('error', ''))}</li>"
            for item in failures
        )
        failure_html = f"<div class='list-card'><div class='section-kicker' style='margin-bottom:8px;'>Не удалось проверить</div><ul>{failure_items}</ul></div>"

    return f"""
    <section class="competitor-section">
      <div class="section-kicker">Сравнение с конкурентами</div>
      <h2>Чего не хватает на фоне сильных конкурентов</h2>
      <p class="lead">Сравнение показывает, какие шаблоны, блоки и коммерческие сигналы конкуренты используют лучше и что стоит внедрить в первую очередь.</p>
      <div class="list-card"><ul class="insight-list">{summary_html}</ul></div>
      <div class="competitor-grid">{''.join(competitor_cards)}</div>
      <div class="action-grid competitor-gap-grid">{''.join(gap_cards) if gap_cards else "<p class='empty-note'>Сильных разрывов по конкурентам в этой выборке не нашли.</p>"}</div>
      {failure_html}
    </section>
    """


def write_preview_html(audit_payload: dict, html_path: Path) -> None:
    audit_payload = normalize_structure(audit_payload)
    critical_source = audit_payload.get("critical_errors") or audit_payload.get("issues", [])
    issues_html = "".join(_issue_card(issue) for issue in critical_source)
    growth_html = "".join(f"<li>{_escape_html_text(item)}</li>" for item in audit_payload.get("growth_points", []))
    priority_html = _priority_table(audit_payload.get("priority_matrix", []))
    phases_html = _phase_checks_html(audit_payload.get("phase_sections", []))
    quick_wins_html = _action_cards(audit_payload.get("quick_wins", []), "effort", "impact")
    strategic_html = _action_cards(audit_payload.get("strategic_moves", []), "impact", "effort")
    competitor_html = _competitor_comparison_html_v4(audit_payload.get("competitor_comparison") or {})
    has_competitors = bool(competitor_html)

    html = f"""<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SEO-аудит {_escape_html_text(audit_payload.get('domain', ''))} - Shelpakov Digital</title>
  <style>
    :root {{
      --bg: #0f1c2d;
      --bg-soft: #f6f9fc;
      --panel: #ffffff;
      --text: #102035;
      --muted: #607088;
      --line: #d8e7f6;
      --cyan: #69d3ff;
      --orange: #f28b34;
      --orange-soft: #fff3e6;
      --critical: #ffe3e3;
      --high: #fff1e6;
      --medium: #eef7ff;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      font-family: Arial, sans-serif;
      background:
        radial-gradient(circle at 10% 10%, rgba(242, 139, 52, 0.15), transparent 28%),
        radial-gradient(circle at 90% 15%, rgba(105, 211, 255, 0.16), transparent 24%),
        linear-gradient(180deg, #0f1c2d 0%, #132238 18%, #f6f9fc 18%, #f6f9fc 100%);
      color: var(--text);
      line-height: 1.6;
    }}
    .wrap {{ width: min(1180px, calc(100% - 32px)); margin: 0 auto; }}
    .hero {{
      display: grid;
      grid-template-columns: minmax(0, 1.25fr) minmax(320px, 0.75fr);
      gap: 24px;
      padding: 34px 0 28px;
      align-items: stretch;
    }}
    .hero-main {{
      background: linear-gradient(145deg, #101c2b 0%, #1a2b44 100%);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 34px;
      padding: 34px;
      box-shadow: 0 24px 80px rgba(5, 14, 25, 0.35);
    }}
    .hero-kicker {{
      display: inline-flex;
      padding: 10px 14px;
      border-radius: 999px;
      background: rgba(255,255,255,0.09);
      color: var(--cyan);
      letter-spacing: .22em;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
    }}
    .hero h1 {{
      margin: 22px 0 14px;
      font-size: clamp(34px, 5vw, 62px);
      line-height: 1.03;
    }}
    .hero p {{ color: rgba(255,255,255,0.82); font-size: 18px; }}
    .hero-side {{
      background: linear-gradient(180deg, #fff7ef 0%, #ffffff 100%);
      border: 1px solid rgba(16, 32, 53, 0.08);
      border-radius: 34px;
      padding: 28px;
      box-shadow: 0 24px 60px rgba(12, 25, 40, 0.08);
    }}
    .hero-side .score {{
      font-size: 72px;
      line-height: 1;
      font-weight: 800;
      margin: 14px 0 6px;
    }}
    .grid-4 {{
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
      margin: 0 0 22px;
    }}
    .metric {{
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 24px;
      padding: 18px;
      text-align: center;
      box-shadow: 0 16px 30px rgba(12, 25, 40, 0.06);
    }}
    .metric-label {{
      color: var(--muted);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: .18em;
      font-weight: 700;
    }}
    .metric-value {{
      margin-top: 12px;
      font-size: 30px;
      font-weight: 800;
      color: var(--text);
    }}
    section, .phase-section {{
      margin: 26px 0;
      background: rgba(255,255,255,0.82);
      border: 1px solid rgba(216,231,246,0.9);
      border-radius: 30px;
      padding: 28px;
      box-shadow: 0 24px 60px rgba(13, 26, 42, 0.06);
      backdrop-filter: blur(18px);
    }}
    .section-kicker {{
      color: var(--orange);
      text-transform: uppercase;
      letter-spacing: .24em;
      font-size: 12px;
      font-weight: 700;
    }}
    h2 {{
      margin: 10px 0 12px;
      font-size: clamp(28px, 3.5vw, 44px);
      line-height: 1.08;
    }}
    h3 {{
      margin: 0 0 10px;
      font-size: 24px;
      line-height: 1.15;
    }}
    .lead {{ color: var(--muted); font-size: 18px; max-width: 920px; }}
    .issue-list, .phase-checks {{ display: grid; gap: 14px; }}
    .issue-card, .phase-check {{
      border-radius: 26px;
      overflow: hidden;
      border: 1px solid var(--line);
      background: #fff;
    }}
    .issue-head {{
      display: flex;
      gap: 12px;
      align-items: center;
      padding: 14px 18px;
      font-size: 15px;
    }}
    .issue-head span {{
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: .18em;
      font-weight: 700;
    }}
    .issue-head strong {{ font-size: 18px; }}
    .issue-critical .issue-head {{ background: var(--critical); color: #b42318; }}
    .issue-high .issue-head {{ background: var(--high); color: #b54708; }}
    .issue-medium .issue-head {{ background: var(--medium); color: #175cd3; }}
    .issue-low .issue-head {{ background: #f4f6fa; color: var(--muted); }}
    .issue-body, .phase-check {{
      padding: 18px;
    }}
    .phase-grid {{
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
      margin: 14px 0;
      align-items: start;
    }}
    .phase-box {{
      border: 1px solid var(--line);
      border-radius: 20px;
      padding: 16px;
      background: var(--bg-soft);
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-self: start;
    }}
    .phase-box-title {{
      color: var(--orange);
      text-transform: uppercase;
      letter-spacing: .14em;
      font-size: 11px;
      font-weight: 700;
      margin-bottom: 8px;
    }}
    .phase-meta {{
      margin: 12px 0 0;
      color: var(--muted);
      font-size: 14px;
      font-weight: 700;
    }}
    .phase-meta span {{
      display: inline-block;
      margin: 0 8px;
    }}
    .issue-body ul, .two-col ul, .roadmap-card ul, .phase-box ul {{
      padding-left: 18px;
      margin: 12px 0 0;
    }}
    .phase-box p {{
      margin: 12px 0 0;
    }}
    .recommendation {{
      margin-top: 12px;
      padding: 12px 14px;
      border-radius: 18px;
      background: var(--bg-soft);
    }}
    .two-col {{
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px;
    }}
    .list-card, .action-card {{
      border: 1px solid var(--line);
      border-radius: 24px;
      background: #fff;
      padding: 22px;
    }}
    .action-grid {{
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }}
    .action-meta {{
      margin: 6px 0;
      color: var(--muted);
      font-size: 14px;
    }}
    .roadmap {{
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
    }}
    .roadmap-card {{
      border: 1px solid var(--line);
      border-radius: 24px;
      padding: 18px;
      background: linear-gradient(180deg, #fff7ef 0%, #fff 100%);
    }}
    .roadmap-period {{
      color: var(--orange);
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .16em;
      font-size: 12px;
    }}
    .table-wrap {{
      overflow: auto;
      border: 1px solid var(--line);
      border-radius: 22px;
      background: #fff;
    }}
    .priority-table {{
      width: 100%;
      border-collapse: collapse;
      min-width: 920px;
    }}
    .priority-table th, .priority-table td {{
      padding: 14px 16px;
      border-bottom: 1px solid var(--line);
      vertical-align: top;
      text-align: left;
    }}
    .priority-table th {{
      background: #132238;
      color: #fff;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: .12em;
    }}
    .priority-table td:nth-child(2),
    .priority-table td:nth-child(3),
    .priority-table td:nth-child(4),
    .priority-table td:nth-child(5) {{
      text-align: center;
      font-weight: 700;
    }}
    .report-tabs {{
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin: 6px 0 12px;
    }}
    .report-tab {{
      appearance: none;
      border: 1px solid var(--line);
      background: rgba(255,255,255,0.72);
      color: var(--text);
      border-radius: 999px;
      padding: 12px 18px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: .2s ease;
    }}
    .report-tab.is-active {{
      background: #132238;
      color: #fff;
      border-color: #132238;
      box-shadow: 0 18px 30px rgba(12, 25, 40, 0.12);
    }}
    .tab-panel[hidden] {{
      display: none;
    }}
    .competitor-grid {{
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      margin-top: 16px;
    }}
    .competitor-card {{
      border: 1px solid var(--line);
      border-radius: 24px;
      background: linear-gradient(180deg, #fff7ef 0%, #fff 100%);
      padding: 22px;
      break-inside: avoid;
    }}
    .competitor-card h4 {{
      margin: 14px 0 8px;
      font-size: 14px;
      color: var(--text);
    }}
    .competitor-card ul {{
      margin: 0 0 10px 18px;
      padding: 0;
    }}
    .competitor-card li {{
      margin-bottom: 6px;
    }}
    .competitor-gap-grid {{
      margin-top: 16px;
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }}
    .insight-list {{
      margin: 0;
    }}
    .empty-note {{
      margin: 0;
      color: var(--muted);
    }}
    .footer-note {{
      margin: 28px auto 40px;
      padding-bottom: 20px;
      color: rgba(16,32,53,0.64);
      font-size: 14px;
    }}
    @media (max-width: 980px) {{
      .hero,
      .roadmap,
      .two-col,
      .phase-grid,
      .action-grid,
      .competitor-grid {{ grid-template-columns: 1fr; }}
      .grid-4 {{ grid-template-columns: repeat(2, minmax(0, 1fr)); }}
    }}
    @media (max-width: 640px) {{
      .grid-4 {{ grid-template-columns: 1fr; }}
    }}
  </style>
</head>
<body>
  <div class="wrap">
    <header class="hero">
      <div class="hero-main">
        <div class="hero-kicker">Shelpakov Digital</div>
        <h1>SEO-аудит {_escape_html_text(audit_payload.get("domain", ""))}</h1>
      </div>
      <aside class="hero-side">
        <div class="section-kicker">Паспорт проекта</div>
        <h2 style="font-size:32px;margin-bottom:8px;">{_escape_html_text(audit_payload.get("company_name", ""))}</h2>
        <p class="lead" style="font-size:16px;">Дата: {_escape_html_text(audit_payload.get("generated_at", ""))}<br/>Домен: {_escape_html_text(audit_payload.get("base_url", ""))}</p>
        <div class="score">{_escape_html_text(audit_payload.get("score", ""))}</div>
        <div style="color:var(--muted);font-weight:700;">Индекс SEO-готовности из 100</div>
      </aside>
    </header>

    <div class="grid-4">
      <div class="metric"><div class="metric-label">URL в sitemap</div><div class="metric-value">{audit_payload.get("sitemap_url_count", 0)}</div></div>
      <div class="metric"><div class="metric-label">Записей в sitemap</div><div class="metric-value">{audit_payload.get("sitemap_total_entries", 0)}</div></div>
      <div class="metric"><div class="metric-label">Средний ответ</div><div class="metric-value">{audit_payload.get("average_response_ms", 0)} ms</div></div>
      <div class="metric"><div class="metric-label">Средний HTML</div><div class="metric-value">{audit_payload.get("average_html_kb", 0)} KB</div></div>
    </div>

    <div class="report-tabs" role="tablist" aria-label="Разделы аудита">
      <button class="report-tab is-active" type="button" data-tab-button="overview">Обзор</button>
      <button class="report-tab" type="button" data-tab-button="details">Подробно</button>
      {'<button class="report-tab" type="button" data-tab-button="competitors">Конкуренты</button>' if has_competitors else ''}
      <button class="report-tab" type="button" data-tab-button="plan">План работ</button>
    </div>

    <div class="tab-panel" data-tab-panel="overview">
      <section>
        <div class="section-kicker">Приоритеты</div>
        <h2>Какие задачи делать в первую очередь</h2>
        <p class="lead">Сначала закрываем критичные и массовые проблемы, которые сильнее всего бьют по индексации, сниппетам и ключевым страницам сайта.</p>
        {priority_html}
      </section>

      <section>
        <div class="section-kicker">Критические ошибки</div>
        <h2>Что сейчас реально блокирует рост</h2>
        <p class="lead">Здесь только те проблемы, которые заметно влияют на индекс, сниппеты, трафик и заявки.</p>
        <div class="issue-list">{issues_html}</div>
      </section>

      <section>
        <div class="section-kicker">Вектор роста</div>
        <h2>Что переработать после базовых исправлений</h2>
        <p class="lead">Ниже направления, которые усиливают структуру, коммерческий интент и качество контента после базовых исправлений.</p>
        <div class="list-card">
          <ul>{growth_html}</ul>
        </div>
      </section>
    </div>

    <div class="tab-panel" data-tab-panel="details" hidden>
      {phases_html}
    </div>

    {f'<div class="tab-panel" data-tab-panel="competitors" hidden>{competitor_html}</div>' if has_competitors else ''}

    <div class="tab-panel" data-tab-panel="plan" hidden>
      <section>
        <div class="section-kicker">Быстрые исправления</div>
        <h2>Что можно исправить в ближайшее время</h2>
        <p class="lead">Это задачи, которые можно внедрить быстро и без большой переделки сайта.</p>
        <div class="action-grid">{quick_wins_html}</div>
      </section>

      <section>
        <div class="section-kicker">Стратегические улучшения</div>
        <h2>Что даст рост после базовых исправлений</h2>
        <p class="lead">Это более крупные изменения, которые усиливают сайт в поиске и помогают получать больше заявок.</p>
        <div class="action-grid">{strategic_html}</div>
      </section>

      <section>
        <div class="section-kicker">План работ</div>
        <h2>План внедрения на 60 дней</h2>
        <p class="lead">Сначала снимаем технические ограничения, потом усиливаем шаблоны и только после этого масштабируем рост.</p>
        <div class="roadmap">{_roadmap_columns(audit_payload.get("roadmap", []))}</div>
      </section>
    </div>

    <div class="footer-note">Аудит подготовлен {_escape_html_text(audit_payload.get("generated_at", ""))} • {_escape_html_text(audit_payload.get("domain", ""))} • Shelpakov Digital</div>
  </div>
  <script>
    (() => {{
      const buttons = Array.from(document.querySelectorAll('[data-tab-button]'));
      const panels = Array.from(document.querySelectorAll('[data-tab-panel]'));
      if (!buttons.length || !panels.length) return;

      const activate = (tabName) => {{
        buttons.forEach((button) => {{
          const isActive = button.dataset.tabButton === tabName;
          button.classList.toggle('is-active', isActive);
        }});
        panels.forEach((panel) => {{
          panel.hidden = panel.dataset.tabPanel !== tabName;
        }});
      }};

      buttons.forEach((button) => {{
        button.addEventListener('click', () => activate(button.dataset.tabButton));
      }});

      activate('overview');
    }})();
  </script>
</body>
</html>
"""
    html_path.write_text(normalize_output_text(html), encoding="utf-8")
