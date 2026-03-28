"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Summary = {
  team: { total: number; high: number; normal: number; low: number };
  mine: { total: number; high: number; normal: number; low: number };
};

export function DashboardSummary() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    let active = true;
    const run = async () => {
      try {
        const res = await fetch("/api/dashboard/summary");
        if (!res.ok) throw new Error("Failed");
        const data = (await res.json()) as Summary;
        if (active) setSummary(data);
      } catch {
        if (active) setError("Unable to load dashboard data.");
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
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  }

  if (error || !summary) {
    return <p className="text-sm text-rose-600">{error ?? "Unable to load dashboard data."}</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <p className="text-sm font-medium text-zinc-900">Workspace</p>
        <p className="mt-1 text-xs text-zinc-600">All workflow requests</p>
        <div className="mt-3 grid grid-cols-4 gap-2 text-sm">
          <div>
            <p className="text-xs text-zinc-500">Total</p>
            <p className="font-semibold">{summary.team.total}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">High</p>
            <p className="font-semibold">{summary.team.high}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Normal</p>
            <p className="font-semibold">{summary.team.normal}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Low</p>
            <p className="font-semibold">{summary.team.low}</p>
          </div>
        </div>
      </Card>

      <Card>
        <p className="text-sm font-medium text-zinc-900">Your items</p>
        <p className="mt-1 text-xs text-zinc-600">Requests you submitted</p>
        <div className="mt-3 grid grid-cols-4 gap-2 text-sm">
          <div>
            <p className="text-xs text-zinc-500">Total</p>
            <p className="font-semibold">{summary.mine.total}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">High</p>
            <p className="font-semibold">{summary.mine.high}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Normal</p>
            <p className="font-semibold">{summary.mine.normal}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Low</p>
            <p className="font-semibold">{summary.mine.low}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

