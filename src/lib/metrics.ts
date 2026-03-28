import { prisma } from "@/lib/prisma";

export interface DashboardMetricDTO {
  id: string;
  key: string;
  title: string;
  value: string;
}

export async function getDashboardMetrics(): Promise<DashboardMetricDTO[]> {
  const rows = await prisma.dashboardMetric.findMany({
    orderBy: { position: "asc" },
  });

  return rows.map((row) => ({
    id: row.id,
    key: row.metricKey,
    title: row.label,
    value: row.value,
  }));
}
