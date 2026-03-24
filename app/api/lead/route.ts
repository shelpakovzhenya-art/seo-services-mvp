import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendLeadEmail } from "@/lib/resend";
import { getRequestOrigin } from "@/lib/request-origin";
import { isLocale } from "@/lib/i18n";

export async function POST(request: NextRequest) {
  const origin = getRequestOrigin(request);
  const formData = await request.formData();
  const localeInput = String(formData.get("locale") || "ru").trim();
  const locale = isLocale(localeInput) ? localeInput : "ru";
  const name = String(formData.get("name") || "").trim();
  const contact = String(formData.get("contact") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !contact) {
    return NextResponse.redirect(new URL(`/${locale}?error=1#contact`, origin));
  }

  let savedToDatabase = false;
  let sentByEmail = false;

  try {
    await prisma.lead.create({
      data: {
        name,
        contact,
        message,
        source: `site:${locale}`,
        status: "new",
      },
    });
    savedToDatabase = true;
  } catch (error) {
    console.error("Lead database save failed", error);
  }

  try {
    await sendLeadEmail({ name, contact, message });
    sentByEmail = true;
  } catch (error) {
    console.error("Lead email send failed", error);
  }

  if (!savedToDatabase && !sentByEmail) {
    return NextResponse.redirect(new URL(`/${locale}?error=1#contact`, origin));
  }

  return NextResponse.redirect(new URL(`/${locale}?success=1#contact`, origin));
}
