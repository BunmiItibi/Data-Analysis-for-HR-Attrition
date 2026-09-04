import { getAppMode } from "@/lib/mode";

export function DemoModeBanner() {
  const mode = getAppMode();
  if (!mode.anyDemo) return null;

  const parts: string[] = [];
  if (mode.dataInDemoMode) parts.push("saved data lives in a local demo store, not Supabase");
  if (mode.aiInDemoMode) parts.push("manager feedback and colleague replies use deterministic rule-based responses, not live Claude");

  return (
    <div className="border-b border-warning/30 bg-warning/10 px-4 py-2 text-center text-sm text-warning">
      <strong className="font-semibold">Demo mode.</strong> {parts.join("; ")}. See{" "}
      <span className="font-medium">.env.example</span> to connect real credentials.
    </div>
  );
}
