import { TESTING_REPORT, type DefectSeverity } from "@/lib/scenario/testingReport";
import { Card, CardHeading } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const SEVERITY_TONE: Record<DefectSeverity, "neutral" | "warning" | "danger"> = {
  low: "neutral",
  medium: "warning",
  high: "danger",
  critical: "danger",
};

export function TestingReportCard() {
  return (
    <Card>
      <CardHeading>Software Testing Report — {TESTING_REPORT.cycle}</CardHeading>
      <p className="mt-2 text-sm text-text-muted">{TESTING_REPORT.summary}</p>
      <div className="mt-4 flex flex-col gap-3">
        {TESTING_REPORT.defects.map((d) => (
          <div key={d.id} className="rounded-md border border-border p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-text">{d.title}</p>
              <Badge tone={SEVERITY_TONE[d.severity]}>{d.severity}</Badge>
            </div>
            <p className="mt-1 text-sm text-text-muted">{d.description}</p>
            <p className="mt-2 text-xs text-text-muted">
              <span className="font-medium">Evidence:</span> {d.evidence}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
