'use client'

import { type ReactNode, useState } from 'react'
import { Check, Copy, Sparkles } from 'lucide-react'
import type { Locale } from '@/lib/i18n'
import type { SeoToolDefinition } from '@/lib/seo-tools'

type SeoToolWorkspaceProps = {
  tool: SeoToolDefinition
  locale: Locale
}

const fieldClassName =
  'tool-input w-full rounded-[22px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-[0_10px_24px_rgba(8,17,31,0.08)] outline-none transition placeholder:text-slate-400 focus:border-[#caa37a] focus:bg-white'

const labelClassName = 'text-xs font-semibold uppercase tracking-[0.24em] text-slate-400'

const copyButtonBase =
  'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#caa37a]/30'

const transliterationMap: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i', й: 'y',
  к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
  х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
}

function t(locale: Locale, ru: string, en: string) {
  return locale === 'en' ? en : ru
}

function transliterate(input: string) {
  return input
    .split('')
    .map((symbol) => transliterationMap[symbol] ?? symbol)
    .join('')
}

function generateSlug(input: string, separator: '-' | '_', lowercase: boolean) {
  const prepared = transliterate(input.trim().toLowerCase())
    .replace(/['’"]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, separator)
    .replace(new RegExp(`\\${separator}{2,}`, 'g'), separator)
    .replace(new RegExp(`^\\${separator}|\\${separator}$`, 'g'), '')

  if (!prepared) {
    return ''
  }

  return lowercase ? prepared : prepared.toUpperCase()
}

function trimValue(value: string) {
  return value.trim()
}

function normalizeUrl(value: string) {
  if (!value.trim()) {
    return ''
  }

  if (/^https?:\/\//i.test(value.trim())) {
    return value.trim()
  }

  return `https://${value.trim()}`
}

function splitLines(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function buildQueryString(entries: Array<[string, string]>) {
  const params = new URLSearchParams()

  entries.forEach(([key, value]) => {
    const trimmed = trimValue(value)
    if (trimmed) {
      params.set(key, trimmed)
    }
  })

  return params.toString()
}

function combineUrlWithQuery(baseUrl: string, queryString: string) {
  const normalizedBase = trimValue(baseUrl)
  if (!normalizedBase) {
    return ''
  }

  const [cleanBase, existingQuery] = normalizedBase.split('?')
  const params = new URLSearchParams(existingQuery || '')
  const newParams = new URLSearchParams(queryString)

  newParams.forEach((value, key) => {
    params.set(key, value)
  })

  const merged = params.toString()
  return merged ? `${cleanBase}?${merged}` : cleanBase
}

function meterTone(current: number, safeMin: number, safeMax: number, warningMax: number, locale: Locale) {
  if (current === 0) {
    return {
      barClass: 'bg-slate-600',
      textClass: 'text-slate-400',
      label: t(locale, 'Введите текст', 'Enter text'),
    }
  }

  if (current >= safeMin && current <= safeMax) {
    return {
      barClass: 'bg-emerald-400',
      textClass: 'text-emerald-300',
      label: t(locale, 'Оптимально', 'Good range'),
    }
  }

  if (current <= warningMax) {
    return {
      barClass: 'bg-amber-300',
      textClass: 'text-amber-200',
      label: t(locale, 'Погранично', 'Borderline'),
    }
  }

  return {
    barClass: 'bg-rose-400',
    textClass: 'text-rose-300',
    label: t(locale, 'Слишком длинно', 'Too long'),
  }
}

function CopyButton({ locale, value }: { locale: Locale; value: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (!value) {
      return
    }

    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!value}
      className={`${copyButtonBase} ${
        copied
          ? 'border-emerald-300/30 bg-emerald-400/12 text-emerald-100'
          : 'border-white/12 bg-white/6 text-slate-100 hover:border-[#caa37a]/36 hover:bg-white/10'
      } ${!value ? 'cursor-not-allowed opacity-45' : ''}`}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? t(locale, 'Скопировано', 'Copied') : t(locale, 'Скопировать', 'Copy')}
    </button>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={labelClassName}>{label}</span>
        {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
      </div>
      {children}
    </label>
  )
}

function ResultBlock({ title, children, actions }: { title: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="rounded-[30px] border border-white/12 bg-[#06101d]/84 p-5 shadow-[0_26px_70px_rgba(2,6,23,0.34)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {actions}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  )
}

function ToolLayout({
  locale,
  tool,
  controls,
  results,
}: {
  locale: Locale
  tool: SeoToolDefinition
  controls: ReactNode
  results: ReactNode
}) {
  return (
    <section className="surface-cosmos p-5 text-slate-200 md:p-8">
      <div className="grid gap-8 xl:grid-cols-[0.88fr_1.12fr]">
        <div className="space-y-6">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-300">
                client-side
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">{tool.title}</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">{tool.intro}</p>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="space-y-3">
              {tool.highlights.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-[#081321]/78 px-4 py-4 text-sm leading-7 text-slate-300">
                  <Sparkles className="mt-1 h-4 w-4 shrink-0 text-[#d5b08d]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="space-y-5">{controls}</div>
          </div>
        </div>

        <div className="space-y-5">{results}</div>
      </div>
    </section>
  )
}

function SlugGeneratorTool({ tool, locale }: SeoToolWorkspaceProps) {
  const [title, setTitle] = useState(
    t(locale, 'SEO продвижение под заявки для медицинского центра в Казани', 'SEO growth for a medical center in Kazan')
  )
  const [separator, setSeparator] = useState<'-' | '_'>('-')
  const [lowercase, setLowercase] = useState(true)
  const slug = generateSlug(title, separator, lowercase)
  const pathPreview = slug ? `/cases/${slug}` : '/cases/your-slug'

  return (
    <ToolLayout
      locale={locale}
      tool={tool}
      controls={
        <>
          <Field label={t(locale, 'Заголовок или фраза', 'Title or phrase')} hint={t(locale, 'Поддерживается кириллица', 'Cyrillic is supported')}>
            <textarea
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              rows={5}
              className={fieldClassName}
              placeholder={t(locale, 'Введите название страницы, кейса или статьи', 'Enter a page, case study, or article title')}
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label={t(locale, 'Разделитель', 'Separator')}>
              <div className="flex gap-3">
                {(['-', '_'] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSeparator(item)}
                    className={`flex-1 rounded-[20px] border px-4 py-3 text-sm font-medium transition ${
                      separator === item
                        ? 'border-[#caa37a]/50 bg-[#caa37a]/12 text-[#f4dcc2]'
                        : 'border-white/12 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </Field>

            <Field label={t(locale, 'Регистр', 'Letter case')}>
              <button
                type="button"
                onClick={() => setLowercase((value) => !value)}
                className={`w-full rounded-[20px] border px-4 py-3 text-left text-sm font-medium transition ${
                  lowercase
                    ? 'border-emerald-300/30 bg-emerald-400/12 text-emerald-100'
                    : 'border-white/12 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                {lowercase
                  ? t(locale, 'Строчные буквы включены', 'Lowercase is enabled')
                  : t(locale, 'Исходный регистр', 'Original casing')}
              </button>
            </Field>
          </div>
        </>
      }
      results={
        <>
          <ResultBlock title={t(locale, 'Готовый slug', 'Generated slug')} actions={<CopyButton locale={locale} value={slug} />}>
            <div className="rounded-[24px] border border-white/10 bg-[#081321] px-5 py-5 text-lg font-semibold text-white">
              {slug || t(locale, 'Здесь появится готовый slug', 'The slug will appear here')}
            </div>
            <div className="mt-4 rounded-[24px] border border-dashed border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-300">
              {t(locale, 'Предпросмотр пути', 'Path preview')}: <span className="font-medium text-[#f4dcc2]">{pathPreview}</span>
            </div>
          </ResultBlock>

          <ResultBlock title={t(locale, 'Как использовать', 'How to use it')}>
            <div className="space-y-3 text-sm leading-7 text-slate-300">
              <p>{t(locale, 'Используйте slug для адресов услуг, кейсов, статей и посадочных страниц.', 'Use the slug for services, case studies, articles, and landing pages.')}</p>
              <p>{t(locale, 'Если адрес получается слишком длинным, сократите исходную фразу до главной смысловой части.', 'If the URL gets too long, shorten the source phrase to its core meaning.')}</p>
              <p>{t(locale, 'Для публичных страниц лучше выбирать короткие адреса без стоп-слов и лишних союзов.', 'For public pages, shorter URLs without filler words usually work better.')}</p>
            </div>
          </ResultBlock>
        </>
      }
    />
  )
}

function UtmBuilderTool({ tool, locale }: SeoToolWorkspaceProps) {
  const [baseUrl, setBaseUrl] = useState('https://www.shelpakov.online/services/seo')
  const [source, setSource] = useState('telegram')
  const [medium, setMedium] = useState('post')
  const [campaign, setCampaign] = useState('spring_launch')
  const [content, setContent] = useState('card_1')
  const [term, setTerm] = useState('')

  const queryString = buildQueryString([
    ['utm_source', source],
    ['utm_medium', medium],
    ['utm_campaign', campaign],
    ['utm_content', content],
    ['utm_term', term],
  ])
  const finalUrl = combineUrlWithQuery(baseUrl, queryString)

  return (
    <ToolLayout
      locale={locale}
      tool={tool}
      controls={
        <>
          <Field label={t(locale, 'Базовый URL', 'Base URL')}>
            <input value={baseUrl} onChange={(event) => setBaseUrl(event.target.value)} className={fieldClassName} placeholder="https://site.com/page" />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="utm_source"><input value={source} onChange={(event) => setSource(event.target.value)} className={fieldClassName} /></Field>
            <Field label="utm_medium"><input value={medium} onChange={(event) => setMedium(event.target.value)} className={fieldClassName} /></Field>
            <Field label="utm_campaign"><input value={campaign} onChange={(event) => setCampaign(event.target.value)} className={fieldClassName} /></Field>
            <Field label="utm_content"><input value={content} onChange={(event) => setContent(event.target.value)} className={fieldClassName} /></Field>
          </div>

          <Field label="utm_term" hint={t(locale, 'Необязательный параметр', 'Optional parameter')}>
            <input value={term} onChange={(event) => setTerm(event.target.value)} className={fieldClassName} />
          </Field>
        </>
      }
      results={
        <>
          <ResultBlock title={t(locale, 'Итоговая ссылка', 'Final URL')} actions={<CopyButton locale={locale} value={finalUrl} />}>
            <div className="rounded-[24px] border border-white/10 bg-[#081321] px-5 py-5 text-sm leading-7 text-slate-100">
              {finalUrl || t(locale, 'Ссылка появится после заполнения URL', 'The URL will appear after you fill in the base address')}
            </div>
          </ResultBlock>

          <ResultBlock title={t(locale, 'Только строка параметров', 'Parameters only')} actions={<CopyButton locale={locale} value={queryString ? `?${queryString}` : ''} />}>
            <div className="rounded-[24px] border border-white/10 bg-[#081321] px-5 py-5 text-sm leading-7 text-slate-300">
              {queryString ? `?${queryString}` : t(locale, 'UTM-параметры появятся здесь', 'The UTM parameter string will appear here')}
            </div>
          </ResultBlock>

          <ResultBlock title={t(locale, 'Подсказка по разметке', 'Tagging tip')}>
            <div className="space-y-3 text-sm leading-7 text-slate-300">
              <p>{t(locale, 'Старайтесь держать единый словарь: например, telegram, email, cpc и post.', 'Keep a consistent naming dictionary such as telegram, email, cpc, and post.')}</p>
              <p>{t(locale, 'Не смешивайте кириллицу и латиницу в названиях кампаний, чтобы потом не страдала аналитика.', 'Do not mix naming conventions inside campaign labels unless the reporting model is built for it.')}</p>
            </div>
          </ResultBlock>
        </>
      }
    />
  )
}

function MetaCounterTool({ tool, locale }: SeoToolWorkspaceProps) {
  const [title, setTitle] = useState(t(locale, 'SEO-продвижение сайтов под заявки и рост органического трафика', 'SEO growth for leads and organic traffic'))
  const [description, setDescription] = useState(
    t(locale, 'SEO-продвижение, аудит и доработка структуры сайта под заявки, доверие и рост органического трафика.', 'SEO growth, audits, and site-structure work focused on trust, lead flow, and sustainable organic growth.')
  )
  const [url, setUrl] = useState('https://www.shelpakov.online/services/seo')

  const titleLength = title.length
  const descriptionLength = description.length
  const titleTone = meterTone(titleLength, 45, 60, 70, locale)
  const descriptionTone = meterTone(descriptionLength, 120, 160, 180, locale)

  return (
    <ToolLayout
      locale={locale}
      tool={tool}
      controls={
        <>
          <Field label="Title" hint={`${titleLength} ${t(locale, 'символов', 'characters')}`}>
            <textarea value={title} onChange={(event) => setTitle(event.target.value)} rows={3} className={fieldClassName} />
          </Field>
          <Field label="Description" hint={`${descriptionLength} ${t(locale, 'символов', 'characters')}`}>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={5} className={fieldClassName} />
          </Field>
          <Field label="URL"><input value={url} onChange={(event) => setUrl(event.target.value)} className={fieldClassName} /></Field>
        </>
      }
      results={
        <>
          <ResultBlock title={t(locale, 'Длина meta-тегов', 'Meta length')}>
            <div className="space-y-5">
              {[
                { label: 'Title', value: titleLength, max: 75, tone: titleTone },
                { label: 'Description', value: descriptionLength, max: 190, tone: descriptionTone },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-100">{item.label}</span>
                    <span className={item.tone.textClass}>{item.value} {t(locale, 'симв.', 'chars')} • {item.tone.label}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/8">
                    <div className={`h-full rounded-full ${item.tone.barClass}`} style={{ width: `${Math.min(100, (item.value / item.max) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </ResultBlock>

          <ResultBlock title={t(locale, 'Предпросмотр сниппета', 'Snippet preview')}>
            <div className="rounded-[26px] border border-white/10 bg-white px-5 py-5 text-slate-800">
              <div className="text-xs text-emerald-700">{trimValue(url) || 'https://site.com/page'}</div>
              <div className="mt-2 text-[1.15rem] font-semibold leading-7 text-[#1a0dab]">
                {trimValue(title) || t(locale, 'Здесь будет ваш title', 'Your title will appear here')}
              </div>
              <div className="mt-2 text-sm leading-7 text-slate-600">
                {trimValue(description) || t(locale, 'Здесь будет ваш description', 'Your description will appear here')}
              </div>
            </div>
          </ResultBlock>
        </>
      }
    />
  )
}

function RobotsGeneratorTool({ tool, locale }: SeoToolWorkspaceProps) {
  const [domain, setDomain] = useState('www.shelpakov.online')
  const [agents, setAgents] = useState('*\nGooglebot')
  const [allowLines, setAllowLines] = useState('/\n/wp-content/uploads/')
  const [disallowLines, setDisallowLines] = useState('/admin/\n/api/\n/tmp/')
  const [extraSitemaps, setExtraSitemaps] = useState('')
  const [host, setHost] = useState('www.shelpakov.online')

  const normalizedDomain = normalizeUrl(domain)
  const sitemapLines = [normalizedDomain ? `${normalizedDomain.replace(/\/$/, '')}/sitemap.xml` : '', ...splitLines(extraSitemaps)].filter(Boolean)

  const robotsText = splitLines(agents)
    .flatMap((agent) => [`User-agent: ${agent}`, ...splitLines(allowLines).map((item) => `Allow: ${item}`), ...splitLines(disallowLines).map((item) => `Disallow: ${item}`), ''])
    .concat(host.trim() ? [`Host: ${host.trim()}`] : [])
    .concat(sitemapLines.map((item) => `Sitemap: ${item}`))
    .join('\n')
    .trim()

  return (
    <ToolLayout
      locale={locale}
      tool={tool}
      controls={
        <>
          <Field label={t(locale, 'Домен сайта', 'Site domain')} hint={t(locale, 'Для sitemap и host', 'Used for sitemap and host')}>
            <input value={domain} onChange={(event) => setDomain(event.target.value)} className={fieldClassName} />
          </Field>
          <div className="grid gap-4 xl:grid-cols-2">
            <Field label="User-agent" hint={t(locale, 'Каждое правило с новой строки', 'One rule per line')}>
              <textarea value={agents} onChange={(event) => setAgents(event.target.value)} rows={4} className={fieldClassName} />
            </Field>
            <Field label="Allow" hint={t(locale, 'Каждое правило с новой строки', 'One rule per line')}>
              <textarea value={allowLines} onChange={(event) => setAllowLines(event.target.value)} rows={4} className={fieldClassName} />
            </Field>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            <Field label="Disallow" hint={t(locale, 'Каждое правило с новой строки', 'One rule per line')}>
              <textarea value={disallowLines} onChange={(event) => setDisallowLines(event.target.value)} rows={5} className={fieldClassName} />
            </Field>
            <Field label={t(locale, 'Дополнительные sitemap', 'Extra sitemap URLs')} hint={t(locale, 'Если их несколько', 'If there is more than one')}>
              <textarea value={extraSitemaps} onChange={(event) => setExtraSitemaps(event.target.value)} rows={5} className={fieldClassName} placeholder={t(locale, 'https://site.ru/post-sitemap.xml', 'https://site.com/post-sitemap.xml')} />
            </Field>
          </div>
          <Field label="Host" hint={t(locale, 'Необязательно', 'Optional')}>
            <input value={host} onChange={(event) => setHost(event.target.value)} className={fieldClassName} />
          </Field>
        </>
      }
      results={
        <>
          <ResultBlock title={t(locale, 'Готовый robots.txt', 'Generated robots.txt')} actions={<CopyButton locale={locale} value={robotsText} />}>
            <pre className="overflow-x-auto rounded-[24px] border border-white/10 bg-[#081321] px-5 py-5 text-sm leading-7 text-slate-200">
              {robotsText || t(locale, 'Заполните поля, и здесь появится текст robots.txt', 'Fill in the fields and the robots.txt draft will appear here')}
            </pre>
          </ResultBlock>

          <ResultBlock title={t(locale, 'Что проверить перед публикацией', 'What to check before publishing')}>
            <div className="space-y-3 text-sm leading-7 text-slate-300">
              <p>{t(locale, 'Не закрывайте служебно важные разделы, если они должны индексироваться.', 'Do not block important sections if they are supposed to stay indexable.')}</p>
              <p>{t(locale, 'Проверьте, что в sitemap указан правильный протокол и боевой домен.', 'Make sure the sitemap points to the correct protocol and production domain.')}</p>
              <p>{t(locale, 'Если сайт на разных зеркалах, отдельно проверьте редиректы и canonical.', 'If the project has mirrors or alternate hosts, review redirects and canonicals as well.')}</p>
            </div>
          </ResultBlock>
        </>
      }
    />
  )
}

function OpenGraphGeneratorTool({ tool, locale }: SeoToolWorkspaceProps) {
  const [title, setTitle] = useState(t(locale, 'SEO-продвижение сайтов под заявки | Shelpakov Digital', 'SEO growth for lead generation | Shelpakov Digital'))
  const [description, setDescription] = useState(
    t(locale, 'SEO-продвижение, аудит и доработка структуры сайта под заявки, доверие и рост органического трафика.', 'SEO growth, audits, and site-structure work focused on trust, lead flow, and stronger organic traffic.')
  )
  const [url, setUrl] = useState('https://www.shelpakov.online/services/seo')
  const [image, setImage] = useState('https://www.shelpakov.online/og-default.jpg')
  const [siteName, setSiteName] = useState('Shelpakov Digital')
  const [type, setType] = useState('website')

  const tags = [
    ['og:title', title],
    ['og:description', description],
    ['og:url', url],
    ['og:image', image],
    ['og:type', type],
    ['og:site_name', siteName],
  ]
    .filter(([, value]) => trimValue(value))
    .map(([property, value]) => `<meta property="${property}" content="${escapeHtml(trimValue(value))}" />`)
    .join('\n')

  const hasImage = /^https?:\/\//i.test(trimValue(image))

  return (
    <ToolLayout
      locale={locale}
      tool={tool}
      controls={
        <>
          <Field label="og:title"><input value={title} onChange={(event) => setTitle(event.target.value)} className={fieldClassName} /></Field>
          <Field label="og:description"><textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} className={fieldClassName} /></Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="og:url"><input value={url} onChange={(event) => setUrl(event.target.value)} className={fieldClassName} /></Field>
            <Field label="og:image"><input value={image} onChange={(event) => setImage(event.target.value)} className={fieldClassName} /></Field>
            <Field label="og:site_name"><input value={siteName} onChange={(event) => setSiteName(event.target.value)} className={fieldClassName} /></Field>
            <Field label="og:type"><input value={type} onChange={(event) => setType(event.target.value)} className={fieldClassName} /></Field>
          </div>
        </>
      }
      results={
        <>
          <ResultBlock title={t(locale, 'HTML-код', 'HTML code')} actions={<CopyButton locale={locale} value={tags} />}>
            <pre className="overflow-x-auto rounded-[24px] border border-white/10 bg-[#081321] px-5 py-5 text-sm leading-7 text-slate-200">
              {tags || t(locale, 'Теги Open Graph появятся здесь', 'The Open Graph tags will appear here')}
            </pre>
          </ResultBlock>

          <ResultBlock title={t(locale, 'Превью карточки', 'Card preview')}>
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white text-slate-900 shadow-[0_20px_60px_rgba(2,8,23,0.24)]">
              <div
                className={`h-48 w-full ${hasImage ? 'bg-[linear-gradient(135deg,#76e4ff,#ffd2ae)]' : 'bg-[linear-gradient(135deg,#0f172a,#1e3a8a,#fb923c)]'}`}
                style={hasImage ? { backgroundImage: `url(${image}), linear-gradient(135deg,#76e4ff,#ffd2ae)` } : undefined}
              />
              <div className="space-y-3 p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{trimValue(siteName) || t(locale, 'Название сайта', 'Site name')}</div>
                <div className="text-2xl font-semibold leading-8 text-slate-950">{trimValue(title) || t(locale, 'Заголовок превью', 'Preview title')}</div>
                <div className="text-sm leading-7 text-slate-600">{trimValue(description) || t(locale, 'Краткое описание карточки', 'Short card description')}</div>
                <div className="text-xs text-[#8a5630]">{trimValue(url) || 'https://site.com/page'}</div>
              </div>
            </div>
          </ResultBlock>
        </>
      }
    />
  )
}

export default function SeoToolWorkspace({ tool, locale }: SeoToolWorkspaceProps) {
  switch (tool.slug) {
    case 'slug-generator':
      return <SlugGeneratorTool tool={tool} locale={locale} />
    case 'utm-builder':
      return <UtmBuilderTool tool={tool} locale={locale} />
    case 'meta-counter':
      return <MetaCounterTool tool={tool} locale={locale} />
    case 'robots-generator':
      return <RobotsGeneratorTool tool={tool} locale={locale} />
    case 'og-generator':
      return <OpenGraphGeneratorTool tool={tool} locale={locale} />
    default:
      return (
        <section className="surface-cosmos p-8 text-white">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="text-lg font-semibold">{t(locale, 'Инструмент пока недоступен', 'This tool is not available yet')}</div>
            <p className="mt-3 text-sm leading-7 text-slate-300">{t(locale, 'Выберите один из доступных SEO-инструментов и продолжайте работу прямо в браузере.', 'Choose one of the available SEO tools and continue working directly in the browser.')}</p>
          </div>
        </section>
      )
  }
}
