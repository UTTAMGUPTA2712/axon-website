import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rotateTokens } from "@/lib/api";
import { SESSION_COOKIE } from "@/lib/config";
import {
  decodeSession,
  encodeSession,
  SESSION_COOKIE_OPTIONS,
  sessionFrom,
} from "@/lib/session";

/** Pages a reader without a session is allowed to see. */
const PUBLIC_PATHS = ["/login", "/register"];

/**
 * The access token is rotated a minute before it expires, not at the instant: a
 * render that starts just inside the window would otherwise present a token that
 * expires mid-request.
 */
const ROTATE_SKEW_MS = 60_000;

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

/**
 * Two jobs, and they are different in kind.
 *
 * **The gate** is an optimistic check: a reader with no session cookie is sent to
 * sign in before a page starts rendering. The cookie's contents are never trusted
 * here — every page still presents its token to the API, which is what actually
 * decides. The point is to avoid rendering a shell for someone plainly signed out.
 *
 * **The rotation** is not optimistic, and this is the only place it happens.
 * Cookies can only be written from a proxy, a Server Action or a Route Handler, so
 * a render that finds an expired token has nowhere to put a fresh one; doing it
 * here means every page below renders with a token that is known good.
 *
 * `POST /refresh` revokes the presented token as it issues the new pair, so two
 * concurrent rotations would sign the reader out. Only real navigations rotate —
 * a router prefetch is skipped — which removes the parallelism that would
 * otherwise come from Next prefetching several links at once.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = decodeSession(request.cookies.get(SESSION_COOKIE)?.value);

  if (!session) {
    if (isPublic(pathname)) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    // Where they were going, so signing in finishes the journey rather than
    // dropping them on the account page. This matters most for the extension
    // connect page, which is reached by a redirect from the extension itself.
    url.search = pathname === "/" ? "" : `?next=${encodeURIComponent(pathname + request.nextUrl.search)}`;
    return NextResponse.redirect(url);
  }

  const expiring = Date.now() >= session.accessExpiresAt - ROTATE_SKEW_MS;
  const isPrefetch =
    request.headers.get("next-router-prefetch") === "1" ||
    request.headers.get("purpose") === "prefetch";

  if (!expiring || isPrefetch) return NextResponse.next();

  const rotation = await rotateTokens(session.refreshToken);

  // The API is unreachable. The session may still be good, so the cookie stays and
  // the page below will fail on its own terms rather than being signed out here.
  if (!rotation.ok && rotation.reason === "unreachable") {
    return NextResponse.next();
  }

  if (!rotation.ok) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "?expired=1";
    const response = NextResponse.redirect(url);
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  // /refresh answers with tokens only, so the user we already know about is
  // carried across rather than being re-fetched.
  const next = sessionFrom(rotation.tokens, {
    id: session.userId,
    email: session.email,
  });

  const encoded = encodeSession(next);

  // Set on the *request* as well as the response. The response cookie is for the
  // browser's next trip; without the request cookie, the render happening under
  // this very request would still read the token we just rotated away.
  request.cookies.set(SESSION_COOKIE, encoded);
  const response = NextResponse.next({ request });
  response.cookies.set(SESSION_COOKIE, encoded, { ...SESSION_COOKIE_OPTIONS });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
};
