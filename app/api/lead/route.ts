import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const name = String(formData.get("name") || "").trim();
  const contact = String(formData.get("contact") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !contact) {
    return NextResponse.redirect(new URL("/?error=1", request.url));
  }

  await prisma.lead.create({
    data: {
      name,
      contact,
      message,
      source: "site",
      status: "new",
    },
  });

  return NextResponse.redirect(new URL("/?success=1#contact", request.url));
}
