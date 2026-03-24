import { NextRequest } from "next/server";

export function getRequestOrigin(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  const host = request.headers.get("host");
  const protocol = request.nextUrl.protocol.replace(":", "") || "https";

  if (host && !host.startsWith("0.0.0.0")) {
    return `${protocol}://${host}`;
  }

  const publicUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    "";

  if (publicUrl) {
    return publicUrl.replace(/\/+$/, "");
  }

  return request.nextUrl.origin;
}
