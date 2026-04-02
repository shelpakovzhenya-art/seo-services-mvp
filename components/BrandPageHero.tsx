import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type BrandPageHeroProps = {
  eyebrow?: string
  title: string
  description?: string | null
  badges?: string[]
  actions?: ReactNode
  aside?: ReactNode
  className?: string
  innerClassName?: string
}

export default function BrandPageHero({
  eyebrow,
  title,
  description,
  badges,
  actions,
  aside,
  className,
  innerClassName,
}: BrandPageHeroProps) {
  return (
    <section className={cn('page-hero-shell surface-pad', className)}>
      <div
        className={cn(
          'grid gap-8 xl:grid-cols-[minmax(0,1.04fr)_minmax(320px,0.96fr)] xl:items-end',
          innerClassName
        )}
      >
        <div>
          {eyebrow ? <span className="brand-chip">{eyebrow}</span> : null}
          <h1 className="mt-5 max-w-5xl text-[clamp(2.25rem,4.3vw,4.5rem)] font-semibold leading-[0.94] tracking-[-0.05em] text-slate-950">
            {title}
          </h1>
          {description ? <p className="mt-5 max-w-3xl text-[0.98rem] leading-8 text-slate-600 md:text-[1.04rem]">{description}</p> : null}

          {badges && badges.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2.5">
              {badges.map((badge) => (
                <span key={badge} className="brand-badge">
                  {badge}
                </span>
              ))}
            </div>
          ) : null}

          {actions ? <div className="mt-7 flex flex-wrap gap-3">{actions}</div> : null}
        </div>

        {aside ? <div className="page-hero-aside">{aside}</div> : null}
      </div>
    </section>
  )
}
