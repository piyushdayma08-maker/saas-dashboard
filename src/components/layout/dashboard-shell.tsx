import { ReactNode } from "react";
import { Role, User } from "@/types";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function DashboardShell({
  children,
  role,
  user,
}: {
  children: ReactNode;
  role: Role;
  user: User;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="flex">
        <Sidebar role={role} />
        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar role={role} user={user} />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
