import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { getRepo } from "@/lib/data";
import { getCharacter } from "@/lib/scenario/characters";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default async function InboxPage() {
  const user = await requireUser();
  const items = await getRepo().listCommunications(user.id);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold text-navy">Inbox</h1>
      <p className="mt-1 mb-6 text-sm text-text-muted">Workplace emails and notifications relevant to your placement so far.</p>

      {items.length === 0 && <Card>Nothing here yet — check back once you’re further into the placement.</Card>}

      <div className="flex flex-col gap-2">
        {items.map(({ communication, reply }) => {
          const sender = getCharacter(communication.fromCharacterId);
          return (
            <Link key={communication.id} href={`/inbox/${communication.id}`}>
              <Card className="transition-colors hover:border-primary/50">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy/10 text-xs font-semibold text-navy"
                    >
                      {sender.avatarInitials}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-text">{communication.subject}</p>
                      <p className="text-xs text-text-muted">
                        {sender.name} · {sender.roleTitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {communication.requiresReply && !reply && <Badge tone="warning">Reply needed</Badge>}
                    {reply && <Badge tone="success">Replied</Badge>}
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
