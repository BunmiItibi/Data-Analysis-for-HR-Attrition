"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { EscalationRecommendationContent } from "@/lib/domain/types";
import { submitTaskAction, reviseTaskAction } from "@/lib/actions/submissions";
import { useAutosave } from "./useAutosave";
import { Field, inputClass } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Card, CardHeading } from "@/components/ui/Card";

export function EscalationRecommendationForm({
  initial,
  mode,
}: {
  initial: EscalationRecommendationContent | null;
  mode: "first" | "revise";
}) {
  const router = useRouter();
  const [incidentSummary, setIncidentSummary] = useState(initial?.incidentSummary ?? "");
  const [severityAssessment, setSeverityAssessment] = useState(initial?.severityAssessment ?? "");
  const [peopleNotifiedText, setPeopleNotifiedText] = useState((initial?.peopleNotified ?? []).join(", "));
  const [recommendation, setRecommendation] = useState(initial?.recommendation ?? "");
  const [launchReadiness, setLaunchReadiness] = useState<EscalationRecommendationContent["launchReadiness"]>(
    initial?.launchReadiness ?? "conditional",
  );
  const [conditions, setConditions] = useState(initial?.conditions ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const content = {
    taskCode: "escalation-recommendation" as const,
    data: {
      incidentSummary,
      severityAssessment,
      peopleNotified: peopleNotifiedText.split(",").map((s) => s.trim()).filter(Boolean),
      recommendation,
      launchReadiness,
      conditions: conditions || undefined,
    },
  };
  const { savedAt, saving } = useAutosave(content, mode === "first");

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
      <CardHeading>{mode === "first" ? "Your escalation and recommendation" : "Revise your escalation and recommendation"}</CardHeading>

      <div className="mt-4 flex flex-col gap-4">
        <Field label="Incident summary" htmlFor="incidentSummary" hint="What was observed, how often, and what was and wasn't exposed.">
          <textarea id="incidentSummary" rows={4} className={inputClass} value={incidentSummary} onChange={(e) => setIncidentSummary(e.target.value)} />
        </Field>

        <Field label="Severity assessment" htmlFor="severityAssessment" hint="Why this matters, grounded in the evidence.">
          <textarea id="severityAssessment" rows={3} className={inputClass} value={severityAssessment} onChange={(e) => setSeverityAssessment(e.target.value)} />
        </Field>

        <Field
          label="Who have you notified?"
          htmlFor="peopleNotified"
          hint="Comma-separated. Think about who owns privacy and data-handling decisions here."
        >
          <input id="peopleNotified" className={inputClass} value={peopleNotifiedText} onChange={(e) => setPeopleNotifiedText(e.target.value)} />
        </Field>

        <Field label="Your recommendation" htmlFor="recommendation" hint="To Sarah — you're recommending, not deciding.">
          <textarea id="recommendation" rows={4} className={inputClass} value={recommendation} onChange={(e) => setRecommendation(e.target.value)} />
        </Field>

        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-text">Launch readiness</legend>
          <div className="flex flex-col gap-2 sm:flex-row">
            {(["ready", "conditional", "not_ready"] as const).map((v) => (
              <label key={v} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
                <input type="radio" name="launchReadiness" checked={launchReadiness === v} onChange={() => setLaunchReadiness(v)} />
                {v === "ready" ? "Ready" : v === "conditional" ? "Conditional" : "Not ready"}
              </label>
            ))}
          </div>
        </fieldset>

        {launchReadiness === "conditional" && (
          <Field label="Conditions" htmlFor="conditions" hint="What has to happen before go-live.">
            <textarea id="conditions" rows={2} className={inputClass} value={conditions} onChange={(e) => setConditions(e.target.value)} />
          </Field>
        )}

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
