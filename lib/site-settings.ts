import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/prisma";
import { defaultSiteUrl } from "@/lib/site-url";

export const defaultRobotsTxt = `User-agent: *
Allow: /

Sitemap: ${defaultSiteUrl}/sitemap.xml
`;

export const defaultSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${defaultSiteUrl}/ru</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="ru" href="${defaultSiteUrl}/ru" />
    <xhtml:link rel="alternate" hreflang="en" href="${defaultSiteUrl}/en" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultSiteUrl}/ru" />
  </url>
  <url>
    <loc>${defaultSiteUrl}/en</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="ru" href="${defaultSiteUrl}/ru" />
    <xhtml:link rel="alternate" hreflang="en" href="${defaultSiteUrl}/en" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultSiteUrl}/ru" />
  </url>
</urlset>
`;

export async function getSiteSettings() {
  noStore();

  return prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      siteName: "Студия Английского",
      siteDescription:
        "Онлайн-центр английского языка с продуманной подачей и сильной методикой.",
      footerText:
        "Студия Английского. Онлайн-центр английского языка с современной системой обучения и бережной подачей.",
      robotsTxt: defaultRobotsTxt,
      sitemapXml: defaultSitemapXml,
    },
  });
}
