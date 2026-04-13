'use client'

import { useEffect, useRef, useState, type ComponentType } from 'react'

type ContactFormComponent = ComponentType<Record<string, never>>

function ContactFormSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 w-40 rounded-full bg-slate-500/50" />
        <div className="h-14 rounded-2xl border border-white/12 bg-[#11152c]/90" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-52 rounded-full bg-slate-500/50" />
        <div className="h-12 rounded-2xl border border-white/12 bg-white/5" />
        <div className="h-14 rounded-2xl border border-white/12 bg-[#11152c]/90" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-20 rounded-full bg-slate-500/50" />
        <div className="h-14 rounded-2xl border border-white/12 bg-[#11152c]/90" />
      </div>
      <div className="h-24 rounded-2xl border border-white/12 bg-white/5" />
      <div className="h-12 rounded-2xl bg-[linear-gradient(90deg,rgba(111,75,255,0.55),rgba(255,78,168,0.55))]" />
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
