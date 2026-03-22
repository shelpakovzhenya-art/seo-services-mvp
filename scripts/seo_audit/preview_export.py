from __future__ import annotations

from html import escape
from pathlib import Path
from urllib.parse import urlparse


def _slugify(value: str) -> str:
    import re

    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9.-]+", "-", value)
    value = re.sub(r"-{2,}", "-", value).strip("-")
    return value or "page"


def _choose_screenshot_targets(audit_payload: dict) -> list[dict]:
    pages = audit_payload.get("sample_pages", [])
    selected: list[dict] = []

    def add(page: dict | None, label: str) -> None:
        if not page:
            return
        url = page.get("url", "")
        if not url or any(item["url"] == url for item in selected):
            return
        selected.append({"url": url, "label": label, "page_type": page.get("page_type", "")})

    add(audit_payload.get("home_page"), "Главная")
    add(next((page for page in pages if "/contacts" in page.get("url", "")), None), "Контакты")
    add(next((page for page in pages if page.get("page_type") == "Категория"), None), "Категория")
    add(next((page for page in pages if page.get("page_type") == "Товар"), None), "Товар")
    add(next((page for page in pages if page.get("page_type") == "Подкатегория"), None), "Подкатегория")
    return selected[:4]


def capture_screenshots(audit_payload: dict, assets_dir: Path) -> list[dict]:
    try:
        from playwright.sync_api import sync_playwright
    except Exception:
        return []

    targets = _choose_screenshot_targets(audit_payload)
    if not targets:
        return []

    assets_dir.mkdir(parents=True, exist_ok=True)
    screenshots: list[dict] = []

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 960}, locale="ru-RU")
        for index, target in enumerate(targets, start=1):
            page = context.new_page()
            try:
                page.goto(target["url"], wait_until="domcontentloaded", timeout=45000)
                page.wait_for_timeout(1800)
                parsed = urlparse(target["url"])
                slug = _slugify(parsed.path.strip("/") or "home")
                file_path = assets_dir / f"{index:02d}-{slug}.png"
                page.screenshot(path=str(file_path), full_page=False)
                screenshots.append(
                    {
                        "label": target["label"],
                        "page_type": target.get("page_type", ""),
                        "url": target["url"],
                        "path": str(file_path),
                    }
                )
            except Exception:
                pass
            finally:
                page.close()
        browser.close()

    return screenshots


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


def _roadmap_columns(audit_payload: dict) -> str:
    chunks = []
    for period, tasks in audit_payload.get("roadmap", []):
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


def _screenshot_cards(audit_payload: dict, html_path: Path) -> str:
    cards = []
    for shot in audit_payload.get("screenshots", []):
        image_path = Path(shot["path"])
        relative = image_path.relative_to(html_path.parent).as_posix()
        cards.append(
            f"""
            <figure class="shot-card">
              <img src="{escape(relative)}" alt="{escape(shot.get('label', 'Скриншот'))}" />
              <figcaption>
                <strong>{escape(shot.get('label', ''))}</strong>
                <span>{escape(shot.get('url', ''))}</span>
              </figcaption>
            </figure>
            """
        )
    return "".join(cards)


def write_preview_html(audit_payload: dict, html_path: Path) -> None:
    issues_html = "".join(_issue_card(issue) for issue in audit_payload.get("issues", []))
    strengths_html = "".join(f"<li>{escape(item)}</li>" for item in audit_payload.get("strengths", []))
    growth_html = "".join(f"<li>{escape(item)}</li>" for item in audit_payload.get("growth_points", []))
    screenshots_html = _screenshot_cards(audit_payload, html_path)
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
    section {{
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
    .lead {{ color: var(--muted); font-size: 18px; max-width: 920px; }}
    .issue-list {{ display: grid; gap: 14px; }}
    .issue-card {{
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
    .issue-body {{ padding: 18px; }}
    .issue-body ul, .two-col ul, .roadmap-card ul {{ padding-left: 18px; margin: 12px 0 0; }}
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
    .list-card {{
      border: 1px solid var(--line);
      border-radius: 24px;
      background: #fff;
      padding: 22px;
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
    .shots {{
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }}
    .shot-card {{
      margin: 0;
      border-radius: 26px;
      overflow: hidden;
      border: 1px solid var(--line);
      background: #fff;
    }}
    .shot-card img {{
      display: block;
      width: 100%;
      aspect-ratio: 16 / 10;
      object-fit: cover;
      background: #edf3fa;
    }}
    .shot-card figcaption {{
      display: grid;
      gap: 5px;
      padding: 14px 16px 18px;
    }}
    .shot-card span {{ color: var(--muted); font-size: 13px; word-break: break-all; }}
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
      .shots {{ grid-template-columns: 1fr; }}
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
      <h2>Что сейчас сильнее всего мешает росту</h2>
      <p class="lead">Ниже не формальные замечания, а те ограничения, которые реально влияют на индексацию, CTR, crawl budget и качество коммерческой выдачи.</p>
      <div class="issue-list">{issues_html}</div>
    </section>

    <section>
      <div class="section-kicker">Скриншоты</div>
      <h2>Как выглядит проект в момент аудита</h2>
      <p class="lead">Автоскриншоты помогают не спорить о контексте: в документе сразу видно, какие страницы легли в разбор и как они выглядят на старте.</p>
      <div class="shots">{screenshots_html}</div>
    </section>

    <section>
      <div class="section-kicker">Сильные стороны</div>
      <h2>На что уже можно опираться</h2>
      <div class="two-col">
        <div class="list-card">
          <ul>{strengths_html}</ul>
        </div>
        <div class="list-card">
          <div class="section-kicker" style="margin-bottom:8px;">Что усиливать</div>
          <ul>{growth_html}</ul>
        </div>
      </div>
    </section>

    <section>
      <div class="section-kicker">Roadmap</div>
      <h2>План внедрения на 60 дней</h2>
      <p class="lead">Такой порядок даёт быстрый эффект: сначала чистим индексацию и шаблоны, потом усиливаем спросовые кластеры и коммерческие посадочные.</p>
      <div class="roadmap">{_roadmap_columns(audit_payload)}</div>
    </section>

    <div class="footer-note">Аудит подготовлен {escape(audit_payload.get("generated_at", ""))} • {escape(audit_payload.get("domain", ""))} • Shelpakov Digital</div>
  </div>
</body>
</html>
"""
    html_path.write_text(html, encoding="utf-8")
