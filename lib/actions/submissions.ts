"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getRepo } from "@/lib/data";
import { submissionContentSchema, type SubmissionContent, type TaskCode } from "@/lib/domain/types";

export interface SaveResult {
  ok: boolean;
  error?: string;
  savedAt?: string;
}

export async function saveDraftAction(content: SubmissionContent): Promise<SaveResult> {
  const user = await requireUser();
  const parsed = submissionContentSchema.safeParse(content);
  if (!parsed.success) return { ok: false, error: "Couldn't save — check your entries." };
  const submission = await getRepo().saveDraft(user.id, parsed.data.taskCode, parsed.data);
  return { ok: true, savedAt: submission.updatedAt };
}

const ALL_TASK_CODES: TaskCode[] = ["requirements-summary", "raid-log", "escalation-recommendation"];

async function advanceToReviewIfAllFinalised(userId: string) {
  const repo = getRepo();
  const submissions = await repo.listSubmissions(userId);
  const allFinalised = ALL_TASK_CODES.every((code) => {
    const s = submissions.find((sub) => sub.taskCode === code);
    return s && (s.status === "feedback_available" || s.status === "resubmitted");
  });
  if (allFinalised) await repo.advanceStage(userId, "review");
}

export async function submitTaskAction(content: SubmissionContent): Promise<SaveResult> {
  const user = await requireUser();
  const parsed = submissionContentSchema.safeParse(content);
  if (!parsed.success) return { ok: false, error: "Check the form — something is missing or too short." };
  await getRepo().submitSubmission(user.id, parsed.data.taskCode, parsed.data);
  await advanceToReviewIfAllFinalised(user.id);
  redirect(`/submissions/${parsed.data.taskCode}/feedback`);
}

export async function reviseTaskAction(content: SubmissionContent): Promise<SaveResult> {
  const user = await requireUser();
  const parsed = submissionContentSchema.safeParse(content);
  if (!parsed.success) return { ok: false, error: "Check the form — something is missing or too short." };
  await getRepo().reviseSubmission(user.id, parsed.data.taskCode, parsed.data);
  await advanceToReviewIfAllFinalised(user.id);
  redirect(`/submissions/${parsed.data.taskCode}/feedback`);
}

export async function getSubmissionForTask(taskCode: TaskCode) {
  const user = await requireUser();
  return getRepo().getSubmission(user.id, taskCode);
}
