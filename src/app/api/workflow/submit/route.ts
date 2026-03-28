import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";

const schema = z.object({
  projectName: z.string().min(3),
  goal: z.string().min(8),
  model: z.string().min(2),
  budget: z.number().min(100),
});

export async function POST(request: Request) {
  try {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid workflow input." }, { status: 400 });
  }

  const workflow = await prisma.workflowRequest.create({
    data: {
      projectName: parsed.data.projectName,
      goal: parsed.data.goal,
      model: parsed.data.model,
      budget: parsed.data.budget,
      requesterName: user.name,
      requesterEmail: user.email,
      requesterUserId: user.id,
    },
  });

  return NextResponse.json({
    message: "Workflow submitted successfully.",
    workflowId: workflow.id,
  });
  } catch (err) {
    return NextResponse.json({ message: "Server error", error: String(err) }, { status: 500 });
  }
}
