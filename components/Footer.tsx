import { ShelpakovFooter } from '@/components/ShelpakovReference'
import { getRequestLocale } from '@/lib/request-locale'

export default async function Footer() {
  const locale = await getRequestLocale()

  return <ShelpakovFooter locale={locale} />
}
