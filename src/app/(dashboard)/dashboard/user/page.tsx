import { Card } from "@/components/ui/card";

export default function UserDashboardPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">My Workspace</h1>
      <Card>
        <p className="text-sm text-zinc-500">Access level</p>
        <p className="mt-2 text-xl font-semibold">Standard user permissions</p>
      </Card>
    </section>
  );
}
