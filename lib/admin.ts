import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

export async function requireAdmin() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
