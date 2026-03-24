import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getSiteSettings } from "@/lib/site-settings";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  const settings = await getSiteSettings();

  return NextResponse.json({
    robotsTxt: settings.robotsTxt || "",
    sitemapXml: settings.sitemapXml || "",
  });
}

export async function PUT(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  const body = await request.json();
  const settings = await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {
      robotsTxt: String(body.robotsTxt || ""),
      sitemapXml: String(body.sitemapXml || ""),
    },
    create: {
      id: "main",
      robotsTxt: String(body.robotsTxt || ""),
      sitemapXml: String(body.sitemapXml || ""),
    },
  });

  return NextResponse.json({
    robotsTxt: settings.robotsTxt || "",
    sitemapXml: settings.sitemapXml || "",
  });
}
