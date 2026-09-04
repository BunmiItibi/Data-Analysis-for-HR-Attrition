"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getRepo, ConflictError, AuthError } from "@/lib/data";
import { registerInputSchema, loginInputSchema } from "@/lib/domain/types";
import { SESSION_COOKIE, setDemoSessionCookie, clearDemoSessionCookie } from "@/lib/auth/session";

export interface ActionState {
  error?: string;
}

export async function registerAction(_prev: ActionState | undefined, formData: FormData): Promise<ActionState> {
  const parsed = registerInputSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }
  try {
    const repo = getRepo();
    const { sessionToken } = await repo.registerUser(parsed.data);
    if (repo.mode === "demo") await setDemoSessionCookie(sessionToken);
  } catch (err) {
    if (err instanceof ConflictError) return { error: err.message };
    console.error(err);
    return { error: "Something went wrong creating your account. Please try again." };
  }
  redirect("/identity");
}

export async function loginAction(_prev: ActionState | undefined, formData: FormData): Promise<ActionState> {
  const parsed = loginInputSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }
  try {
    const repo = getRepo();
    const { sessionToken } = await repo.loginUser(parsed.data);
    if (repo.mode === "demo") await setDemoSessionCookie(sessionToken);
  } catch (err) {
    if (err instanceof AuthError) return { error: err.message };
    console.error(err);
    return { error: "Something went wrong signing you in. Please try again." };
  }
  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  const repo = getRepo();
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value ?? "";
  await repo.logout(token);
  await clearDemoSessionCookie();
  redirect("/");
}
