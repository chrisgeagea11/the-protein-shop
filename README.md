import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

function requireAdmin() {
  const session = getSession();
  return session?.role === "ADMIN" ? session : null;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAdmin()) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const body = await req.json();
  const product = await db.product.update({ where: { id: params.id }, data: body });
  return NextResponse.json(product);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAdmin()) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  // Soft-delete by deactivating rather than hard-deleting, so past orders
  // still resolve their product reference.
  await db.product.update({ where: { id: params.id }, data: { active: false } });
  return NextResponse.json({ success: true });
}
