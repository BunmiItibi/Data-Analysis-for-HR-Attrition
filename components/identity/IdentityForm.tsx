"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveIdentityAction } from "@/lib/actions/profile";
import type { ActionState } from "@/lib/actions/auth";
import { COMPETENCIES, COMPETENCY_LABELS } from "@/lib/domain/types";
import { Field, inputClass } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : "Generate my profile"}
    </Button>
  );
}

export function IdentityForm() {
  const [state, formAction] = useActionState<ActionState | undefined, FormData>(saveIdentityAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <Field
        label="What's your career goal?"
        htmlFor="careerGoal"
        hint="For example: an entry-level Project Officer or Project Coordinator role."
      >
        <textarea id="careerGoal" name="careerGoal" required minLength={10} rows={3} className={inputClass} />
      </Field>
      <Field
        label="Where are you starting from?"
        htmlFor="currentSituation"
        hint="Your background so far — qualifications, work history, or why project work feels out of reach right now."
      >
        <textarea id="currentSituation" name="currentSituation" required minLength={10} rows={3} className={inputClass} />
      </Field>
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-text">
          Pick 1–5 areas you’d most like to develop
        </legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {COMPETENCIES.map((c) => (
            <label key={c} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
              <input type="checkbox" name="developmentPriorities" value={c} className="h-4 w-4" />
              {COMPETENCY_LABELS[c]}
            </label>
          ))}
        </div>
      </fieldset>
      {state?.error && (
        <p role="alert" className="text-sm font-medium text-danger">
          {state.error}
        </p>
      )}
      <SubmitButton />
    </form>
  );
}
