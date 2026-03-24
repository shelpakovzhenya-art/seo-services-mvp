import { getSiteSettings, defaultSitemapXml } from "@/lib/site-settings";

export async function GET() {
  const settings = await getSiteSettings();

  return new Response(settings.sitemapXml || defaultSitemapXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
