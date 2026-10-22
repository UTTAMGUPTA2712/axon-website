"use client";

import { useActionState } from "react";
import { Notice } from "@/components/brand";
import { Field, SubmitButton } from "@/components/fields";
import {
  INITIAL_AUTH_STATE,
  signIn,
  signUp,
  type AuthState,
} from "@/lib/actions/auth";
import { MIN_PASSWORD_LENGTH } from "@/lib/config";

/**
 * One form for both pages. Signing in and signing up differ by two fields and a
 * verb; giving them separate components is how the two drift apart.
 *
 * `next` is rendered as a hidden input rather than read from the URL inside the
 * action: a Server Action does not see the page's query string, and the value has
 * already been vetted by the server component above.
 */
export function AuthFormClient({
  mode,
  next,
}: {
  mode: "signIn" | "signUp";
  next: string;
}) {
  const isSignUp = mode === "signUp";
  const [state, action, pending] = useActionState<AuthState, FormData>(
    isSignUp ? signUp : signIn,
    INITIAL_AUTH_STATE,
  );

  return (
    <form action={action} className="mt-8 space-y-4">
      <input type="hidden" name="next" value={next} />

      {isSignUp && (
        <Field
          id="name"
          label="Name"
          autoComplete="name"
          placeholder="Optional"
        />
      )}

      <Field
        id="email"
        label="Email"
        type="email"
        autoComplete="username"
        required
        autoFocus={!isSignUp}
        placeholder="you@example.com"
      />

      <Field
        id="password"
        label="Password"
        type="password"
        autoComplete={isSignUp ? "new-password" : "current-password"}
        required
        hint={
          isSignUp
            ? `At least ${MIN_PASSWORD_LENGTH} characters. A phrase works well.`
            : undefined
        }
      />

      {state.error && <Notice>{state.error}</Notice>}

      <SubmitButton
        pending={pending}
        pendingLabel={isSignUp ? "Creating your account" : "Signing in"}
      >
        {isSignUp ? "Create account" : "Sign in"}
      </SubmitButton>
    </form>
  );
}
