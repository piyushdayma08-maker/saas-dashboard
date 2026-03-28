"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkflowRequestDTO, WorkflowPriority } from "@/lib/workflows";

export function AdminWorkflows() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<WorkflowRequestDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function loadItems() {
    setError(null);
    try {
      const response = await fetch("/api/workflows");
      if (!response.ok) throw new Error("Failed");
      const data = (await response.json()) as { workflows: WorkflowRequestDTO[] };
      setItems(data.workflows);
    } catch {
      setError("Unable to load workflow requests.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadItems();
  }, []);

  async function updatePriority(id: string, priority: WorkflowPriority) {
    setSavingId(id);
    try {
      await fetch(`/api/workflows/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority }),
      });
      await loadItems();
    } finally {
      setSavingId(null);
    }
  }

  async function remove(id: string) {
    setSavingId(id);
    try {
      await fetch(`/api/workflows/${id}`, { method: "DELETE" });
      await loadItems();
    } finally {
      setSavingId(null);
    }
  }

  if (loading) {
    return (
      <Card>
        <Skeleton className="h-5 w-44" />
        <div className="mt-3 space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="space-y-3">
      <h2 className="text-lg font-semibold">Workflow queue</h2>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {items.length === 0 ? (
        <p className="text-sm text-zinc-600">No workflow requests yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-lg border border-zinc-200 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-zinc-900">{item.projectName}</p>
                  <p className="text-xs text-zinc-600">
                    {item.requesterName} ({item.requesterEmail})
                  </p>
                  <p className="mt-1 text-xs text-zinc-600">{item.goal}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Model: {item.model} | Budget: ${item.budget}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="rounded-md border border-zinc-300 px-2 py-1 text-xs"
                    value={item.priority}
                    disabled={savingId === item.id}
                    onChange={(e) => void updatePriority(item.id, e.target.value as WorkflowPriority)}
                  >
                    <option value="high">High priority</option>
                    <option value="normal">Normal priority</option>
                    <option value="low">Low priority</option>
                  </select>
                  <Button
                    variant="danger"
                    className="px-3 py-1 text-xs"
                    disabled={savingId === item.id}
                    onClick={() => void remove(item.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
