import { notFound, redirect } from 'next/navigation'
import SeoReportEditor from '@/components/admin/SeoReportEditor'
import { isAuthenticated } from '@/lib/auth'
import { listSeoProjects } from '@/lib/seo-projects'
import { getSeoReportJob } from '@/lib/seo-report-store'

export default async function AdminSeoReportDetailsPage({ params }: { params: { id: string } }) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    redirect('/admin/login')
  }

  const [report, projects] = await Promise.all([getSeoReportJob(params.id), listSeoProjects()])

  if (!report) {
    notFound()
  }

  return (
    <SeoReportEditor
      reportId={report.id}
      initialStatus={report.status}
      initialConfig={report.configData}
      projects={projects}
    />
  )
}
