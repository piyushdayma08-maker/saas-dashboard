"use client";

import { Bell, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/hooks/use-notifications";
import { useUIStore } from "@/store/ui-store";
import { Role, User } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function Topbar({ role, user }: { role: Role; user: User }) {
  const router = useRouter();
  const collapsed = useUIStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const notifications = useUIStore((state) => state.notifications);
  const { loading } = useNotifications(role);

  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-4">
      <div className="flex items-center gap-2">
        <button
          onClick={toggleSidebar}
          className="rounded-md p-2 text-zinc-600 hover:bg-zinc-100"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
        <p className="text-sm text-zinc-500">Welcome back, {user.name.split(" ")[0]}.</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1.5 text-xs text-zinc-700">
          <Bell size={14} />
          {loading ? <Skeleton className="h-3 w-10" /> : <span>{notifications.length} new</span>}
        </div>
        <Button
          variant="secondary"
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
          }}
        >
          Sign out
        </Button>
      </div>
    </header>
  );
}
