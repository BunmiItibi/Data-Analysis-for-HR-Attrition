"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { RaidEntry, RaidLogContent } from "@/lib/domain/types";
import { RAID_ENTRY_TYPES } from "@/lib/domain/types";
import { submitTaskAction, reviseTaskAction } from "@/lib/actions/submissions";
import { useAutosave } from "./useAutosave";
import { inputClass } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Card, CardHeading } from "@/components/ui/Card";

function emptyEntry(): RaidEntry {
  return {
    id: typeof crypto !== "undefined" ? crypto.randomUUID() : Math.random().toString(36).slice(2),
    type: "risk",
    description: "",
    owner: "",
    impact: "medium",
    mitigation: "",
    status: "open",
  };
}

export function RaidLogForm({ initial, mode }: { initial: RaidLogContent | null; mode: "first" | "revise" }) {
  const router = useRouter();
  const [entries, setEntries] = useState<RaidEntry[]>(initial?.entries.length ? initial.entries : [emptyEntry()]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const content = { taskCode: "raid-log" as const, data: { entries: entries.filter((e) => e.description.trim()) } };
  const { savedAt, saving } = useAutosave(content, mode === "first");

  function update(i: number, patch: Partial<RaidEntry>) {
    setEntries((prev) => prev.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));
  }

  function remove(i: number) {
    setEntries((prev) => prev.filter((_, idx) => idx !== i));
  }

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      const fn = mode === "first" ? submitTaskAction : reviseTaskAction;
      const result = await fn(content);
      if (result && !result.ok) setError(result.error ?? "Something went wrong.");
      else router.refresh();
    });
  }

  return (
    <Card>
      <CardHeading>{mode === "first" ? "Your RAID log" : "Revise your RAID log"}</CardHeading>

      <div className="mt-4 flex flex-col gap-3">
        {entries.map((entry, i) => (
          <div key={entry.id} className="rounded-md border border-border p-3">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <label className="flex flex-col gap-1 text-xs text-text-muted">
                Type
                <select className={inputClass} value={entry.type} onChange={(e) => update(i, { type: e.target.value as RaidEntry["type"] })}>
                  {RAID_ENTRY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs text-text-muted">
                Owner
                <input className={inputClass} value={entry.owner} onChange={(e) => update(i, { owner: e.target.value })} />
              </label>
              <label className="flex flex-col gap-1 text-xs text-text-muted">
                Impact
                <select className={inputClass} value={entry.impact} onChange={(e) => update(i, { impact: e.target.value as RaidEntry["impact"] })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs text-text-muted">
                Status
                <select className={inputClass} value={entry.status} onChange={(e) => update(i, { status: e.target.value as RaidEntry["status"] })}>
                  <option value="open">Open</option>
                  <option value="monitoring">Monitoring</option>
                  <option value="closed">Closed</option>
                </select>
              </label>
            </div>
            <label className="mt-2 flex flex-col gap-1 text-xs text-text-muted">
              Description
              <textarea rows={2} className={inputClass} value={entry.description} onChange={(e) => update(i, { description: e.target.value })} />
            </label>
            <label className="mt-2 flex flex-col gap-1 text-xs text-text-muted">
              Mitigation / response
              <textarea rows={2} className={inputClass} value={entry.mitigation} onChange={(e) => update(i, { mitigation: e.target.value })} />
            </label>
            <button type="button" className="mt-2 text-xs font-medium text-danger hover:underline" onClick={() => remove(i)}>
              Remove entry
            </button>
          </div>
        ))}

        <button
          type="button"
          className="text-sm font-medium text-primary hover:underline"
          onClick={() => setEntries((prev) => [...prev, emptyEntry()])}
        >
          + Add another entry
        </button>

        {error && (
          <p role="alert" className="text-sm font-medium text-danger">
            {error}
          </p>
        )}

        <div className="flex items-center gap-3">
          <Button type="button" disabled={pending} onClick={handleSubmit}>
            {pending ? "Submitting…" : mode === "first" ? "Submit for feedback" : "Resubmit"}
          </Button>
          <span className="text-xs text-text-muted">
            {saving ? "Saving…" : savedAt ? `Draft saved ${new Date(savedAt).toLocaleTimeString()}` : ""}
          </span>
        </div>
      </div>
    </Card>
  );
}
