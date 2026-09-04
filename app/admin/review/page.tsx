import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getRepo } from "@/lib/data";
import { getTask } from "@/lib/scenario/tasks";
import { COMPETENCY_LABELS } from "@/lib/domain/types";
import { Card, CardHeading } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { markAssessmentReviewedAction } from "@/lib/actions/admin";

export default async function AdminReviewPage() {
  const user = await requireUser();
  if (user.appRole !== "facilitator" && user.appRole !== "admin") redirect("/dashboard");

  const flagged = await getRepo().listFlaggedAssessments();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-navy">Review queue</h1>
        <p className="mt-1 text-sm text-text-muted">
          Assessments flagged for human review — low confidence, disputed, privacy-related or otherwise
          consequential. This is a minimal Release 0.1 view; full content and participant management is out of
          scope for this release (see docs/PRODUCT_DECISIONS.md).
        </p>
      </div>

      {flagged.length === 0 && <Card>Nothing waiting for review.</Card>}

      <div className="flex flex-col gap-4">
        {flagged.map(({ assessment, userFullName, taskCode }) => (
          <Card key={assessment.id}>
            <div className="flex items-center justify-between">
              <CardHeading>
                {userFullName} — {getTask(taskCode).workProductLabel}
              </CardHeading>
              <Badge tone="warning">Pending review</Badge>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              {assessment.competencyAssessments
                .filter((ca) => ca.humanReviewFlag)
                .map((ca) => (
                  <div key={ca.competency} className="rounded-md border border-border p-2 text-sm">
                    <p className="font-medium text-text">
                      {COMPETENCY_LABELS[ca.competency]} — {ca.score}/5{" "}
                      {ca.safetyFlag && <Badge tone="danger">Safety flag</Badge>}
                    </p>
                    <p className="text-text-muted">{ca.gap}</p>
                  </div>
                ))}
            </div>
            <form action={markAssessmentReviewedAction.bind(null, assessment.id)} className="mt-3">
              <Button type="submit" variant="secondary">
                Mark reviewed
              </Button>
            </form>
          </Card>
        ))}
      </div>
    </div>
  );
}
