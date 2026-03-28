"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const emailSchema = z.object({
  email: z.string().email(),
});

const resetSchema = z
  .object({
    otp: z.string().min(6).max(6),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type EmailForm = z.infer<typeof emailSchema>;
type ResetForm = z.infer<typeof resetSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [otpMeta, setOtpMeta] = useState<{ otp: string; expiresAt: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    defaultValues: { otp: "", newPassword: "", confirmPassword: "" },
  });

  async function sendOtp(values: EmailForm) {
    setLoading(true);
    setServerMessage(null);
    setOtpMeta(null);

    const res = await fetch("/api/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = (await res.json()) as { message: string; otp?: string; expiresAt?: number };
    setLoading(false);
    setServerMessage(data.message ?? null);

    if (data.otp && data.expiresAt) {
      setEmail(values.email.toLowerCase());
      setOtpMeta({ otp: data.otp, expiresAt: data.expiresAt });
    }
  }

  async function resetPassword(values: ResetForm) {
    setLoading(true);
    setServerMessage(null);

    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: values.otp, newPassword: values.newPassword }),
    });

    const data = (await res.json()) as { message: string };
    setLoading(false);

    if (!res.ok) {
      setServerMessage(data.message);
      return;
    }

    router.push("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md p-6">
        <h1 className="mb-2 text-2xl font-semibold">Forgot password</h1>
        <p className="mb-4 text-sm text-zinc-600">
          Enter your email to receive a one-time OTP.
        </p>

        {!otpMeta ? (
          <form
            onSubmit={emailForm.handleSubmit(sendOtp)}
            className="space-y-3"
            aria-busy={loading}
          >
            <Input placeholder="Email" {...emailForm.register("email")} />
            <p className="text-xs text-rose-600">{emailForm.formState.errors.email?.message}</p>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Get OTP"}
            </Button>
            {serverMessage ? <p className="text-xs text-zinc-600">{serverMessage}</p> : null}
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              disabled={loading}
              onClick={() => router.push("/login")}
            >
              Back to login
            </Button>
          </form>
        ) : (
          <form onSubmit={resetForm.handleSubmit(resetPassword)} className="space-y-3" aria-busy={loading}>
            <p className="text-xs text-zinc-600">OTP was generated for: {email}</p>
            {otpMeta ? (
              <div className="rounded-lg bg-indigo-50 p-3 text-sm text-indigo-800">
                Demo OTP: <span className="font-mono font-semibold">{otpMeta.otp}</span>
                <span className="ml-2 text-indigo-700">
                  Expires at: {new Date(otpMeta.expiresAt).toLocaleTimeString()}
                </span>
              </div>
            ) : null}
            <Input placeholder="6-digit OTP" inputMode="numeric" {...resetForm.register("otp")} />
            <p className="text-xs text-rose-600">{resetForm.formState.errors.otp?.message}</p>

            <Input
              type="password"
              placeholder="New password"
              {...resetForm.register("newPassword")}
            />
            <p className="text-xs text-rose-600">{resetForm.formState.errors.newPassword?.message}</p>

            <Input
              type="password"
              placeholder="Confirm password"
              {...resetForm.register("confirmPassword")}
            />
            <p className="text-xs text-rose-600">{resetForm.formState.errors.confirmPassword?.message}</p>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Resetting..." : "Reset password"}
            </Button>
            {serverMessage ? <p className="text-xs text-rose-600">{serverMessage}</p> : null}
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              disabled={loading}
              onClick={() => {
                setOtpMeta(null);
                setEmail("");
                resetForm.reset();
              }}
            >
              Send OTP again
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}

