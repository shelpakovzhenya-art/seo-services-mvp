import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "admin-auth";

export async function ensureAdminUser() {
  const username = (process.env.ADMIN_USER || "admin").trim();
  const password = process.env.ADMIN_PASS || "admin123";
  const hash = await bcrypt.hash(password, 10);

  await prisma.admin.upsert({
    where: { username },
    update: { password: hash },
    create: {
      username,
      password: hash,
    },
  });

  return { username, password };
}

export async function verifyCredentials(username: string, password: string) {
  if (!username?.trim() || !password?.trim()) {
    return false;
  }

  await ensureAdminUser();

  const admin = await prisma.admin.findUnique({
    where: { username: username.trim() },
  });

  if (!admin) {
    return false;
  }

  return bcrypt.compare(password.trim(), admin.password);
}

export async function createSession(rememberForDays = 14) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * rememberForDays,
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value === "authenticated";
}
