'use client'

import { type ReactNode, useState } from 'react'
import { Check, Clipboard, Copy, Sparkles } from 'lucide-react'
import type { SeoToolDefinition } from '@/lib/seo-tools'

type SeoToolWorkspaceProps = {
  tool: SeoToolDefinition
}

const fieldClassName =
  'w-full rounded-[22px] border border-white/12 bg-[#091425]/82 px-4 py-3 text-sm text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50 focus:bg-[#0b182b]/92'

const labelClassName = 'text-xs font-semibold uppercase tracking-[0.24em] text-slate-400'

const copyButtonBase =
  'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/40'

const transliterationMap: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'yo',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'sch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
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

function meterTone(current: number, safeMin: number, safeMax: number, warningMax: number) {
  if (current === 0) {
    return {
      barClass: 'bg-slate-600',
      textClass: 'text-slate-400',
      label: 'Введите текст',
    }
  }

  if (current >= safeMin && current <= safeMax) {
    return {
      barClass: 'bg-emerald-400',
      textClass: 'text-emerald-300',
      label: 'Оптимально',
    }
  }

  if (current <= warningMax) {
    return {
      barClass: 'bg-amber-300',
      textClass: 'text-amber-200',
      label: 'Погранично',
    }
  }

  return {
    barClass: 'bg-rose-400',
    textClass: 'text-rose-300',
    label: 'Слишком длинно',
  }
}

function CopyButton({ value }: { value: string }) {
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
          : 'border-white/12 bg-white/6 text-slate-100 hover:border-cyan-300/40 hover:bg-white/10'
      } ${!value ? 'cursor-not-allowed opacity-45' : ''}`}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? 'Скопировано' : 'Скопировать'}
    </button>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
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

function ResultBlock({
  title,
  children,
  actions,
}: {
  title: string
  children: ReactNode
  actions?: ReactNode
}) {
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
  tool,
  controls,
  results,
}: {
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
              <span className="warm-chip">{tool.category}</span>
              <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-300">
                client-side
              </span>
            </div>
            <h2 className="mt-5 text-3xl font-semibold text-white md:text-4xl">{tool.title}</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">{tool.intro}</p>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">Что умеет</div>
            <div className="mt-4 space-y-3">
              {tool.highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-[#081321]/78 px-4 py-4 text-sm leading-7 text-slate-300"
                >
                  <Sparkles className="mt-1 h-4 w-4 shrink-0 text-orange-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">Панель ввода</div>
            <div className="mt-4 space-y-5">{controls}</div>
          </div>
        </div>

        <div className="space-y-5">{results}</div>
      </div>
    </section>
  )
}

function SlugGeneratorTool({ tool }: { tool: SeoToolDefinition }) {
  const [title, setTitle] = useState('SEO продвижение под заявки для медицинского центра в Казани')
  const [separator, setSeparator] = useState<'-' | '_'>('-')
  const [lowercase, setLowercase] = useState(true)
  const slug = generateSlug(title, separator, lowercase)
  const pathPreview = slug ? `/cases/${slug}` : '/cases/your-slug'

  return (
    <ToolLayout
      tool={tool}
      controls={
        <>
          <Field label="Заголовок или фраза" hint="Поддерживается кириллица">
            <textarea
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              rows={5}
              className={fieldClassName}
              placeholder="Введите название страницы, кейса или статьи"
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Разделитель">
              <div className="flex gap-3">
                {(['-', '_'] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSeparator(item)}
                    className={`flex-1 rounded-[20px] border px-4 py-3 text-sm font-medium transition ${
                      separator === item
                        ? 'border-cyan-300/50 bg-cyan-300/14 text-cyan-100'
                        : 'border-white/12 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Регистр">
              <button
                type="button"
                onClick={() => setLowercase((value) => !value)}
                className={`w-full rounded-[20px] border px-4 py-3 text-left text-sm font-medium transition ${
                  lowercase
                    ? 'border-emerald-300/30 bg-emerald-400/12 text-emerald-100'
                    : 'border-white/12 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                {lowercase ? 'Строчные буквы включены' : 'Исходный регистр'}
              </button>
            </Field>
          </div>
        </>
      }
      results={
        <>
          <ResultBlock title="Готовый slug" actions={<CopyButton value={slug} />}>
            <div className="rounded-[24px] border border-white/10 bg-[#081321] px-5 py-5 text-lg font-semibold text-white">
              {slug || 'Здесь появится готовый slug'}
            </div>
            <div className="mt-4 rounded-[24px] border border-dashed border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-300">
              Предпросмотр пути: <span className="font-medium text-cyan-100">{pathPreview}</span>
            </div>
          </ResultBlock>

          <ResultBlock title="Как использовать">
            <div className="space-y-3 text-sm leading-7 text-slate-300">
              <p>Используйте slug для адресов услуг, кейсов, статей и посадочных страниц.</p>
              <p>Если адрес получается слишком длинным, сократите исходную фразу до главной смысловой части.</p>
              <p>Для публичных страниц лучше выбирать короткие адреса без стоп-слов и лишних союзов.</p>
            </div>
          </ResultBlock>
        </>
      }
    />
  )
}

function UtmBuilderTool({ tool }: { tool: SeoToolDefinition }) {
  const [baseUrl, setBaseUrl] = useState('https://shelpakov.online/services/seo')
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
      tool={tool}
      controls={
        <>
          <Field label="Базовый URL">
            <input
              value={baseUrl}
              onChange={(event) => setBaseUrl(event.target.value)}
              className={fieldClassName}
              placeholder="https://site.ru/page"
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="utm_source">
              <input value={source} onChange={(event) => setSource(event.target.value)} className={fieldClassName} />
            </Field>
            <Field label="utm_medium">
              <input value={medium} onChange={(event) => setMedium(event.target.value)} className={fieldClassName} />
            </Field>
            <Field label="utm_campaign">
              <input value={campaign} onChange={(event) => setCampaign(event.target.value)} className={fieldClassName} />
            </Field>
            <Field label="utm_content">
              <input value={content} onChange={(event) => setContent(event.target.value)} className={fieldClassName} />
            </Field>
          </div>

          <Field label="utm_term" hint="Необязательный параметр">
            <input value={term} onChange={(event) => setTerm(event.target.value)} className={fieldClassName} />
          </Field>
        </>
      }
      results={
        <>
          <ResultBlock title="Итоговая ссылка" actions={<CopyButton value={finalUrl} />}>
            <div className="rounded-[24px] border border-white/10 bg-[#081321] px-5 py-5 text-sm leading-7 text-slate-100">
              {finalUrl || 'Ссылка появится после заполнения URL'}
            </div>
          </ResultBlock>

          <ResultBlock title="Только строка параметров" actions={<CopyButton value={queryString ? `?${queryString}` : ''} />}>
            <div className="rounded-[24px] border border-white/10 bg-[#081321] px-5 py-5 text-sm leading-7 text-slate-300">
              {queryString ? `?${queryString}` : 'UTM-параметры появятся здесь'}
            </div>
          </ResultBlock>

          <ResultBlock title="Подсказка по разметке">
            <div className="space-y-3 text-sm leading-7 text-slate-300">
              <p>
                Старайтесь держать единый словарь: например, <span className="text-cyan-100">telegram</span>,{' '}
                <span className="text-cyan-100">email</span>, <span className="text-cyan-100">cpc</span>,{' '}
                <span className="text-cyan-100">post</span>.
              </p>
              <p>Не смешивайте кириллицу и латиницу в названиях кампаний, чтобы потом не страдала аналитика.</p>
            </div>
          </ResultBlock>
        </>
      }
    />
  )
}

function MetaCounterTool({ tool }: { tool: SeoToolDefinition }) {
  const [title, setTitle] = useState('SEO-продвижение сайтов под заявки и рост органического трафика')
  const [description, setDescription] = useState(
    'SEO-продвижение, аудит и доработка структуры сайта под заявки, доверие и рост органического трафика для услуг, B2B-проектов и локального бизнеса.'
  )
  const [url, setUrl] = useState('https://shelpakov.online/services/seo')

  const titleLength = title.length
  const descriptionLength = description.length
  const titleTone = meterTone(titleLength, 45, 60, 70)
  const descriptionTone = meterTone(descriptionLength, 120, 160, 180)

  return (
    <ToolLayout
      tool={tool}
      controls={
        <>
          <Field label="Title" hint={`${titleLength} символов`}>
            <textarea
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              rows={3}
              className={fieldClassName}
            />
          </Field>

          <Field label="Description" hint={`${descriptionLength} символов`}>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={5}
              className={fieldClassName}
            />
          </Field>

          <Field label="URL">
            <input value={url} onChange={(event) => setUrl(event.target.value)} className={fieldClassName} />
          </Field>
        </>
      }
      results={
        <>
          <ResultBlock title="Длина meta-тегов">
            <div className="space-y-5">
              {[
                {
                  label: 'Title',
                  value: titleLength,
                  max: 75,
                  tone: titleTone,
                },
                {
                  label: 'Description',
                  value: descriptionLength,
                  max: 190,
                  tone: descriptionTone,
                },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-100">{item.label}</span>
                    <span className={item.tone.textClass}>
                      {item.value} симв. • {item.tone.label}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/8">
                    <div
                      className={`h-full rounded-full ${item.tone.barClass}`}
                      style={{ width: `${Math.min(100, (item.value / item.max) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ResultBlock>

          <ResultBlock title="Предпросмотр сниппета">
            <div className="rounded-[26px] border border-white/10 bg-white px-5 py-5 text-slate-800">
              <div className="text-xs text-emerald-700">{trimValue(url) || 'https://site.ru/page'}</div>
              <div className="mt-2 text-[1.15rem] font-semibold leading-7 text-[#1a0dab]">
                {trimValue(title) || 'Здесь будет ваш title'}
              </div>
              <div className="mt-2 text-sm leading-7 text-slate-600">
                {trimValue(description) || 'Здесь будет ваш description'}
              </div>
            </div>
          </ResultBlock>
        </>
      }
    />
  )
}

function RobotsGeneratorTool({ tool }: { tool: SeoToolDefinition }) {
  const [domain, setDomain] = useState('shelpakov.online')
  const [agents, setAgents] = useState('*\nGooglebot')
  const [allowLines, setAllowLines] = useState('/\n/wp-content/uploads/')
  const [disallowLines, setDisallowLines] = useState('/admin/\n/api/\n/tmp/')
  const [extraSitemaps, setExtraSitemaps] = useState('')
  const [host, setHost] = useState('shelpakov.online')

  const normalizedDomain = normalizeUrl(domain)
  const sitemapLines = [
    normalizedDomain ? `${normalizedDomain.replace(/\/$/, '')}/sitemap.xml` : '',
    ...splitLines(extraSitemaps),
  ].filter(Boolean)

  const robotsText = splitLines(agents)
    .flatMap((agent) => [
      `User-agent: ${agent}`,
      ...splitLines(allowLines).map((item) => `Allow: ${item}`),
      ...splitLines(disallowLines).map((item) => `Disallow: ${item}`),
      '',
    ])
    .concat(host.trim() ? [`Host: ${host.trim()}`] : [])
    .concat(sitemapLines.map((item) => `Sitemap: ${item}`))
    .join('\n')
    .trim()

  return (
    <ToolLayout
      tool={tool}
      controls={
        <>
          <Field label="Домен сайта" hint="Для sitemap и host">
            <input value={domain} onChange={(event) => setDomain(event.target.value)} className={fieldClassName} />
          </Field>

          <div className="grid gap-4 xl:grid-cols-2">
            <Field label="User-agent" hint="Каждый с новой строки">
              <textarea value={agents} onChange={(event) => setAgents(event.target.value)} rows={4} className={fieldClassName} />
            </Field>
            <Field label="Allow" hint="Каждое правило с новой строки">
              <textarea
                value={allowLines}
                onChange={(event) => setAllowLines(event.target.value)}
                rows={4}
                className={fieldClassName}
              />
            </Field>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <Field label="Disallow" hint="Каждое правило с новой строки">
              <textarea
                value={disallowLines}
                onChange={(event) => setDisallowLines(event.target.value)}
                rows={5}
                className={fieldClassName}
              />
            </Field>
            <Field label="Дополнительные sitemap" hint="Если их несколько">
              <textarea
                value={extraSitemaps}
                onChange={(event) => setExtraSitemaps(event.target.value)}
                rows={5}
                className={fieldClassName}
                placeholder="https://site.ru/post-sitemap.xml"
              />
            </Field>
          </div>

          <Field label="Host" hint="Необязательно">
            <input value={host} onChange={(event) => setHost(event.target.value)} className={fieldClassName} />
          </Field>
        </>
      }
      results={
        <>
          <ResultBlock title="Готовый robots.txt" actions={<CopyButton value={robotsText} />}>
            <pre className="overflow-x-auto rounded-[24px] border border-white/10 bg-[#081321] px-5 py-5 text-sm leading-7 text-slate-200">
              {robotsText || 'Заполните поля, и здесь появится текст robots.txt'}
            </pre>
          </ResultBlock>

          <ResultBlock title="Что проверить перед публикацией">
            <div className="space-y-3 text-sm leading-7 text-slate-300">
              <p>Не закрывайте служебно важные разделы, если они должны индексироваться.</p>
              <p>Проверьте, что в sitemap указан правильный протокол и боевой домен.</p>
              <p>Если сайт на разных зеркалах, отдельно проверьте настройки редиректов и canonical.</p>
            </div>
          </ResultBlock>
        </>
      }
    />
  )
}

function OpenGraphGeneratorTool({ tool }: { tool: SeoToolDefinition }) {
  const [title, setTitle] = useState('SEO-продвижение сайтов под заявки | Shelpakov Digital')
  const [description, setDescription] = useState(
    'SEO-продвижение, аудит и доработка структуры сайта под заявки, доверие и рост органического трафика.'
  )
  const [url, setUrl] = useState('https://shelpakov.online/services/seo')
  const [image, setImage] = useState('https://shelpakov.online/og-default.jpg')
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
      tool={tool}
      controls={
        <>
          <Field label="og:title">
            <input value={title} onChange={(event) => setTitle(event.target.value)} className={fieldClassName} />
          </Field>

          <Field label="og:description">
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className={fieldClassName}
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="og:url">
              <input value={url} onChange={(event) => setUrl(event.target.value)} className={fieldClassName} />
            </Field>
            <Field label="og:image">
              <input value={image} onChange={(event) => setImage(event.target.value)} className={fieldClassName} />
            </Field>
            <Field label="og:site_name">
              <input value={siteName} onChange={(event) => setSiteName(event.target.value)} className={fieldClassName} />
            </Field>
            <Field label="og:type">
              <input value={type} onChange={(event) => setType(event.target.value)} className={fieldClassName} />
            </Field>
          </div>
        </>
      }
      results={
        <>
          <ResultBlock title="HTML-код" actions={<CopyButton value={tags} />}>
            <pre className="overflow-x-auto rounded-[24px] border border-white/10 bg-[#081321] px-5 py-5 text-sm leading-7 text-slate-200">
              {tags || 'Теги Open Graph появятся здесь'}
            </pre>
          </ResultBlock>

          <ResultBlock title="Превью карточки">
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white text-slate-900 shadow-[0_20px_60px_rgba(2,8,23,0.24)]">
              <div
                className={`h-48 w-full ${
                  hasImage
                    ? 'bg-[linear-gradient(135deg,#76e4ff,#ffd2ae)]'
                    : 'bg-[linear-gradient(135deg,#0f172a,#1e3a8a,#fb923c)]'
                }`}
                style={hasImage ? { backgroundImage: `url(${image}), linear-gradient(135deg,#76e4ff,#ffd2ae)` } : undefined}
              />
              <div className="space-y-3 p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{trimValue(siteName) || 'Site name'}</div>
                <div className="text-2xl font-semibold leading-8 text-slate-950">{trimValue(title) || 'Заголовок превью'}</div>
                <div className="text-sm leading-7 text-slate-600">{trimValue(description) || 'Краткое описание карточки'}</div>
                <div className="text-xs text-cyan-700">{trimValue(url) || 'https://site.ru/page'}</div>
              </div>
            </div>
          </ResultBlock>
        </>
      }
    />
  )
}

export default function SeoToolWorkspace({ tool }: SeoToolWorkspaceProps) {
  switch (tool.slug) {
    case 'slug-generator':
      return <SlugGeneratorTool tool={tool} />
    case 'utm-builder':
      return <UtmBuilderTool tool={tool} />
    case 'meta-counter':
      return <MetaCounterTool tool={tool} />
    case 'robots-generator':
      return <RobotsGeneratorTool tool={tool} />
    case 'og-generator':
      return <OpenGraphGeneratorTool tool={tool} />
    default:
      return (
        <section className="surface-cosmos p-8 text-white">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="text-lg font-semibold">Инструмент пока недоступен</div>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Выберите один из доступных SEO-инструментов из списка ниже и продолжайте работу прямо в браузере.
            </p>
          </div>
        </section>
      )
  }
}
