"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, WandSparkles, Bot, ShieldCheck, Gauge } from "lucide-react";
import { Role } from "@/types";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";

const commonLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/users", label: "Users", icon: Users },
  { href: "/dashboard/workflows/new", label: "Workflow", icon: WandSparkles },
  { href: "/dashboard/assistant", label: "AI Assistant", icon: Bot },
];

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const collapsed = useUIStore((state) => state.sidebarCollapsed);
  const links = [
    ...commonLinks,
    role === "admin"
      ? { href: "/dashboard/admin", label: "Admin Hub", icon: ShieldCheck }
      : { href: "/dashboard/user", label: "My Workspace", icon: ShieldCheck },
  ];

  const adminExtras =
    role === "admin"
      ? [{ href: "/dashboard/admin/metrics", label: "Metrics", icon: Gauge }]
      : [];

  return (
    <aside
      className={cn(
        "hidden h-screen border-r border-zinc-200 bg-white p-3 md:block",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="mb-8 mt-2 flex items-center gap-2 px-2">
        <Image
          src="/flowdesk.svg"
          alt="FlowDesk"
          width={collapsed ? 28 : 32}
          height={collapsed ? 28 : 32}
          priority
        />
        {!collapsed ? <span className="text-lg font-semibold text-zinc-900">FlowDesk</span> : null}
      </div>
      <nav className="space-y-1">
        {[...links, ...adminExtras].map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900",
              )}
            >
              <Icon size={18} />
              {!collapsed ? <span>{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
