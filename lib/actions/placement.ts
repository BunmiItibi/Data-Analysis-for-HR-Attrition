"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { getRepo } from "@/lib/data";
import { EXPERIENCE_ID } from "@/lib/scenario";
import { INDUCTION_ITEM_IDS, type InductionItemId } from "@/lib/domain/types";

export async function applyToPlacementAction(): Promise<void> {
  const user = await requireUser();
  await getRepo().applyToPlacement(user.id);
  redirect(`/placements/${EXPERIENCE_ID}`);
}

export async function acceptPlacementAction(): Promise<void> {
  const user = await requireUser();
  await getRepo().acceptPlacement(user.id);
  redirect("/induction");
}

export async function markInductionItemCompleteAction(itemId: InductionItemId): Promise<void> {
  const user = await requireUser();
  if (!INDUCTION_ITEM_IDS.includes(itemId)) return;
  await getRepo().completeInductionItem(user.id, itemId);
  revalidatePath("/induction");
}

export async function finishInductionAction(): Promise<void> {
  const user = await requireUser();
  await getRepo().finishInduction(user.id);
  redirect("/dashboard");
}
