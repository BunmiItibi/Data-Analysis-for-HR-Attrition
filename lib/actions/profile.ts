"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getRepo } from "@/lib/data";
import { experienceProfileInputSchema } from "@/lib/domain/types";
import type { ActionState } from "./auth";

export async function saveIdentityAction(_prev: ActionState | undefined, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const parsed = experienceProfileInputSchema.safeParse({
    careerGoal: formData.get("careerGoal"),
    currentSituation: formData.get("currentSituation"),
    developmentPriorities: formData.getAll("developmentPriorities"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }
  await getRepo().saveExperienceProfile(user.id, parsed.data);
  redirect("/placements");
}
