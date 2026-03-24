import { getSiteSettings, defaultRobotsTxt } from "@/lib/site-settings";

export async function GET() {
  const settings = await getSiteSettings();

  return new Response(settings.robotsTxt || defaultRobotsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
