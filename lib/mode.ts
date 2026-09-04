import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isDemoAiMode } from "@/lib/ai";

export interface AppMode {
  dataInDemoMode: boolean;
  aiInDemoMode: boolean;
  anyDemo: boolean;
}

export function getAppMode(): AppMode {
  const dataInDemoMode = !isSupabaseConfigured();
  const aiInDemoMode = isDemoAiMode();
  return { dataInDemoMode, aiInDemoMode, anyDemo: dataInDemoMode || aiInDemoMode };
}
