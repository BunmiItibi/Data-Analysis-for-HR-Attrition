import { notFound } from "next/navigation";
import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { getRepo } from "@/lib/data";
import { getTask } from "@/lib/scenario/tasks";
import type {
  EscalationRecommendationContent,
  RaidLogContent,
  RequirementsSummaryContent,
  TaskCode,
} from "@/lib/domain/types";
import { TaskBrief } from "@/components/tasks/TaskBrief";
import { TestingReportCard } from "@/components/tasks/TestingReportCard";
import { RequirementsSummaryForm } from "@/components/tasks/RequirementsSummaryForm";
import { RaidLogForm } from "@/components/tasks/RaidLogForm";
import { EscalationRecommendationForm } from "@/components/tasks/EscalationRecommendationForm";
import { Card } from "@/components/ui/Card";

const VALID_CODES: TaskCode[] = ["requirements-summary", "raid-log", "escalation-recommendation"];

export default async function TaskPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (!VALID_CODES.includes(code as TaskCode)) notFound();
  const taskCode = code as TaskCode;
  const task = getTask(taskCode);

  const user = await requireUser();
  const repo = getRepo();
  await repo.advanceStage(user.id, task.stage);
  const submission = await repo.getSubmission(user.id, taskCode);

  const hasAssessment = submission?.versions.some((v) => v.assessment);
  const mode: "first" | "revise" = !submission || submission.status === "draft" ? "first" : "revise";
  const source = mode === "first" ? submission?.versions[0] : submission?.versions[submission.versions.length - 1];
  const initial = source?.content.data ?? null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <TaskBrief task={task} />
      {taskCode === "escalation-recommendation" && <TestingReportCard />}

      {hasAssessment && (
        <Card className="border-primary/30 bg-primary/5">
          <p className="text-sm text-text">
            You already have feedback on this task.{" "}
            <Link href={`/submissions/${taskCode}/feedback`} className="font-medium text-primary hover:underline">
              View feedback
            </Link>{" "}
            — you can still revise your answer below.
          </p>
        </Card>
      )}

      {taskCode === "requirements-summary" && (
        <RequirementsSummaryForm initial={initial as RequirementsSummaryContent | null} mode={mode} />
      )}
      {taskCode === "raid-log" && <RaidLogForm initial={initial as RaidLogContent | null} mode={mode} />}
      {taskCode === "escalation-recommendation" && (
        <EscalationRecommendationForm initial={initial as EscalationRecommendationContent | null} mode={mode} />
      )}
    </div>
  );
}
