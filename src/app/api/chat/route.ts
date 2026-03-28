import { NextResponse } from "next/server";

const cannedResponses = [
  "You can improve conversion by tightening onboarding to one primary task.",
  "Usage is rising this week. Consider alerting the team at 85% budget threshold.",
  "For retention, activate contextual nudges on step 2 of the workflow wizard.",
];

export async function POST(request: Request) {
  const body = (await request.json()) as { message: string };
  await new Promise((resolve) => setTimeout(resolve, 900));
  const pick = cannedResponses[Math.floor(Math.random() * cannedResponses.length)];
  return NextResponse.json({ response: `${pick} (Prompt received: "${body.message}")` });
}
