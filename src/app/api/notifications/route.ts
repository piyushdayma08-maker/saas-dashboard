import { NextResponse } from "next/server";
import { getNotifications } from "@/lib/mock-db";
import { Role } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = (searchParams.get("role") ?? "user") as Role;
  const items = getNotifications(role);
  return NextResponse.json({ items });
}
