"use client"

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useRef, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from 'react'

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
  countLabel: string
  showCountBadge?: boolean
}

function ServiceCard({ card }: { card: ServicesCarouselCard }) {
  return (
    <Link
      href={card.href}
      prefetch={false}
      className="services-carousel-card brand-link-card group flex min-h-[21rem] w-[84vw] max-w-[20.5rem] shrink-0 flex-col p-6 md:w-[20.5rem] md:max-w-none"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="brand-badge text-[11px] tracking-[0.18em] uppercase">
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
          <div className="mt-5 rounded-[22px] border border-slate-200/90 bg-white/75 px-4 py-3 text-sm leading-6 text-slate-700">
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

export default function ServicesCarousel({ cards, countLabel, showCountBadge = true }: ServicesCarouselProps) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const dragStateRef = useRef({
    pointerId: null as number | null,
    startX: 0,
    startScrollLeft: 0,
    isDragging: false,
  })
  const suppressClickRef = useRef(false)

  if (cards.length === 0) {
    return null
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) {
      return
    }

    const track = trackRef.current

    if (!track) {
      return
    }

    dragStateRef.current.pointerId = event.pointerId
    dragStateRef.current.startX = event.clientX
    dragStateRef.current.startScrollLeft = track.scrollLeft
    dragStateRef.current.isDragging = false
    suppressClickRef.current = false
    track.setPointerCapture(event.pointerId)
    track.classList.add('services-carousel-track--dragging')
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const track = trackRef.current
    const state = dragStateRef.current

    if (!track || state.pointerId !== event.pointerId) {
      return
    }

    const deltaX = event.clientX - state.startX

    if (!state.isDragging && Math.abs(deltaX) < 4) {
      return
    }

    state.isDragging = true
    track.scrollLeft = state.startScrollLeft - deltaX
    event.preventDefault()
  }

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    const track = trackRef.current
    const state = dragStateRef.current

    if (state.pointerId !== event.pointerId) {
      return
    }

    if (track?.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId)
    }

    track?.classList.remove('services-carousel-track--dragging')

    if (state.isDragging) {
      suppressClickRef.current = true
      window.setTimeout(() => {
        suppressClickRef.current = false
      }, 0)
    }

    state.pointerId = null
    state.isDragging = false
  }

  const handleClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    suppressClickRef.current = false
  }

  return (
    <div className="space-y-3">
      {showCountBadge ? (
        <div className="flex justify-end">
          <div className="brand-badge text-xs uppercase tracking-[0.18em]">
            {cards.length} {countLabel}
          </div>
        </div>
      ) : null}

      <div className="services-carousel-shell">
        <div className="services-carousel-fade services-carousel-fade--left hidden md:block" />
        <div className="services-carousel-fade services-carousel-fade--right hidden md:block" />

        <div
          ref={trackRef}
          className="services-carousel-track services-carousel-track--draggable -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2 pt-1"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onLostPointerCapture={handlePointerEnd}
          onClickCapture={handleClickCapture}
        >
          {cards.map((card) => (
            <ServiceCard key={card.slug} card={card} />
          ))}
        </div>
      </div>
    </div>
  )
}
