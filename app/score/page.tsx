import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getRepo } from "@/lib/data";
import { COMPETENCIES, COMPETENCY_LABELS, SCORE_LABELS } from "@/lib/domain/types";
import { Card, CardHeading } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";

export default async function ScorePage() {
  const user = await requireUser();
  const repo = getRepo();
  const enrollment = await repo.getOrCreateEnrollment(user.id);

  if (
    enrollment.stage !== "review" &&
    enrollment.stage !== "completed"
  ) {
    redirect("/dashboard");
  }
  if (enrollment.stage === "review") {
    await repo.advanceStage(user.id, "completed");
  }

  const scores = await repo.getCompetencyScores(user.id);
  const scoreByCompetency = new Map(scores.map((s) => [s.competency, s]));

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-navy">Your Experience Score</h1>
        <p className="mt-1 text-sm text-text-muted">
          A developmental view across ten workplace competencies. Every score below is backed by evidence from
          your actual submissions — this is not accredited or certified employment readiness.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {COMPETENCIES.map((competency) => {
          const s = scoreByCompetency.get(competency);
          return (
            <Card key={competency}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardHeading>{COMPETENCY_LABELS[competency]}</CardHeading>
                {s ? (
                  <Badge tone="primary">
                    {s.level}/5 — {SCORE_LABELS[s.level]}
                  </Badge>
                ) : (
                  <Badge tone="neutral">Not yet assessed</Badge>
                )}
              </div>
              {s ? (
                <div className="mt-2 text-sm text-text-muted">
                  <p>{s.rationale}</p>
                  {s.revisionDelta !== null && (
                    <p className="mt-1">
                      {s.revisionDelta > 0
                        ? `Improved by ${s.revisionDelta.toFixed(1)} points after revision.`
                        : s.revisionDelta < 0
                          ? "Score decreased after revision — see feedback for detail."
                          : "No change after revision."}
                    </p>
                  )}
                  <ul className="mt-2 list-inside list-disc space-y-1">
                    {s.evidenceRefs.map((ref, i) => (
                      <li key={i}>
                        <span className="capitalize">{ref.taskCode.replace(/-/g, " ")}</span>: “{ref.excerpt}”
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="mt-2 text-sm text-text-muted">
                  This placement’s work products don’t yet give evidence for this competency.
                </p>
              )}
            </Card>
          );
        })}
      </div>

      <div>
        <ButtonLink href="/portfolio">View my portfolio</ButtonLink>
      </div>
    </div>
  );
}
