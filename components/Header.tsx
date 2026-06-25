import { ShelpakovHeader } from '@/components/ShelpakovReference'
import { getRequestLocale } from '@/lib/request-locale'

export default async function Header() {
  const locale = await getRequestLocale()

  return <ShelpakovHeader locale={locale} />
}
