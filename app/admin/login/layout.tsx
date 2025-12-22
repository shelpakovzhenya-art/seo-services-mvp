// Login page has its own layout - bypasses admin layout auth check
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

