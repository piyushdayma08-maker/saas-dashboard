import { UsersTable } from "@/components/tables/users-table";
import { getPublicUsers } from "@/lib/mock-db";

export default function UsersPage() {
  const users = getPublicUsers();
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">User Management</h1>
      <UsersTable initialUsers={users} />
    </section>
  );
}
