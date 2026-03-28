import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { getUserByEmail } from "@/lib/mock-db";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as { email: string; password: string };
  const existing = getUserByEmail(body.email);

  if (!existing || existing.password !== body.password) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const publicUser = {
    id: existing.id,
    name: existing.name,
    email: existing.email,
    role: existing.role,
  };
  const response = NextResponse.json({ user: publicUser });
  response.cookies.set(SESSION_COOKIE, createSessionToken(publicUser), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return response;
}
