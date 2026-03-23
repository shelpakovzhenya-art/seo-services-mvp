import { redirect } from 'next/navigation'
import SeoReportParserIndex from '@/components/admin/SeoReportParserIndex'
import { isAuthenticated } from '@/lib/auth'
import { listSeoReportJobs } from '@/lib/seo-report-store'

export default async function AdminSeoReportParserPage() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    redirect('/admin/login')
  }

  const reports = await listSeoReportJobs()

  return <SeoReportParserIndex reports={reports} />
}
