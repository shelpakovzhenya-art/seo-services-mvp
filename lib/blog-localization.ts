import { buildBlogListing } from '@/lib/built-in-blog-posts'
import type { Locale } from '@/lib/i18n'
import { containsCyrillic } from '@/lib/text-detection'

export type LocalizableBlogPostRecord = {
  id?: string | number
  slug?: string | null
  title?: string | null
  excerpt?: string | null
  content?: string | null
  coverImage?: string | null
  published?: boolean | null
  publishedAt?: Date | string | null
  updatedAt?: Date | string | null
}

const englishBlogOverrides: Record<string, Partial<LocalizableBlogPostRecord>> = {
  'geo-i-ii-vydacha-kak-poluchat-trafik-v-2026': {
    title: 'GEO and AI search in 2026: how a site can still win traffic from answer-first SERPs',
    excerpt:
      'AI answers do not kill every click equally. The pages that keep traffic are the ones that go beyond a definition and help a person choose a real next step.',
    content: `# GEO and AI search in 2026: how a site can still win traffic from answer-first SERPs

If we simplify the picture, GEO does not take traffic away from every page at the same rate. The first pages to lose are the ones that only repeat a definition, summarize obvious points, or give a generic answer without a practical next step.

Pages hold value when they do more than a short AI response can package. That usually means comparison, trade-offs, diagnosis, local context, and a clear route from information to action.

## Which pages lose clicks first

- thin explainers that only repeat what something is;
- broad blog posts without a symptom-to-solution structure;
- content that never helps the reader choose the next step;
- isolated informational pages that are not connected to services, cases, or conversion paths.

If the entire answer fits into a short paragraph, an AI block can reuse that value without sending a click. That is why "SEO content for volume" is the biggest risk in this environment.

## Which pages keep value next to AI answers

- comparison pages with clear trade-offs;
- diagnostic pages that explain when one approach fails;
- articles with scenarios, examples, and real constraints;
- local or niche-specific pages where generic answers stay too broad;
- pages that connect reading to an audit, service, case, or inquiry.

The page should not compete with AI on speed alone. It should compete on depth, structure, and usefulness for a decision.

## What GEO still takes from a website

Generative search still depends on classic SEO signals:

- understandable site architecture;
- clean indexation and minimal crawl waste;
- strong relationships between service pages, articles, cases, and contact points;
- accurate title, description, H1, and structured blocks;
- a mobile version that stays readable and keeps the path to action clear.

If the site is weak technically or thematically scattered, GEO only exposes that weakness faster.

## What to rebuild first

1. Rewrite first screens of the strongest articles in answer-first format.
2. Add comparison, limitations, and "when this does not fit" blocks.
3. Remove weak articles that dilute the topic without adding value.
4. Strengthen linking between articles, services, and case studies.
5. Start with an [SEO audit](/services/seo-audit) if the problem is larger than content alone.

## Takeaway

In AI-heavy SERPs, content keeps traffic when it helps the search engine build an answer and still gives the user a reason to open the full page. That means less filler, more structure, and a better route from reading to action.`,
  },
  'seo-trendy-2026-chto-rabotaet-segodnya': {
    title: 'SEO trends for 2026: what still works when search gets noisier',
    excerpt:
      'The trend is not a single tactic. The projects that keep growing in 2026 usually win on structure, commercial clarity, technical stability, and useful content systems.',
    content: `# SEO trends for 2026: what still works when search gets noisier

In 2026 the strongest trend is not a new checkbox. It is the same core idea applied more strictly: search rewards projects that are structurally clear, technically stable, commercially trustworthy, and useful beyond one shallow answer.

## What keeps working

### Strong service and category pages

Projects still grow when their key pages are built around real demand clusters rather than broad, overloaded templates.

### Technical hygiene

Indexation problems, duplicate templates, weak internal linking, and bloated structures still slow growth. In noisy SERPs, technical weakness is exposed even faster.

### Commercial clarity

Pages convert better when they answer basic doubts: who is responsible, why trust this company, how to get in touch, and what the next step looks like.

### Useful content systems

The blog works when it supports the service layer, enters earlier demand, and moves the user toward a decision. A blog that lives separately from revenue pages still loses relevance.

## What has weakened

- publishing articles only to increase volume;
- one-page-fits-all structures for many different intents;
- generic SEO checklists detached from business priorities;
- decorative content blocks without any role in conversion.

## What teams should prioritize

1. Identify the 10 to 15 pages that actually influence leads or revenue.
2. Fix structure, templates, and metadata on those pages first.
3. Rebuild service pages before expanding broad informational content.
4. Tie articles to service pages, cases, and commercial paths.
5. Use [technical SEO](/services/technical-seo) or [SEO consulting](/services/seo-consulting) when the bottleneck sits in architecture or implementation quality.

## Takeaway

The winning trend is not novelty. It is execution quality. In 2026, projects outperform when the site is easier to understand for search engines and easier to trust for a user.`,
  },
  'kak-izmerit-effektivnost-seo-i-ai-trafika': {
    title: 'How to measure SEO and AI traffic without fooling yourself',
    excerpt:
      'Looking only at total organic sessions is no longer enough. Good measurement now tracks what pages participate in the route to an inquiry and how demand quality changes over time.',
    content: `# How to measure SEO and AI traffic without fooling yourself

If search behavior changes, the measurement model has to change too. Looking only at total organic traffic is not enough when AI answers absorb some clicks and change what a useful visit looks like.

## What to measure instead of one big traffic number

- which pages still send people deeper into the site;
- which articles participate in paths to inquiries or calls;
- which topics lost raw clicks but improved visit quality;
- which demand clusters now underperform because the page no longer offers enough value.

## Good signs

- fewer visits, but stronger progression to service pages;
- better assisted conversions from articles;
- more time on pages with diagnostic or comparison intent;
- clearer separation between informational, commercial, and supporting content.

## Bad signs

- traffic stays flat, but users stop moving to the next step;
- articles rank, but add no value to inquiries;
- demand is split across weak overlapping pages;
- reporting focuses on visibility while conversion paths stay broken.

## A practical measurement stack

1. Segment pages by role: service, article, case, conversion, supporting.
2. Track assisted conversions and multi-step paths, not only last click.
3. Watch query clusters, not only one blended organic bucket.
4. Review click quality together with [SEO consulting](/services/seo-consulting) or an [SEO audit](/services/seo-audit) when the pattern becomes unclear.

## Takeaway

The goal is not to prove that every page still gets the same number of clicks. The goal is to understand which pages still help the project make money and which pages need to be rebuilt for the new search environment.`,
  },
  'trebovaniya-k-sovremennomu-saitu-dlya-seo-i-konversii': {
    title: 'What a modern website needs for SEO and conversion',
    excerpt:
      'A modern site is not only about design. It has to combine structure, speed, trust, search-readiness, and a clear route from the first visit to the inquiry.',
    content: `# What a modern website needs for SEO and conversion

A modern website is not defined by visual trends alone. For growth, it needs to solve two tasks together: be understandable for search engines and be convincing for the visitor.

## The minimum foundation

- clear architecture with predictable paths between sections;
- strong key templates for services, categories, and conversion pages;
- technical cleanliness: metadata, canonicals, internal links, and indexation logic;
- mobile readability without broken layouts or hidden calls to action;
- commercial trust blocks that explain who stands behind the offer and why it is safe to contact.

## Where old websites usually fail

- the homepage tries to rank for everything at once;
- service pages are thin and interchangeable;
- contact zones are weak or hidden too deep;
- there is no connection between informational content and commercial pages;
- technical debt accumulates after redesigns and partial releases.

## What matters for conversion

The page has to reduce uncertainty. That means clear offer framing, proof, scenarios, pricing logic where possible, and a visible next step.

## What matters for SEO

The site needs search-ready templates, clean crawl logic, internal linking, and content built around actual intent clusters.

## If the base is already outdated

Sometimes the best move is not another cosmetic patch. It is a rebuild through [website development](/services/website-development) with SEO and conversion needs built into the structure from the start.

## Takeaway

A modern website works when design, structure, technical SEO, and commercial logic support each other. If one of those layers is missing, both traffic and conversion suffer.`,
  },
  'kak-podgotovit-sait-k-geo-i-ii-vydache': {
    title: 'How to prepare a website for GEO and AI-driven search',
    excerpt:
      'Preparation for GEO is not about writing “for AI”. It is about making site architecture, page logic, and answer quality strong enough for both search engines and users.',
    content: `# How to prepare a website for GEO and AI-driven search

Preparing a site for GEO does not start with prompt tricks. It starts with the same basics that strong SEO has always required, only with a higher standard for page usefulness.

## The first layer

- clean information architecture;
- pages separated by real intent instead of vague topic overlap;
- strong internal routes between service pages, articles, cases, and contact points;
- technically clean templates and stable indexation.

## The second layer

Pages need to answer more than a definition. The strongest formats usually include:

- comparison;
- conditions and limitations;
- common mistakes;
- scenario-based explanations;
- a clear next step after the answer.

## What to rebuild first

1. Priority service pages that drive money.
2. Articles that already rank but feel too shallow.
3. Thin overlapping pages that blur the topic.
4. Internal linking between informational and commercial layers.

## Where to start if the site is messy

If the structure is already chaotic, start with an [SEO audit](/services/seo-audit). If the content system is the weak point, move next into [SEO content](/services/seo-content). If the whole foundation is outdated, the issue may be deeper than content alone.

## Takeaway

GEO rewards websites that are easier to understand, easier to cite, and still worth clicking. That comes from structure, clarity, and real decision-supporting content, not from AI-themed wording.`,
  },
  'seo-dlya-brand-media-kak-izmerit-polzu': {
    title: 'SEO for brand media: how to measure whether content actually helps the business',
    excerpt:
      'Brand media should not be measured by publication count alone. The useful question is whether the content explains, qualifies, and moves the reader deeper into the site.',
    content: `# SEO for brand media: how to measure whether content actually helps the business

Brand media becomes expensive very quickly if it only produces volume. The right question is not "how many articles did we publish?" but "what role does this content play in the route to demand and trust?"

## Useful roles for brand media

- entering broad informational demand earlier than service pages can;
- explaining difficult topics before the commercial conversation starts;
- building authority and trust;
- sending readers to deeper pages: service pages, case studies, or contact points.

## Weak roles

- articles that duplicate one another without a clear audience stage;
- content that ranks but never supports a next step;
- publication calendars measured only by volume.

## What to track

- assisted conversions from content;
- movement from content to service pages;
- topic clusters that actually support revenue pages;
- whether content improves trust and qualification, not only raw sessions.

## When brand media helps SEO most

It works best when the media layer is connected to the service layer. That means content strategy, internal linking, and commercial destinations have to be planned together.

## Takeaway

Brand media supports SEO and business results when it explains, qualifies, and routes people deeper into the site. When it only increases article count, it becomes a costly archive instead of an asset.`,
  },
  'pereezd-na-novyy-domen-bez-poteri-trafika': {
    title: 'Moving to a new domain without losing SEO: a practical migration plan',
    excerpt:
      'A domain migration is not a minor technical task. It is a separate SEO project with risks for traffic, conversion, and the search equity the site has already built.',
    content: `# Moving to a new domain without losing SEO: a practical migration plan

Changing the domain is often reduced to "set up redirects". In reality, migration is a separate SEO project with direct risk for traffic, leads, and accumulated search equity.

## When migration is justified

- rebranding;
- legal or geographic constraints;
- a domain name that clearly limits the business;
- merging several projects into one structure.

If there is no strong reason, the first step is to measure the risk before moving.

## What to prepare before launch

- a full list of indexable URLs;
- priority pages by traffic, leads, and revenue;
- metadata and canonical references for important templates;
- analytics and webmaster baselines;
- external links pointing to high-value pages.

Without this inventory, teams forget critical URLs and begin solving avoidable problems after launch.

## The biggest migration mistake

The worst outcomes usually come from combining too many changes at once:

- new domain;
- new design;
- new CMS;
- new structure;
- new content logic.

When everything changes together, it becomes much harder to understand what caused the drop.

## Redirect logic

Every important old URL should point to the most relevant new URL through a 301 redirect. Sending everything to the homepage is one of the fastest ways to lose search equity.

## What to check in the first 72 hours

- are legacy URLs returning the right 301 responses;
- are sitemap and robots available;
- are critical pages indexable;
- do forms, contact routes, and commercial blocks still work;
- did the mobile version survive the move.

## When to start with an audit

If the site is large or already has strong search visibility, begin with an [SEO audit](/services/seo-audit). If the move also touches templates, rendering, or crawl logic, [technical SEO](/services/technical-seo) should be part of the plan.

## Takeaway

Migration is not only a change of address. It is the transfer of search equity and the commercial route of the site. Treat it as a structured project, not as a side task, and the risk becomes manageable.`,
  },
}

export function localizeBlogPostRecord<T extends LocalizableBlogPostRecord>(post: T, locale: Locale): T {
  if (locale !== 'en') {
    return post
  }

  const slug = post.slug || ''
  const override = englishBlogOverrides[slug]

  return override ? ({ ...post, ...override } as T) : post
}

export function hasRussianBlogContent(post: LocalizableBlogPostRecord) {
  return [post.title, post.excerpt, post.content].some((value) => containsCyrillic(value))
}

export function buildLocalizedBlogListing<T extends LocalizableBlogPostRecord>(posts: T[], locale: Locale) {
  return buildBlogListing(posts)
    .map((post) => localizeBlogPostRecord(post, locale))
    .filter((post) => (locale === 'en' ? !hasRussianBlogContent(post) : true))
}
