"use client";

import { useTransition } from "react";
import { signOut } from "@/lib/actions/auth";

/**
 * Signs this browser out and leaves every other session — including an extension
 * already connected — alone. The API is told which refresh token to revoke, so
 * this is not "sign out everywhere".
 */
export function SignOutButton() {
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(() => void signOut())}
      className="text-[13px] text-muted underline transition-opacity disabled:opacity-60"
    >
      {pending ? "Signing out" : "Sign out of this browser"}
    </button>
  );
}
