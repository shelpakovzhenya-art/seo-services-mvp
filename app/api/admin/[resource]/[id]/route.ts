import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { resourceModelMap } from "@/lib/admin-config";

function getDelegate(resource: string) {
  const modelKey = resourceModelMap[resource];
  if (!modelKey) {
    return null;
  }

  return (prisma as any)[modelKey];
}

function normalizePayload(resource: string, body: Record<string, any>) {
  const payload = { ...body };

  if (resource === "blog" && payload.publishedAt) {
    payload.publishedAt = new Date(payload.publishedAt);
  }

  if ("order" in payload && payload.order === "") {
    payload.order = 0;
  }

  if ("rating" in payload && payload.rating === "") {
    payload.rating = 5;
  }

  return payload;
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ resource: string; id: string }> }
) {
  const params = await context.params;
  const unauthorized = await requireAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  const delegate = getDelegate(params.resource);
  if (!delegate) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const item = await delegate.update({
    where: { id: params.id },
    data: normalizePayload(params.resource, body),
  });

  return NextResponse.json({ item });
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ resource: string; id: string }> }
) {
  const params = await context.params;
  const unauthorized = await requireAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  const delegate = getDelegate(params.resource);
  if (!delegate) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await delegate.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}
