import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  const settings = await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main", siteName: "Студия Английского" },
  });

  return NextResponse.json({ settings });
}

export async function PUT(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  const body = await request.json();
  const settings = await prisma.siteSettings.update({
    where: { id: "main" },
    data: body,
  });

  return NextResponse.json({ settings });
}
