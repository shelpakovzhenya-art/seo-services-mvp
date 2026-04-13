'use client'

import Link from 'next/link'
import { useState } from 'react'
import { type Locale, prefixPathWithLocale } from '@/lib/i18n'

type CaseCard = {
  tag: string
  title: string
  description: string
  resultValue: string
  resultText: string
  href: string
}

type BlogCard = {
  title: string
  description: string
  href: string
}

type Props = {
  locale: Locale
  cases: CaseCard[]
  posts: BlogCard[]
  compact?: boolean
}

export default function CasesBlogSwitcher({ locale, cases, posts, compact = false }: Props) {
  const [tab, setTab] = useState<'cases' | 'blog'>('cases')

  const heading =
    tab === 'cases'
      ? 'Кейсы, где видно не только цифры, но и логику изменений'
      : 'Блог с разбором SEO, структуры и внедрения'
  const description =
    tab === 'cases'
      ? 'Показываю задачу, сделанные работы и итог, чтобы было понятно, что именно дало результат.'
      : 'Материалы с конкретными шагами: как улучшать структуру, ключевые страницы и путь к заявке.'
  const actionHref = tab === 'cases' ? '/cases' : '/blog'
  const actionText = tab === 'cases' ? 'Открыть кейсы' : 'Открыть блог'

  return (
    <>
      <div className={compact ? 'mt-1' : 'mt-2'}>
        <p className={compact ? 'text-xs font-bold text-[#b188ff]' : 'text-[13px] font-bold text-[#b188ff]'}>
          {tab === 'cases' ? 'Кейсы' : 'Блог'}
        </p>
        <h2
          className={
            compact
              ? 'mt-1 text-[34px] font-extrabold leading-[0.95] tracking-[-0.03em] text-[#f6f8ff]'
              : 'mt-2 max-w-[980px] text-[48px] font-extrabold leading-[0.96] tracking-[-0.03em] text-[#f6f8ff]'
          }
        >
          {heading}
        </h2>
        <p
          className={
            compact
              ? 'mt-2 text-sm font-medium leading-[1.45] text-[#ccd2e8]'
              : 'mt-3 text-[17px] font-medium leading-[1.48] text-[#ccd2e8]'
          }
        >
          {description}
        </p>
      </div>

      <div className={compact ? 'mt-4 flex flex-col gap-3' : 'mt-5 flex flex-col gap-5'}>
        {tab === 'cases'
          ? cases.map((item, index) => (
              <Link
                key={`case-${item.title}`}
                href={prefixPathWithLocale(item.href, locale)}
                className={
                  compact
                    ? 'flex flex-col gap-2.5 rounded-2xl border border-white/10 bg-[#0f1122] px-3 py-3 transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_14px_34px_rgba(2,6,24,0.34)]'
                    : 'grid grid-cols-[minmax(0,1fr)_280px] gap-5 rounded-[20px] border border-white/10 bg-[#0f1122] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_18px_42px_rgba(2,6,24,0.34)]'
                }
              >
                <div className="flex flex-col gap-2.5">
                  <p className={compact ? 'text-[11px] font-bold text-[#b6bbd6]' : 'text-xs font-bold text-[#b6bbd6]'}>{item.tag}</p>
                  <h3
                    className={
                      compact
                        ? 'text-[22px] font-bold leading-[1.08] tracking-[-0.02em] text-[#f2f5ff]'
                        : 'max-w-[820px] text-[29px] font-bold leading-[1.1] tracking-[-0.02em] text-[#f2f5ff]'
                    }
                  >
                    {item.title}
                  </h3>
                  <p
                    className={
                      compact
                        ? 'text-sm font-medium leading-[1.45] text-[#c8cfe5]'
                        : 'max-w-[820px] text-[15px] font-medium leading-[1.5] text-[#c8cfe5]'
                    }
                  >
                    {item.description}
                  </p>
                </div>

                <div
                  className={compact ? 'rounded-xl border border-white/10 px-2.5 py-2' : 'rounded-2xl border border-white/10 px-4 py-4'}
                  style={{
                    background:
                      index % 2 === 0
                        ? 'linear-gradient(90deg, rgba(103,70,255,0.2), rgba(255,78,165,0.12)), #13162A'
                        : 'linear-gradient(90deg, rgba(91,76,255,0.2), rgba(255,94,165,0.12)), #13162A',
                  }}
                >
                  <p className={compact ? 'text-[11px] font-bold text-[#b8bcd6]' : 'text-xs font-bold text-[#b8bcd6]'}>Результат</p>
                  <p
                    className={
                      compact
                        ? 'text-[20px] font-extrabold leading-[1.02] tracking-[-0.02em] text-[#f5eeff]'
                        : 'mt-1 text-[26px] font-extrabold leading-[1.03] tracking-[-0.02em] text-[#f5eeff]'
                    }
                  >
                    {item.resultValue}
                  </p>
                  <p className={compact ? 'text-[13px] font-medium leading-[1.35] text-[#d2d8ea]' : 'mt-2 text-sm font-medium leading-[1.4] text-[#d2d8ea]'}>
                    {item.resultText}
                  </p>
                </div>
              </Link>
            ))
          : posts.map((item) => (
              <Link
                key={`blog-${item.title}`}
                href={prefixPathWithLocale(item.href, locale)}
                className={
                  compact
                    ? 'rounded-2xl border border-white/10 bg-[#0f1122] px-3 py-3 transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_14px_34px_rgba(2,6,24,0.34)]'
                    : 'rounded-[20px] border border-white/10 bg-[#0f1122] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_18px_42px_rgba(2,6,24,0.34)]'
                }
              >
                <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#a9afd2]">
                  Материал
                </div>
                <h3
                  className={
                    compact
                      ? 'mt-3 text-[22px] font-bold leading-[1.08] tracking-[-0.02em] text-[#f2f5ff]'
                      : 'mt-3 text-[30px] font-bold leading-[1.08] tracking-[-0.02em] text-[#f2f5ff]'
                  }
                >
                  {item.title}
                </h3>
                <p
                  className={
                    compact
                      ? 'mt-2 text-sm font-medium leading-[1.45] text-[#c8cfe5]'
                      : 'mt-3 max-w-[960px] text-base font-medium leading-[1.5] text-[#c8cfe5]'
                  }
                >
                  {item.description}
                </p>
              </Link>
            ))}
      </div>

      <div className={compact ? 'mt-4 flex items-center gap-3' : 'mt-6 flex items-center gap-4'}>
        <Link
          href={prefixPathWithLocale(actionHref, locale)}
          className={
            compact
              ? 'inline-flex rounded-full border border-white/30 bg-[linear-gradient(90deg,#6f4bff,#ff4ea8)] px-4 py-2.5 text-[13px] font-bold text-white'
              : 'inline-flex rounded-full border border-white/30 bg-[linear-gradient(90deg,#6f4bff,#ff4ea8)] px-5 py-3 text-sm font-bold text-white'
          }
        >
          {actionText}
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTab('cases')}
            aria-label="Показать кейсы"
            className={`h-2.5 w-2.5 rounded-full border transition ${tab === 'cases' ? 'border-white bg-white' : 'border-[#8d91ac] bg-transparent hover:border-[#d9def3]'}`}
          />
          <button
            type="button"
            onClick={() => setTab('blog')}
            aria-label="Показать блог"
            className={`h-2.5 w-2.5 rounded-full border transition ${tab === 'blog' ? 'border-white bg-white' : 'border-[#8d91ac] bg-transparent hover:border-[#d9def3]'}`}
          />
        </div>
      </div>
    </>
  )
}
