/**
 * The browser never talks to the Axon API directly.
 *
 * Every call is made from this app's server with the user's access token read out
 * of an httpOnly cookie — so the token is never exposed to client JavaScript, and
 * the API needs no CORS entry for this origin.
 */
export const API_URL = (
  process.env.AXON_API_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

export const SESSION_COOKIE = "axon_session";

/**
 * Matches JWT_REFRESH_TTL on the server. The cookie carries the refresh token, so
 * it should not outlive it; the access token inside is rotated long before this.
 */
export const SESSION_MAX_AGE_SECONDS = Number(
  process.env.AXON_SESSION_MAX_AGE ?? 30 * 24 * 60 * 60,
);

/** The server's own floor (RegisterDto), said up front rather than found as a 400. */
export const MIN_PASSWORD_LENGTH = 10;

/**
 * Where the extension's sign-in callback is allowed to point.
 *
 * `launchWebAuthFlow` only ever listens on `https://<extension-id>.chromiumapp.org/`,
 * and that URL is the one thing the connect page is handed by a caller rather than
 * deciding for itself. Accepting it unchecked would make this page an open redirect
 * that a code is attached to, so it is matched against this shape — and, when
 * AXON_EXTENSION_ID is set, against that one id.
 */
// Lower-cased on the way in. A URL's hostname is case-insensitive and `new URL()`
// normalises it, so an id configured in any other case would never match and every
// sign-in would be refused with "that did not come from the Axon extension" — true of
// nothing, and very hard to guess from.
export const EXTENSION_ID = (process.env.AXON_EXTENSION_ID ?? "")
  .trim()
  .toLowerCase();

export function isAllowedExtensionCallback(raw: string): boolean {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }

  if (url.protocol !== "https:") return false;

  const match = /^([a-p]{32})\.chromiumapp\.org$/.exec(url.hostname);
  if (!match) return false;

  // A fragment on the way in would be dropped when we append our own, and a query
  // string we did not put there has no meaning to the extension. Both signal a
  // caller doing something other than what this page is for.
  if (url.hash || url.search) return false;

  return EXTENSION_ID ? match[1] === EXTENSION_ID : true;
}

/**
 * Where a sign-in is allowed to land.
 *
 * `next` arrives in the URL, so it is a value a stranger can choose. Only a path
 * on this origin is honoured — anything absolute, protocol-relative (`//evil`) or
 * otherwise not starting with a single slash falls back to the account page. A
 * sign-in page that can be made to bounce somewhere else is a phishing primitive,
 * and this one is linked to from the extension.
 */
export function safeNext(raw: unknown): string {
  if (typeof raw !== "string" || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/account";
  }
  return raw;
}
