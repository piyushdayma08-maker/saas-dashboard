type OtpRecord = {
  otp: string;
  expiresAt: number;
  attempts: number;
};

// In-memory OTP store for demo purposes.
// In production, store this in Redis/DB with TTL.
const store = new Map<string, OtpRecord>();

export function createOtp(email: string, ttlMs = 5 * 60 * 1000) {
  const otp = String(Math.floor(100000 + Math.random() * 900000)); // 6 digits
  store.set(email.toLowerCase(), {
    otp,
    expiresAt: Date.now() + ttlMs,
    attempts: 0,
  });
  return { otp, expiresAt: Date.now() + ttlMs };
}

export function verifyOtp(email: string, otp: string) {
  const key = email.toLowerCase();
  const record = store.get(key);
  if (!record) return { ok: false as const, reason: "not_found" as const };
  if (Date.now() > record.expiresAt) return { ok: false as const, reason: "expired" as const };

  // Basic attempt limit to keep UX sane.
  if (record.attempts >= 5) {
    return { ok: false as const, reason: "too_many_attempts" as const };
  }

  if (record.otp !== otp) {
    record.attempts += 1;
    store.set(key, record);
    return { ok: false as const, reason: "invalid" as const };
  }

  return { ok: true as const };
}

export function consumeOtp(email: string) {
  store.delete(email.toLowerCase());
}
