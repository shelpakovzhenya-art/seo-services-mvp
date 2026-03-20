import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  Binary,
  Bot,
  Briefcase,
  Building2,
  LineChart,
  Radar,
  Search,
  Sparkles,
} from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import ContactForm from '@/components/ContactForm'

const trustMetrics = [
  { value: 'SEO + GEO', label: 'Search systems tuned for classic and AI-driven discovery' },
  { value: 'B2B / Expert', label: 'Positioning for complex niches, demand capture and authority' },
  { value: 'Strategy-first', label: 'From structure and messaging to landing conversion logic' },
]

const capabilityBlocks = [
  {
    title: 'Search visibility systems',
    text: 'Technical SEO, semantic architecture, content clusters and commercial page frameworks that scale with demand.',
    icon: Radar,
  },
  {
    title: 'Conversion-led landing design',
    text: 'Sharper offer hierarchy, stronger proof, cleaner CTA logic and page structures built for sales conversations.',
    icon: LineChart,
  },
  {
    title: 'AI-ready content operations',
    text: 'Editorial systems, expert positioning and answer-focused content prepared for new search interfaces.',
    icon: Bot,
  },
]

const industryBlocks = [
  'B2B services and expert businesses',
  'SaaS and digital products',
  'Local businesses with competitive search demand',
  'E-commerce categories that need structured growth',
]

const processBlocks = [
  {
    step: '01',
    title: 'Audit the signal',
    text: 'We map search intent, funnel gaps, offer friction and content weak points before touching design.',
  },
  {
    step: '02',
    title: 'Rebuild the structure',
    text: 'We create a clearer navigation, page hierarchy and trust architecture so visitors understand value faster.',
  },
  {
    step: '03',
    title: 'Launch the growth loop',
    text: 'SEO, content, cases and conversion updates start reinforcing each other instead of competing for attention.',
  },
]

export default async function HomePage() {
  let services: any[] = []
  let reviews: any[] = []
  let cases: any[] = []
  let posts: any[] = []

  try {
    services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      take: 6,
    })
    reviews = await prisma.review.findMany({
      orderBy: { order: 'asc' },
      take: 3,
    })
    cases = await prisma.case.findMany({
      orderBy: { order: 'asc' },
      take: 2,
    })
    posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    })
  } catch (error) {
    console.error('Error loading homepage data:', error)
  }

  return (
    <div className="overflow-hidden">
      <section className="section-grid relative border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(34,211,238,0.18),transparent_25%),radial-gradient(circle_at_80%_18%,rgba(96,165,250,0.2),transparent_24%)]" />
        <div className="container relative mx-auto px-4 pb-20 pt-16 md:pb-28 md:pt-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-cyan-200">
                Shelpakov Digital
              </span>
              <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.02] text-white md:text-7xl">
                Digital growth architecture for brands that need more than just traffic.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
                Inspired by the trust-driven structure of Ashmanov and Demis, but translated into a leaner, more modern boutique format: strategy, SEO systems, expert content and conversion design.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a href="#contact-form">
                  <Button size="lg" className="rounded-full px-7">
                    Start growth audit
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <Link href="/cases">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-white/15 bg-white/5 px-7 text-white hover:bg-white/10"
                  >
                    View cases
                  </Button>
                </Link>
              </div>
              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {trustMetrics.map((metric) => (
                  <div key={metric.value} className="glass-panel p-5">
                    <div className="text-2xl font-semibold text-white">{metric.value}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-400">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel relative overflow-hidden p-6 md:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.2),transparent_35%)]" />
              <div className="relative space-y-6">
                <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-black/20 p-5">
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Growth map</div>
                    <div className="mt-2 text-2xl font-semibold text-white">Authority + intent + conversion</div>
                  </div>
                  <Binary className="h-10 w-10 text-cyan-300" />
                </div>

                <div className="grid gap-4">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-3">
                      <Search className="h-5 w-5 text-cyan-200" />
                      <span className="font-medium text-white">Competitive intelligence</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      Offer positioning, demand capture and structural gaps based on how category leaders earn trust.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5 text-cyan-200" />
                      <span className="font-medium text-white">Futuristic UX layer</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      Dark interface, luminous accents, glass panels and sharper content pacing for a more premium feel.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-3">
                      <BadgeCheck className="h-5 w-5 text-cyan-200" />
                      <span className="font-medium text-white">Commercial clarity</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      Each page should explain who it is for, what changes after engagement and why the offer is credible.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Structure borrowed from leaders</p>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-5xl">
              What we took from Ashmanov and Demis
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-400">
            Both competitors rely on authority, service breadth, cases, expertise and recurring content. We are keeping that logic, but making the experience more focused and visually more advanced.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {capabilityBlocks.map((block) => {
            const Icon = block.icon
            return (
              <div key={block.title} className="glass-panel p-7">
                <Icon className="h-8 w-8 text-cyan-200" />
                <h3 className="mt-5 text-2xl font-semibold text-white">{block.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{block.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="border-y border-white/10 bg-black/10">
        <div className="container mx-auto px-4 py-20">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Core offer map</p>
              <h2 className="mt-3 text-3xl font-semibold text-white md:text-5xl">
                Service structure that feels like an agency, not a template.
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {services.map((service) => (
                <div key={service.id} className="glass-panel p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-semibold text-white">{service.name}</h3>
                    <Briefcase className="mt-1 h-5 w-5 text-cyan-200" />
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{service.description}</p>
                  <div className="mt-6 text-sm uppercase tracking-[0.18em] text-cyan-200">
                    from {service.price.toLocaleString('ru-RU')} {service.unit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="glass-panel p-8">
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Who this is for</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Focused for expert categories and growth-stage brands.</h2>
            <div className="mt-8 space-y-4">
              {industryBlocks.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-slate-300">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {processBlocks.map((item) => (
              <div key={item.step} className="glass-panel flex gap-5 p-6">
                <div className="text-3xl font-semibold text-cyan-200">{item.step}</div>
                <div>
                  <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-black/10">
        <div className="container mx-auto px-4 py-20">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Proof layer</p>
              <h2 className="mt-3 text-3xl font-semibold text-white md:text-5xl">
                Cases, signals and reasons to trust the process.
              </h2>
            </div>
            <Link href="/cases" className="inline-flex items-center gap-2 text-cyan-200 transition hover:text-white">
              Explore all cases
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {cases.length > 0 ? (
              cases.map((item, index) => (
                <div key={item.id} className="glass-panel p-8">
                  <div className="flex items-center justify-between">
                    <span className="text-sm uppercase tracking-[0.24em] text-cyan-200">Case {index + 1}</span>
                    <Building2 className="h-5 w-5 text-cyan-200" />
                  </div>
                  <h3 className="mt-6 text-3xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-400">{item.description || item.content || 'Commercial SEO and conversion restructuring for long-term demand growth.'}</p>
                </div>
              ))
            ) : (
              <div className="glass-panel p-8 lg:col-span-2">
                <h3 className="text-2xl font-semibold text-white">Case layer ready</h3>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                  The structure is prepared for proof-driven case studies with outcome summaries, growth metrics and project context.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Content engine</p>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-5xl">
              Expertise should look alive, not archived.
            </h2>
          </div>
          <Link href="/blog" className="inline-flex items-center gap-2 text-cyan-200 transition hover:text-white">
            Open the blog
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="glass-panel group p-7 transition hover:border-cyan-300/30 hover:bg-white/8">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Insight</div>
                <h3 className="mt-4 text-2xl font-semibold text-white group-hover:text-cyan-100">{post.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-400">{post.excerpt || 'Fresh thinking on SEO, visibility systems and demand capture.'}</p>
              </Link>
            ))
          ) : (
            <div className="glass-panel p-7 md:col-span-3">
              <h3 className="text-2xl font-semibold text-white">Expert content area is in place</h3>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                We can now develop this into a stronger thought-leadership stream: market analysis, SEO systems, GEO content and category commentary.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="border-y border-white/10 bg-black/10">
        <div className="container mx-auto px-4 py-20">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Social proof</p>
              <h2 className="mt-3 text-3xl font-semibold text-white md:text-5xl">Trust should feel documented.</h2>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="glass-panel p-7">
                  <div className="flex gap-1 text-cyan-200">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="mt-5 text-sm leading-7 text-slate-300">{review.text}</p>
                  <p className="mt-6 text-sm text-slate-500">— {review.author}</p>
                </div>
              ))
            ) : (
              <div className="glass-panel p-7 md:col-span-3">
                <p className="text-sm leading-7 text-slate-400">
                  Review cards are ready to become a stronger social proof strip with logos, vertical tags and outcome-focused testimonials.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="contact-form" className="container mx-auto px-4 py-20">
        <div className="glass-panel overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="border-b border-white/10 p-8 lg:border-b-0 lg:border-r">
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Next move</p>
              <h2 className="mt-4 text-4xl font-semibold text-white">Let’s rebuild the site into a premium digital growth platform.</h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400">
                The new structure is already pointing in the right direction: stronger authority, clearer offer hierarchy and a more memorable interface. From here we can deepen pages, sharpen copy and make the whole brand feel more expensive.
              </p>
            </div>
            <div className="p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export async function generateMetadata() {
  const { getSiteUrl } = await import('@/lib/site-url')
  const siteUrl = getSiteUrl()

  return {
    title: 'Shelpakov Digital',
    description:
      'Shelpakov Digital builds SEO systems, authority content and conversion architecture for ambitious brands.',
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: 'Shelpakov Digital',
      description:
        'Shelpakov Digital builds SEO systems, authority content and conversion architecture for ambitious brands.',
      url: siteUrl,
      type: 'website',
    },
  }
}
