"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { registerAction, type ActionState } from "@/lib/actions/auth";
import { Field, inputClass } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Creating your account…" : "Create account"}
    </Button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useActionState<ActionState | undefined, FormData>(registerAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <Field label="Full name" htmlFor="fullName">
        <input id="fullName" name="fullName" type="text" autoComplete="name" required className={inputClass} />
      </Field>
      <Field label="Email" htmlFor="email">
        <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} />
      </Field>
      <Field label="Password" htmlFor="password" hint="At least 8 characters.">
        <input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} className={inputClass} />
      </Field>
      {state?.error && (
        <p role="alert" className="text-sm font-medium text-danger">
          {state.error}
        </p>
      )}
      <SubmitButton />
    </form>
  );
}
