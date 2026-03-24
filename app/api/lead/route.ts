import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequestOrigin } from "@/lib/request-origin";
import { sendLeadEmail } from "@/lib/resend";

export async function POST(request: NextRequest) {
  const origin = getRequestOrigin(request);
  const formData = await request.formData();
  const name = String(formData.get("name") || "").trim();
  const contact = String(formData.get("contact") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !contact) {
    return NextResponse.redirect(new URL("/?error=1#contact", origin));
  }

  let savedToDatabase = false;
  let sentByEmail = false;

  try {
    await prisma.lead.create({
      data: {
        name,
        contact,
        message,
        source: "site",
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
    return NextResponse.redirect(new URL("/?error=1#contact", origin));
  }

  return NextResponse.redirect(new URL("/?success=1#contact", origin));
}
