import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getRepo } from "@/lib/data";
import { INDUCTION_ITEMS } from "@/lib/scenario";
import { INDUCTION_ITEM_IDS } from "@/lib/domain/types";
import { Card, CardHeading } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { finishInductionAction, markInductionItemCompleteAction } from "@/lib/actions/placement";

export default async function InductionPage() {
  const user = await requireUser();
  const enrollment = await getRepo().getOrCreateEnrollment(user.id);

  if (enrollment.state === "invited" || enrollment.state === "applied" || enrollment.state === "offered") {
    redirect("/placements");
  }
  if (enrollment.stage !== "induction") redirect("/dashboard");

  const completed = enrollment.inductionCompletedItemIds;
  const allDone = INDUCTION_ITEM_IDS.every((id) => completed.includes(id));

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold text-navy">Workplace induction</h1>
      <p className="mt-1 mb-4 text-sm text-text-muted">
        Five short items before your first day. Mark each one complete once you’ve read it.
      </p>
      <div className="mb-6">
        <ProgressBar value={(completed.length / INDUCTION_ITEM_IDS.length) * 100} label="Induction progress" />
      </div>

      <div className="flex flex-col gap-3">
        {INDUCTION_ITEMS.map((item) => {
          const done = completed.includes(item.id);
          return (
            <Card key={item.id} className={done ? "border-success/40" : ""}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <CardHeading>{item.title}</CardHeading>
                    {done && <Badge tone="success">Complete</Badge>}
                  </div>
                  <p className="mt-2 text-sm text-text-muted">{item.body}</p>
                </div>
                {!done && (
                  <form action={markInductionItemCompleteAction.bind(null, item.id)}>
                    <Button type="submit" variant="secondary">
                      Mark complete
                    </Button>
                  </form>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <form action={finishInductionAction} className="mt-6">
        <Button type="submit" disabled={!allDone}>
          {allDone ? "Complete induction and enter the workplace" : `Complete all items to continue (${completed.length}/${INDUCTION_ITEM_IDS.length})`}
        </Button>
      </form>
    </div>
  );
}
