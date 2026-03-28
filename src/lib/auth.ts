import { cookies } from "next/headers";
import { User } from "@/types";

export const SESSION_COOKIE = "saasflow_session";

function encode(payload: User): string {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64");
}

function decode(token: string): User | null {
  try {
    const json = Buffer.from(token, "base64").toString("utf8");
    return JSON.parse(json) as User;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return decode(token);
}

export function createSessionToken(user: User): string {
  return encode(user);
}
