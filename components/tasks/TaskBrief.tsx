import type { Task } from "@/lib/domain/types";
import { Card, CardHeading } from "@/components/ui/Card";
import { COMPETENCY_LABELS } from "@/lib/domain/types";
import { Badge } from "@/components/ui/Badge";

export function TaskBrief({ task }: { task: Task }) {
  return (
    <Card>
      <CardHeading>{task.title}</CardHeading>
      <p className="mt-2 text-sm text-text-muted">{task.businessContext}</p>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">What to do</p>
        <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-text">
          {task.instructions.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ol>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Quality expectations</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-text">
          {task.qualityCriteria.map((c) => (
            <li key={c.label}>
              <span className="font-medium">{c.label}:</span> {c.detail}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {task.competencies.map((c) => (
          <Badge key={c} tone="neutral">
            {COMPETENCY_LABELS[c]}
          </Badge>
        ))}
      </div>
    </Card>
  );
}
