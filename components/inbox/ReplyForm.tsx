"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { replyToCommunicationAction } from "@/lib/actions/inbox";
import type { ActionState } from "@/lib/actions/auth";
import { Field, inputClass } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Sending…" : "Send reply"}
    </Button>
  );
}

export function ReplyForm({ communicationId }: { communicationId: string }) {
  const [state, formAction] = useActionState<ActionState | undefined, FormData>(replyToCommunicationAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3" noValidate>
      <input type="hidden" name="communicationId" value={communicationId} />
      <Field label="Your reply" htmlFor="bodyMarkdown">
        <textarea id="bodyMarkdown" name="bodyMarkdown" required minLength={5} rows={5} className={inputClass} />
      </Field>
      {state?.error && (
        <p role="alert" className="text-sm font-medium text-danger">
          {state.error}
        </p>
      )}
      <div>
        <SubmitButton />
      </div>
    </form>
  );
}
