import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Repo } from "./repo";

let repo: Repo | null = null;

export function getRepo(): Repo {
  if (!repo) {
    // Lazy require, not `import`: keeps the unused backend (and its SDK)
    // out of the bundle — demo builds never pull in @supabase/supabase-js.
    /* eslint-disable @typescript-eslint/no-require-imports */
    if (isSupabaseConfigured()) {
      const { SupabaseRepo } = require("./supabase/supabaseRepo") as typeof import("./supabase/supabaseRepo");
      repo = new SupabaseRepo();
    } else {
      const { DemoRepo } = require("./demo/demoRepo") as typeof import("./demo/demoRepo");
      repo = new DemoRepo();
    }
    /* eslint-enable @typescript-eslint/no-require-imports */
  }
  return repo;
}

export * from "./repo";
