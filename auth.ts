import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword, createSessionToken, getSessionCookieName } from "@/lib/auth";

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const parsed = SignupSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid signup details" }, { status: 400 });
  }
  const { email, password, firstName, lastName } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "An account with that email already exists" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await db.user.create({
    data: { email, passwordHash, firstName, lastName },
  });

  const token = createSessionToken({ userId: user.id, email: user.email, role: user.role });
  const res = NextResponse.json({ id: user.id, email: user.email });
  res.cookies.set(getSessionCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return res;
}
