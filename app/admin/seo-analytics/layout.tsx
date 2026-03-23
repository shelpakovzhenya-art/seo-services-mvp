import SeoAnalyticsNav from '@/components/admin/SeoAnalyticsNav'

export default function SeoAnalyticsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SeoAnalyticsNav />
      {children}
    </div>
  )
}
