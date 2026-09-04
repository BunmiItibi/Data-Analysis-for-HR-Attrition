import type { Enrollment, Stage, Submission, TaskCode } from "@/lib/domain/types";
import { getTask } from "@/lib/scenario/tasks";

export interface NextAction {
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
}

function submissionFor(submissions: Submission[], taskCode: TaskCode): Submission | undefined {
  return submissions.find((s) => s.taskCode === taskCode);
}

function isFinalised(submission: Submission | undefined): boolean {
  return submission?.status === "feedback_available" || submission?.status === "resubmitted";
}

export function computeNextAction(
  enrollment: Enrollment,
  submissions: Submission[],
  welcomeEmailReplied: boolean,
): NextAction {
  const stage: Stage = enrollment.stage;

  if (stage === "induction") {
    return {
      title: "Finish your induction",
      description: "Complete the five induction items before you start work.",
      href: "/induction",
      buttonLabel: "Go to induction",
    };
  }

  if (stage === "briefing") {
    if (!welcomeEmailReplied) {
      return {
        title: "Read your welcome email",
        description: "Sarah has sent you a welcome message and the project briefing. Read it and introduce yourself.",
        href: "/inbox",
        buttonLabel: "Open inbox",
      };
    }
    return {
      title: "Join the requirements meeting",
      description: "Review the requirements meeting Sarah, Lucy, Daniel and Maya just held, and write your summary.",
      href: "/meetings/requirements-meeting",
      buttonLabel: "Review the meeting",
    };
  }

  if (stage === "requirements_meeting") {
    const submission = submissionFor(submissions, "requirements-summary");
    if (!isFinalised(submission)) {
      return {
        title: "Write your requirements summary",
        description: getTask("requirements-summary").businessContext,
        href: "/tasks/requirements-summary",
        buttonLabel: "Open the task",
      };
    }
    return {
      title: "Open the RAID log",
      description: "Now capture the project's risks, assumptions, issues and dependencies.",
      href: "/tasks/raid-log",
      buttonLabel: "Open the RAID log",
    };
  }

  if (stage === "raid_log") {
    const submission = submissionFor(submissions, "raid-log");
    if (!isFinalised(submission)) {
      return {
        title: "Complete the RAID log",
        description: getTask("raid-log").businessContext,
        href: "/tasks/raid-log",
        buttonLabel: "Open the RAID log",
      };
    }
    return {
      title: "Check the testing report",
      description: "Rachel's team has finished this test cycle. Read the report in your inbox.",
      href: "/inbox",
      buttonLabel: "Open inbox",
    };
  }

  if (stage === "testing_incident" || stage === "escalation") {
    const submission = submissionFor(submissions, "escalation-recommendation");
    if (!isFinalised(submission)) {
      return {
        title: "Escalate and recommend",
        description: getTask("escalation-recommendation").businessContext,
        href: "/tasks/escalation-recommendation",
        buttonLabel: "Open the task",
      };
    }
    return {
      title: "Review your feedback",
      description: "See what Sarah made of your escalation and recommendation.",
      href: "/submissions/escalation-recommendation/feedback",
      buttonLabel: "View feedback",
    };
  }

  if (stage === "review") {
    const pending = submissions.find((s) => s.status === "feedback_available");
    if (pending) {
      return {
        title: "Feedback is waiting for you",
        description: `Sarah has reviewed your ${getTask(pending.taskCode).workProductLabel.toLowerCase()}. Read it and decide whether to revise.`,
        href: `/submissions/${pending.taskCode}/feedback`,
        buttonLabel: "View feedback",
      };
    }
    return {
      title: "See your Experience Score",
      description: "You've completed all three work products. Review your developmental score.",
      href: "/score",
      buttonLabel: "View my score",
    };
  }

  return {
    title: "View your portfolio",
    description: "Your placement is complete. Review your portfolio evidence.",
    href: "/portfolio",
    buttonLabel: "Open portfolio",
  };
}
