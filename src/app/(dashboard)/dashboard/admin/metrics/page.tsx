import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { MetricsEditor } from "@/components/dashboard/metrics-editor";

export default async function AdminMetricsPage() {
  const user = await getCurrentUser();
  if (user?.role !== "admin") redirect("/dashboard/user");

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Metrics</h1>
      <p className="text-sm text-zinc-600">
        Update the values shown on the dashboard overview.
      </p>
      <MetricsEditor />
    </section>
  );
}

