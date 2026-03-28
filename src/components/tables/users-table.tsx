"use client";

import { useMemo, useState } from "react";
import { RoleBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@/types";

export function UsersTable({ initialUsers }: { initialUsers: User[] }) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase();
    return initialUsers
      .filter((user) => {
        const matchText =
          user.name.toLowerCase().includes(normalized) ||
          user.email.toLowerCase().includes(normalized);
        const matchRole = roleFilter === "all" || user.role === roleFilter;
        return matchText && matchRole;
      })
      .sort((a, b) => (sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
  }, [initialUsers, query, roleFilter, sortAsc]);

  const maxPage = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <Input
          placeholder="Search users by name or email..."
          className="max-w-md"
          value={query}
          onChange={(e) => {
            setPage(1);
            setQuery(e.target.value);
          }}
        />
        <div className="flex gap-2">
          <select
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            value={roleFilter}
            onChange={(e) => {
              setPage(1);
              setRoleFilter(e.target.value as "all" | "admin" | "user");
            }}
          >
            <option value="all">All roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <Button variant="secondary" onClick={() => setSortAsc((prev) => !prev)}>
            Sort {sortAsc ? "A-Z" : "Z-A"}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-zinc-500">
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((user) => (
              <tr key={user.id} className="border-b border-zinc-100 last:border-0">
                <td className="py-3 font-medium text-zinc-900">{user.name}</td>
                <td className="py-3 text-zinc-600">{user.email}</td>
                <td className="py-3">
                  <RoleBadge role={user.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-zinc-500">
          Page {page} of {maxPage}
        </span>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </Button>
          <Button
            variant="ghost"
            disabled={page === maxPage}
            onClick={() => setPage((prev) => Math.min(maxPage, prev + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
