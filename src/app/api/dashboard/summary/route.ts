import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const [teamTotal, teamHigh, teamNormal, teamLow, teamRecent] = await Promise.all([
      prisma.workflowRequest.count(),
      prisma.workflowRequest.count({ where: { priority: "high" } }),
      prisma.workflowRequest.count({ where: { priority: "normal" } }),
      prisma.workflowRequest.count({ where: { priority: "low" } }),
      prisma.workflowRequest.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, projectName: true, priority: true, createdAt: true, requesterUserId: true },
      }),
    ]);

    const mineWhere =
      user.id
        ? { OR: [{ requesterUserId: user.id }, { requesterEmail: user.email }] }
        : { requesterEmail: user.email };

    const [myTotal, myHigh, myNormal, myLow, myRecent] = await Promise.all([
      prisma.workflowRequest.count({ where: mineWhere }),
      prisma.workflowRequest.count({ where: { ...mineWhere, priority: "high" } }),
      prisma.workflowRequest.count({ where: { ...mineWhere, priority: "normal" } }),
      prisma.workflowRequest.count({ where: { ...mineWhere, priority: "low" } }),
      prisma.workflowRequest.findMany({
        where: mineWhere,
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, projectName: true, priority: true, createdAt: true },
      }),
    ]);

    return NextResponse.json({
      team: {
        total: teamTotal,
        high: teamHigh,
        normal: teamNormal,
        low: teamLow,
        recent: teamRecent.map((r) => ({
          id: r.id,
          projectName: r.projectName,
          priority: r.priority,
          createdAt: r.createdAt.toISOString(),
        })),
      },
      mine: {
        total: myTotal,
        high: myHigh,
        normal: myNormal,
        low: myLow,
        recent: myRecent.map((r) => ({
          id: r.id,
          projectName: r.projectName,
          priority: r.priority,
          createdAt: r.createdAt.toISOString(),
        })),
      },
    });
  } catch (err) {
    return NextResponse.json({ message: "Server error", error: String(err) }, { status: 500 });
  }
}

