"use client";

import { useActionState } from "react";
import { Notice } from "@/components/brand";
import { SubmitButton } from "@/components/fields";
import {
  connectExtension,
  declineExtension,
  INITIAL_CONNECT_STATE,
  type ConnectState,
} from "@/lib/actions/extension";

/**
 * The approval. Everything the handoff needs is a hidden input, because a Server
 * Action cannot see the page's query string — and every one of them is checked
 * again inside the action, which is a public endpoint in its own right.
 */
export function ConnectForm({
  email,
  redirectUri,
  codeChallenge,
  state,
}: {
  email: string;
  redirectUri: string;
  codeChallenge: string;
  state: string;
}) {
  const [result, action, pending] = useActionState<ConnectState, FormData>(
    connectExtension,
    INITIAL_CONNECT_STATE,
  );

  const hidden = (
    <>
      <input type="hidden" name="redirect_uri" value={redirectUri} />
      <input type="hidden" name="code_challenge" value={codeChallenge} />
      <input type="hidden" name="state" value={state} />
    </>
  );

  return (
    <div className="mt-8">
      <dl className="divide-y divide-line border-y border-line">
        <div className="flex items-baseline justify-between gap-4 py-3">
          <dt className="text-[13px] text-muted">Account</dt>
          <dd className="font-mono text-[14px] text-ink">{email}</dd>
        </div>
      </dl>

      <ul className="mt-5 space-y-2 text-[13px] text-muted">
        <li>
          The extension will run prompts against this account&apos;s plan and
          daily quota.
        </li>
        <li>
          It never receives your password — only a session it can end on its own.
        </li>
        <li>You can disconnect it any time by signing out inside Axon.</li>
      </ul>

      {result.error && (
        <div className="mt-5">
          <Notice>{result.error}</Notice>
        </div>
      )}

      <form action={action} className="mt-6">
        {hidden}
        <SubmitButton pending={pending} pendingLabel="Connecting">
          Connect this extension
        </SubmitButton>
      </form>

      {/* A separate form, so declining is one POST and not a variant of the
          approval the reader might submit by accident. */}
      <form action={declineExtension} className="mt-3">
        {hidden}
        <SubmitButton pending={false} pendingLabel="" tone="quiet">
          Not now
        </SubmitButton>
      </form>
    </div>
  );
}
