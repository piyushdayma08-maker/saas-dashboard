import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const metrics = [
    { metricKey: "active_projects", label: "Active projects", value: "24", position: 1 },
    { metricKey: "mrr", label: "Monthly recurring revenue", value: "$54,280", position: 2 },
    { metricKey: "conversion_rate", label: "Conversion rate", value: "12.9%", position: 3 },
  ];

  for (const metric of metrics) {
    await prisma.dashboardMetric.upsert({
      where: { metricKey: metric.metricKey },
      update: {
        label: metric.label,
        value: metric.value,
        position: metric.position,
      },
      create: metric,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
