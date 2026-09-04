import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { getRepo } from "@/lib/data";
import { EXPERIENCE_ID, EXPERIENCE_SUMMARY, PLACEMENT } from "@/lib/scenario";
import { Card, CardHeading } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { applyToPlacementAction } from "@/lib/actions/placement";
import { Badge } from "@/components/ui/Badge";

export default async function PlacementListingPage() {
  const user = await requireUser();
  const enrollment = await getRepo().getOrCreateEnrollment(user.id);
  const alreadyStarted = enrollment.state !== "invited";

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold text-navy">Available placement</h1>
      <p className="mt-1 mb-6 text-sm text-text-muted">One placement is open in this Release 0.1 preview.</p>
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardHeading>{PLACEMENT.title}</CardHeading>
            <p className="mt-1 text-sm text-text-muted">
              {EXPERIENCE_SUMMARY.organisation} · {EXPERIENCE_SUMMARY.industry}
            </p>
          </div>
          <Badge tone="primary">{EXPERIENCE_SUMMARY.effort}</Badge>
        </div>
        <p className="mt-4 text-sm text-text">{PLACEMENT.evidenceYouWillLeaveWith.length} pieces of evidence you’ll leave with, reviewed by your manager and revised by you.</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">You’ll be responsible for</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-text">
              {PLACEMENT.responsibilities.slice(0, 4).map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Not your call</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-text">
              {PLACEMENT.notResponsibleFor.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6">
          {alreadyStarted ? (
            <Link href={`/placements/${EXPERIENCE_ID}`} className="text-sm font-medium text-primary hover:underline">
              View your placement offer →
            </Link>
          ) : (
            <form action={applyToPlacementAction}>
              <Button type="submit">Apply for this placement</Button>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
}
