'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import type { CaseGalleryImage } from '@/lib/case-gallery'
import type { Locale } from '@/lib/i18n'

type CaseGalleryProps = {
  images: CaseGalleryImage[]
  title: string
  locale?: Locale
}

const galleryCopy = {
  ru: {
    title: 'Скрины и материалы из проекта',
    description: 'Каждый экран можно открыть крупнее и спокойно рассмотреть детали.',
    openLarger: 'Открыть крупнее',
    openImage: (index: number, title: string) => `Открыть изображение ${index + 1} из кейса ${title}`,
    dialogLabel: (title: string) => `Просмотр изображения из кейса ${title}`,
    close: 'Закрыть просмотр',
    fragment: 'Фрагмент проекта',
    previous: 'Показать предыдущий экран',
    next: 'Показать следующий экран',
    slideCounter: (active: number, total: number) => `Экран ${active} из ${total}`,
  },
  en: {
    title: 'Result screenshots and project materials',
    description: 'Open any screen in a larger view and inspect the details calmly.',
    openLarger: 'Open larger',
    openImage: (index: number, title: string) => `Open image ${index + 1} from case study ${title}`,
    dialogLabel: (title: string) => `Image viewer for case study ${title}`,
    close: 'Close viewer',
    fragment: 'Project snapshot',
    previous: 'Show previous screen',
    next: 'Show next screen',
    slideCounter: (active: number, total: number) => `Screen ${active} of ${total}`,
  },
} as const

export default function CaseGallery({ images, title, locale = 'ru' }: CaseGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const activeImage = activeIndex !== null ? images[activeIndex] : null
  const activeSlideNumber = activeIndex !== null ? activeIndex + 1 : 1
  const copy = galleryCopy[locale]

  useEffect(() => {
    if (activeIndex === null) {
      return
    }

    const previousOverflow = document.body.style.overflow

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveIndex(null)
        return
      }

      if (!images.length) {
        return
      }

      if (event.key === 'ArrowRight') {
        setActiveIndex((current) => (current === null ? 0 : (current + 1) % images.length))
      }

      if (event.key === 'ArrowLeft') {
        setActiveIndex((current) => (current === null ? 0 : (current - 1 + images.length) % images.length))
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeIndex, images.length])

  const showPrevious = () => {
    if (!images.length) {
      return
    }

    setActiveIndex((current) => (current === null ? 0 : (current - 1 + images.length) % images.length))
  }

  const showNext = () => {
    if (!images.length) {
      return
    }

    setActiveIndex((current) => (current === null ? 0 : (current + 1) % images.length))
  }

  return (
    <>
      <section className="page-card mt-8">
        <h2 className="text-3xl font-semibold text-slate-950">{copy.title}</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">{copy.description}</p>

        <div className="uniform-grid-3 mt-8 gap-4">
          {images.map((image, index) => (
            <article
              key={`${image.src}-${index}`}
              className="uniform-card overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-[0_18px_45px_rgba(148,107,61,0.08)]"
            >
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className="group flex h-full flex-col text-left"
                aria-label={copy.openImage(index, title)}
              >
                <div className="relative aspect-[16/10] w-full bg-[linear-gradient(180deg,#fffdf8,#f7fbff)] p-3">
                  <div className="relative h-full w-full overflow-hidden rounded-[20px] border border-white/80 bg-white">
                    <Image
                      src={image.src}
                      alt={image.caption || `${title} ${index + 1}`}
                      fill
                      unoptimized
                      className="object-contain p-2 transition duration-500 group-hover:scale-[1.02]"
                    />

                    <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between rounded-full border border-white/70 bg-slate-950/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white opacity-100 shadow-[0_12px_30px_rgba(15,23,42,0.22)] backdrop-blur md:opacity-0 md:transition md:duration-300 md:group-hover:opacity-100">
                      <span>{copy.openLarger}</span>
                      <Expand className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {image.caption ? (
                  <div className="border-t border-orange-100 px-4 py-3 text-sm leading-6 text-slate-600">
                    {image.caption}
                  </div>
                ) : null}
              </button>
            </article>
          ))}
        </div>
      </section>

      {activeImage ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={copy.dialogLabel(title)}
        >
          <button
            type="button"
            aria-label={copy.close}
            className="absolute inset-0 bg-slate-950/82 backdrop-blur-sm"
            onClick={() => setActiveIndex(null)}
          />

          <div className="relative z-10 w-full max-w-7xl">
            <div className="overflow-hidden rounded-[32px] border border-white/20 bg-[linear-gradient(160deg,rgba(255,255,255,0.96),rgba(243,249,255,0.94)_46%,rgba(255,245,236,0.95)_100%)] p-4 shadow-[0_40px_120px_rgba(2,8,23,0.5)] md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4">
                <div className="max-w-3xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">{copy.fragment}</p>
                  {activeImage.caption ? (
                    <p className="mt-2 text-sm leading-7 text-slate-700 md:text-base">{activeImage.caption}</p>
                  ) : null}
                </div>

                <div className="flex items-center gap-2">
                  {images.length > 1 ? (
                    <>
                      <button
                        type="button"
                        onClick={showPrevious}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                        aria-label={copy.previous}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={showNext}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                        aria-label={copy.next}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => setActiveIndex(null)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                    aria-label={copy.close}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[24px] border border-white/80 bg-white md:aspect-[16/9]">
                <Image
                  src={activeImage.src}
                  alt={activeImage.caption || `${title} ${activeSlideNumber}`}
                  fill
                  priority
                  unoptimized
                  className="object-contain p-2 md:p-4"
                />
              </div>

              {images.length > 1 ? (
                <div className="mt-4 text-sm text-slate-500">{copy.slideCounter(activeSlideNumber, images.length)}</div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
