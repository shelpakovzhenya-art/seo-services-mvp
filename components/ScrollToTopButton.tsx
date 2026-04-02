'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

const SHOW_AFTER_SCROLL = 360

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > SHOW_AFTER_SCROLL)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Прокрутить вверх"
      className={`scroll-top-button ${visible ? '' : 'scroll-top-button--hidden'}`}
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/14 bg-white/10 text-[#d2ab86] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
        <ArrowUp className="h-4 w-4" />
      </span>
      <span className="hidden pr-1 text-sm font-bold tracking-[0.08em] text-slate-100/95 sm:inline">Наверх</span>
    </button>
  )
}
