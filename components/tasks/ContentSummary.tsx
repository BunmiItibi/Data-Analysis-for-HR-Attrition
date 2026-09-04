import type { SubmissionContent } from "@/lib/domain/types";

export function ContentSummary({ content }: { content: SubmissionContent }) {
  if (content.taskCode === "requirements-summary") {
    const { data } = content;
    return (
      <div className="flex flex-col gap-3 text-sm">
        <p>{data.summary}</p>
        {data.decisions.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Decisions</p>
            <ul className="mt-1 list-inside list-disc">
              {data.decisions.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        )}
        {data.actions.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Actions</p>
            <ul className="mt-1 list-inside list-disc">
              {data.actions.map((a) => (
                <li key={a.action}>
                  {a.action} — {a.owner} ({a.dueDate})
                </li>
              ))}
            </ul>
          </div>
        )}
        {data.openQuestions.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Open questions</p>
            <ul className="mt-1 list-inside list-disc">
              {data.openQuestions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  if (content.taskCode === "raid-log") {
    const { data } = content;
    return (
      <div className="flex flex-col gap-2 text-sm">
        {data.entries.map((e) => (
          <div key={e.id} className="rounded-md border border-border p-2">
            <p className="font-medium capitalize text-text">
              {e.type} · {e.impact} impact · {e.status}
            </p>
            <p className="text-text-muted">{e.description}</p>
            <p className="text-xs text-text-muted">
              Owner: {e.owner || "—"} · Mitigation: {e.mitigation || "—"}
            </p>
          </div>
        ))}
      </div>
    );
  }

  const { data } = content;
  return (
    <div className="flex flex-col gap-3 text-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Incident summary</p>
        <p>{data.incidentSummary}</p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Severity assessment</p>
        <p>{data.severityAssessment}</p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">People notified</p>
        <p>{data.peopleNotified.join(", ") || "None recorded"}</p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Recommendation</p>
        <p>{data.recommendation}</p>
        <p className="mt-1 text-xs text-text-muted">
          Launch readiness: <span className="font-medium">{data.launchReadiness}</span>
          {data.conditions ? ` — ${data.conditions}` : ""}
        </p>
      </div>
    </div>
  );
}
