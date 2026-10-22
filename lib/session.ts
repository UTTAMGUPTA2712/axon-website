import "server-only";
import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "./config";

export interface Session {
  accessToken: string;
  refreshToken: string;
  /** Absolute, in ms. Lets the proxy decide to rotate without asking the API. */
  accessExpiresAt: number;
  email: string;
  userId: string;
}

/** Short keys: this JSON sits in a cookie, which has 4KB to hold two JWTs. */
interface SessionCookie {
  a: string;
  r: string;
  x: number;
  e: string;
  u: string;
}

export function encodeSession(session: Session): string {
  const payload: SessionCookie = {
    a: session.accessToken,
    r: session.refreshToken,
    x: session.accessExpiresAt,
    e: session.email,
    u: session.userId,
  };
  return JSON.stringify(payload);
}

export function decodeSession(raw: string | undefined): Session | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SessionCookie;
    if (!parsed?.a || !parsed?.r) return null;
    return {
      accessToken: parsed.a,
      refreshToken: parsed.r,
      accessExpiresAt: Number(parsed.x) || 0,
      email: parsed.e ?? "",
      userId: parsed.u ?? "",
    };
  } catch {
    // A malformed cookie is the same as no session; the next guarded page sends
    // the reader to sign in.
    return null;
  }
}

/**
 * The session lives in one httpOnly cookie: both tokens, the access token's
 * expiry, and enough about the user to render a header without a round trip.
 *
 * Nothing client-side holds a copy, so there is no store to keep in sync and
 * nothing for a cross-site script to read. The refresh token in particular never
 * reaches the browser's JavaScript — which is the whole reason the extension is
 * being moved onto this flow rather than being handed one of its own to keep.
 */
export async function readSession(): Promise<Session | null> {
  return decodeSession((await cookies()).get(SESSION_COOKIE)?.value);
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
} as const;

/** Only callable from a Server Action or Route Handler. */
export async function writeSession(session: Session): Promise<void> {
  (await cookies()).set(
    SESSION_COOKIE,
    encodeSession(session),
    SESSION_COOKIE_OPTIONS,
  );
}

export async function clearSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

/** Turns an `expiresIn` (seconds) from the API into the absolute stamp we store. */
export function sessionFrom(
  tokens: { accessToken: string; refreshToken: string; expiresIn: number },
  user: { id: string; email: string },
): Session {
  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    accessExpiresAt: Date.now() + (tokens.expiresIn ?? 900) * 1000,
    email: user.email,
    userId: user.id,
  };
}
