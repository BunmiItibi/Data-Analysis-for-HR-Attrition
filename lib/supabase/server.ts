import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { Database } from "./database.types";

/**
 * Server-side Supabase client bound to the current request's cookies. Only
 * call this when `isSupabaseConfigured()` is true — see lib/data/index.ts,
 * which is the only place that should decide between this and the demo
 * repo.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) => {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component render — middleware refreshes
          // the session cookie instead. Safe to ignore here.
        }
      },
    },
  });
}

/**
 * Service-role client for trusted server-only operations (content seeding,
 * admin review actions). Never import this from client code — the key must
 * never reach the browser.
 */
export function createSupabaseServiceRoleClient() {
  // Lazy require: this client is only used from trusted server-only code
  // paths (seeding, admin actions) and should never be pulled into a route
  // that might run without SUPABASE_SERVICE_ROLE_KEY configured.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require("@supabase/supabase-js") as typeof import("@supabase/supabase-js");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  }
  return createClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
