import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getRepo } from "@/lib/data";
import type { Profile } from "@/lib/domain/types";

export const SESSION_COOKIE = "experix_session";

/** Demo mode only — Supabase mode manages its own auth cookies via lib/supabase/server.ts. */
export async function setDemoSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearDemoSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<Profile | null> {
  const repo = getRepo();
  if (repo.mode === "supabase") {
    return repo.getUserBySession("");
  }
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return repo.getUserBySession(token);
}

export async function requireUser(): Promise<Profile> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
