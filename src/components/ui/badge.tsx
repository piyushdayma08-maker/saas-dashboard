import { Role } from "@/types";

export function RoleBadge({ role }: { role: Role }) {
  const classes =
    role === "admin"
      ? "bg-indigo-100 text-indigo-700 border-indigo-200"
      : "bg-emerald-100 text-emerald-700 border-emerald-200";
  return (
    <span className={`rounded-full border px-2 py-1 text-xs font-medium capitalize ${classes}`}>
      {role}
    </span>
  );
}
