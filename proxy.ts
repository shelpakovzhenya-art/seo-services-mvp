import { NextResponse, type NextRequest } from "next/server";
import { isLocale } from "@/lib/i18n";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const segments = pathname.split("/").filter(Boolean);
  const pathnameLocale = segments[0];

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", isLocale(pathnameLocale) ? pathnameLocale : "ru");

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|icon.svg|.*\\..*).*)"],
};
