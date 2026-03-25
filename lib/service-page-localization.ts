import type { Locale } from '@/lib/i18n'
import { getLocalizedServicePage, getLocalizedServicePages } from '@/lib/localized-service-pages'
import { getServicePage, servicePages, type ServicePageContent } from '@/lib/service-pages'

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

const extraEnglishServicePages: ServicePageContent[] = [
  {
    slug: 'seo-content',
    shortName: 'SEO Content',
    label: 'Content built around demand and page intent',
    h1: 'SEO content for service pages, articles, and search scenarios that need clearer intent coverage',
    title: 'SEO content for stronger service pages and supporting articles',
    description:
      'A content format for teams that need more than rewritten paragraphs: stronger page logic, clearer demand coverage, and content that helps the site move users toward inquiry.',
    intro:
      'This service is useful when the site already has pages, but they are weak at explaining the offer, matching intent, or supporting search growth.',
    heroValue:
      'The work focuses on content architecture first: what each page should do, which questions it should answer, and how it should connect to nearby pages.',
    subheading:
      'It is a fit for service sites, expert projects, and content hubs where weak pages limit both visibility and conversion.',
    angle: 'Demand-focused page content',
    cardDescription: 'Content work for service pages, articles, and supporting materials tied to real search intent.',
    cardCta: 'Open service',
    benefits: [
      { title: 'Pages with a job to do', text: 'Each page is rebuilt around a clearer role in search and in the route toward inquiry.' },
      { title: 'Less filler, more meaning', text: 'The goal is not bulk text. The goal is a cleaner response to what the user actually needs.' },
      { title: 'Content that supports structure', text: 'Articles, service pages, and supporting assets work together instead of competing for attention.' },
    ],
    audience: [
      'Service websites where the core pages feel thin, generic, or too similar to competitors.',
      'Projects that need a clearer content layer around articles, FAQs, and supporting demand clusters.',
      'Teams that want content tied to page structure and business goals rather than isolated copywriting.',
    ],
    includes: [
      'Review of page intent, weak spots, and structural content gaps.',
      'Recommendations for service-page copy, article roles, and supporting page logic.',
      'Content outlines or rewrites built around search intent and commercial clarity.',
      'A cleaner link between articles, service pages, and the next user action.',
    ],
    steps: [
      { title: 'Map page intent', text: 'We define what each page needs to answer, prove, and guide the user toward.' },
      { title: 'Rebuild the message layer', text: 'The page structure, blocks, and copy are updated around demand and clarity.' },
      { title: 'Connect nearby pages', text: 'Service pages, articles, and supporting content are linked into a cleaner system.' },
      { title: 'Refine and extend', text: 'After the strongest pages improve, the same logic is applied to the next layer.' },
    ],
    outcomes: [
      'Stronger page copy built around search intent and decision support.',
      'A more useful content layer across services, articles, and supporting materials.',
      'Less generic text and more commercially relevant pages.',
    ],
    results: [
      { title: 'Clearer service pages', text: 'Users and search engines get a more direct answer instead of vague or overloaded copy.' },
      { title: 'Better content structure', text: 'Supporting articles and FAQs strengthen the site instead of floating as separate pieces.' },
      { title: 'A stronger route to inquiry', text: 'Pages help the user move forward with more confidence and less friction.' },
    ],
    faq: [
      {
        question: 'Is this only copywriting?',
        answer: 'No. The service is about page logic and demand coverage first, and writing second.',
      },
      {
        question: 'Do articles matter if we mainly care about service pages?',
        answer: 'Yes, when they support earlier-stage demand and help connect users back to the right service page.',
      },
      {
        question: 'Can this improve existing pages without rebuilding the whole site?',
        answer: 'Yes. In many cases, the strongest next move is rebuilding the page layer before touching the broader architecture.',
      },
    ],
    seoBlockTitle: 'Why content works better when it follows intent, not just keywords',
    seoParagraphs: [
      'Most weak pages do not fail because they lack volume. They fail because they do not answer the right question clearly enough.',
      'A stronger content system makes pages easier to rank, easier to understand, and easier to act on.',
    ],
    ctas: {
      soft: 'Discuss the content format',
      rational: 'Get a content-first plan',
      fast: 'Review the page layer today',
    },
    related: ['seo', 'seo-audit', 'b2b-seo', 'website-development'],
    images: imageSet('seo-content', 'SEO content planning for service pages', 'SEO content workflow from intent to implementation', 'SEO content results for stronger pages and demand coverage'),
  },
  {
    slug: 'link-building',
    shortName: 'Link Building',
    label: 'Authority growth around priority pages',
    h1: 'Link building for websites that need external authority tied to the right pages',
    title: 'Link building aligned with page priorities and SEO structure',
    description:
      'A link building format focused on supporting the pages that actually matter, instead of buying scattered placements with weak strategic value.',
    intro:
      'This is most useful when the site already has a working base and the next step is strengthening authority around priority service or category pages.',
    heroValue:
      'The main goal is not link volume. It is stronger support for the URLs and demand clusters that deserve additional authority.',
    subheading:
      'It fits projects that already understand which pages matter most and want external signals tied to that structure.',
    angle: 'Authority with page-level priorities',
    cardDescription: 'External authority work built around priority URLs, themes, and a cleaner SEO logic.',
    cardCta: 'Open service',
    benefits: [
      { title: 'Priority before volume', text: 'Placements support the URLs that matter most instead of scattering value across the site.' },
      { title: 'Cleaner strategic fit', text: 'Link activity is connected to demand, page strength, and the actual SEO roadmap.' },
      { title: 'Less random placement waste', text: 'The work focuses on relevance and usefulness, not just on buying inventory.' },
    ],
    audience: [
      'Projects with a stable SEO base that now need stronger authority around key pages.',
      'Service sites or B2B projects where a few priority URLs matter more than broad link volume.',
      'Teams that want link work tied to strategy instead of treated as a separate checkbox.',
    ],
    includes: [
      'Review of priority URLs and the current SEO structure.',
      'Recommendations for what deserves authority support first.',
      'A link-building plan tied to page goals, themes, and growth logic.',
      'Monitoring of how external work fits into the broader SEO roadmap.',
    ],
    steps: [
      { title: 'Define the priority layer', text: 'We choose the pages and themes that are worth supporting first.' },
      { title: 'Align link logic', text: 'External work is matched to page roles, search demand, and SEO priorities.' },
      { title: 'Launch the placements', text: 'The plan moves from theory into placements with a cleaner strategic fit.' },
      { title: 'Review and adjust', text: 'Further work is refined around what the site still needs most.' },
    ],
    outcomes: [
      'A clearer plan for which pages deserve authority support.',
      'More relevant link work around priority services or landing pages.',
      'A stronger relationship between external authority and site growth.',
    ],
    results: [
      { title: 'Better support for key URLs', text: 'Important pages gain external signals that make sense for their strategic role.' },
      { title: 'Less wasted budget', text: 'The work stays focused on useful placements instead of random coverage.' },
      { title: 'Stronger SEO alignment', text: 'Link building becomes part of the roadmap, not a disconnected monthly task.' },
    ],
    faq: [
      {
        question: 'Should link building start before the pages are ready?',
        answer: 'Usually no. The strongest results come when the target pages already deserve the extra authority.',
      },
      {
        question: 'Is this only for large sites?',
        answer: 'No. Even smaller projects can benefit when a few priority URLs are commercially important.',
      },
      {
        question: 'Do links replace technical or content work?',
        answer: 'No. External authority works best after the site already has a cleaner structure and stronger pages.',
      },
    ],
    seoBlockTitle: 'Why link building works best after the page strategy is clear',
    seoParagraphs: [
      'External signals help most when they strengthen the URLs that are already important to demand capture and inquiry quality.',
      'Without that focus, link building often turns into expensive noise.',
    ],
    ctas: {
      soft: 'Discuss link building',
      rational: 'Get a page-priority link plan',
      fast: 'Review the authority layer now',
    },
    related: ['seo', 'seo-audit', 'seo-content', 'b2b-seo'],
    images: imageSet('link-building', 'Link building strategy for priority service pages', 'Link building workflow tied to page priorities', 'Link building results for stronger authority support'),
  },
  {
    slug: 'seo-consulting',
    shortName: 'SEO Consulting',
    label: 'Strategic support and decision quality',
    h1: 'SEO consulting for teams that need sharper priorities, stronger decisions, and a clearer growth frame',
    title: 'SEO consulting for strategy, prioritization, and expert review',
    description:
      'A consulting format for teams that can execute internally, but need stronger guidance on priorities, tradeoffs, and SEO decision quality.',
    intro:
      'This is useful when the main problem is not a lack of people, but a lack of clarity around what should happen first and why.',
    heroValue:
      'The work helps the team make better decisions around structure, content, technical priorities, migrations, and search growth tradeoffs.',
    subheading:
      'It fits internal teams, product owners, and companies that want expert support without handing the whole process to an outside executor.',
    angle: 'Strategic support without production overhead',
    cardDescription: 'SEO consulting for prioritization, team support, and higher-quality project decisions.',
    cardCta: 'Open service',
    benefits: [
      { title: 'Sharper priorities', text: 'The team gets a clearer view of what matters first and what can wait.' },
      { title: 'Better decision quality', text: 'Strategy discussions become more practical and less opinion-driven.' },
      { title: 'Support without replacement', text: 'Consulting strengthens the internal team instead of replacing it.' },
    ],
    audience: [
      'Companies with internal marketing, product, or development teams.',
      'Projects that need expert review of current SEO plans and assumptions.',
      'Teams that want better control over contractors, priorities, and strategic direction.',
    ],
    includes: [
      'Review of the current SEO plan, backlog, or active discussions.',
      'Expert input on structure, migrations, content, and technical tradeoffs.',
      'Priority recommendations for the next implementation stage.',
      'Support in evaluating ideas, vendors, and conflicting internal directions.',
    ],
    steps: [
      { title: 'Review the current frame', text: 'We look at the roadmap, blockers, and decisions the team is struggling with now.' },
      { title: 'Separate signal from noise', text: 'The goal is to identify what is strategic and what is only distracting effort.' },
      { title: 'Support key decisions', text: 'The team gets a stronger frame for choosing the next move with more confidence.' },
      { title: 'Stay aligned over time', text: 'Consulting can continue as a regular strategic layer while the team executes.' },
    ],
    outcomes: [
      'More confidence in the next SEO and website decisions.',
      'A clearer relationship between strategy, resources, and execution.',
      'Less wasted effort from scattered or weakly framed initiatives.',
    ],
    results: [
      { title: 'A stronger roadmap', text: 'The project moves with more clarity and fewer conflicting directions.' },
      { title: 'Higher-quality execution', text: 'Implementation improves when the team understands the purpose behind each move.' },
      { title: 'Better vendor and backlog control', text: 'Consulting helps judge recommendations before they become expensive work.' },
    ],
    faq: [
      {
        question: 'How is this different from ongoing SEO?',
        answer: 'Consulting focuses on strategic support and review, while ongoing SEO includes more direct execution ownership.',
      },
      {
        question: 'Is this useful if we already have an SEO specialist?',
        answer: 'Yes. Consulting is often most useful as expert support for an internal specialist or team lead.',
      },
      {
        question: 'Can this be limited to a short project phase?',
        answer: 'Yes. Some teams use consulting around migrations, relaunches, or specific decision-heavy periods only.',
      },
    ],
    seoBlockTitle: 'Why consulting matters when the team can execute but still lacks clarity',
    seoParagraphs: [
      'Execution speed does not help much when the project keeps choosing the wrong direction.',
      'Consulting brings an expert frame for prioritization, review, and tradeoffs so the team can move with more confidence.',
    ],
    ctas: {
      soft: 'Discuss SEO consulting',
      rational: 'Get a consulting engagement outline',
      fast: 'Review the project decisions now',
    },
    related: ['seo-audit', 'seo', 'b2b-seo', 'technical-seo'],
    images: imageSet('seo-consulting', 'SEO consulting for strategic support and prioritization', 'SEO consulting workflow for team decisions', 'SEO consulting results for roadmap clarity and control'),
  },
  {
    slug: 'website-development',
    shortName: 'Website Development',
    label: 'A stronger site foundation for growth and lead generation',
    h1: 'Website development for service businesses that need a stronger base for SEO, clarity, and inquiries',
    title: 'Website development built around structure, trust, and future growth',
    description:
      'A website development format for projects where the current platform now limits SEO, service presentation, conversion, or further expansion.',
    intro:
      'This is useful when the issue is not one broken template, but the whole site foundation: structure, page logic, trust blocks, and the route toward inquiry.',
    heroValue:
      'The goal is to launch a site that is easier to grow, easier to understand, and more prepared for SEO and future content expansion from the start.',
    subheading:
      'It fits service websites, expert projects, and relaunches where the old site has become a ceiling rather than a base.',
    angle: 'Rebuild the foundation, not just the surface',
    cardDescription: 'Website development for stronger structure, service presentation, and growth readiness.',
    cardCta: 'Open service',
    benefits: [
      { title: 'A better growth base', text: 'The site is designed to support future SEO, content, and landing-page expansion.' },
      { title: 'Stronger page logic', text: 'Services, trust, and CTAs are organized into a clearer route toward inquiry.' },
      { title: 'Fewer structural dead ends', text: 'The platform and templates are built to reduce expensive rework later.' },
    ],
    audience: [
      'Projects where the current site architecture blocks further SEO and commercial improvements.',
      'Businesses preparing a relaunch, service expansion, or stronger lead-generation site.',
      'Teams that want a new site not for design alone, but for structure and growth readiness.',
    ],
    includes: [
      'Review of the current site limitations and the growth requirements of the next version.',
      'Planning of structure, priority pages, trust blocks, and conversion routes.',
      'Development of a cleaner platform and page system for future expansion.',
      'A stronger base for SEO, content, cases, and service-page growth after launch.',
    ],
    steps: [
      { title: 'Define the new frame', text: 'We decide what the next site has to support in terms of pages, trust, and growth.' },
      { title: 'Design the page system', text: 'Structure and templates are planned around service presentation and lead flow.' },
      { title: 'Build the new platform', text: 'The site is developed as a working base, not just a visual refresh.' },
      { title: 'Launch with room to grow', text: 'The result is prepared for future SEO, content, and structural expansion.' },
    ],
    outcomes: [
      'A clearer website structure for services, trust, and inquiry flow.',
      'A platform that is easier to extend with SEO and content later.',
      'Less dependency on constant structural workarounds.',
    ],
    results: [
      { title: 'Better service presentation', text: 'Pages explain the offer, context, and next action more clearly.' },
      { title: 'A stronger route to inquiry', text: 'The site guides users through a cleaner sequence instead of leaving them in friction.' },
      { title: 'More reliable growth readiness', text: 'Future SEO and content work has a better technical and structural base.' },
    ],
    faq: [
      {
        question: 'How do you know when a new site is really needed?',
        answer: 'Usually when structure, page logic, and platform limits keep blocking growth no matter how much small SEO work is added.',
      },
      {
        question: 'Can development start with a smaller launch scope?',
        answer: 'Yes. A focused first version is often the healthiest way to launch without losing room for later expansion.',
      },
      {
        question: 'Is SEO considered during development?',
        answer: 'Yes. The site is planned with SEO structure and future growth in mind from the beginning.',
      },
    ],
    seoBlockTitle: 'Why a better website foundation often matters more than another round of cosmetic fixes',
    seoParagraphs: [
      'Some projects no longer need isolated improvements. They need a cleaner base that supports growth without constant structural compromise.',
      'A stronger site foundation makes SEO, content, and lead generation easier to develop after launch.',
    ],
    ctas: {
      soft: 'Discuss the development scope',
      rational: 'Get a website relaunch outline',
      fast: 'Review the current site now',
    },
    related: ['seo-audit', 'seo', 'technical-seo', 'seo-content'],
    images: imageSet('website-development', 'Website development concept for growth and lead generation', 'Website development workflow from structure to launch', 'Website development results for stronger structure and growth readiness'),
  },
]

const extraEnglishServicePageMap = new Map(extraEnglishServicePages.map((service) => [service.slug, service] as const))
const builtInEnglishServicePageMap = new Map(getLocalizedServicePages('en').map((service) => [service.slug, service] as const))

export function getServicePageForLocale(slug: string, locale: Locale) {
  if (locale === 'en') {
    return extraEnglishServicePageMap.get(slug) || getLocalizedServicePage(slug, locale) || getServicePage(slug) || null
  }

  return getServicePage(slug) || null
}

export function getServicePagesForLocale(locale: Locale) {
  if (locale !== 'en') {
    return servicePages
  }

  return servicePages.map((service) => {
    return extraEnglishServicePageMap.get(service.slug) || builtInEnglishServicePageMap.get(service.slug) || service
  })
}
