import Link from 'next/link'
import { prefixPathWithLocale, type Locale } from '@/lib/i18n'
import { getTrustLinks, type TrustPageCopy } from '@/lib/trust-content'

type TrustPageShellProps = {
  copy: TrustPageCopy
  locale: Locale
}

export default function TrustPageShell({ copy, locale }: TrustPageShellProps) {
  const trustLinks = getTrustLinks(locale)

  return (
    <div className="page-shell">
      <section className="surface-grid surface-pad">
        <span className="warm-chip">{copy.chip}</span>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950 md:text-6xl">{copy.title}</h1>
        <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-600">{copy.description}</p>
      </section>

      <section className="reading-shell">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-orange-700">{copy.introTitle}</p>
          <div className="editorial-prose mt-6 max-w-none">
            {copy.introBody.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 surface-grid surface-pad">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-orange-700">{copy.cardsTitle}</p>
          <div className="uniform-grid-3 mt-6 gap-4">
            {copy.cards.map((card) => (
              <article key={card.title} className="uniform-card rounded-[24px] border border-orange-100 bg-[#fffaf5] p-5">
                <h2 className="text-xl font-semibold text-slate-950">{card.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-700">{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 reading-shell">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-orange-700">{copy.bulletsTitle}</p>
          <div className="mt-6 grid gap-4">
            {copy.bullets.map((item) => (
              <article key={item.title} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_14px_32px_rgba(15,23,42,0.05)]">
                <h2 className="text-xl font-semibold text-slate-950">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-700">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 surface-cosmos surface-pad">
        <div className="max-w-4xl">
          <p className="text-sm uppercase tracking-[0.24em] text-orange-300">{copy.linksTitle}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {trustLinks.links.map((item) => (
              <Link
                key={item.href}
                href={prefixPathWithLocale(item.href, locale)}
                className="rounded-[24px] border border-white/12 bg-white/8 p-5 transition hover:border-cyan-300/40 hover:bg-white/12"
              >
                <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
