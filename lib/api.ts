import "server-only";
import { redirect } from "next/navigation";
import { API_URL } from "./config";
import { readSession } from "./session";
import type { AuthTokens } from "./types";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  query?: Record<string, string | number | undefined>;
  /** Suppress the automatic redirect to /login on a 401. */
  raw?: boolean;
}

export function buildUrl(
  path: string,
  query?: RequestOptions["query"],
): string {
  const url = new URL(path.replace(/^\//, ""), `${API_URL}/`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

/**
 * The API's error bodies put the detail in `message`, which is a string for a
 * thrown exception and an array for a failed validation. Both end up as one line.
 */
export function extractMessage(body: unknown): string | null {
  if (!body || typeof body !== "object") {
    return typeof body === "string" && body ? body : null;
  }
  const message = (body as { message?: unknown }).message;
  if (Array.isArray(message)) return message.join(". ");
  if (typeof message === "string") return message;
  return null;
}

async function parse(response: Response): Promise<unknown> {
  if (response.status === 204) return null;
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

/** One unauthenticated call: sign in, sign up, rotate. */
export async function apiPublic<T>(
  path: string,
  body: unknown,
): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const parsed = await parse(response);
  if (!response.ok) {
    throw new ApiError(
      response.status,
      extractMessage(parsed) ?? `Request failed (${response.status})`,
      parsed,
    );
  }
  return parsed as T;
}

/**
 * One call to the Axon API as the signed-in user.
 *
 * Nothing is cached: an account page that shows yesterday's quota is worse than
 * one that takes an extra moment. Pages wrap these reads in `<Suspense>`, which
 * is what Cache Components asks for and what lets the shell render immediately.
 *
 * A 401 here means the access token expired *between* the proxy's rotation check
 * and this request, or that the session was revoked elsewhere. Either way there is
 * nowhere to put a new cookie from inside a render, so it ends at sign-in rather
 * than trying to rotate — see proxy.ts, which is where rotation lives.
 */
export async function api<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const session = await readSession();
  if (!session) {
    if (options.raw) throw new ApiError(401, "Not signed in");
    redirect("/login");
  }

  const response = await fetch(buildUrl(path, options.query), {
    method: options.method ?? "GET",
    headers: {
      accept: "application/json",
      authorization: `Bearer ${session.accessToken}`,
      ...(options.body ? { "content-type": "application/json" } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (response.status === 401) {
    if (options.raw) throw new ApiError(401, "Session expired");
    redirect("/login?expired=1");
  }

  const parsed = await parse(response);
  if (!response.ok) {
    throw new ApiError(
      response.status,
      extractMessage(parsed) ?? `Request failed (${response.status})`,
      parsed,
    );
  }
  return parsed as T;
}

/**
 * The two ways rotation can fail, which must not be treated the same: a revoked
 * token means sign in again, an unreachable API means leave the cookie alone and
 * try on the next request.
 */
export type RotationResult =
  | { ok: true; tokens: AuthTokens }
  | { ok: false; reason: "revoked" | "unreachable" };

/**
 * Rotates a refresh token. Called from the proxy and from nowhere else, because
 * `POST /refresh` revokes the token it is given as it issues the new pair: two
 * callers racing means the loser presents a revoked token and is signed out for
 * no reason.
 */
export async function rotateTokens(
  refreshToken: string,
): Promise<RotationResult> {
  let response: Response;
  try {
    response = await fetch(buildUrl("/refresh"), {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
  } catch {
    return { ok: false, reason: "unreachable" };
  }

  // Spent, revoked or expired: this session is genuinely over.
  if (!response.ok) return { ok: false, reason: "revoked" };

  const tokens = (await parse(response)) as AuthTokens | null;
  if (!tokens?.accessToken || !tokens?.refreshToken) {
    return { ok: false, reason: "revoked" };
  }
  return { ok: true, tokens };
}
