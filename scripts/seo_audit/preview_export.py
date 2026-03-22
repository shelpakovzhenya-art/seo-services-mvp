from __future__ import annotations

from html import escape
from pathlib import Path

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
    text = str(value or "")
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("\n", "<br/>")
    )


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


def _append_issue_cards(story: list, issues: list[dict], styles: dict) -> None:
    for issue in issues:
        evidence_html = "".join(f"<br/>• {_escape_pdf_text(item)}" for item in issue.get("evidence", []))
        content = [
            [Paragraph(_escape_pdf_text(f"{issue.get('severity', '').upper()}  {issue.get('title', '')}"), styles["cardTitle"])],
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
                [Paragraph(f"<b>Влияние:</b> {_escape_pdf_text(item.get('impact', ''))} &nbsp;&nbsp; <b>Усилие:</b> {_escape_pdf_text(item.get('effort', ''))}", styles["small"])],
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
        _section_header(story, "Глубокий разбор", str(section.get("title", "")), str(section.get("intro", "")), styles)
        for check in section.get("checks", []):
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
                    [Paragraph(f"<b>Приоритет:</b> {_escape_pdf_text(check.get('priority', ''))} &nbsp;&nbsp; <b>Ответственный:</b> {_escape_pdf_text(check.get('owner', ''))}", styles["small"])],
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
            story.append(KeepTogether([card, Spacer(1, 10)]))


def _append_roadmap(story: list, roadmap: list[list], styles: dict) -> None:
    _section_header(
        story,
        "Roadmap",
        "План внедрения на 60 дней",
        "Порядок выстроен так, чтобы сначала убрать технические стоп-факторы, потом усилить шаблоны, а после этого наращивать точки роста.",
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
        "Ключевые URL, которые вошли в итоговый документ",
        "В документ вынесены основные страницы, по которым проще всего понять качество шаблонов, SEO-обвязки и коммерческого слоя сайта.",
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
            Paragraph(
                _escape_pdf_text(
                    "Коммерческий аудит с фокусом на индексацию, точки роста, шаблоны страниц, конверсию и реальный план внедрения."
                ),
                styles["coverBody"],
            ),
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
            ("Sitemap unique", audit_payload.get("sitemap_url_count", 0)),
            ("Sitemap entries", audit_payload.get("sitemap_total_entries", 0)),
            ("Средний ответ", f"{audit_payload.get('average_response_ms', 0)} ms"),
            ("HTML обхода", f"{audit_payload.get('average_html_kb', 0)} KB"),
        ]
        metric_cards = [_metric_card(label, value, styles) for label, value in metrics]
        story.append(Table([metric_cards[:2], metric_cards[2:]], colWidths=[86 * mm, 86 * mm], rowHeights=[28 * mm, 28 * mm]))
        story.append(PageBreak())

        _section_header(
            story,
            "Executive summary",
            "Главные выводы по проекту",
            "Ниже не просто список ошибок, а короткая выжимка того, где сайт уже держится уверенно и что сейчас сильнее всего мешает росту.",
            styles,
        )
        story.extend(_paragraph_list(audit_payload.get("executive_summary", []), styles))
        story.append(Spacer(1, 10))

        _section_header(
            story,
            "Сильные стороны",
            "На что уже можно опираться",
            "Это база, которую не нужно ломать. На ней проще строить рост, чем пересобирать проект с нуля.",
            styles,
        )
        story.extend(_paragraph_list(audit_payload.get("strengths", []), styles))
        story.append(Spacer(1, 6))
        story.append(Paragraph("Точки роста", styles["cardTitle"]))
        story.extend(_paragraph_list(audit_payload.get("growth_points", []), styles))
        story.append(Spacer(1, 14))

        _section_header(
            story,
            "Приоритеты",
            "Матрица проблем по влиянию на рост",
            "Здесь задачи разложены по impact, risk и business-effect, чтобы было понятно, что делать первым.",
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
                                    f"Impact: {row.get('impact', '')} | Risk: {row.get('risk', '')} | Business: {row.get('business', '')} | Итог: {row.get('total', '')}"
                                ),
                                styles["small"],
                            )
                        ],
                        [Paragraph(f"<b>Приоритет:</b> {_escape_pdf_text(row.get('severity', ''))} &nbsp;&nbsp; <b>Ответственный:</b> {_escape_pdf_text(row.get('owner', ''))}", styles["base"])],
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
            "Это не весь backlog, а ограничения, которые первыми режут индекс, сниппеты, crawl budget и способность сайта забирать спрос.",
            styles,
        )
        _append_issue_cards(story, audit_payload.get("critical_errors") or audit_payload.get("issues", []), styles)
        _append_phase_sections(story, audit_payload.get("phase_sections", []), styles)
        _append_action_cards(
            story,
            audit_payload.get("quick_wins", []),
            "Quick wins",
            "Быстрые победы на ближайший спринт",
            "Эти правки можно внедрить быстро и получить заметный эффект без большой перестройки проекта.",
            styles,
        )
        _append_action_cards(
            story,
            audit_payload.get("strategic_moves", []),
            "Стратегические улучшения",
            "Что усилит проект поверх базовых фиксов",
            "Это уже не тушение пожара, а слой изменений, который превращает сайт в более сильный источник заявок и роста видимости.",
            styles,
        )
        _append_roadmap(story, audit_payload.get("roadmap", []), styles)
        _append_appendix(story, audit_payload.get("appendix_pages") or audit_payload.get("sample_pages", []), styles)

        doc.build(
            story,
            onFirstPage=_draw_pdf_chrome(str(audit_payload.get("domain", "")), "Shelpakov Digital", regular_font, bold_font),
            onLaterPages=_draw_pdf_chrome(str(audit_payload.get("domain", "")), "Shelpakov Digital", regular_font, bold_font),
        )
        return True
    except Exception:
        return False


def _issue_card(issue: dict) -> str:
    severity = escape(issue.get("severity", ""))
    title = escape(issue.get("title", ""))
    why = escape(issue.get("why_it_matters", ""))
    recommendation = escape(issue.get("recommendation", ""))
    evidence_items = "".join(f"<li>{escape(item)}</li>" for item in issue.get("evidence", []))
    return f"""
    <article class="issue-card issue-{severity.lower()}">
      <div class="issue-head"><span>{severity}</span><strong>{title}</strong></div>
      <div class="issue-body">
        <p>{why}</p>
        <ul>{evidence_items}</ul>
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
            f"<td>{escape(row.get('problem', ''))}</td>"
            f"<td>{escape(str(row.get('impact', '')))}</td>"
            f"<td>{escape(str(row.get('risk', '')))}</td>"
            f"<td>{escape(str(row.get('business', '')))}</td>"
            f"<td>{escape(str(row.get('total', '')))}</td>"
            f"<td>{escape(row.get('severity', ''))}</td>"
            f"<td>{escape(row.get('owner', ''))}</td>"
            "</tr>"
        )
    return (
        "<div class='table-wrap'><table class='priority-table'>"
        "<thead><tr><th>Проблема</th><th>Impact</th><th>Risk</th><th>Business</th><th>Итог</th><th>Приоритет</th><th>Ответственный</th></tr></thead>"
        f"<tbody>{''.join(body)}</tbody></table></div>"
    )


def _phase_checks_html(phase_sections: list[dict]) -> str:
    blocks = []
    for section in phase_sections:
        checks_html = []
        for check in section.get("checks", []):
            metrics = "".join(
                f"<li><strong>{escape(str(label))}:</strong> {escape(str(value))}</li>"
                for label, value in check.get("metrics", [])
            )
            findings = "".join(f"<li>{escape(item)}</li>" for item in check.get("findings", []))
            checks_html.append(
                f"""
                <article class="phase-check">
                  <h3>{escape(check.get('name', ''))}</h3>
                  <p><strong>Что проверялось:</strong> {escape(check.get('checked', ''))}</p>
                  <p><strong>Как проверялось:</strong> {escape(check.get('method', ''))}</p>
                  <div class="phase-grid">
                    <div class="phase-box">
                      <div class="phase-box-title">Ключевые метрики</div>
                      <ul>{metrics}</ul>
                    </div>
                    <div class="phase-box">
                      <div class="phase-box-title">Что нашли</div>
                      <ul>{findings}</ul>
                    </div>
                  </div>
                  <p class="phase-meta"><strong>Приоритет:</strong> {escape(check.get('priority', ''))} <span>•</span> <strong>Ответственный:</strong> {escape(check.get('owner', ''))}</p>
                  <p class="recommendation"><strong>Что делать:</strong> {escape(check.get('recommendation', ''))}</p>
                </article>
                """
            )
        blocks.append(
            f"""
            <section class="phase-section">
              <div class="section-kicker">Глубокий разбор</div>
              <h2>{escape(section.get('title', ''))}</h2>
              <p class="lead">{escape(section.get('intro', ''))}</p>
              <div class="phase-checks">{''.join(checks_html)}</div>
            </section>
            """
        )
    return "".join(blocks)


def _roadmap_columns(roadmap: list[list]) -> str:
    chunks = []
    for period, tasks in roadmap:
        items = "".join(f"<li>{escape(task)}</li>" for task in tasks)
        chunks.append(
            f"""
            <div class="roadmap-card">
              <div class="roadmap-period">{escape(period)}</div>
              <ul>{items}</ul>
            </div>
            """
        )
    return "".join(chunks)


def _action_cards(items: list[dict], value_key: str, extra_key: str) -> str:
    cards = []
    for item in items:
        cards.append(
            f"""
            <article class="action-card">
              <h3>{escape(item.get('title', ''))}</h3>
              <p class="action-meta"><strong>{escape(value_key.capitalize())}:</strong> {escape(item.get(value_key, ''))}</p>
              <p class="action-meta"><strong>{escape(extra_key.capitalize())}:</strong> {escape(item.get(extra_key, ''))}</p>
              <p>{escape(item.get('action') or item.get('details') or '')}</p>
            </article>
            """
        )
    return "".join(cards)


def write_preview_html(audit_payload: dict, html_path: Path) -> None:
    critical_source = audit_payload.get("critical_errors") or audit_payload.get("issues", [])
    issues_html = "".join(_issue_card(issue) for issue in critical_source)
    strengths_html = "".join(f"<li>{escape(item)}</li>" for item in audit_payload.get("strengths", []))
    growth_html = "".join(f"<li>{escape(item)}</li>" for item in audit_payload.get("growth_points", []))
    priority_html = _priority_table(audit_payload.get("priority_matrix", []))
    phases_html = _phase_checks_html(audit_payload.get("phase_sections", []))
    quick_wins_html = _action_cards(audit_payload.get("quick_wins", []), "effort", "impact")
    strategic_html = _action_cards(audit_payload.get("strategic_moves", []), "impact", "effort")

    html = f"""<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SEO-аудит {escape(audit_payload.get('domain', ''))} — Shelpakov Digital</title>
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
    }}
    .phase-box {{
      border: 1px solid var(--line);
      border-radius: 20px;
      padding: 16px;
      background: var(--bg-soft);
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
      .grid-4,
      .roadmap,
      .two-col,
      .phase-grid,
      .action-grid {{ grid-template-columns: 1fr; }}
    }}
  </style>
</head>
<body>
  <div class="wrap">
    <header class="hero">
      <div class="hero-main">
        <div class="hero-kicker">Shelpakov Digital</div>
        <h1>SEO-аудит {escape(audit_payload.get("domain", ""))}</h1>
        <p>Коммерческий аудит с фокусом на индексацию, точки роста, шаблоны страниц, конверсию и реальный план внедрения.</p>
      </div>
      <aside class="hero-side">
        <div class="section-kicker">Паспорт проекта</div>
        <h2 style="font-size:32px;margin-bottom:8px;">{escape(audit_payload.get("company_name", ""))}</h2>
        <p class="lead" style="font-size:16px;">Дата: {escape(audit_payload.get("generated_at", ""))}<br/>Домен: {escape(audit_payload.get("base_url", ""))}</p>
        <div class="score">{escape(str(audit_payload.get("score", "")))}</div>
        <div style="color:var(--muted);font-weight:700;">Индекс SEO-готовности из 100</div>
      </aside>
    </header>

    <div class="grid-4">
      <div class="metric"><div class="metric-label">Sitemap unique</div><div class="metric-value">{audit_payload.get("sitemap_url_count", 0)}</div></div>
      <div class="metric"><div class="metric-label">Sitemap entries</div><div class="metric-value">{audit_payload.get("sitemap_total_entries", 0)}</div></div>
      <div class="metric"><div class="metric-label">Средний ответ</div><div class="metric-value">{audit_payload.get("average_response_ms", 0)} ms</div></div>
      <div class="metric"><div class="metric-label">HTML выборки</div><div class="metric-value">{audit_payload.get("average_html_kb", 0)} KB</div></div>
    </div>

    <section>
      <div class="section-kicker">Приоритеты</div>
      <h2>Матрица проблем по влиянию на рост</h2>
      <p class="lead">Здесь задачи не просто перечислены, а разложены по impact, risk и business-effect, чтобы было понятно, что делать первым.</p>
      {priority_html}
    </section>

    <section>
      <div class="section-kicker">Критические ошибки</div>
      <h2>Что сейчас реально блокирует рост</h2>
      <p class="lead">Это не весь backlog, а ограничения, которые первыми режут индекс, сниппеты, crawl budget и способность сайта забирать спрос.</p>
      <div class="issue-list">{issues_html}</div>
    </section>

    {phases_html}

    <section>
      <div class="section-kicker">Quick wins</div>
      <h2>Быстрые победы на ближайший спринт</h2>
      <p class="lead">Эти правки можно внедрить быстро и получить заметный эффект без большой перестройки проекта.</p>
      <div class="action-grid">{quick_wins_html}</div>
    </section>

    <section>
      <div class="section-kicker">Стратегические улучшения</div>
      <h2>Что усилит проект поверх базовых фиксов</h2>
      <p class="lead">Это уже не тушение пожара, а слой изменений, который превращает сайт в более сильный источник заявок и роста видимости.</p>
      <div class="action-grid">{strategic_html}</div>
    </section>

    <section>
      <div class="section-kicker">Сильные стороны</div>
      <h2>На что уже можно опираться</h2>
      <div class="two-col">
        <div class="list-card">
          <ul>{strengths_html}</ul>
        </div>
        <div class="list-card">
          <div class="section-kicker" style="margin-bottom:8px;">Точки роста</div>
          <ul>{growth_html}</ul>
        </div>
      </div>
    </section>

    <section>
      <div class="section-kicker">Roadmap</div>
      <h2>План внедрения на 60 дней</h2>
      <p class="lead">Порядок выстроен так, чтобы сначала снять технические стоп-факторы, потом усилить шаблоны и только после этого наращивать слой роста.</p>
      <div class="roadmap">{_roadmap_columns(audit_payload.get("roadmap", []))}</div>
    </section>

    <div class="footer-note">Аудит подготовлен {escape(audit_payload.get("generated_at", ""))} • {escape(audit_payload.get("domain", ""))} • Shelpakov Digital</div>
  </div>
</body>
</html>
"""
    html_path.write_text(html, encoding="utf-8")
