"use client";

import { useActionState } from "react";
import { Notice } from "@/components/brand";
import { Field, SubmitButton } from "@/components/fields";
import { deleteAccount, updateName } from "@/lib/actions/account";
import { INITIAL_ACCOUNT_STATE, type AccountState } from "@/lib/form-state";

export function NameForm({ name }: { name: string }) {
  const [state, action, pending] = useActionState<AccountState, FormData>(
    updateName,
    INITIAL_ACCOUNT_STATE,
  );
  return (
    <form action={action} className="space-y-3">
      <div>
        <label
          htmlFor="name"
          className="block text-[13px] font-medium text-muted"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          defaultValue={name}
          autoComplete="name"
          maxLength={120}
          className="mt-1.5 h-10 w-full rounded-md border border-line-strong bg-plane px-3 text-[14px] text-ink outline-none focus:border-signal"
        />
      </div>
      {state.error && <Notice>{state.error}</Notice>}
      {state.done && <Notice tone="good">{state.done}</Notice>}
      <SubmitButton pending={pending} pendingLabel="Saving">
        Save name
      </SubmitButton>
    </form>
  );
}

export function DeleteForm() {
  const [state, action, pending] = useActionState<AccountState, FormData>(
    deleteAccount,
    INITIAL_ACCOUNT_STATE,
  );
  return (
    <details className="group">
      <summary className="cursor-pointer text-[13px] text-muted underline">
        Delete my account
      </summary>
      <form action={action} className="mt-4 space-y-3">
        <p className="text-[13px] leading-relaxed text-muted">
          This removes your account, your prompt history and any saved keys, and
          signs out every browser and the extension. It cannot be undone —
          export your data first if you want a copy.
        </p>
        <Field
          id="password"
          label="Confirm with your password"
          type="password"
          autoComplete="current-password"
          required
        />
        {state.error && <Notice>{state.error}</Notice>}
        <SubmitButton pending={pending} pendingLabel="Deleting" tone="quiet">
          Delete account permanently
        </SubmitButton>
      </form>
    </details>
  );
}
