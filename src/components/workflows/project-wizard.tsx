"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  projectName: z.string().min(3, "Project name must be 3+ chars"),
  goal: z.string().min(8, "Goal should be descriptive"),
  model: z.string().min(2, "Pick a model"),
  budget: z.number().min(100, "Budget must be at least 100"),
});

type FormData = z.infer<typeof schema>;

export function ProjectWizard() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange", // ✅ better UX
    defaultValues: {
      projectName: "",
      goal: "",
      model: "GPT-5",
      budget: 500,
    },
  });

  // ✅ FIX: step-wise validation
  const handleNext = async () => {
    let valid = false;

    if (step === 1) {
      valid = await form.trigger(["projectName", "goal"]);
    } else if (step === 2) {
      valid = await form.trigger(["model", "budget"]);
    }

    if (valid) setStep(step + 1);
  };

  const onSubmit = form.handleSubmit(
    async (values) => {
      try {
        setLoading(true);
        setSubmitted(null);

        const response = await fetch("/api/workflow/submit", {
          method: "POST",
          body: JSON.stringify(values),
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed");

        const data = await response.json();
        setSubmitted(data.message);
      } catch (err) {
        console.error(err);
        setSubmitted("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    (errors) => {
      // form validation errors handled via UI
    }
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-4">
      <p className="text-sm font-medium text-zinc-700">Step {step} of 3</p>

      {step === 1 && (
        <>
          <Input placeholder="Project name" {...form.register("projectName")} />
          <p className="text-xs text-rose-600">{form.formState.errors.projectName?.message}</p>

          <Input placeholder="Primary goal" {...form.register("goal")} />
          <p className="text-xs text-rose-600">{form.formState.errors.goal?.message}</p>
        </>
      )}

      {step === 2 && (
        <>
          <Input placeholder="Model" {...form.register("model")} />
          <p className="text-xs text-rose-600">{form.formState.errors.model?.message}</p>

          <Input
            type="number"
            placeholder="Budget"
            {...form.register("budget", { valueAsNumber: true })}
          />
          <p className="text-xs text-rose-600">{form.formState.errors.budget?.message}</p>
        </>
      )}

      {step === 3 && (
        <div className="rounded-lg bg-zinc-100 p-3 text-sm text-zinc-700">
          Review your inputs and submit the workflow.
        </div>
      )}

      <div className="flex gap-2">
        <Button type="button" variant="ghost" disabled={step === 1} onClick={() => setStep(step - 1)}>
          Back
        </Button>

        {step < 3 ? (
          <Button type="button" onClick={handleNext}>
            Continue
          </Button>
        ) : (
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit workflow"}
          </Button>
        )}
      </div>

      {submitted && <p className="text-sm text-emerald-700">{submitted}</p>}
    </form>
  );
}