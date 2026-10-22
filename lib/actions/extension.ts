"use server";

import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { isAllowedExtensionCallback } from "@/lib/config";

export interface ConnectState {
  error: string | null;
}

export const INITIAL_CONNECT_STATE: ConnectState = { error: null };

interface AuthorizeResponse {
  code: string;
  expiresIn: number;
}

/**
 * Appends the handoff to the extension's callback URL.
 *
 * In the fragment, not the query string: a fragment is never sent to a server, is
 * not written into an access log, and is not carried on by a redirect. Chrome
 * hands `launchWebAuthFlow` the whole URL either way, so the extension reads it
 * exactly the same — there is nothing to trade away by choosing the safer half.
 */
function callbackWith(
  redirectUri: string,
  params: Record<string, string>,
): string {
  const fragment = new URLSearchParams(params).toString();
  return `${redirectUri}#${fragment}`;
}

/**
 * Approve the extension: mint a one-time code for the signed-in reader and send
 * the browser back to the extension's callback carrying it.
 *
 * The code is worth nothing on its own. Redeeming it also needs the PKCE verifier
 * whose digest the extension sent as `code_challenge`, and that verifier never
 * left the extension's service worker — so the one part of this that travels
 * through a URL cannot be replayed by whatever else can see URLs.
 *
 * `state` is echoed back untouched. It is the extension's own nonce, and checking
 * it is how the extension knows the callback answers the request it made.
 */
export async function connectExtension(
  _previous: ConnectState,
  formData: FormData,
): Promise<ConnectState> {
  const redirectUri = String(formData.get("redirect_uri") ?? "");
  const codeChallenge = String(formData.get("code_challenge") ?? "");
  const state = String(formData.get("state") ?? "");

  // Re-checked here, not trusted from the page that rendered the form: a Server
  // Action is a public endpoint, and the only thing standing between this one and
  // an open redirect with a live credential attached is this line.
  if (!isAllowedExtensionCallback(redirectUri)) {
    return { error: "That sign-in request did not come from the Axon extension." };
  }
  if (!codeChallenge) {
    return { error: "That sign-in request is missing its verification challenge." };
  }

  let code: string;
  try {
    const authorized = await api<AuthorizeResponse>(
      "/auth/extension/authorize",
      {
        method: "POST",
        body: { codeChallenge, codeChallengeMethod: "S256" },
        raw: true,
      },
    );
    code = authorized.code;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return { error: "Your session has expired. Sign in again to connect." };
    }
    return {
      error:
        error instanceof ApiError
          ? error.message
          : "Could not reach Axon. Check your connection and try again.",
    };
  }

  redirect(callbackWith(redirectUri, { code, ...(state ? { state } : {}) }));
}

/**
 * Decline. The extension is told so explicitly rather than being left to time
 * out, so it can close the window and say what happened.
 */
export async function declineExtension(formData: FormData): Promise<void> {
  const redirectUri = String(formData.get("redirect_uri") ?? "");
  const state = String(formData.get("state") ?? "");

  if (!isAllowedExtensionCallback(redirectUri)) redirect("/account");

  redirect(
    callbackWith(redirectUri, {
      error: "access_denied",
      ...(state ? { state } : {}),
    }),
  );
}
