# axon-app

The public account app. Where a **user** signs in — as distinct from `axon-admin`,
where an operator does.

It exists for one reason the extension could not solve on its own: the extension
used to ask for an Axon password in its own options page. Now it opens a page here,
the reader approves, and the extension receives a session it can use and revoke —
without ever handling the password.

```bash
npm run dev      # port 3002; the API owns :3000 and the console :3001
npm run build
npm run lint
```

`AXON_API_URL` points at `axon-server`. `AXON_EXTENSION_ID` is a comma-separated list of
the extension ids this deployment will sign in; empty accepts any `chromiumapp.org`
callback, which is the default so development needs no setup. See `.env.example`.

## Pointing a development extension at a deployed app

This is the normal development setup, and nothing in the extension's manifest has to
change for it: `launchWebAuthFlow` opens the connect page in a window Chrome owns, not a
`fetch` from the extension's origin, so the app's URL needs no host permission.

Three values have to agree. In `ask-ai/src/shared/constants.js`:

- `AXON_APP_URL` → the deployed app.
- `AXON_API_URL` → **the same server the deployed app talks to.** This is the one that
  bites. The code is minted in that server's database, so an extension exchanging it
  against a different API finds nothing and reports "that sign-in link is no longer
  valid" — a message written to not help, because distinguishing "no such code" from
  "already spent" would let someone probe for codes. Here it would tell you nothing
  while every URL looked right.

And here, `AXON_EXTENSION_ID` → the unpacked extension's id from `chrome://extensions`.

**An unpacked extension's id is derived from its folder path.** It is stable while the
folder stays put, and different on another machine or after a move — so an id pinned in a
deployed app stops matching when either happens. To fix the id for good, add a `key` to
the extension's manifest (`chrome://extensions` → Pack extension gives you the `.pem` to
derive it from); the unpacked build then keeps one id everywhere. Until then, expect to
update this list when the folder moves, and keep both the dev and release ids in it.

## The browser never calls the API

Pages are Server Components that `await api(...)` and mutations are Server Actions.
Both tokens live in one httpOnly cookie, so there is no CORS entry for this origin
and nothing for an XSS to read. `cacheComponents` is on, so anything reading cookies,
`searchParams` or an uncached `fetch` sits inside `<Suspense>`. Nothing uses
`"use cache"` on purpose — a stale quota figure is worse than a slower page.

## Rotation lives in the proxy, and only there

`POST /refresh` revokes the token it is given as it issues the new pair. Two
concurrent rotations therefore means the loser presents a revoked token and the
reader is signed out for nothing.

Cookies can only be written from a proxy, a Server Action or a Route Handler — a
render that finds an expired token has nowhere to put a fresh one. So `proxy.ts`
rotates before anything renders, and nothing else rotates at all. Router prefetches
are skipped, which removes the parallelism Next would otherwise create by
prefetching several links at once. A rotation that fails because the API is
unreachable leaves the cookie alone; one that fails because the token is spent ends
at `/login?expired=1`.

## The extension handoff

OAuth's authorization-code grant with PKCE, reduced to the one client that needs it.

1. The extension makes a random `code_verifier`, keeps it in its service worker, and
   opens `/extension/connect?code_challenge=<sha256>&state=<nonce>&redirect_uri=<its
   own chromiumapp.org callback>` through `chrome.identity.launchWebAuthFlow`.
2. No session here yet? `proxy.ts` sends the reader to `/login?next=…` so signing in
   finishes the connection rather than landing on the account page.
3. The reader approves. `connectExtension` calls `POST /auth/extension/authorize`
   with their own access token and gets a single-use code good for two minutes.
4. We redirect to the callback with the code **in the fragment** — never sent to a
   server, never written to an access log, and not carried on by a redirect. Chrome
   hands the whole URL to the extension either way, so the safer half costs nothing.
5. The extension calls `POST /auth/extension/token` with the code *and* the
   verifier, and gets its own token pair.

Two checks carry this, and both are repeated inside the Server Action rather than
trusted from the page that rendered the form, because an action is a public
endpoint in its own right:

- **`redirect_uri` must be an extension's own `chromiumapp.org` callback**
  (`isAllowedExtensionCallback`). Without it this page is an open redirect with a
  live credential attached.
- **`next` must be a path on this origin** (`safeNext`). A sign-in page that can be
  made to bounce elsewhere is a phishing primitive, and this one is linked to from
  the extension.

The code travelling through a URL is the exposed part of the sequence, and on its
own it is worth nothing: redeeming also needs the verifier, which never left the
extension.

## Design

The palette is `axon-admin`'s, deliberately — one product, one substrate. The rules
that carry over: one hue only, status never by colour alone, monospace reserved for
things read character by character (ids, emails, quota figures), no card kit.
