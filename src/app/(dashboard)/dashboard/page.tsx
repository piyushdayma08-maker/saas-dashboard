import { DashboardSummary } from "@/components/dashboard/dashboard-summary";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
      <p className="text-sm text-zinc-600">
        Personalized for {user?.role === "admin" ? "administrators" : "workspace users"}.
      </p>
      <DashboardSummary />
    </section>
  );
}
