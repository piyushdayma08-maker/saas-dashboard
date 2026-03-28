import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { AdminWorkflows } from "@/components/dashboard/admin-workflows";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (user?.role !== "admin") redirect("/dashboard/user");

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin Hub</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="text-sm text-zinc-500">Platform usage</p>
          <p className="mt-2 text-2xl font-semibold">82% capacity</p>
        </Card>
        <Card>
          <p className="text-sm text-zinc-500">Pending approvals</p>
          <p className="mt-2 text-2xl font-semibold">14 requests</p>
        </Card>
      </div>
      <AdminWorkflows />
    </section>
  );
}
