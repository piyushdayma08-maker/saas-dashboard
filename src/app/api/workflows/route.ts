import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { listWorkflowRequests } from "@/lib/workflows";
export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const workflows = await listWorkflowRequests();
    return NextResponse.json({ workflows });
  } catch (err) {
    return NextResponse.json({ message: "Server error", error: String(err) }, { status: 500 });
  }
}
