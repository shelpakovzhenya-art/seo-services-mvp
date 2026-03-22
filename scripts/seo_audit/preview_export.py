from __future__ import annotations

from html import escape
from pathlib import Path
import shutil


def _playwright_launch_kwargs() -> dict:
    try:
        executable_path = (
            shutil.which("chromium")
            or shutil.which("chromium-browser")
            or shutil.which("google-chrome")
            or shutil.which("google-chrome-stable")
        )
    except Exception:
        executable_path = None

    launch_kwargs = {"headless": True}
    if executable_path:
        launch_kwargs["executable_path"] = executable_path
    return launch_kwargs


def write_preview_pdf(html_path: Path, pdf_path: Path) -> bool:
    try:
        from playwright.sync_api import sync_playwright
    except Exception:
        return False

    if not html_path.exists():
        return False

    pdf_path.parent.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(**_playwright_launch_kwargs())
        page = browser.new_page(viewport={"width": 1440, "height": 960}, locale="ru-RU")
        try:
            page.goto(html_path.resolve().as_uri(), wait_until="networkidle", timeout=45000)
            page.emulate_media(media="screen")
            page.pdf(
                path=str(pdf_path),
                format="A4",
                print_background=True,
                margin={"top": "14mm", "right": "12mm", "bottom": "16mm", "left": "12mm"},
            )
            return True
        finally:
            page.close()
            browser.close()


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
