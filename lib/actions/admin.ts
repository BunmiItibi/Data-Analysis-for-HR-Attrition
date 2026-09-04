"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { getRepo } from "@/lib/data";

export async function markAssessmentReviewedAction(assessmentId: string): Promise<void> {
  const user = await requireUser();
  if (user.appRole !== "facilitator" && user.appRole !== "admin") redirect("/dashboard");
  await getRepo().markAssessmentReviewed(assessmentId);
  revalidatePath("/admin/review");
}
