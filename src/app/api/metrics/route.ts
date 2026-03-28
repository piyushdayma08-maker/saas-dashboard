import { NextResponse } from "next/server";
import { getDashboardMetrics } from "@/lib/metrics";
export const runtime = "nodejs";

export async function GET() {
  try {
    const metrics = await getDashboardMetrics();
    return NextResponse.json({ metrics });
  } catch (err) {
    return NextResponse.json({ message: "Unable to load metrics.", error: String(err) }, { status: 500 });
  }
}
