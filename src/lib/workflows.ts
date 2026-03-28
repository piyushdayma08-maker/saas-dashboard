import { prisma } from "@/lib/prisma";

export type WorkflowPriority = "high" | "normal" | "low";

export interface WorkflowRequestDTO {
  id: string;
  projectName: string;
  goal: string;
  model: string;
  budget: number;
  priority: WorkflowPriority;
  requesterName: string;
  requesterEmail: string;
  createdAt: string;
}

const priorityRank: Record<WorkflowPriority, number> = {
  high: 0,
  normal: 1,
  low: 2,
};

export async function listWorkflowRequests(): Promise<WorkflowRequestDTO[]> {
  const rows = await prisma.workflowRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return rows
    .map((row) => ({
      id: row.id,
      projectName: row.projectName,
      goal: row.goal,
      model: row.model,
      budget: row.budget,
      priority: (row.priority as WorkflowPriority) ?? "normal",
      requesterName: row.requesterName,
      requesterEmail: row.requesterEmail,
      createdAt: row.createdAt.toISOString(),
    }))
    .sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);
}
