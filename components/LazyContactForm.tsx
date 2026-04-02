'use client'

import { useEffect, useRef, useState, type ComponentType } from 'react'

type ContactFormComponent = ComponentType<Record<string, never>>

function ContactFormSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 w-40 rounded-full bg-slate-200/80" />
        <div className="h-14 rounded-2xl bg-white/80" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-52 rounded-full bg-slate-200/80" />
        <div className="h-12 rounded-2xl bg-[rgba(238,242,246,0.9)]" />
        <div className="h-14 rounded-2xl bg-white/80" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-20 rounded-full bg-slate-200/80" />
        <div className="h-14 rounded-2xl bg-white/80" />
      </div>
      <div className="h-24 rounded-2xl bg-[rgba(246,242,236,0.9)]" />
      <div className="h-12 rounded-2xl bg-[linear-gradient(90deg,rgba(14,21,35,0.88),rgba(28,41,64,0.8))]" />
    </div>
  )
}

export default function LazyContactForm() {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [FormComponent, setFormComponent] = useState<ContactFormComponent | null>(null)

  useEffect(() => {
    if (!hostRef.current || shouldLoad) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '320px 0px' }
    )

    observer.observe(hostRef.current)

    return () => observer.disconnect()
  }, [shouldLoad])

  useEffect(() => {
    if (!shouldLoad || FormComponent) {
      return
    }

    let active = true

    import('@/components/ContactForm').then((module) => {
      if (active) {
        setFormComponent(() => module.default)
      }
    })

    return () => {
      active = false
    }
  }, [FormComponent, shouldLoad])

  return <div ref={hostRef}>{FormComponent ? <FormComponent /> : <ContactFormSkeleton />}</div>
}
