import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { createUser, getUserByEmail } from "@/lib/mock-db";
import { Role } from "@/types";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name: string;
    email: string;
    password: string;
    role: Role;
  };

  if (getUserByEmail(body.email)) {
    return NextResponse.json({ message: "User already exists" }, { status: 409 });
  }

  const user = createUser(body);
  const response = NextResponse.json({ user });
  response.cookies.set(SESSION_COOKIE, createSessionToken(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return response;
}
