'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
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
  autoScrollNote: string
  countLabel: string
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

const DRAG_THRESHOLD = 8
const AUTO_SCROLL_SPEED = 32
const MOMENTUM_DECAY = 0.93
const MOMENTUM_MIN_SPEED = 0.18

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

function ServiceCard({ card, clone = false }: { card: ServicesCarouselCard; clone?: boolean }) {
  return (
    <Link
      href={card.href}
      aria-hidden={clone}
      tabIndex={clone ? -1 : undefined}
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

export default function ServicesCarousel({ cards, autoScrollNote, countLabel }: ServicesCarouselProps) {
  const shouldAnimate = cards.length > 1
  const desktopTrackRef = useRef<HTMLDivElement | null>(null)
  const desktopGroupRef = useRef<HTMLDivElement | null>(null)
  const cycleWidthRef = useRef(0)
  const dragStateRef = useRef<DragState>(DEFAULT_DRAG_STATE)
  const isDraggingRef = useRef(false)
  const isHoveringRef = useRef(false)
  const isFocusedRef = useRef(false)
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

  const scheduleSuppressClickReset = useCallback((delay = 140) => {
    clearSuppressClickTimeout()
    suppressClickTimeoutRef.current = window.setTimeout(() => {
      suppressClickRef.current = false
      suppressClickTimeoutRef.current = null
    }, delay)
  }, [clearSuppressClickTimeout])

  const normalizeScrollLeft = useCallback(
    (value: number) => {
      const cycleWidth = cycleWidthRef.current

      if (!shouldAnimate || cycleWidth <= 0) {
        return value
      }

      let normalizedValue = value

      while (normalizedValue < 0) {
        normalizedValue += cycleWidth
      }

      while (normalizedValue >= cycleWidth) {
        normalizedValue -= cycleWidth
      }

      return normalizedValue
    },
    [shouldAnimate]
  )

  const stopMomentum = useCallback(() => {
    if (momentumFrameRef.current === null) {
      return
    }

    cancelAnimationFrame(momentumFrameRef.current)
    momentumFrameRef.current = null
  }, [])

  const startMomentum = useCallback(
    (initialVelocity: number) => {
      stopMomentum()

      let velocity = initialVelocity

      const step = () => {
        const track = desktopTrackRef.current

        if (!track || isDraggingRef.current) {
          momentumFrameRef.current = null
          suppressClickRef.current = false
          return
        }

        track.scrollLeft = normalizeScrollLeft(track.scrollLeft + velocity)
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
    [normalizeScrollLeft, scheduleSuppressClickReset, stopMomentum]
  )

  const measureCycleWidth = useCallback(() => {
    const group = desktopGroupRef.current

    if (!group) {
      cycleWidthRef.current = 0
      return
    }

    cycleWidthRef.current = group.getBoundingClientRect().width
  }, [])

  useEffect(() => {
    if (!shouldAnimate) {
      return
    }

    measureCycleWidth()

    const group = desktopGroupRef.current

    if (!group) {
      return
    }

    const handleResize = () => {
      measureCycleWidth()
    }

    window.addEventListener('resize', handleResize)

    let resizeObserver: ResizeObserver | null = null

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        measureCycleWidth()
      })
      resizeObserver.observe(group)
    }

    return () => {
      window.removeEventListener('resize', handleResize)

      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [measureCycleWidth, shouldAnimate])

  useEffect(() => {
    if (!shouldAnimate) {
      return
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      return
    }

    let animationFrame: number | null = null
    let previousTime = performance.now()

    const tick = (timestamp: number) => {
      const track = desktopTrackRef.current

      if (track) {
        const deltaSeconds = (timestamp - previousTime) / 1000
        previousTime = timestamp

        const isInteracting =
          isDraggingRef.current ||
          isHoveringRef.current ||
          isFocusedRef.current ||
          momentumFrameRef.current !== null

        if (!isInteracting) {
          track.scrollLeft = normalizeScrollLeft(track.scrollLeft + AUTO_SCROLL_SPEED * deltaSeconds)
        }
      }

      animationFrame = requestAnimationFrame(tick)
    }

    animationFrame = requestAnimationFrame(tick)

    return () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [normalizeScrollLeft, shouldAnimate])

  useEffect(() => {
    return () => {
      clearSuppressClickTimeout()
      stopMomentum()
    }
  }, [clearSuppressClickTimeout, stopMomentum])

  const finishDrag = useCallback(
    (pointerId?: number) => {
      const state = dragStateRef.current

      if (!state.active) {
        return
      }

      if (typeof pointerId === 'number' && state.pointerId !== pointerId) {
        return
      }

      const track = desktopTrackRef.current

      if (track && state.pointerId !== null && track.hasPointerCapture(state.pointerId)) {
        track.releasePointerCapture(state.pointerId)
      }

      const shouldPreventClick = state.moved
      const releaseVelocity = state.velocity

      dragStateRef.current = { ...DEFAULT_DRAG_STATE }
      isDraggingRef.current = false
      setIsDragging(false)

      if (!shouldPreventClick) {
        suppressClickRef.current = false
        return
      }

      suppressClickRef.current = true

      if (Math.abs(releaseVelocity) > 0.025) {
        startMomentum(-releaseVelocity * 18)
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

      const track = desktopTrackRef.current

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

      isDraggingRef.current = true
      setIsDragging(true)
      track.setPointerCapture(event.pointerId)
    },
    [clearSuppressClickTimeout, stopMomentum]
  )

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const state = dragStateRef.current

      if (!state.active || state.pointerId !== event.pointerId) {
        return
      }

      event.preventDefault()

      const track = desktopTrackRef.current

      if (!track) {
        return
      }

      const deltaX = event.clientX - state.startX

      if (!state.moved && Math.abs(deltaX) > DRAG_THRESHOLD) {
        state.moved = true
        suppressClickRef.current = true
      }

      track.scrollLeft = normalizeScrollLeft(state.startScrollLeft - deltaX)

      const timestamp = performance.now()
      const deltaTime = timestamp - state.lastTime

      if (deltaTime > 0) {
        state.velocity = (event.clientX - state.lastX) / deltaTime
        state.lastX = event.clientX
        state.lastTime = timestamp
      }
    },
    [normalizeScrollLeft]
  )

  const handlePointerUp = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      finishDrag(event.pointerId)
    },
    [finishDrag]
  )

  const handlePointerCancel = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      finishDrag(event.pointerId)
    },
    [finishDrag]
  )

  const handleMouseEnter = useCallback(() => {
    isHoveringRef.current = true
  }, [])

  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false
  }, [])

  const handleFocusCapture = useCallback(() => {
    isFocusedRef.current = true
  }, [])

  const handleBlurCapture = useCallback((event: FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget

    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) {
      return
    }

    isFocusedRef.current = false
  }, [])

  const handleDesktopClickCapture = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    scheduleSuppressClickReset(70)
  }, [scheduleSuppressClickReset])

  const handleWheel = useCallback(
    (event: WheelEvent<HTMLDivElement>) => {
      const track = desktopTrackRef.current

      if (!track) {
        return
      }

      const horizontalDelta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY

      if (Math.abs(horizontalDelta) < 1) {
        return
      }

      event.preventDefault()
      track.scrollLeft = normalizeScrollLeft(track.scrollLeft + horizontalDelta)
    },
    [normalizeScrollLeft]
  )

  if (cards.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm leading-6 text-slate-500">{autoScrollNote}</p>
        <div className="brand-badge hidden text-xs uppercase tracking-[0.18em] md:inline-flex">
          {cards.length} {countLabel}
        </div>
      </div>

      <div className="services-carousel-shell hidden md:block">
        <div className="services-carousel-fade services-carousel-fade--left" />
        <div className="services-carousel-fade services-carousel-fade--right" />

        <div
          ref={desktopTrackRef}
          className={`services-carousel-track services-carousel-track--desktop${isDragging ? ' is-dragging' : ''}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocusCapture={handleFocusCapture}
          onBlurCapture={handleBlurCapture}
          onWheel={handleWheel}
          onClickCapture={handleDesktopClickCapture}
        >
          <div ref={desktopGroupRef} className="services-carousel-group">
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
