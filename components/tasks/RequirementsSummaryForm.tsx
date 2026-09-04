"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { RequirementsSummaryContent } from "@/lib/domain/types";
import { submitTaskAction, reviseTaskAction } from "@/lib/actions/submissions";
import { useAutosave } from "./useAutosave";
import { Field, inputClass } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Card, CardHeading } from "@/components/ui/Card";

const EMPTY: RequirementsSummaryContent = { summary: "", decisions: [], actions: [], openQuestions: [] };

interface ActionRow {
  action: string;
  owner: string;
  dueDate: string;
}

export function RequirementsSummaryForm({
  initial,
  mode,
}: {
  initial: RequirementsSummaryContent | null;
  mode: "first" | "revise";
}) {
  const router = useRouter();
  const [summary, setSummary] = useState(initial?.summary ?? EMPTY.summary);
  const [decisionsText, setDecisionsText] = useState((initial?.decisions ?? []).join("\n"));
  const [openQuestionsText, setOpenQuestionsText] = useState((initial?.openQuestions ?? []).join("\n"));
  const [actions, setActions] = useState<ActionRow[]>(
    initial?.actions.length ? initial.actions : [{ action: "", owner: "", dueDate: "" }],
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const content = {
    taskCode: "requirements-summary" as const,
    data: {
      summary,
      decisions: decisionsText.split("\n").map((s) => s.trim()).filter(Boolean),
      openQuestions: openQuestionsText.split("\n").map((s) => s.trim()).filter(Boolean),
      actions: actions.filter((a) => a.action.trim()),
    },
  };

  const { savedAt, saving } = useAutosave(content, mode === "first");

  function updateAction(i: number, patch: Partial<ActionRow>) {
    setActions((prev) => prev.map((a, idx) => (idx === i ? { ...a, ...patch } : a)));
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
      <CardHeading>{mode === "first" ? "Your requirements summary" : "Revise your requirements summary"}</CardHeading>

      <div className="mt-4 flex flex-col gap-4">
        <Field label="Summary" htmlFor="summary" hint="A few sentences on what the meeting covered.">
          <textarea id="summary" rows={4} className={inputClass} value={summary} onChange={(e) => setSummary(e.target.value)} />
        </Field>

        <Field label="Decisions made" htmlFor="decisions" hint="One per line. Only things actually agreed, not just discussed.">
          <textarea id="decisions" rows={3} className={inputClass} value={decisionsText} onChange={(e) => setDecisionsText(e.target.value)} />
        </Field>

        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-text">Actions</legend>
          <div className="flex flex-col gap-2">
            {actions.map((a, i) => (
              <div key={i} className="grid grid-cols-1 gap-2 rounded-md border border-border p-2 sm:grid-cols-3">
                <input
                  placeholder="Action"
                  className={inputClass}
                  value={a.action}
                  onChange={(e) => updateAction(i, { action: e.target.value })}
                />
                <input
                  placeholder="Owner"
                  className={inputClass}
                  value={a.owner}
                  onChange={(e) => updateAction(i, { owner: e.target.value })}
                />
                <input
                  placeholder="Due date"
                  className={inputClass}
                  value={a.dueDate}
                  onChange={(e) => updateAction(i, { dueDate: e.target.value })}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-2 text-sm font-medium text-primary hover:underline"
            onClick={() => setActions((prev) => [...prev, { action: "", owner: "", dueDate: "" }])}
          >
            + Add another action
          </button>
        </fieldset>

        <Field label="Open questions" htmlFor="openQuestions" hint="One per line. Anything left unresolved.">
          <textarea id="openQuestions" rows={2} className={inputClass} value={openQuestionsText} onChange={(e) => setOpenQuestionsText(e.target.value)} />
        </Field>

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
