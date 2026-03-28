import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";

const updateSchema = z.object({
  metrics: z
    .array(
      z.object({
        key: z.string().min(1),
        title: z.string().min(1),
        value: z.string().min(1),
      }),
    )
    .min(1),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const body = await request.json().catch(() => null);
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ message: "Invalid input" }, { status: 400 });

    const incoming = parsed.data.metrics;
    const keys = incoming.map((m) => m.key);

    const existing = await prisma.dashboardMetric.findMany({
      where: { metricKey: { in: keys } },
    });
    const positionByKey = new Map(existing.map((m) => [m.metricKey, m.position]));

    const updates = incoming.map((m, index) => {
      const position = positionByKey.get(m.key) ?? index + 1;
      return prisma.dashboardMetric.upsert({
        where: { metricKey: m.key },
        update: {
          label: m.title,
          value: m.value,
          position,
        },
        create: {
          metricKey: m.key,
          label: m.title,
          value: m.value,
          position,
        },
      });
    });

    await Promise.all(updates);

    const updated = await prisma.dashboardMetric.findMany({
      orderBy: { position: "asc" },
    });

    return NextResponse.json({
      metrics: updated.map((row) => ({
        id: row.id,
        key: row.metricKey,
        title: row.label,
        value: row.value,
      })),
    });
  } catch (err) {
    return NextResponse.json({ message: "Server error", error: String(err) }, { status: 500 });
  }
}

