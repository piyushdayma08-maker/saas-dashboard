"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardMetricDTO } from "@/lib/metrics";

const editSchema = z.object({
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

type EditDraft = { key: string; title: string; value: string }[];

export function MetricsEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Keep separate local state so edits don't fight with fetched values.
  const [draftState, setDraftState] = useState<EditDraft>([]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      try {
        const response = await fetch("/api/metrics");
        if (!response.ok) throw new Error("Failed");
        const data = (await response.json()) as { metrics: DashboardMetricDTO[] };
        if (!active) return;
        setDraftState(data.metrics.map((m) => ({ key: m.key, title: m.title, value: m.value })));
      } catch {
        if (!active) return;
        setError("Unable to load metrics.");
      } finally {
        if (!active) return;
        setLoading(false);
      }
    };

    void run();
    return () => {
      active = false;
    };
  }, []);

  async function onSave() {
    setSubmitError(null);
    setSaving(true);
    try {
      const parsed = editSchema.safeParse({ metrics: draftState });
      if (!parsed.success) {
        setSubmitError("Please check the inputs.");
        return;
      }

      const response = await fetch("/api/metrics/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metrics: parsed.data.metrics }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { message?: string };
        setSubmitError(data.message ?? "Unable to save changes.");
        return;
      }

      const updated = await response.json().catch(() => null);
      if (!updated || !updated.metrics) return;
      setDraftState(
        (updated.metrics as DashboardMetricDTO[]).map((m) => ({
          key: m.key,
          title: m.title,
          value: m.value,
        })),
      );
    } catch {
      setSubmitError("Unable to save changes.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="grid gap-3">
        <Card className="p-4">
          <Skeleton className="h-4 w-40" />
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
        <Card className="p-4">
          <Skeleton className="h-4 w-40" />
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
        <Card className="p-4">
          <Skeleton className="h-4 w-40" />
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-rose-600">{error}</p>;
  }

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-900">Edit dashboard cards</p>
          <p className="text-xs text-zinc-600">Update labels and values for the dashboard overview.</p>
        </div>
        <Button onClick={onSave} disabled={saving || draftState.length === 0}>
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>

      {submitError ? <p className="mb-3 text-sm text-rose-600">{submitError}</p> : null}

      <div className="space-y-3">
        {draftState.map((m, idx) => (
          <div key={m.key} className="grid grid-cols-12 gap-3 rounded-lg border border-zinc-200 p-3">
            <div className="col-span-12 flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-900">
                Card {idx + 1}
              </p>
              <span className="rounded-md bg-zinc-100 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-zinc-600">
                {m.key}
              </span>
            </div>

            <label className="col-span-6 text-xs text-zinc-600">
              Title
              <Input
                className="mt-1"
                value={m.title}
                onChange={(e) => {
                  setDraftState((prev) => {
                    const next = [...prev];
                    next[idx] = { ...next[idx], title: e.target.value };
                    return next;
                  });
                }}
              />
            </label>

            <label className="col-span-6 text-xs text-zinc-600">
              Value
              <Input
                className="mt-1"
                value={m.value}
                onChange={(e) => {
                  setDraftState((prev) => {
                    const next = [...prev];
                    next[idx] = { ...next[idx], value: e.target.value };
                    return next;
                  });
                }}
              />
            </label>
          </div>
        ))}
      </div>
    </Card>
  );
}

