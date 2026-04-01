import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export type ServicesCarouselCard = {
  slug: string
  href: string
  label: string
  title: string
  description: string
  signal: string | null
  pricing: string | null
  cta: string
}

type ServicesCarouselProps = {
  cards: ServicesCarouselCard[]
  autoScrollNote: string
  countLabel: string
}

function ServiceCard({ card, clone = false }: { card: ServicesCarouselCard; clone?: boolean }) {
  return (
    <Link
      href={card.href}
      aria-hidden={clone}
      tabIndex={clone ? -1 : undefined}
      prefetch={false}
      className="services-carousel-card group flex min-h-[21rem] w-[84vw] max-w-[20.5rem] shrink-0 flex-col rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_22px_50px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:border-slate-900/12 hover:shadow-[0_28px_60px_rgba(15,23,42,0.12)] md:w-[20.5rem] md:max-w-none"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
          {card.label}
        </span>
        {card.pricing ? <span className="text-sm font-semibold text-slate-900">{card.pricing}</span> : null}
      </div>

      <div className="mt-6 flex flex-1 flex-col">
        <div className="space-y-3">
          <h3 className="text-[1.8rem] font-semibold leading-[1.02] tracking-[-0.04em] text-slate-950">{card.title}</h3>
          <p className="text-sm leading-7 text-slate-600">{card.description}</p>
        </div>

        {card.signal ? (
          <div className="mt-5 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
            {card.signal}
          </div>
        ) : null}

        <div className="mt-auto pt-6">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-950 transition group-hover:text-slate-700">
            {card.cta}
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function ServicesCarousel({ cards, autoScrollNote, countLabel }: ServicesCarouselProps) {
  if (cards.length === 0) {
    return null
  }

  const shouldAnimate = cards.length > 1

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm leading-6 text-slate-500">{autoScrollNote}</p>
        <div className="hidden rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 md:inline-flex">
          {cards.length} {countLabel}
        </div>
      </div>

      <div className="services-carousel-shell hidden md:block">
        <div className="services-carousel-fade services-carousel-fade--left" />
        <div className="services-carousel-fade services-carousel-fade--right" />

        <div className={shouldAnimate ? 'services-carousel-track--animated' : 'services-carousel-group'}>
          <div className="services-carousel-group">
            {cards.map((card) => (
              <ServiceCard key={card.slug} card={card} />
            ))}
          </div>

          {shouldAnimate ? (
            <div className="services-carousel-group" aria-hidden="true">
              {cards.map((card) => (
                <ServiceCard key={`${card.slug}-clone`} card={card} clone />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="services-carousel-track -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2 pt-1 md:hidden">
        {cards.map((card) => (
          <ServiceCard key={`${card.slug}-mobile`} card={card} />
        ))}
      </div>
    </div>
  )
}
