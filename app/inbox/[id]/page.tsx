import { notFound } from "next/navigation";
import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { getRepo } from "@/lib/data";
import { getCharacter } from "@/lib/scenario/characters";
import { Card } from "@/components/ui/Card";
import { MessageBody } from "@/components/MessageBody";
import { ReplyForm } from "@/components/inbox/ReplyForm";

export default async function InboxMessagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const items = await getRepo().listCommunications(user.id);
  const item = items.find(({ communication }) => communication.id === id);
  if (!item) notFound();

  const { communication, reply } = item;
  const sender = getCharacter(communication.fromCharacterId);

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/inbox" className="text-sm text-primary hover:underline">
        ← Back to inbox
      </Link>

      <Card className="mt-4">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <span
            aria-hidden
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy/10 text-sm font-semibold text-navy"
          >
            {sender.avatarInitials}
          </span>
          <div>
            <p className="text-base font-semibold text-text">{communication.subject}</p>
            <p className="text-xs text-text-muted">
              {sender.name} · {sender.roleTitle}
            </p>
          </div>
        </div>

        <div className="pt-4">
          <MessageBody text={communication.bodyMarkdown} />
        </div>

        {communication.attachments && communication.attachments.length > 0 && (
          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Attachments</p>
            {communication.attachments.map((a) => (
              <div key={a.label} className="rounded-md border border-border bg-bg px-3 py-2 text-sm">
                <p className="font-medium text-text">{a.label}</p>
                <p className="text-text-muted">{a.description}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {reply && (
        <Card className="mt-3 border-primary/30 bg-primary/5">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Your reply</p>
          <div className="mt-2">
            <MessageBody text={reply.bodyMarkdown} />
          </div>
          {reply.characterFollowUp && (
            <div className="mt-4 border-t border-primary/20 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">{sender.name} replied</p>
              <div className="mt-2">
                <MessageBody text={reply.characterFollowUp} />
              </div>
            </div>
          )}
        </Card>
      )}

      {!reply && communication.requiresReply && (
        <Card className="mt-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">Reply</p>
          <ReplyForm communicationId={communication.id} />
        </Card>
      )}
    </div>
  );
}
