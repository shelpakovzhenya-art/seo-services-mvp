import { NextRequest, NextResponse } from "next/server";
import { createSession, verifyCredentials } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, password, remember } = body;

  const isValid = await verifyCredentials(username, password);

  if (!isValid) {
    return NextResponse.json(
      { error: "Неверный логин или пароль" },
      { status: 401 }
    );
  }

  await createSession(remember ? 30 : 7);
  return NextResponse.json({ success: true });
}
