"use server";

import { redirect } from "next/navigation";
import { api, ApiError, apiPublic } from "@/lib/api";
import { MIN_PASSWORD_LENGTH, safeNext } from "@/lib/config";
import { clearSession, readSession, sessionFrom, writeSession } from "@/lib/session";
import type { AuthTokens } from "@/lib/types";

export interface AuthState {
  error: string | null;
}

export const INITIAL_AUTH_STATE: AuthState = { error: null };

function friendlyError(error: unknown, credentials: string): string {
  if (error instanceof ApiError) {
    if (error.status === 429) {
      return "Too many attempts. Wait a minute and try again.";
    }
    if (error.status === 401) return credentials;
    // 403 (blocked) and 409 (email taken) are written to be read by a person.
    if (error.status === 403 || error.status === 409) return error.message;
    return error.message;
  }
  return "Could not reach Axon. Check your connection and try again.";
}

/**
 * The redirect is outside the try block on purpose: `redirect()` works by
 * throwing, so catching around it would swallow the navigation and show an error
 * for a sign-in that actually succeeded.
 */
export async function signIn(
  _previous: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));

  if (!email || !password) {
    return { error: "Enter your email address and password." };
  }

  try {
    const tokens = await apiPublic<AuthTokens>("/login", { email, password });
    if (!tokens.user) return { error: "Axon did not return an account." };
    await writeSession(sessionFrom(tokens, tokens.user));
  } catch (error) {
    return {
      error: friendlyError(error, "That email and password do not match an account."),
    };
  }

  redirect(next);
}

export async function signUp(
  _previous: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const next = safeNext(formData.get("next"));

  if (!email || !password) {
    return { error: "Enter your email address and a password." };
  }
  // Said here as well as on the server, so it reads as a rule rather than a 400.
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      error: `Use at least ${MIN_PASSWORD_LENGTH} characters — a phrase is easier to remember than a short password.`,
    };
  }

  try {
    const tokens = await apiPublic<AuthTokens>("/register", {
      email,
      password,
      ...(name ? { name } : {}),
    });
    if (!tokens.user) return { error: "Axon did not return an account." };
    await writeSession(sessionFrom(tokens, tokens.user));
  } catch (error) {
    return { error: friendlyError(error, "Could not create that account.") };
  }

  redirect(next);
}

/**
 * Signs this browser out. Sending the refresh token revokes *this* session;
 * sending no body would revoke every session the account has, which would sign
 * the reader's other browsers — and their extension — out with it.
 */
export async function signOut(): Promise<void> {
  const session = await readSession();

  if (session) {
    try {
      // `raw` so a 401 reports rather than redirecting: this is already the way
      // out, and a session the API has forgotten is one less thing to revoke.
      await api("/logout", {
        method: "POST",
        body: { refreshToken: session.refreshToken },
        raw: true,
      });
    } catch {
      // A sign-out the API never heard about still has to sign this browser out,
      // or a network blip strands the reader in a session they asked to end.
    }
  }

  await clearSession();
  redirect("/login");
}
