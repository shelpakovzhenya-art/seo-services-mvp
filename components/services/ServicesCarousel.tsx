'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type WheelEvent,
} from 'react'

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

type DragState = {
  active: boolean
  pointerId: number | null
  startX: number
  startScrollLeft: number
  lastX: number
  lastTime: number
  velocity: number
  moved: boolean
}

const DRAG_THRESHOLD = 6
const MOMENTUM_DECAY = 0.93
const MOMENTUM_MIN_SPEED = 0.2
const MOMENTUM_MULTIPLIER = 18

const DEFAULT_DRAG_STATE: DragState = {
  active: false,
  pointerId: null,
  startX: 0,
  startScrollLeft: 0,
  lastX: 0,
  lastTime: 0,
  velocity: 0,
  moved: false,
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
  const dragStateRef = useRef<DragState>(DEFAULT_DRAG_STATE)
  const suppressClickRef = useRef(false)
  const momentumFrameRef = useRef<number | null>(null)
  const suppressClickTimeoutRef = useRef<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const clearSuppressClickTimeout = useCallback(() => {
    if (suppressClickTimeoutRef.current === null) {
      return
    }

    window.clearTimeout(suppressClickTimeoutRef.current)
    suppressClickTimeoutRef.current = null
  }, [])

  const stopMomentum = useCallback(() => {
    if (momentumFrameRef.current === null) {
      return
    }

    cancelAnimationFrame(momentumFrameRef.current)
    momentumFrameRef.current = null
  }, [])

  useEffect(() => {
    return () => {
      clearSuppressClickTimeout()
      stopMomentum()
    }
  }, [clearSuppressClickTimeout, stopMomentum])

  const scheduleSuppressClickReset = useCallback((delay = 120) => {
    clearSuppressClickTimeout()

    suppressClickTimeoutRef.current = window.setTimeout(() => {
      suppressClickRef.current = false
      suppressClickTimeoutRef.current = null
    }, delay)
  }, [clearSuppressClickTimeout])

  const startMomentum = useCallback(
    (initialVelocity: number) => {
      stopMomentum()

      let velocity = initialVelocity

      const step = () => {
        const track = trackRef.current

        if (!track || dragStateRef.current.active) {
          momentumFrameRef.current = null
          suppressClickRef.current = false
          return
        }

        const maxScroll = track.scrollWidth - track.clientWidth

        if (maxScroll <= 0) {
          momentumFrameRef.current = null
          suppressClickRef.current = false
          return
        }

        const nextScrollLeft = Math.min(maxScroll, Math.max(0, track.scrollLeft + velocity))
        track.scrollLeft = nextScrollLeft

        if (nextScrollLeft <= 0 || nextScrollLeft >= maxScroll) {
          velocity *= 0.82
        }

        velocity *= MOMENTUM_DECAY

        if (Math.abs(velocity) < MOMENTUM_MIN_SPEED) {
          momentumFrameRef.current = null
          scheduleSuppressClickReset()
          return
        }

        momentumFrameRef.current = requestAnimationFrame(step)
      }

      momentumFrameRef.current = requestAnimationFrame(step)
    },
    [scheduleSuppressClickReset, stopMomentum]
  )

  const finishDrag = useCallback(
    (pointerId?: number) => {
      const track = trackRef.current
      const state = dragStateRef.current

      if (!state.active) {
        return
      }

      if (typeof pointerId === 'number' && state.pointerId !== pointerId) {
        return
      }

      if (track && state.pointerId !== null && track.hasPointerCapture(state.pointerId)) {
        track.releasePointerCapture(state.pointerId)
      }

      const releaseVelocity = state.velocity
      const shouldSuppressClick = state.moved

      dragStateRef.current = { ...DEFAULT_DRAG_STATE }
      setIsDragging(false)

      if (!shouldSuppressClick) {
        suppressClickRef.current = false
        return
      }

      suppressClickRef.current = true

      if (Math.abs(releaseVelocity) > 0.025) {
        startMomentum(-releaseVelocity * MOMENTUM_MULTIPLIER)
        return
      }

      scheduleSuppressClickReset()
    },
    [scheduleSuppressClickReset, startMomentum]
  )

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === 'mouse' && event.button !== 0) {
        return
      }

      const track = trackRef.current

      if (!track) {
        return
      }

      stopMomentum()
      clearSuppressClickTimeout()
      suppressClickRef.current = false

      const timestamp = performance.now()

      dragStateRef.current = {
        active: true,
        pointerId: event.pointerId,
        startX: event.clientX,
        startScrollLeft: track.scrollLeft,
        lastX: event.clientX,
        lastTime: timestamp,
        velocity: 0,
        moved: false,
      }

      setIsDragging(true)
      track.setPointerCapture(event.pointerId)
    },
    [clearSuppressClickTimeout, stopMomentum]
  )

  const handlePointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current
    const state = dragStateRef.current

    if (!track || !state.active || state.pointerId !== event.pointerId) {
      return
    }

    const deltaX = event.clientX - state.startX

    if (!state.moved && Math.abs(deltaX) < DRAG_THRESHOLD) {
      return
    }

    state.moved = true
    track.scrollLeft = state.startScrollLeft - deltaX

    const timestamp = performance.now()
    const deltaTime = timestamp - state.lastTime

    if (deltaTime > 0) {
      state.velocity = (event.clientX - state.lastX) / deltaTime
      state.lastX = event.clientX
      state.lastTime = timestamp
    }

    event.preventDefault()
  }, [])

  const handlePointerUp = useCallback((event: PointerEvent<HTMLDivElement>) => {
    finishDrag(event.pointerId)
  }, [finishDrag])

  const handlePointerCancel = useCallback((event: PointerEvent<HTMLDivElement>) => {
    finishDrag(event.pointerId)
  }, [finishDrag])

  const handleLostPointerCapture = useCallback((event: PointerEvent<HTMLDivElement>) => {
    finishDrag(event.pointerId)
  }, [finishDrag])

  const handleClickCapture = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    scheduleSuppressClickReset(70)
  }, [scheduleSuppressClickReset])

  const handleWheel = useCallback((event: WheelEvent<HTMLDivElement>) => {
    const track = trackRef.current

    if (!track) {
      return
    }

    const horizontalIntent = Math.abs(event.deltaX) > Math.abs(event.deltaY)

    if (horizontalIntent) {
      return
    }

    const maxScroll = track.scrollWidth - track.clientWidth

    if (maxScroll <= 0) {
      return
    }

    const nextScrollLeft = Math.min(maxScroll, Math.max(0, track.scrollLeft + event.deltaY))

    if (nextScrollLeft === track.scrollLeft) {
      return
    }

    track.scrollLeft = nextScrollLeft
    event.preventDefault()
  }, [])

  if (cards.length === 0) {
    return null
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
          className={`services-carousel-track services-carousel-track--draggable -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2 pt-1${isDragging ? ' services-carousel-track--dragging' : ''}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onLostPointerCapture={handleLostPointerCapture}
          onClickCapture={handleClickCapture}
          onWheel={handleWheel}
        >
          {cards.map((card) => (
            <ServiceCard key={card.slug} card={card} />
          ))}
        </div>
      </div>
    </div>
  )
}
