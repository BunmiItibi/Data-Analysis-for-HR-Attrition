import { requireUser } from "@/lib/auth/session";
import { getRepo } from "@/lib/data";
import { getTask } from "@/lib/scenario/tasks";
import { PLACEMENT, EXPERIENCE_SUMMARY } from "@/lib/scenario";
import { COMPETENCY_LABELS, SCORE_LABELS } from "@/lib/domain/types";
import { Card, CardHeading } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ContentSummary } from "@/components/tasks/ContentSummary";
import { setConsentAction } from "@/lib/actions/consent";
import { Button } from "@/components/ui/Button";

export default async function PortfolioPage() {
  const user = await requireUser();
  const repo = getRepo();
  const portfolio = await repo.getPortfolio(user.id);
  const consents = await repo.listConsents(user.id);
  const latestPortfolioConsent = [...consents].filter((c) => c.purpose === "portfolio_display").pop();

  if (!portfolio) {
    return <p className="text-sm text-text-muted">Nothing to show yet — start your placement first.</p>;
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="rounded-lg border border-primary/40 bg-primary/5 p-4 text-sm">
        <p className="font-semibold text-navy">
          This candidate completed a structured simulated software-project work placement through Experix.
        </p>
        <p className="mt-1 text-text-muted">This does not represent employment by Northstar Health Digital.</p>
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-navy">{portfolio.profile.fullName}</h1>
        <p className="mt-1 text-sm text-text-muted">
          {EXPERIENCE_SUMMARY.title} · {EXPERIENCE_SUMMARY.organisation}
        </p>
        <div className="mt-2">
          <Badge tone={portfolio.enrollment.state === "completed" ? "success" : "primary"}>
            {portfolio.enrollment.state === "completed" ? "Placement complete" : "Placement in progress"}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeading>Role and responsibilities</CardHeading>
        <p className="mt-2 text-sm text-text-muted">
          {EXPERIENCE_SUMMARY.roleTitle} on {EXPERIENCE_SUMMARY.project}, reporting to {EXPERIENCE_SUMMARY.manager}.
        </p>
        <ul className="mt-2 list-inside list-disc text-sm text-text">
          {PLACEMENT.responsibilities.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </Card>

      {portfolio.experienceProfile && (
        <Card>
          <CardHeading>Career goal</CardHeading>
          <p className="mt-2 text-sm text-text-muted">{portfolio.experienceProfile.careerGoal}</p>
        </Card>
      )}

      <div>
        <h2 className="mb-3 text-base font-semibold text-text">Work products and decisions</h2>
        <div className="flex flex-col gap-3">
          {portfolio.completedSubmissions.map((submission) => {
            const task = getTask(submission.taskCode);
            const finalVersion = submission.versions[submission.versions.length - 1];
            const wasRevised = submission.versions.length > 1;
            return (
              <Card key={submission.id}>
                <div className="flex items-center justify-between">
                  <CardHeading>{task.workProductLabel}</CardHeading>
                  {wasRevised && <Badge tone="success">Revised after feedback</Badge>}
                </div>
                <div className="mt-3">
                  <ContentSummary content={finalVersion.content} />
                </div>
                {finalVersion.assessment && (
                  <p className="mt-3 border-t border-border pt-3 text-xs text-text-muted">
                    Manager feedback: {finalVersion.assessment.managerNote.split("\n")[0]}
                  </p>
                )}
              </Card>
            );
          })}
          {portfolio.completedSubmissions.length === 0 && (
            <Card>No work products completed yet — they’ll appear here once submitted and assessed.</Card>
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-base font-semibold text-text">Competencies demonstrated</h2>
        <div className="flex flex-wrap gap-2">
          {portfolio.competencyScores.map((s) => (
            <Badge key={s.competency} tone="primary">
              {COMPETENCY_LABELS[s.competency]}: {SCORE_LABELS[s.level]}
            </Badge>
          ))}
          {portfolio.competencyScores.length === 0 && <p className="text-sm text-text-muted">None yet.</p>}
        </div>
      </div>

      <Card>
        <CardHeading>Portfolio visibility</CardHeading>
        <p className="mt-2 text-sm text-text-muted">
          This preview is private to you. Release 0.1 does not yet support sharing a public verification link —
          that’s planned for a future release. Your consent choice below is recorded now so it’s ready when
          sharing launches.
        </p>
        <form action={setConsentAction} className="mt-3 flex items-center gap-3">
          <input type="hidden" name="purpose" value="portfolio_display" />
          <input type="hidden" name="granted" value="true" />
          <Button type="submit" variant="secondary">
            {latestPortfolioConsent?.granted ? "Consent recorded ✓" : "Consent to future portfolio sharing"}
          </Button>
          {latestPortfolioConsent && (
            <span className="text-xs text-text-muted">
              Last updated {new Date(latestPortfolioConsent.respondedAt).toLocaleDateString()}
            </span>
          )}
        </form>
      </Card>
    </div>
  );
}
