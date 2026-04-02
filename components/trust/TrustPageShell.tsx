import Link from 'next/link'
import BrandPageHero from '@/components/BrandPageHero'
import { prefixPathWithLocale, type Locale } from '@/lib/i18n'
import { getEditorialTeam, getTrustLinks, type TrustPageCopy } from '@/lib/trust-content'

type TrustPageShellProps = {
  copy: TrustPageCopy
  locale: Locale
}

export default function TrustPageShell({ copy, locale }: TrustPageShellProps) {
  const trustLinks = getTrustLinks(locale)
  const team = getEditorialTeam(locale)

  return (
    <div className="page-shell">
      <BrandPageHero
        eyebrow={copy.chip}
        title={copy.title}
        description={copy.description}
        aside={
          <>
            <div className="page-aside-card">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">{team.name}</div>
              <h2 className="mt-3 text-xl font-semibold leading-tight text-slate-950">{team.role}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{team.summary}</p>
            </div>

            <div className="page-aside-card--dark">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#d5b08d]">{copy.linksTitle}</div>
              <div className="mt-4 space-y-3">
                {trustLinks.links.map((item) => (
                  <Link key={item.href} href={prefixPathWithLocale(item.href, locale)} className="block rounded-[18px] border border-white/10 bg-white/[0.05] px-4 py-3 transition hover:bg-white/[0.08]">
                    <div className="text-sm font-semibold text-white">{item.title}</div>
                    <p className="mt-1 text-sm leading-6 text-slate-300">{item.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </>
        }
      />

      <section className="reading-shell">
        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-slate-500">{copy.introTitle}</div>
        <div className="editorial-prose mt-5 max-w-none">
          {copy.introBody.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="mt-8 surface-grid surface-pad">
        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-slate-500">{copy.cardsTitle}</div>
        <div className="uniform-grid-3 mt-5 gap-4">
          {copy.cards.map((card) => (
            <article key={card.title} className="uniform-card brand-card-soft p-5">
              <h2 className="text-xl font-semibold text-slate-950">{card.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 surface-grid surface-pad">
        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-slate-500">{copy.bulletsTitle}</div>
        <div className="mt-5 grid gap-4">
          {copy.bullets.map((item) => (
            <article key={item.title} className="brand-card p-5">
              <h2 className="text-xl font-semibold text-slate-950">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 surface-grid surface-pad">
        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-slate-500">{copy.linksTitle}</div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {trustLinks.links.map((item) => (
            <Link
              key={item.href}
              href={prefixPathWithLocale(item.href, locale)}
              className="brand-link-card p-5"
            >
              <h2 className="text-lg font-semibold text-slate-950">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
