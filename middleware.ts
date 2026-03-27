import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { defaultLocale, getLocaleFromPathname, prefixPathWithLocale, stripLocaleFromPathname } from '@/lib/i18n'
import { getCanonicalRedirectUrl } from '@/lib/site-url'

const PUBLIC_FILE = /\.[^/]+$/

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const canonicalRedirectUrl = getCanonicalRedirectUrl({
    requestUrl: request.nextUrl,
    requestHost: request.headers.get('x-forwarded-host') || request.headers.get('host'),
    requestProtocol: request.headers.get('x-forwarded-proto') || request.nextUrl.protocol,
  })

  if (canonicalRedirectUrl) {
    return NextResponse.redirect(canonicalRedirectUrl, 308)
  }

  const localeFromPath = getLocaleFromPathname(pathname)
  const internalLocale = request.nextUrl.searchParams.get('__locale')
  const cookieLocale = request.cookies.get('locale')?.value
  const locale =
    localeFromPath ||
    (internalLocale === 'en' ? 'en' : internalLocale === 'ru' ? 'ru' : null) ||
    (cookieLocale === 'en' ? 'en' : defaultLocale)

  if (PUBLIC_FILE.test(pathname) || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin')) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-site-pathname', pathname)
    requestHeaders.set('x-locale', locale)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  if (!localeFromPath) {
    if (internalLocale === 'ru' || internalLocale === 'en') {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-site-pathname', pathname)
      requestHeaders.set('x-site-original-pathname', prefixPathWithLocale(pathname, internalLocale))
      requestHeaders.set('x-locale', internalLocale)

      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })

      response.cookies.set('locale', internalLocale, { path: '/', sameSite: 'lax' })
      return response
    }

    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = prefixPathWithLocale(pathname, locale)

    const response = NextResponse.redirect(redirectUrl)
    response.cookies.set('locale', locale, { path: '/', sameSite: 'lax' })
    return response
  }

  const internalPath = stripLocaleFromPathname(pathname)
  const rewriteUrl = request.nextUrl.clone()
  rewriteUrl.pathname = internalPath
  rewriteUrl.searchParams.set('__locale', localeFromPath)

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-site-pathname', internalPath)
  requestHeaders.set('x-site-original-pathname', pathname)
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
    '/robots.txt',
    '/sitemap.xml',
    '/((?!api|_next/static|_next/image|.*\\..*).*)',
  ],
}
