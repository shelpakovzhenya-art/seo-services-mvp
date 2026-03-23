import { redirect } from 'next/navigation'
import SeoReportsManager from '@/components/admin/SeoReportsManager'
import { isAuthenticated } from '@/lib/auth'
import { listSeoProjects } from '@/lib/seo-projects'
import { listSeoReportJobs } from '@/lib/seo-report-store'

export default async function AdminSeoReportsPage() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    redirect('/admin/login')
  }

  const [projects, reports] = await Promise.all([listSeoProjects(), listSeoReportJobs()])

  return <SeoReportsManager projects={projects} reports={reports} />
}
