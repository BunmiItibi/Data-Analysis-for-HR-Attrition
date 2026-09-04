import { redirect } from "next/navigation";
import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { getRepo } from "@/lib/data";
import { computeNextAction } from "@/lib/dashboard";
import { STAGE_LABELS, STAGE_ORDER } from "@/lib/scenario";
import { TASKS } from "@/lib/scenario/tasks";
import { Card, CardHeading } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Submission, SubmissionStatus } from "@/lib/domain/types";

const STATUS_LABEL: Record<SubmissionStatus, string> = {
  draft: "Draft saved",
  submitted: "Submitted",
  feedback_available: "Feedback ready",
  revision_requested: "Revision requested",
  resubmitted: "Revised",
  completed: "Completed",
};

const STATUS_TONE: Record<SubmissionStatus, "neutral" | "primary" | "success" | "warning"> = {
  draft: "neutral",
  submitted: "primary",
  feedback_available: "warning",
  revision_requested: "warning",
  resubmitted: "success",
  completed: "success",
};

export default async function DashboardPage() {
  const user = await requireUser();
  const repo = getRepo();
  const enrollment = await repo.getOrCreateEnrollment(user.id);

  if (enrollment.state === "invited" || enrollment.state === "applied" || enrollment.state === "offered") {
    redirect("/placements");
  }
  if (enrollment.stage === "induction") redirect("/induction");

  const [submissions, communications] = await Promise.all([
    repo.listSubmissions(user.id),
    repo.listCommunications(user.id),
  ]);
  const welcomeReplied = communications.some(
    ({ communication, reply }) => communication.id === "email-sarah-welcome" && reply,
  );
  const nextAction = computeNextAction(enrollment, submissions, welcomeReplied);
  const stageProgress = ((STAGE_ORDER.indexOf(enrollment.stage) + 1) / STAGE_ORDER.length) * 100;

  const byTask = (code: string) => submissions.find((s: Submission) => s.taskCode === code);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-text-muted">Northstar Health Digital · {STAGE_LABELS[enrollment.stage]}</p>
        <h1 className="text-2xl font-semibold text-navy">Welcome back, {user.fullName.split(" ")[0]}</h1>
      </div>

      <ProgressBar value={stageProgress} label="Placement progress" />

      <Card className="border-primary/40 bg-primary/5">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Your next step</p>
        <h2 className="mt-1 text-lg font-semibold text-navy">{nextAction.title}</h2>
        <p className="mt-1 text-sm text-text-muted">{nextAction.description}</p>
        <div className="mt-4">
          <ButtonLink href={nextAction.href}>{nextAction.buttonLabel}</ButtonLink>
        </div>
      </Card>

      <div>
        <h2 className="mb-3 text-base font-semibold text-text">Your work products</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {TASKS.map((task) => {
            const submission = byTask(task.code);
            return (
              <Link key={task.code} href={`/tasks/${task.code}`}>
                <Card className="h-full transition-colors hover:border-primary/50">
                  <CardHeading>{task.workProductLabel}</CardHeading>
                  <div className="mt-3">
                    {submission ? (
                      <Badge tone={STATUS_TONE[submission.status]}>{STATUS_LABEL[submission.status]}</Badge>
                    ) : (
                      <Badge tone="neutral">Not started</Badge>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4 text-sm">
        <Link href="/inbox" className="font-medium text-primary hover:underline">
          Inbox
        </Link>
        <Link href="/meetings/requirements-meeting" className="font-medium text-primary hover:underline">
          Requirements meeting
        </Link>
      </div>
    </div>
  );
}
