"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const form = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = form.handleSubmit(async (values) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(values),
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      form.setError("root", { message: "Invalid credentials." });
      return;
    }
    router.push("/dashboard");
  });

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-3 rounded-xl border border-zinc-200 bg-white p-6">
        <h1 className="text-2xl font-semibold">Login</h1>
        <Input placeholder="Email" {...form.register("email")} />
        <p className="text-xs text-rose-600">{form.formState.errors.email?.message}</p>
        <Input type="password" placeholder="Password" {...form.register("password")} />
        <p className="text-xs text-rose-600">{form.formState.errors.password?.message}</p>
        <p className="text-xs text-rose-600">{form.formState.errors.root?.message}</p>
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="text-sm text-indigo-600 hover:text-indigo-700"
            onClick={() => router.push("/forgot")}
          >
            Forgot password?
          </button>
        </div>
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>
    </div>
  );
}
