import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const status = req.nextUrl.searchParams.get("status") ?? undefined;

  // Admins can see every order (for the admin dashboard); customers only see their own.
  const orders = await db.order.findMany({
    where: {
      ...(session.role === "ADMIN" ? {} : { userId: session.userId }),
      ...(status ? { status: status as any } : {}),
    },
    include: { items: { include: { variant: { include: { product: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}
