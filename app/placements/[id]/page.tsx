import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getRepo } from "@/lib/data";
import { EXPERIENCE_ID, PLACEMENT } from "@/lib/scenario";
import { Card, CardHeading } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { acceptPlacementAction } from "@/lib/actions/placement";

export default async function PlacementOfferPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id !== EXPERIENCE_ID) notFound();

  const user = await requireUser();
  const enrollment = await getRepo().getOrCreateEnrollment(user.id);

  if (enrollment.state === "invited") redirect("/placements");
  if (enrollment.state !== "offered") redirect("/induction");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold text-navy">Your placement offer</h1>
      <p className="mt-1 mb-6 text-sm text-text-muted">Review the terms before you accept.</p>
      <Card>
        <CardHeading>{PLACEMENT.title}</CardHeading>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">Organisation</dt>
            <dd>{PLACEMENT.organisation}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">Project</dt>
            <dd>{PLACEMENT.project}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">Manager</dt>
            <dd>{PLACEMENT.manager}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">Expected effort</dt>
            <dd>{PLACEMENT.expectedEffort}</dd>
          </div>
        </dl>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Conduct you’re agreeing to</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-text">
            {PLACEMENT.conduct.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Evidence you’ll leave with</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-text">
            {PLACEMENT.evidenceYouWillLeaveWith.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>

        <form action={acceptPlacementAction} className="mt-6">
          <Button type="submit">Accept placement</Button>
        </form>
      </Card>
    </div>
  );
}
