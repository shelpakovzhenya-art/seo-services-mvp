import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/prisma";

export const defaultRobotsTxt = `User-agent: *
Allow: /

Sitemap: https://lenochkin-center-production.up.railway.app/sitemap.xml
`;

export const defaultSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://lenochkin-center-production.up.railway.app/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
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
