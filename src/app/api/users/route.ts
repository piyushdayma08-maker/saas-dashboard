import { NextResponse } from "next/server";
import { getPublicUsers } from "@/lib/mock-db";

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return NextResponse.json({ users: getPublicUsers() });
}
