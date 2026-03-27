import type { Locale } from '@/lib/i18n'
import { servicePages, type ServicePageContent } from '@/lib/service-pages'
import { marketExpansionEnServices } from '@/lib/service-market-expansion'

function imageSet(slug: string, heroAlt: string, processAlt: string, resultsAlt: string) {
  return {
    hero: `/services/${slug}/hero.webp`,
    process: `/services/${slug}/process.webp`,
    results: `/services/${slug}/results.webp`,
    heroAlt,
    processAlt,
    resultsAlt,
  }
}

const enServicePages: ServicePageContent[] = [
  {
    slug: 'seo',
    shortName: 'SEO Growth',
    label: 'SEO for sustainable demand capture',
    h1: 'SEO growth for service websites that need leads, not vanity traffic',
    title: 'SEO growth built around leads and organic demand',
    description:
      'An ongoing SEO service for companies that need a clearer structure, stronger key pages, and a search channel that supports real inquiries.',
    intro:
      'This format is useful when the website already has some traction, but the search layer still feels fragmented and underperforms commercially.',
    heroValue:
      'We treat SEO as a growth system: demand mapping, page structure, content logic, technical foundations, and a cleaner path to inquiry.',
    subheading:
      'It is a strong fit for service businesses and B2B websites that need growth without disconnected tasks and random monthly activity.',
    angle: 'Organic growth with commercial intent',
    cardDescription: 'A structured SEO format focused on demand capture, priority pages, and lead quality.',
    cardCta: 'Open service',
    benefits: [
      { title: 'One working system', text: 'Search demand, structure, content, and commercial signals are managed as one roadmap.' },
      { title: 'Priorities before volume', text: 'The team starts with the pages and constraints that affect growth first.' },
      { title: 'Lead-oriented execution', text: 'The work is built around visibility plus conversion, not rankings in isolation.' },
    ],
    audience: [
      'Service websites that already get impressions but lose too much value before inquiry.',
      'B2B projects where the site needs to support trust and a longer decision cycle.',
      'Teams that want a clear SEO rhythm instead of disconnected monthly tasks.',
    ],
    includes: [
      'Demand mapping and review of the current site structure.',
      'Prioritization of technical, structural, and content improvements.',
      'Work on key service pages, internal linking, snippets, and trust blocks.',
      'A repeatable plan for expanding search coverage without creating noise.',
    ],
    steps: [
      { title: 'Audit the current state', text: 'We review demand, templates, key pages, and the current path to inquiry.' },
      { title: 'Set priorities', text: 'The first roadmap separates urgent blockers from work that can wait.' },
      { title: 'Improve the key layer', text: 'Core pages, structure, and supporting content are strengthened around actual demand.' },
      { title: 'Measure and extend', text: 'We review impact, refine the plan, and add the next growth layer.' },
    ],
    outcomes: [
      'A cleaner structure around core services and demand clusters.',
      'Stronger key pages that support both search visibility and trust.',
      'A more predictable organic channel with fewer wasted actions.',
    ],
    results: [
      { title: 'Better search coverage', text: 'The site captures more demand through clearer entry pages and stronger topic structure.' },
      { title: 'Higher commercial relevance', text: 'Traffic lands on pages that are closer to inquiry and easier to understand.' },
      { title: 'A steadier roadmap', text: 'The team gets a practical implementation sequence instead of scattered SEO ideas.' },
    ],
    faq: [
      {
        question: 'When is ongoing SEO the right choice?',
        answer:
          'When the site already works as a business asset but still needs stronger structure, priority pages, and a regular growth cadence.',
      },
      {
        question: 'Do you focus only on rankings?',
        answer: 'No. Rankings matter, but the real goal is a better path from search demand to qualified inquiry.',
      },
      {
        question: 'Can this start after an audit?',
        answer: 'Yes. Many projects begin with an audit and then move into ongoing SEO once priorities are clear.',
      },
    ],
    seoBlockTitle: 'Why SEO works best as a system, not a monthly checklist',
    seoParagraphs: [
      'Most sites do not underperform because one meta tag is wrong. They underperform because structure, key pages, trust, and technical foundations are disconnected.',
      'A stronger SEO system ties those layers together and makes the site easier to grow without constant rework.',
    ],
    ctas: {
      soft: 'Talk through the SEO format',
      rational: 'Get a practical SEO starting point',
      fast: 'Discuss the project today',
    },
    related: ['seo-audit', 'technical-seo', 'seo-content', 'website-development'],
    images: imageSet('seo', 'SEO growth concept for a service website', 'SEO workflow from diagnosis to implementation', 'Expected SEO results for traffic and lead quality'),
  },
  {
    slug: 'seo-audit',
    shortName: 'SEO Audit',
    label: 'Priority-focused site diagnosis',
    h1: 'SEO audit that turns website problems into a practical implementation plan',
    title: 'SEO audit with priorities, evidence, and a clear next step',
    description:
      'A practical SEO audit for teams that need to understand what blocks growth now and what should be fixed first.',
    intro:
      'This format is useful when the site has multiple symptoms and the team needs a real priority map instead of another generic checklist.',
    heroValue:
      'The goal is not just to collect issues. The goal is to show where visibility, trust, and conversion are being lost and how to act on it.',
    subheading:
      'A good audit helps the team stop guessing between technical fixes, structure changes, and content work.',
    angle: 'Diagnosis before wider implementation',
    cardDescription: 'A structured audit for teams that need evidence, priorities, and a cleaner implementation sequence.',
    cardCta: 'Open service',
    benefits: [
      { title: 'Clear priorities', text: 'Issues are separated into urgent blockers, next-wave tasks, and secondary items.' },
      { title: 'Business context', text: 'The review connects technical and structural issues to demand capture and lead flow.' },
      { title: 'Ready for execution', text: 'The output is usable by marketing, development, and the business owner.' },
    ],
    audience: [
      'Projects that have already tried SEO but still lack a clear explanation for weak results.',
      'Teams preparing a redesign, migration, or SEO relaunch and wanting fewer blind spots.',
      'Companies that need a first step before committing to broader work.',
    ],
    includes: [
      'Review of indexation, templates, snippets, and structural weak spots.',
      'Assessment of key service pages, trust signals, and next-step clarity.',
      'A prioritized action plan with examples and implementation notes.',
      'A practical explanation of what to fix now and what can wait.',
    ],
    steps: [
      { title: 'Collect site evidence', text: 'We review technical signals, templates, key pages, and demand structure.' },
      { title: 'Separate causes from symptoms', text: 'The audit shows what is fundamental and what is only background noise.' },
      { title: 'Package the findings', text: 'The output is organized for the people who actually have to implement it.' },
      { title: 'Align the next move', text: 'After the audit, it becomes clear whether the project needs SEO, technical work, or a rebuild.' },
    ],
    outcomes: [
      'A clearer picture of what blocks growth the most.',
      'A usable roadmap for implementation across teams.',
      'More confidence in choosing the right next service.',
    ],
    results: [
      { title: 'Less waste at the start', text: 'The team spends less time on secondary fixes and more on the real blockers.' },
      { title: 'Cleaner communication', text: 'Owners, marketing, and development get the same priority map.' },
      { title: 'A better next decision', text: 'The project can move into execution with fewer assumptions and fewer false starts.' },
    ],
    faq: [
      {
        question: 'How is this different from ongoing SEO?',
        answer: 'An audit is a diagnostic phase. It defines the right priorities before any ongoing work begins.',
      },
      {
        question: 'Will the audit be usable by our team?',
        answer: 'Yes. The output is designed to be shared with development, marketing, and decision-makers without heavy rework.',
      },
      {
        question: 'Can we start with an audit only?',
        answer: 'Yes. For many projects, that is the safest way to understand the current state before choosing the next format.',
      },
    ],
    seoBlockTitle: 'Why a priority-first audit is often the best first move',
    seoParagraphs: [
      'When the site has many symptoms, broad execution often wastes time because the team still does not know what matters most.',
      'A strong audit shortens that uncertainty and turns a fuzzy problem into a concrete roadmap.',
    ],
    ctas: {
      soft: 'Discuss the audit format',
      rational: 'Get a priority-first audit plan',
      fast: 'Review the site this week',
    },
    related: ['technical-seo', 'seo', 'seo-consulting', 'website-development'],
    images: imageSet('seo-audit', 'SEO audit overview and priority map', 'SEO audit workflow for teams and implementation', 'Audit output focused on fixes and priorities'),
  },
  {
    slug: 'technical-seo',
    shortName: 'Technical SEO',
    label: 'Technical stability for organic growth',
    h1: 'Technical SEO for websites held back by indexation, templates, and architecture',
    title: 'Technical SEO for clean indexation and scalable site architecture',
    description:
      'A technical SEO format for websites struggling with templates, duplicate logic, migrations, filters, or unstable indexation.',
    intro:
      'This service is most useful when the main blocker is not messaging, but the platform and the search-facing technical layer.',
    heroValue:
      'The work focuses on indexation quality, template behavior, URL logic, and technical consistency across the site.',
    subheading:
      'It is a fit for projects where growth keeps breaking against architecture, template noise, or post-migration instability.',
    angle: 'Fix the technical base before scaling',
    cardDescription: 'Technical work for indexation, template logic, and scalable site architecture.',
    cardCta: 'Open service',
    benefits: [
      { title: 'Cleaner indexation', text: 'Search engines spend less attention on noise and more on priority pages.' },
      { title: 'Safer scaling', text: 'The site becomes easier to grow without multiplying duplicate or low-value URLs.' },
      { title: 'Fewer hidden blockers', text: 'Template and architecture issues are addressed before they absorb more SEO effort.' },
    ],
    audience: [
      'Sites with large template footprints, filters, service combinations, or repeated URL issues.',
      'Projects recovering from redesigns, migrations, or unstable technical releases.',
      'Teams that need technical SEO guidance tied to implementation reality.',
    ],
    includes: [
      'Review of crawling, indexation, URL logic, and major technical signals.',
      'Analysis of template behavior, canonical logic, sitemaps, and duplicate generation.',
      'Implementation guidance with examples and post-fix verification priorities.',
      'A clearer split between urgent technical risk and secondary cleanup.',
    ],
    steps: [
      { title: 'Find the root blocker', text: 'We determine whether the loss comes from indexation, templates, migrations, or architecture.' },
      { title: 'Prioritize the technical layer', text: 'Critical technical fixes are separated from cosmetic SEO noise.' },
      { title: 'Support implementation', text: 'The technical plan is framed so development can apply it safely.' },
      { title: 'Verify the outcome', text: 'After fixes, the site is checked again for residual template and indexation issues.' },
    ],
    outcomes: [
      'A cleaner and more predictable search-facing technical layer.',
      'Less crawl waste and fewer duplicate or misleading URLs.',
      'A safer base for future SEO, content, and structure work.',
    ],
    results: [
      { title: 'Technical stability', text: 'Key pages become easier to index and less likely to compete with noise.' },
      { title: 'Higher implementation confidence', text: 'Teams know which technical fixes matter most and why.' },
      { title: 'Better readiness for growth', text: 'The site can be expanded more safely after the core architecture is cleaned up.' },
    ],
    faq: [
      {
        question: 'When should technical SEO come before content work?',
        answer: 'When the site is unstable, noisy, or poorly indexed, content alone cannot compensate for the technical bottleneck.',
      },
      {
        question: 'Do we need developers for this service?',
        answer: 'In many cases, yes. The service is designed to help developers work on the right issues in the right order.',
      },
      {
        question: 'Is this only for large websites?',
        answer: 'No. Even smaller sites can lose growth when architecture, templates, or migrations are handled badly.',
      },
    ],
    seoBlockTitle: 'Why technical SEO matters even when the problem looks content-related',
    seoParagraphs: [
      'Some projects keep trying to fix visibility through content while the real issue sits in templates, indexation, or architecture.',
      'A cleaner technical base gives the rest of the SEO stack a chance to work as intended.',
    ],
    ctas: {
      soft: 'Discuss the technical scope',
      rational: 'Get a technical SEO starting point',
      fast: 'Review the technical state now',
    },
    related: ['seo-audit', 'seo', 'website-development', 'ecommerce-seo'],
    images: imageSet('technical-seo', 'Technical SEO architecture and indexation concept', 'Technical SEO workflow for implementation', 'Technical SEO results for cleaner indexation and scale'),
  },
  {
    slug: 'local-seo',
    shortName: 'Local SEO',
    label: 'Search visibility for city and service demand',
    h1: 'Local SEO for service businesses that depend on regional search demand',
    title: 'Local SEO for city-based demand, trust, and inquiries',
    description:
      'A local SEO format for businesses that need stronger city-level visibility, clearer landing pages, and a better route from search to inquiry.',
    intro:
      'This is most useful when geography matters to the user and the site needs more than a generic service page to compete.',
    heroValue:
      'The work connects local demand, regional pages, contacts, trust signals, and search-facing structure into one practical layer.',
    subheading:
      'It fits clinics, local services, branch-based businesses, and projects where the route to inquiry is tied to the city or location.',
    angle: 'Regional visibility with commercial clarity',
    cardDescription: 'Local SEO for city-level demand, regional landing pages, and a cleaner path to inquiry.',
    cardCta: 'Open service',
    benefits: [
      { title: 'Stronger local relevance', text: 'The website becomes clearer for city-based demand and service intent.' },
      { title: 'Better trust signals', text: 'Contacts, branch logic, and local evidence support the decision to inquire.' },
      { title: 'More precise entry pages', text: 'Users land on pages that match the location and the task better.' },
    ],
    audience: [
      'Businesses with offices, branches, or a real city-based service footprint.',
      'Local service projects where one broad page cannot cover all relevant regional intent.',
      'Teams that need a practical regional structure without low-quality geo-spam.',
    ],
    includes: [
      'Review of local demand, pages, and branch or city logic.',
      'Recommendations for regional landing pages, trust signals, and contact consistency.',
      'Guidance on local structure, internal linking, and demand coverage.',
      'A cleaner route from local search to booking, call, or inquiry.',
    ],
    steps: [
      { title: 'Map local demand', text: 'We identify where the site needs separate regional pages and where one page is enough.' },
      { title: 'Strengthen the local layer', text: 'Location logic, trust elements, and entry pages are reorganized around real demand.' },
      { title: 'Connect search and inquiry', text: 'The path from local query to action becomes easier and clearer.' },
      { title: 'Expand carefully', text: 'The regional layer grows where it brings value, not where it creates empty page volume.' },
    ],
    outcomes: [
      'A clearer city-based structure around core services.',
      'Stronger local relevance and trust for nearby users.',
      'A more practical route from search demand to inquiry.',
    ],
    results: [
      { title: 'Better local coverage', text: 'Important regional queries gain stronger landing pages and clearer context.' },
      { title: 'More useful local pages', text: 'Regional pages support real decisions instead of acting as thin copies.' },
      { title: 'Higher inquiry readiness', text: 'The site feels more credible and easier to act on for local users.' },
    ],
    faq: [
      {
        question: 'Do all cities need separate pages?',
        answer:
          'No. Separate pages help only where there is real demand, distinct local context, and enough value to justify them.',
      },
      {
        question: 'Is local SEO only about maps and listings?',
        answer: 'No. The website itself still needs stronger local structure, trust, and a clearer route to inquiry.',
      },
      {
        question: 'Can this work for one city only?',
        answer: 'Yes. Even a single-city business often needs a more intentional local demand structure.',
      },
    ],
    seoBlockTitle: 'Why local SEO is more than adding city names to pages',
    seoParagraphs: [
      'The strongest local pages combine relevance, trust, and a clear next step. Geography alone is not enough.',
      'A local SEO layer works best when it supports real user intent instead of producing shallow regional copies.',
    ],
    ctas: {
      soft: 'Discuss local SEO',
      rational: 'Get a local SEO starting point',
      fast: 'Review the regional structure today',
    },
    related: ['seo-audit', 'seo', 'website-development', 'seo-content'],
    images: imageSet('local-seo', 'Local SEO visibility concept for city demand', 'Local SEO workflow from demand mapping to implementation', 'Local SEO results for visibility and inquiries'),
  },
  {
    slug: 'ecommerce-seo',
    shortName: 'eCommerce SEO',
    label: 'SEO for catalog and category growth',
    h1: 'eCommerce SEO for stores growing through categories, filters, and product templates',
    title: 'eCommerce SEO for scalable catalog growth',
    description:
      'An SEO format for online stores that need cleaner catalog structure, better category coverage, and safer template logic.',
    intro:
      'This service is meant for stores where the real SEO challenge lives in categories, filters, and catalog architecture.',
    heroValue:
      'The work focuses on scalable search coverage without losing control of template quality, indexation, or user navigation.',
    subheading:
      'It fits catalogs and stores that need to grow beyond a few winning sections without turning filters into SEO noise.',
    angle: 'Catalog scale with cleaner architecture',
    cardDescription: 'SEO for categories, filters, products, and catalog structure at scale.',
    cardCta: 'Open service',
    benefits: [
      { title: 'Scalable category growth', text: 'Search coverage expands through stronger category and subcategory logic.' },
      { title: 'Safer filter handling', text: 'Useful combinations are separated from noise and duplicate-heavy pages.' },
      { title: 'Better catalog quality', text: 'Templates support both indexation and real product discovery.' },
    ],
    audience: [
      'Stores with large or growing catalogs that need a more deliberate SEO architecture.',
      'Projects losing visibility because filters, categories, or cards are poorly structured.',
      'Teams that need SEO tied to catalog scale rather than single-page optimization.',
    ],
    includes: [
      'Review of categories, filters, product templates, and indexation behavior.',
      'Recommendations for scalable catalog structure and search entry points.',
      'Priorities for product, category, and template-level improvements.',
      'Guidance on balancing coverage, clean architecture, and conversion logic.',
    ],
    steps: [
      { title: 'Audit the catalog logic', text: 'We review where the store wins, where it creates noise, and where coverage is missing.' },
      { title: 'Restructure key templates', text: 'Categories, filters, and important product flows are prioritized first.' },
      { title: 'Clarify indexation rules', text: 'Indexable combinations are separated from technical clutter.' },
      { title: 'Grow with control', text: 'The catalog expands more safely with fewer duplicate and thin-page risks.' },
    ],
    outcomes: [
      'A cleaner catalog structure for organic growth.',
      'Better search entry points through categories and product logic.',
      'More control over scale, templates, and indexation noise.',
    ],
    results: [
      { title: 'Stronger category visibility', text: 'Important categories gain better coverage and clearer search intent alignment.' },
      { title: 'Less filter noise', text: 'The index contains fewer low-value combinations and more purposeful entry pages.' },
      { title: 'A better growth base', text: 'The store becomes easier to expand without multiplying search problems.' },
    ],
    faq: [
      {
        question: 'Is this mainly about products or categories?',
        answer:
          'Usually both. The main challenge is how category logic, product templates, and indexation work together at scale.',
      },
      {
        question: 'Do filters always need to be indexed?',
        answer: 'No. Some combinations deserve search visibility, others only create technical and commercial noise.',
      },
      {
        question: 'Can this work for a mid-size store too?',
        answer: 'Yes. A store does not have to be huge before category and template logic start limiting growth.',
      },
    ],
    seoBlockTitle: 'Why store growth depends on architecture as much as on content',
    seoParagraphs: [
      'Many stores lose search growth because the catalog is not organized around demand and useful entry points.',
      'The stronger the catalog architecture, the easier it is to scale categories, filters, and product templates safely.',
    ],
    ctas: {
      soft: 'Discuss eCommerce SEO',
      rational: 'Get a catalog SEO starting point',
      fast: 'Review the store structure today',
    },
    related: ['technical-seo', 'seo-audit', 'website-development', 'seo-content'],
    images: imageSet('ecommerce-seo', 'eCommerce SEO concept for categories and filters', 'eCommerce SEO workflow for catalog structure', 'eCommerce SEO results for catalog growth'),
  },
  {
    slug: 'b2b-seo',
    shortName: 'B2B SEO',
    label: 'SEO for complex services and longer sales cycles',
    h1: 'B2B SEO for companies that need search visibility plus trust and qualification',
    title: 'B2B SEO for service pages, trust, and qualified demand',
    description:
      'An SEO format for complex services where the website has to educate, qualify, and support a longer buying process.',
    intro:
      'This format is useful when traffic volume alone does not matter and the real challenge is better-fit demand and stronger trust.',
    heroValue:
      'The work focuses on service architecture, expertise presentation, trust-building pages, and a clearer route to a qualified conversation.',
    subheading:
      'It suits expert services, production, integrators, and B2B websites where the site must support a longer decision cycle.',
    angle: 'Qualified demand instead of raw traffic',
    cardDescription: 'SEO for complex services where trust, structure, and qualification matter more than volume alone.',
    cardCta: 'Open service',
    benefits: [
      { title: 'More qualified demand', text: 'The site attracts users closer to the right use case and budget fit.' },
      { title: 'Stronger trust layer', text: 'Pages explain capability, process, and proof more clearly.' },
      { title: 'Better alignment with sales', text: 'Search traffic supports a real business conversation instead of loose interest.' },
    ],
    audience: [
      'B2B companies with long evaluation cycles and complex service delivery.',
      'Sites where expertise and trust matter as much as visibility itself.',
      'Teams that need SEO tied to pipeline quality, not just traffic volume.',
    ],
    includes: [
      'Review of service architecture, demand structure, and buyer paths.',
      'Improvements to key service pages, expertise signals, and supporting content.',
      'Recommendations for content and structure that help qualify demand.',
      'A clearer route from search visibility to contact or sales conversation.',
    ],
    steps: [
      { title: 'Map the decision journey', text: 'We look at how search demand connects to trust, proof, and the next commercial step.' },
      { title: 'Strengthen the core pages', text: 'Service pages and supporting materials are improved around buyer intent.' },
      { title: 'Filter and qualify demand', text: 'The site becomes clearer about fit, constraints, and use cases.' },
      { title: 'Support long-cycle growth', text: 'SEO, content, and service architecture work together more predictably.' },
    ],
    outcomes: [
      'A clearer service architecture for complex buyer journeys.',
      'More trust and qualification in the search-facing layer.',
      'Better alignment between SEO activity and sales value.',
    ],
    results: [
      { title: 'Better-fit inquiries', text: 'The site does a stronger job of attracting and preparing the right audience.' },
      { title: 'Stronger service pages', text: 'Pages explain expertise, process, and commercial reality more clearly.' },
      { title: 'A more useful content layer', text: 'Content supports the longer decision path instead of acting as disconnected traffic bait.' },
    ],
    faq: [
      {
        question: 'How is this different from standard SEO?',
        answer: 'The emphasis is stronger on qualification, trust, use cases, and supporting a longer sales process.',
      },
      {
        question: 'Does this still include technical and structural work?',
        answer: 'Yes. The difference is that those improvements are prioritized around qualified demand and complex service pages.',
      },
      {
        question: 'Is this only for enterprise companies?',
        answer: 'No. It is useful for any project where the service is complex and the site needs to guide a slower buying decision.',
      },
    ],
    seoBlockTitle: 'Why B2B SEO needs stronger meaning, not just more traffic',
    seoParagraphs: [
      'In B2B, the site rarely wins because of search volume alone. It wins when the right people understand the offer and trust the next step.',
      'That is why structure, proof, and qualification matter as much as rankings in this format.',
    ],
    ctas: {
      soft: 'Discuss B2B SEO',
      rational: 'Get a B2B SEO starting point',
      fast: 'Review the site and demand now',
    },
    related: ['seo', 'seo-audit', 'seo-content', 'seo-consulting'],
    images: imageSet('b2b-seo', 'B2B SEO concept for qualified demand', 'B2B SEO workflow for service pages and trust', 'B2B SEO results for qualified inquiries'),
  },
  ...marketExpansionEnServices,
]

const enServicePageMap = new Map(enServicePages.map((service) => [service.slug, service] as const))

export function getLocalizedServicePage(slug: string, locale: Locale) {
  return locale === 'en' ? enServicePageMap.get(slug) || null : servicePages.find((service) => service.slug === slug) || null
}

export function getLocalizedServicePages(locale: Locale) {
  return locale === 'en' ? enServicePages : servicePages
}
