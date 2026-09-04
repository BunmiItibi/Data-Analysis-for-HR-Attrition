import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getRepo } from "@/lib/data";
import { getTask } from "@/lib/scenario/tasks";
import type { TaskCode } from "@/lib/domain/types";
import { Card, CardHeading } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { ContentSummary } from "@/components/tasks/ContentSummary";
import { AssessmentView } from "@/components/tasks/AssessmentView";

const VALID_CODES: TaskCode[] = ["requirements-summary", "raid-log", "escalation-recommendation"];

export default async function FeedbackPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (!VALID_CODES.includes(code as TaskCode)) notFound();
  const taskCode = code as TaskCode;
  const task = getTask(taskCode);

  const user = await requireUser();
  const submission = await getRepo().getSubmission(user.id, taskCode);
  if (!submission || submission.versions.length === 0 || !submission.versions[0].assessment) {
    notFound();
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-navy">Feedback: {task.workProductLabel}</h1>
        <p className="mt-1 text-sm text-text-muted">
          {submission.versions.length > 1
            ? "Original submission and your revision, each with feedback."
            : "Your submission and Sarah's feedback."}
        </p>
      </div>

      {submission.versions.map((version) => (
        <Card key={version.id}>
          <div className="flex items-center justify-between">
            <CardHeading>{version.kind === "original" ? "Original submission" : `Revision ${version.versionNumber - 1}`}</CardHeading>
            <Badge tone="neutral">{new Date(version.createdAt).toLocaleString()}</Badge>
          </div>
          <div className="mt-4 border-b border-border pb-4">
            <ContentSummary content={version.content} />
          </div>
          {version.assessment ? (
            <div className="pt-4">
              <AssessmentView assessment={version.assessment} />
            </div>
          ) : (
            <p className="pt-4 text-sm text-text-muted">Not yet assessed.</p>
          )}
        </Card>
      ))}

      <div className="flex gap-3">
        <ButtonLink href={`/tasks/${taskCode}`} variant="secondary">
          Revise this work
        </ButtonLink>
        <ButtonLink href="/dashboard">Back to dashboard</ButtonLink>
      </div>
    </div>
  );
}
