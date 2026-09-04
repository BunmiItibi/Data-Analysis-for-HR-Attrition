"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getRepo } from "@/lib/data";
import { communicationReplyInputSchema } from "@/lib/domain/types";
import type { ActionState } from "./auth";

export async function replyToCommunicationAction(_prev: ActionState | undefined, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const parsed = communicationReplyInputSchema.safeParse({
    communicationId: formData.get("communicationId"),
    bodyMarkdown: formData.get("bodyMarkdown"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Write a short reply before sending." };
  }
  await getRepo().replyToCommunication(user.id, parsed.data.communicationId, parsed.data.bodyMarkdown);
  redirect(`/inbox/${parsed.data.communicationId}`);
}
