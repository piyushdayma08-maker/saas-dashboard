import { ProjectWizard } from "@/components/workflows/project-wizard";

export default function NewWorkflowPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">New Workflow</h1>
      <ProjectWizard />
    </section>
  );
}
