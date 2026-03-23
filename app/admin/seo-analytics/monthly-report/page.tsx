import { redirect } from 'next/navigation'
import SeoMonthlyReportBuilder from '@/components/admin/SeoMonthlyReportBuilder'
import { isAuthenticated } from '@/lib/auth'
import { listSeoProjects } from '@/lib/seo-projects'

export default async function AdminMonthlySeoReportPage() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    redirect('/admin/login')
  }

  const projects = await listSeoProjects()

  return <SeoMonthlyReportBuilder projects={projects} />
}
