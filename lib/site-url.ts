export const defaultSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  process.env.APP_URL?.trim() ||
  "https://lenochkin-center-production.up.railway.app";

export function withBaseUrl(pathname: string) {
  return new URL(pathname, defaultSiteUrl).toString();
}
