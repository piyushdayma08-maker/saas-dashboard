"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["admin", "user"]),
});

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "user" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(values),
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      form.setError("root", { message: "Email already exists." });
      return;
    }
    router.push("/dashboard");
  });

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-3 rounded-xl border border-zinc-200 bg-white p-6">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <Input placeholder="Full name" {...form.register("name")} />
        <p className="text-xs text-rose-600">{form.formState.errors.name?.message}</p>
        <Input placeholder="Email" {...form.register("email")} />
        <p className="text-xs text-rose-600">{form.formState.errors.email?.message}</p>
        <Input type="password" placeholder="Password" {...form.register("password")} />
        <p className="text-xs text-rose-600">{form.formState.errors.password?.message}</p>
        <select className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm" {...form.register("role")}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <p className="text-xs text-rose-600">{form.formState.errors.root?.message}</p>
        <Button type="submit" className="w-full">
          Sign up
        </Button>
      </form>
    </div>
  );
}
