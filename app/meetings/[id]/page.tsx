import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getRepo } from "@/lib/data";
import { getMeeting } from "@/lib/scenario/meetings";
import { Card, CardHeading } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";

export default async function MeetingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let meeting;
  try {
    meeting = getMeeting(id);
  } catch {
    notFound();
  }

  const user = await requireUser();
  await getRepo().advanceStage(user.id, meeting.stage);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold text-navy">{meeting.title}</h1>
      <p className="mt-1 mb-6 text-sm text-text-muted">{meeting.purpose}</p>

      <Card>
        <CardHeading>Participants</CardHeading>
        <p className="mt-2 text-sm text-text">{meeting.participants.join(", ")}</p>
      </Card>

      <Card className="mt-3">
        <CardHeading>Agenda</CardHeading>
        <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-text">
          {meeting.agenda.map((a) => (
            <li key={a.title}>
              {a.title} <span className="text-text-muted">— {a.owner}</span>
            </li>
          ))}
        </ol>
      </Card>

      <Card className="mt-3">
        <CardHeading>Transcript</CardHeading>
        <div className="mt-3 flex flex-col gap-3">
          {meeting.transcript.map((line, i) => (
            <div key={i} className="text-sm">
              <span className="font-semibold text-text">{line.speaker}: </span>
              <span className="text-text-muted">{line.line}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-6">
        <p className="text-sm text-text-muted">
          Ready to write your requirements summary from this meeting? Include decisions, actions with owners
          and dates, and anything left open.
        </p>
        <div className="mt-4">
          <ButtonLink href="/tasks/requirements-summary">Write the requirements summary</ButtonLink>
        </div>
      </Card>
    </div>
  );
}
