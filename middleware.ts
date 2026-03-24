import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { defaultLocale, getLocaleFromPathname, prefixPathWithLocale, stripLocaleFromPathname } from '@/lib/i18n'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const localeFromPath = getLocaleFromPathname(pathname)
  const cookieLocale = request.cookies.get('locale')?.value
  const locale = localeFromPath || (cookieLocale === 'en' ? 'en' : defaultLocale)

  if (pathname.startsWith('/admin')) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-pathname', pathname)
    requestHeaders.set('x-locale', locale)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  if (!localeFromPath) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = prefixPathWithLocale(pathname, locale)

    const response = NextResponse.redirect(redirectUrl)
    response.cookies.set('locale', locale, { path: '/', sameSite: 'lax' })
    return response
  }

  const internalPath = stripLocaleFromPathname(pathname)
  const rewriteUrl = request.nextUrl.clone()
  rewriteUrl.pathname = internalPath

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', internalPath)
  requestHeaders.set('x-original-pathname', pathname)
  requestHeaders.set('x-locale', localeFromPath)

  const response = NextResponse.rewrite(rewriteUrl, {
    request: {
      headers: requestHeaders,
    },
  })

  response.cookies.set('locale', localeFromPath, { path: '/', sameSite: 'lax' })
  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
