import type { Locale } from '@/lib/i18n'
import { serializeCaseGallery } from '@/lib/case-gallery'
import { botiqCase } from '@/lib/botiq-case'
import { podocenterCase } from '@/lib/podocenter-case'
import { containsCyrillic } from '@/lib/text-detection'

type CaseWorkSection = {
  title: string
  paragraphs: string[]
}

type CaseFaqItem = {
  question: string
  answer: string
}

type CaseResultItem = {
  metric: string
  value: string
  impact: string
}

export type LocalizableCaseRecord = {
  slug?: string | null
  title?: string | null
  description?: string | null
  h1?: string | null
  excerpt?: string | null
  content?: string | null
  resultImages?: string | null
  about?: string[]
  pointA?: string[]
  goals?: string[]
  work?: CaseWorkSection[]
  results?: CaseResultItem[]
  whyItWorked?: string[]
  conclusion?: string | null
  faq?: CaseFaqItem[]
}

const englishBotiqGallery = serializeCaseGallery([
  {
    src: '/cases/botiq/audit-summary.png',
    caption:
      'Opening summary of the audit: the main conclusion, strongest sides of the project, and the first priorities for implementation.',
  },
  {
    src: '/cases/botiq/audit-architecture.png',
    caption:
      'Technical section of the audit: canonical logic, template issues, site architecture, and internal linking.',
  },
  {
    src: '/cases/botiq/audit-structured-data.png',
    caption:
      'Structured data and commercial page review: where schema, contact blocks, and entry points to conversion need improvement.',
  },
  {
    src: '/cases/botiq/audit-competitor-gap.png',
    caption:
      'Competitor gap analysis showing where the project already looks solid and where template-level gaps still slow growth.',
  },
  {
    src: '/cases/botiq/audit-roadmap.png',
    caption:
      'Final roadmap with staged implementation priorities for the next 60 days.',
  },
])

const englishCaseOverrides: Record<string, Partial<LocalizableCaseRecord>> = {
  [podocenterCase.slug]: {
    h1: 'How a podiatry center in Kazan rebuilt its website around demand and appointments',
    title: 'PodoCenter SEO case study: local visibility and stronger lead flow in Kazan',
    description:
      'A local medical SEO case study: demand was split into service pages, supporting content, and clearer conversion paths so the website could win more local traffic and inquiries in Kazan.',
    excerpt:
      'This was not a “magic SEO trick” story. It was a full rebuild of structure, service pages, supporting content, and appointment paths for a local medical project.',
    about: [
      'Client: PodoCenter podiatry clinic.',
      'Niche: podiatry and related medical services.',
      'Region: Kazan.',
      'Starting point: the site was already live, but organic traffic did not convert into a stable flow of inquiries for priority services.',
    ],
    pointA: [
      'Part of the demand was trapped on broad pages without a dedicated landing page for the actual intent.',
      'For several services, the site looked weaker than local competitors in the Kazan SERP.',
      'The informational layer was poorly connected to services and to the appointment path.',
      'Commercial trust signals did not reduce anxiety enough: the path to contact was not clear.',
      'Organic traffic was arriving, but too often it stopped before the user reached an appointment.',
    ],
    goals: [
      'Expand demand coverage across service-driven and symptom-driven queries.',
      'Strengthen local visibility in Kazan for priority clusters.',
      'Build a clearer path from search to appointment.',
      'Reduce dependence on broad traffic and improve the quality of inquiries from organic search.',
      'Create stronger landing pages for key services instead of relying mostly on the homepage.',
    ],
    work: [
      {
        title: 'Demand was mapped by patient scenarios, not by a loose keyword list',
        paragraphs: [
          'The work started not from a generic keyword dump, but from real intents: when a person is already searching for an appointment, when they are still comparing options, and when they enter through a symptom or a question.',
          'That clustering made it clear where a dedicated service page was needed and where an article, FAQ, or supporting page would do a better job. It removed a common local SEO mistake: pushing too many different formulations onto one weak page.',
        ],
      },
      {
        title: 'The site structure was rebuilt around commercial demand, not around a general showcase',
        paragraphs: [
          'The service layer was strengthened and tied directly to local demand in Kazan. That mattered more than endlessly expanding the blog or adding broad descriptive texts about podiatry.',
          'The goal was simple: a person should land on a page where the problem, the service, the difference in approach, and the next step are all obvious without extra wandering.',
        ],
      },
      {
        title: 'Priority service landing pages were repackaged',
        paragraphs: [
          'The main service pages were rebuilt so they solved two tasks at once: being understandable for search engines and lowering friction before an appointment.',
          'The focus was not on volume for volume’s sake. Each page had to answer the practical question: is this service right for me now, and what do I do next if it is?',
        ],
      },
      {
        title: 'The blog became a working layer instead of decorative background',
        paragraphs: [
          'The blog was used as an early-demand entry point. Some users do not start with an appointment query. They begin with a symptom, a concern, or a comparison of treatment options.',
          'Those materials gave the project more useful entry points and then moved readers toward the relevant service page. In medical and adjacent niches, that trust-building step is often critical before conversion.',
        ],
      },
      {
        title: 'Commercial blocks and the appointment route were strengthened',
        paragraphs: [
          'A separate layer of work went into contacts, specialist presentation, trust blocks, and the overall path to a lead. The page had to answer the basic doubts that prevent an inquiry.',
          'For a local medical project, this is never secondary. People may see the right service in search, but still hesitate if the site does not make the next step feel clear and safe.',
        ],
      },
      {
        title: 'The technical foundation was aligned into one system',
        paragraphs: [
          'In parallel, the core SEO layer was cleaned up: headings, internal linking, metadata, indexation logic, and the overall search-ready structure of the site.',
          'That made sure useful pages were not isolated. For local SEO, strong services, supporting content, and trust pages have to work as one connected system rather than as separate sections.',
        ],
      },
    ],
    results: [
      {
        metric: 'Demand structure',
        value: 'The site stopped leaning mostly on broad pages and gained more dedicated entry points for concrete services.',
        impact: 'Organic traffic was distributed across more precise landing pages instead of pooling inside one generic section.',
      },
      {
        metric: 'Local visibility',
        value: 'Priority clusters became more visible in Kazan search results.',
        impact: 'Growth appeared first on the pages that were closest to appointments and commercial demand.',
      },
      {
        metric: 'Path to inquiry',
        value: 'The route from search to appointment became shorter and clearer.',
        impact: 'Organic traffic started working not only on visits, but on real inquiries for the clinic.',
      },
    ],
    whyItWorked: [
      'Demand was split by intent instead of being blurred across broad pages.',
      'Services, blog content, and trust blocks were connected into one route instead of living in separate silos.',
      'Commercial factors were strengthened exactly where organic demand was landing.',
      'Technical SEO and content work moved together, so growth was not blocked by one neglected layer.',
    ],
    conclusion:
      'This case is useful because it shows the working logic of local SEO for services. Growth did not come from one “hack”, but from the connection between demand, structure, landing pages, supporting content, and the path to an inquiry.',
    faq: [
      {
        question: 'Why does a podiatry center need both service pages and articles?',
        answer:
          'Because part of the demand starts earlier than an appointment query. Articles help capture symptom-driven intent, explain the situation, and then move a person toward the relevant service page.',
      },
      {
        question: 'What affects local SEO most in this type of niche?',
        answer:
          'Usually it is the combination of dedicated service pages, local relevance, commercial trust signals, and a stable technical foundation. One isolated fix rarely creates a durable result.',
      },
      {
        question: 'Can a project grow without a large blog?',
        answer:
          'Yes, if the main service pages already cover demand well. But in a competitive niche, supporting content often creates extra entry points and builds trust before the appointment step.',
      },
      {
        question: 'What should be checked if traffic exists but leads remain weak?',
        answer:
          'Then the issue is usually not only SEO. You have to review landing pages, offer clarity, commercial blocks, and the overall route to an inquiry. Traffic without a clear next step will stall.',
      },
    ],
  },
  [botiqCase.slug]: {
    title: 'Botiq SEO audit case study: implementation roadmap for a partner SaaS project',
    description:
      'A practical SEO audit for Botiq: site architecture, templates, schema, commercial signals, and a staged roadmap for the next 60 days.',
    excerpt:
      'This case shows how an SEO audit can turn into a working implementation plan for a SaaS site instead of a formal slide deck.',
    about: ['SEO audit', 'Technical SEO', 'Content strategy', 'SaaS / AI product'],
    resultImages: englishBotiqGallery,
    content: `
<p><a href="https://www.botiq.tech/" target="_blank" rel="noopener noreferrer">Botiq</a> is a partner-focused SaaS project. The goal of the SEO audit was not to produce a decorative presentation, but to give the team a practical document for development, content, and SEO decisions.</p>

<p>At the start, the project needed clear answers to three questions: which parts of the site were already assembled well, which templates were slowing growth, and what should be implemented first without scattering the team.</p>

<h2>What the audit covered</h2>
<ul>
  <li>Indexation and crawl review: robots.txt, sitemap, canonical logic, and general search hygiene.</li>
  <li>Site architecture, internal linking, and the quality of key templates.</li>
  <li>Title, description, H1, content framing, image handling, and schema markup.</li>
  <li>Commercial pages, contact zones, forms, and core conversion entry points.</li>
  <li>Competitor gap analysis translated into concrete implementation tasks.</li>
  <li>A roadmap split into quick wins, medium-term fixes, and staged priorities.</li>
</ul>

<h2>What the audit showed</h2>
<p>The project already had a workable base, but the SEO and conversion layer was uneven. That is common for SaaS sites: the product evolves faster than templates, metadata, structured data, and commercial routing.</p>

<ul>
  <li>The project had a solid product core, but not every important template had an equally strong search-ready presentation.</li>
  <li>Canonical logic, structured data, and metadata consistency still needed work.</li>
  <li>Some pages existed, but looked weaker than they should from both an SEO and conversion perspective.</li>
  <li>Commercial entry points and contact zones were present, but not yet convincing enough for demand capture.</li>
</ul>

<h2>What went into the first priorities</h2>
<ol>
  <li>Turn contact and inquiry pages into full commercial landing pages instead of technical endpoints.</li>
  <li>Rebuild title, description, H1, and canonical patterns across the main template types.</li>
  <li>Add valid schema where it actually helps search engines understand the page entity.</li>
  <li>Strengthen commercial pages with FAQ, proof blocks, and decision-supporting content.</li>
  <li>Make conversion points more visible on pages where users are already close to a decision.</li>
  <li>Use competitor gap analysis as a source of tasks, not as a passive comparison sheet.</li>
</ol>

<h2>What the team received</h2>
<p>The output was not a long list of disconnected remarks. It was an implementation map with quick fixes, template-level improvements, and staged priorities that could be put into work without creating chaos inside the product team.</p>

<p>That is especially important for SaaS. The value of the audit was not its length, but the fact that it gave the team a decision-making framework: what to do now, what to delay, and where SEO and conversion issues intersect.</p>

<h2>Why this case matters</h2>
<p>This is not a story about a “magic growth jump after an audit”. It is a good example of how an SEO audit helps structure work on a complex product site with templates, technical debt, and multiple conversion scenarios.</p>

<p>If you need a similar breakdown for a project with template sprawl, technical compromises, and unclear SEO priorities, the closest service is <a href="/services/seo-audit">SEO audit</a>.</p>
`,
  },
}

export function localizeCaseRecord<T extends LocalizableCaseRecord>(caseItem: T, locale: Locale): T {
  if (locale !== 'en') {
    return caseItem
  }

  const slug = caseItem.slug || ''
  const override = englishCaseOverrides[slug]

  return override ? ({ ...caseItem, ...override } as T) : caseItem
}

export function hasRussianCaseContent(caseItem: LocalizableCaseRecord) {
  const textParts = [
    caseItem.title,
    caseItem.description,
    caseItem.h1,
    caseItem.excerpt,
    caseItem.content,
    caseItem.conclusion,
    ...(caseItem.about || []),
    ...(caseItem.pointA || []),
    ...(caseItem.goals || []),
    ...(caseItem.whyItWorked || []),
    ...(caseItem.work || []).flatMap((section) => [section.title, ...section.paragraphs]),
    ...(caseItem.faq || []).flatMap((item) => [item.question, item.answer]),
  ]

  return textParts.some((value) => containsCyrillic(value))
}
