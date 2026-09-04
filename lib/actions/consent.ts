"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { getRepo } from "@/lib/data";
import { consentInputSchema } from "@/lib/domain/types";

export async function setConsentAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const parsed = consentInputSchema.safeParse({
    purpose: formData.get("purpose"),
    granted: formData.get("granted") === "true",
  });
  if (!parsed.success) return;
  await getRepo().setConsent(user.id, parsed.data.purpose, parsed.data.granted);
  revalidatePath("/portfolio");
}
