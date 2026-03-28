"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardMetricDTO } from "@/lib/metrics";

export function MetricsCards() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetricDTO[]>([]);

  useEffect(() => {
    let active = true;

    const run = async () => {
      try {
        const response = await fetch("/api/metrics");
        if (!response.ok) throw new Error("Failed");
        const data = (await response.json()) as { metrics: DashboardMetricDTO[] };
        if (active) setMetrics(data.metrics);
      } catch {
        if (active) setError("Unable to load dashboard metrics.");
      } finally {
        if (active) setLoading(false);
      }
    };

    void run();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-rose-600">{error}</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric) => (
        <Card key={metric.id}>
          <p className="text-sm text-zinc-500">{metric.title}</p>
          <p className="mt-2 text-2xl font-semibold">{metric.value}</p>
        </Card>
      ))}
    </div>
  );
}
