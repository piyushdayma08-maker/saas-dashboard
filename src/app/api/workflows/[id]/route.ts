import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";

const schema = z.object({
  priority: z.enum(["high", "normal", "low"]),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const body = await request.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ message: "Invalid priority." }, { status: 400 });

    const { id } = await params;
    await prisma.workflowRequest.update({
      where: { id },
      data: { priority: parsed.data.priority },
    });

    return NextResponse.json({ message: "Priority updated." });
  } catch (err) {
    return NextResponse.json({ message: "Server error", error: String(err) }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const { id } = await params;
    await prisma.workflowRequest.delete({ where: { id } });

    return NextResponse.json({ message: "Workflow removed." });
  } catch (err) {
    return NextResponse.json({ message: "Server error", error: String(err) }, { status: 500 });
  }
}
