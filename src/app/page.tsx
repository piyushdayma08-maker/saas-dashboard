import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-6">
      <main className="w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-600">
        Welcome to FlowDesk
        </p>
        <h1 className="text-3xl font-semibold text-zinc-900">FlowDesk Dashboard</h1>
        <p className="mt-2 text-zinc-600">
        Manage workflows, users, and updates in one place.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/login">
            <Button>Login</Button>
          </Link>
          <Link href="/signup">
            <Button variant="secondary">Create account</Button>
          </Link>
        </div>
        {/* <p className="mt-4 text-xs text-zinc-500">
          Demo accounts: admin@saasflow.dev / admin1234 and user@saasflow.dev / user1234
        </p> */}
      </main>
    </div>
  );
}
