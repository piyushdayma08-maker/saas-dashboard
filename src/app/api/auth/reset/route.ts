import { NextResponse } from "next/server";
import { consumeOtp, verifyOtp } from "@/lib/otp-store";
import { updateUserPassword } from "@/lib/mock-db";

export async function POST(request: Request) {
  const body = (await request.json()) as { email: string; otp: string; newPassword: string };
  const email = body.email?.trim().toLowerCase();
  const otp = String(body.otp ?? "").trim();

  if (!email || otp.length === 0 || (body.newPassword?.length ?? 0) < 8) {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const otpResult = verifyOtp(email, otp);
  if (!otpResult.ok) {
    return NextResponse.json({ message: "Invalid or expired OTP." }, { status: 400 });
  }

  const updated = updateUserPassword(email, body.newPassword);
  if (!updated) {
    return NextResponse.json({ message: "Could not reset password." }, { status: 400 });
  }

  consumeOtp(email);
  return NextResponse.json({ message: "Password reset successful." });
}

