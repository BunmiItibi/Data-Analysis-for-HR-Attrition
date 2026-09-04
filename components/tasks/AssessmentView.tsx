import type { Assessment } from "@/lib/domain/types";
import { COMPETENCY_LABELS, SCORE_LABELS } from "@/lib/domain/types";
import { Badge } from "@/components/ui/Badge";
import { MessageBody } from "@/components/MessageBody";

export function AssessmentView({ assessment }: { assessment: Assessment }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border border-navy/20 bg-navy/5 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">Sarah’s feedback</p>
        <MessageBody text={assessment.managerNote} />
      </div>

      <div className="flex flex-col gap-3">
        {assessment.competencyAssessments.map((ca) => (
          <div key={ca.competency} className="rounded-md border border-border p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-text">{COMPETENCY_LABELS[ca.competency]}</p>
              <div className="flex items-center gap-1.5">
                <Badge tone="primary">
                  {ca.score}/5 — {SCORE_LABELS[ca.score]}
                </Badge>
                {ca.safetyFlag && <Badge tone="danger">Safety flag</Badge>}
                {ca.humanReviewFlag && <Badge tone="warning">Human review</Badge>}
              </div>
            </div>
            <p className="mt-2 text-xs text-text-muted">Assessed against: {ca.criterion}</p>
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">Evidence</dt>
                <dd className="text-text">{ca.evidence}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">Strength</dt>
                <dd className="text-text">{ca.strength}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">Gap</dt>
                <dd className="text-text">{ca.gap}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">Improve by</dt>
                <dd className="text-text">{ca.improvement}</dd>
              </div>
            </dl>
            <p className="mt-2 text-xs text-text-muted">Confidence: {ca.confidence}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-text-muted">
        Source: {assessment.source === "ai" ? "AI assessment (Claude)" : assessment.source === "demo" ? "Demo-mode rule-based assessment" : "Human reviewer"}
        {assessment.humanReviewStatus !== "not_required" && ` · Human review: ${assessment.humanReviewStatus}`}
      </p>
    </div>
  );
}
