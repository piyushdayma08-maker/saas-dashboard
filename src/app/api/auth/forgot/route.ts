import { NextResponse } from "next/server";
import { createOtp } from "@/lib/otp-store";
import { getUserByEmail } from "@/lib/mock-db";

export async function POST(request: Request) {
  const body = (await request.json()) as { email: string };
  const email = body.email?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ message: "Invalid email" }, { status: 400 });
  }

  const existing = getUserByEmail(email);
  if (!existing) {
    // Avoid leaking account existence.
    return NextResponse.json(
      { message: "If that email exists, we will send an OTP shortly." },
      { status: 200 },
    );
  }

  const { otp, expiresAt } = createOtp(email);
  // In a real product, you'd send `otp` via email/SMS.
  // For this demo, we return it so you can test the flow.
  return NextResponse.json({
    message: "OTP generated.",
    otp,
    expiresAt,
  });
}

