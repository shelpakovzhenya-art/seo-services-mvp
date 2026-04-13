import Link from 'next/link'
import { headers } from 'next/headers'
import { Button } from '@/components/ui/button'
import { getDictionary } from '@/lib/dictionaries'
import { getRouteLocale, prefixPathWithLocale } from '@/lib/i18n'

export default async function NotFound() {
  const headersList = await headers()
  const locale = getRouteLocale(headersList.get('x-locale'))
  const dictionary = getDictionary(locale)

  return (
    <div className="page-shell text-center">
      <section className="surface-grid surface-pad">
        <h1 className="mb-4 text-4xl font-bold text-slate-100 md:text-6xl">404</h1>
        <p className="mb-8 text-xl text-slate-300">{dictionary.notFound.title}</p>
        <Link href={prefixPathWithLocale('/', locale)}>
          <Button>{dictionary.notFound.back}</Button>
        </Link>
      </section>
    </div>
  )
}
