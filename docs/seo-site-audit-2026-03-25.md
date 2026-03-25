# SEO Content Audit - 2026-03-25

Assumptions:
- GEO: Russia, Moscow-weighted commercial SERP
- Primary queries: `seo продвижение сайта`, `seo аудит сайта`, `разработка сайта под ключ`
- Secondary queries: `technical seo`, `local seo`, `seo консультация`, `link building`, `seo тексты`
- Audit scope: homepage, services index, all service pages via shared template, blog hub, case-study hub, reviews, contacts, calculator, tools

SERP sources checked:
- https://seo.ru/
- https://www.it-agency.ru/services/seo-audit/
- https://creatico.ru/services/site/
- https://rk-agency.ru/development/
- https://itrox.ru/services/site/sozdanie-saytov-pod-klyuch/
- https://sigmasmm.ru/ru/sites/

Local page sources checked:
- [app/page.tsx](/c:/Users/della/seo-services-mvp/app/page.tsx)
- [app/services/page.tsx](/c:/Users/della/seo-services-mvp/app/services/page.tsx)
- [components/services/ServicePageTemplate.tsx](/c:/Users/della/seo-services-mvp/components/services/ServicePageTemplate.tsx)
- [lib/service-pages.ts](/c:/Users/della/seo-services-mvp/lib/service-pages.ts)
- [lib/website-development-service-data.ts](/c:/Users/della/seo-services-mvp/lib/website-development-service-data.ts)
- [app/blog/page.tsx](/c:/Users/della/seo-services-mvp/app/blog/page.tsx)
- [app/cases/page.tsx](/c:/Users/della/seo-services-mvp/app/cases/page.tsx)
- [app/reviews/page.tsx](/c:/Users/della/seo-services-mvp/app/reviews/page.tsx)
- [app/contacts/page.tsx](/c:/Users/della/seo-services-mvp/app/contacts/page.tsx)
- [app/calculator/page.tsx](/c:/Users/della/seo-services-mvp/app/calculator/page.tsx)
- [app/tools/page.tsx](/c:/Users/della/seo-services-mvp/app/tools/page.tsx)

## 1. Executive verdict

Сайт до правок был не слабым по дизайну и базовому покрытию интента, но заметно коммодитизированным в самом важном кластере: коммерческих сервисных страницах. Главная проблема не в “качестве текста”, а в том, что homepage, services hub и service template повторяли безопасную SERP-логику: преимущества, этапы, что входит, FAQ, CTA. Это делало страницы взаимозаменяемыми с типовым agency SERP. Рост через переписывание был возможен и оправдан: новый URL-кластер создавать не требовалось, потому что core intent уже закрыт; нужно было сменить угол подачи и порядок блоков, добавив diagnosis, anti-fit, friction и decision-support.

## 2. Scores

Overall site score for the main commercial cluster:

- Content Commoditization Score: 72/100
- Information Gain Score: 31/100
- Bottom line: базовое покрытие интента было нормальным, но новизна и decision-support были слишком слабыми. Сайт объяснял услуги, но редко помогал выбрать правильный формат и увидеть, когда решение не подходит.

Sub-scores for commoditization:

- Headline/thesis overlap: 76/100
  Current commercial pages шли по рынку: “что это”, “что входит”, “этапы”, “результаты”, “FAQ”. Это совпадает с dominant commercial SERP almost one-to-one.
- Entity overlap: 61/100
  Использовались общие сущности вроде SEO, структуры, контента, доверия, но почти не было собственных фреймворков, decision labels или фирменных категорий выбора.
- Data overlap: 68/100
  На части страниц были прайсы и кейсы, но мало собственных micro-data, budget drivers, rollout constraints или benchmark logic. Без этого коммерческий контент остаётся похожим на рынок.
- Angle overlap: 82/100
  Главный угол был safe and polished: “сильный сайт под заявки”, “системный рост”, “понятный план”. Это хорошая формулировка, но SERP already uses the same safety angle.
- Example overlap: 58/100
  Сайт не был полностью обезличенным, но многие блоки говорили о типовых ситуациях без failure-case framing и без “когда не покупать”.
- Format overlap: 79/100
  Home, services hub and service pages были построены как стандартные agency landing pages. Формат отличался визуально, но не структурно.
- Fluff ratio: 49/100
  Воды не критично много, но встречались общие формулировки про рост, доверие, системность и понятный путь без нового сигнала относительно SERP.
- Intent dilution: 44/100
  Intents mostly stayed commercial, but some blocks размазывали выбор: страница хотела и продать, и объяснить, и выглядеть экспертно, не помогая принять решение между соседними услугами.

Sub-scores for information gain:

- Entity gain: 34/100
  До правок почти не было новых категорий вроде symptom-based routing, anti-fit blocks, friction matrices, budget-driver cards.
- Data gain: 27/100
  Собственных цифр и benchmark logic мало. Были стартовые цены, но не хватало what-changes-the-budget and implementation-risk framing.
- Perspective gain: 39/100
  Контент был написан аккуратно, но редко занимал operator view: где проект ломается, что не покупать, какой первый шаг даст больше пользы.
- Procedure gain: 24/100
  Не хватало decision trees и symptom-to-service logic. Страницы объясняли услугу, но слабо помогали выбрать её против соседних форматов.
- Local gain: 26/100
  GEO Russia implied, but pages слабо проговаривали типовые local constraints: внедрение, шаблоны, филиалы, миграции, budgets, коммерческая подача под российский SERP.
- Friction gain: 36/100
  Были hints about complexity, but almost no structured trade-offs, blockers, hidden costs, or “when not fit”.

## 3. SERP consensus snapshot

What is the same across the SERP:

- Intro definition or promise-led hero
- Blocks like `что входит`, `этапы`, `преимущества`, `стоимость`, `кейсы`, `FAQ`, `форма заявки`
- Safe commercial angle: “под ключ”, “комплексный подход”, “рост трафика и заявок”, “прозрачность работ”
- Standard proof blocks: years on market, project counts, logos, reviews, price from, meeting CTA

Dominant patterns in top results:

- SEO service pages rely on benefits, work stages, metrics, and generic conversion reassurance
- Audit pages push deliverables, team credibility, meeting process, and price anchors
- Website development pages lean on “site under leads”, “analytics + SEO + design”, package types, and rapid launch promises

Weak spot visible in the majority of competitors:

- Very little anti-fit content
- Very little friction analysis
- Very little “symptom -> right service” routing
- Very little honest explanation of when development beats SEO or when audit beats monthly support
- Lots of polished claims, not enough decision clarity

## 4. Gap map

Missing from page cluster before rewrite:

- Diagnostic symptom blocks on homepage and service pages
- Explicit “когда эта услуга не подходит”
- Friction/trade-off blocks
- Decision matrix between audit, technical SEO, ongoing SEO, content, consulting, and development
- Budget driver explanation beyond generic “depends on complexity”
- Reading routes on the blog hub
- “How to read this case/review” framing on supporting proof pages

Overused on page cluster before rewrite:

- Generic benefit cards
- Standard “что входит” and “этапы” sections with no counter-angle
- Safe phrases around “рост”, “доверие”, “понятный план”
- FAQ as reassurance instead of objection-handling

Untapped opportunities:

- Symptom-based routing
- Failure-mode framing
- “Don’t buy this yet” blocks
- Hidden-cost tables for development and SEO
- Local/Russia-specific deployment constraints
- Support/CRM/sales-call objections instead of generic FAQ

Sections to cut, merge, or invert:

- Invert `что это такое / преимущества` into `как понять, что вам нужен именно этот формат`
- Merge generic cross-sell sections into a real decision matrix
- Move FAQ from reassurance-only to pre-sale objections
- Reduce abstract promises in hubs and replace them with choice architecture

## 5. Fast wins

- [P1] Replace generic service intros with diagnosis-first blocks
  Where: service template before benefits
  What: symptom, root cause, why-this-service-fit cards
  Why it works: closes procedure gap and reduces headline/thesis overlap
  Why it is not commodity: most commercial pages explain the service; few help qualify it
  Effort: low
  Impact: high
  Type: ranking differentiation / conversion assist

- [P1] Add “when this service is not the right first step”
  Where: service template near hero
  What: anti-fit cards for every service
  Why it works: adds friction gain and reduces wrong-lead intent mismatch
  Why it is not commodity: SERP rarely says when not to buy
  Effort: low
  Impact: high
  Type: ranking differentiation / conversion assist

- [P1] Replace generic related-services block with decision matrix
  Where: service template mid-page
  What: audit vs SEO vs technical vs development routing
  Why it works: helps users self-qualify and keeps commercial intent sharp
  Why it is not commodity: most sites cross-sell; few explain the fork
  Effort: medium
  Impact: high
  Type: ranking differentiation / dwell / conversion assist

- [P1] Reframe homepage around first-step decisions
  Where: homepage between approach and packages
  What: add three start-here forks
  Why it works: homepage becomes a chooser, not a generic agency overview
  Why it is not commodity: this changes the angle from “we do everything” to “here is what you actually need first”
  Effort: medium
  Impact: high
  Type: conversion assist / ranking differentiation

- [P1] Reframe services hub around adjacent-service confusion
  Where: `/services`
  What: add audit vs SEO, technical vs development, content vs consulting comparison cards
  Why it works: closes MOFU intent and improves page usefulness
  Why it is not commodity: standard services hubs list categories; they rarely help resolve the conflict between them
  Effort: low
  Impact: high
  Type: long-tail / conversion assist

- [P2] Add “how to read this case” framing
  Where: `/cases` and `/cases/[slug]`
  What: cards that tell users to look at problem, priority, and structural change
  Why it works: cases become proof of process, not just portfolio decoration
  Why it is not commodity: most agency case pages assume the user already knows what to extract
  Effort: low
  Impact: medium
  Type: dwell / conversion assist

- [P2] Add reading routes to the blog hub
  Where: `/blog`
  What: task-based entry paths by scenario
  Why it works: blog becomes easier to navigate by job-to-be-done
  Why it is not commodity: most blogs sort by recency, not by use case
  Effort: low
  Impact: medium
  Type: long-tail / dwell

- [P2] Add budget-driver and caution logic to calculator
  Where: `/calculator`
  What: explain where estimate undercounts real scope
  Why it works: qualifies leads and reduces distrust around price
  Why it is not commodity: calculators usually only add up numbers, they do not explain the failure modes of the estimate
  Effort: low
  Impact: medium
  Type: conversion assist

## 6. Structural rewrites

Delete or demote:

- Generic “what is this service” opening as the main explanatory block
- Generic related-services section without decision logic
- FAQ position as a late reassurance-only block

Add:

- `Как понять, что проекту нужен именно этот формат`
- `Когда не подходит`
- `Friction и trade-offs`
- `Матрица выбора`
- `Вопросы перед стартом`

Recommended order for service pages:

1. Hero with core promise and price anchor
2. Diagnostic block
3. Anti-fit block
4. Benefit cards
5. Scope and audience
6. Friction / hidden constraints
7. Decision matrix to adjacent services
8. Quick CTA
9. Steps / outcomes / results
10. Expert block
11. Objection-led FAQ
12. Contact form

Recommended order for hubs:

1. Hero
2. Decision-support block
3. Catalog or content grid
4. Confusion-resolver comparison block
5. Contact / next step

## 7. Information Gain injections

Ten concrete injections for the next wave:

1. Add “когда не покупать эту услугу” examples from sales calls
   Source: sales / CRM

2. Add budget driver cards by scenario: small site, migration, regional rollout, B2B, eCommerce
   Source: pricing / internal scoping

3. Add “что тормозит внедрение чаще всего” blocks
   Source: internal process / support

4. Add “что считать нормой / риском / критичным” benchmarks for audits and migrations
   Source: audit delivery notes

5. Add decision trees: symptom -> best first service
   Source: internal triage process

6. Add objection FAQ from real pre-sale threads
   Source: sales / Telegram / email

7. Add case excerpts framed as problem -> first fix -> structural outcome
   Source: case archives / retrospectives

8. Add local-market nuances for Russia: regional pages, maps, филиалы, call expectations, budget cadence
   Source: local market / current projects

9. Add failure cases where SEO did not start with monthly support
   Source: post-mortem / project history

10. Add simple comparison tables between adjacent services
   Source: internal framework / offer design

## 8. Ready-to-paste blocks

Three H2:

- Когда проекту нужен не “ещё один SEO-месяц”, а новая точка старта
- Какие ограничения сайта сильнее всего режут рост в российской выдаче
- Как выбрать между аудитом, technical SEO, системным SEO и перезапуском сайта

Three H3:

- Признак: трафик есть, заявки слабые
- Почему команда буксует даже при большом объёме задач
- Когда лучше не расширять сайт, а сначала пересобрать каркас

Table:

| Симптом | Что чаще всего скрывается под проблемой | С чего лучше начать |
|---|---|---|
| Позиции растут, а заявок почти нет | Слабая упаковка ключевых страниц, CTA, доверие | SEO-контент или системное SEO |
| После редизайна сайт просел | Сломанные шаблоны, индексация, редиректы, canonical | Technical SEO или аудит |
| Непонятно, почему сайт не растёт | Смешение нескольких проблем без приоритета | SEO-аудит |
| Площадка устарела и дорого меняется | Архитектура мешает расширению, сайт не держит новые разделы | Разработка или перезапуск |

Diagnostic block:

**Как понять, что вам нужен именно этот формат**

Если сайт уже получает показы, но не превращает органику в обращения, проблема часто лежит не в отсутствии “ещё одного ключа”, а в слабой связке между спросом, страницей услуги и сценарием заявки. В этом случае сильнее всего работает не общий monthly retainer “на всё сразу”, а формат, который сначала покажет узкое место: аудит, technical SEO, перепаковка ключевых страниц или перезапуск сайта.

Перед стартом полезно ответить на три вопроса:

- Сайт теряет рост из-за индексации и шаблонов или из-за слабой коммерческой подачи?
- Команда понимает, какой блок сейчас критичен, или спорит между техникой, контентом и структурой?
- Текущая площадка выдерживает расширение, или каждая новая задача превращается в дорогой костыль?

Objection-based FAQ block:

**Вопросы перед стартом**

**Нам точно нужен новый сайт, а не просто SEO?**
Если текущая площадка мешает расширению, слабо презентует услуги и не ведёт к обращению, новый каркас обычно даёт больше эффекта, чем серия косметических правок.

**Можно ли начать не с ежемесячного сопровождения, а с более точного шага?**
Да. Для многих проектов сильнее сначала аудит или technical SEO, чтобы не покупать широкий объём работ до диагностики корневой проблемы.

**Почему вы не предлагаете “всё сразу”?**
Потому что самый дорогой сценарий для бизнеса — одновременно покупать аудит, контент, ссылки и сопровождение без понимания, какой слой реально ограничивает рост именно сейчас.

**Калькулятор показал одну сумму. Почему реальная оценка может отличаться?**
На бюджет сильнее всего влияют архитектура сайта, срочность внедрения, число шаблонных зон, переезд, интеграции и запас под дальнейшее масштабирование.

**Если у нас уже есть подрядчик, что делать?**
В этом случае часто полезнее SEO-консалтинг или аудит: они помогают проверить приоритеты, спорные гипотезы и качество уже предложенного плана без смены всей команды.

## What was implemented

Implemented on 2026-03-25:

- Service template rewritten around diagnosis, anti-fit, friction, and decision-routing
- Homepage reframed around first-step decisions instead of generic service packaging
- Services hub upgraded with adjacent-service comparison logic
- Blog, cases, reviews, contacts, calculator, and tools pages received supporting decision and interpretation blocks
- Service cards now carry `best-fit` triggers instead of only generic descriptions
