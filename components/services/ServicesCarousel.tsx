'use client'

import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

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
  previousLabel: string
  nextLabel: string
  swipeHint: string
}

function readCarouselState(track: HTMLDivElement, cardsLength: number) {
  const style = window.getComputedStyle(track)
  const gap = Number.parseFloat(style.columnGap || style.gap || '0')
  const firstCard = track.firstElementChild as HTMLElement | null
  const step = firstCard ? firstCard.offsetWidth + gap : track.clientWidth
  const nextIndex = step > 0 ? Math.round(track.scrollLeft / step) : 0

  return {
    activeIndex: Math.max(0, Math.min(cardsLength - 1, nextIndex)),
    canScrollPrev: track.scrollLeft > 8,
    canScrollNext: track.scrollLeft < track.scrollWidth - track.clientWidth - 8,
  }
}

export default function ServicesCarousel({
  cards,
  previousLabel,
  nextLabel,
  swipeHint,
}: ServicesCarouselProps) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(cards.length > 1)

  function handleTrackScroll() {
    const track = trackRef.current
    if (!track) {
      return
    }

    const nextState = readCarouselState(track, cards.length)
    setActiveIndex(nextState.activeIndex)
    setCanScrollPrev(nextState.canScrollPrev)
    setCanScrollNext(nextState.canScrollNext)
  }

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current
    if (!track) {
      return
    }

    const style = window.getComputedStyle(track)
    const gap = Number.parseFloat(style.columnGap || style.gap || '0')
    const firstCard = track.firstElementChild as HTMLElement | null
    const distance = firstCard ? firstCard.offsetWidth + gap : track.clientWidth * 0.88

    track.scrollBy({
      left: distance * direction,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    function applyState() {
      const track = trackRef.current
      if (!track) {
        return
      }

      const nextState = readCarouselState(track, cards.length)
      setActiveIndex(nextState.activeIndex)
      setCanScrollPrev(nextState.canScrollPrev)
      setCanScrollNext(nextState.canScrollNext)
    }

    applyState()

    window.addEventListener('resize', applyState)
    return () => window.removeEventListener('resize', applyState)
  }, [cards.length])

  if (cards.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 font-medium text-slate-700">
            {`${activeIndex + 1}/${cards.length}`}
          </span>
          <span>{swipeHint}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={previousLabel}
            onClick={() => scrollByCard(-1)}
            disabled={!canScrollPrev}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label={nextLabel}
            onClick={() => scrollByCard(1)}
            disabled={!canScrollNext}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={handleTrackScroll}
        className="services-carousel-track -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-3 pt-1"
      >
        {cards.map((card) => (
          <Link
            key={card.slug}
            href={card.href}
            className="services-carousel-card uniform-card glass-panel interactive-card min-h-[24rem] w-[86vw] max-w-[25rem] shrink-0 p-6 sm:w-[31rem]"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="rounded-full border border-orange-200 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-700">
                {card.label}
              </span>
              {card.pricing ? <span className="text-sm font-semibold text-slate-900">{card.pricing}</span> : null}
            </div>

            <div className="mt-5 flex flex-1 flex-col">
              <div className="space-y-4">
                <h3 className="text-3xl font-semibold leading-tight text-slate-950">{card.title}</h3>
                <p className="text-sm leading-7 text-slate-600">{card.description}</p>
              </div>

              {card.signal ? (
                <div className="mt-5 rounded-[22px] border border-cyan-100 bg-cyan-50/70 px-4 py-3 text-sm leading-6 text-slate-700">
                  {card.signal}
                </div>
              ) : null}

              <div className="mt-auto pt-6">
                <div className="inline-flex items-center gap-2 text-sm font-medium text-cyan-700">
                  {card.cta}
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200/80">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#ffb27a,#63d9ff)] transition-[width] duration-300"
          style={{ width: `${((activeIndex + 1) / cards.length) * 100}%` }}
        />
      </div>
    </div>
  )
}
