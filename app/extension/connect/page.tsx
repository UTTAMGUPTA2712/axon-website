import { Suspense } from "react";
import { Brand, Notice } from "@/components/brand";
import { isAllowedExtensionCallback } from "@/lib/config";
import { readSession } from "@/lib/session";
import { ConnectForm } from "./connect-form";

export const metadata = {
  title: "Connect the Axon extension",
  robots: { index: false, follow: false },
};

type Params = Promise<{
  redirect_uri?: string;
  code_challenge?: string;
  state?: string;
}>;

/**
 * The page the extension opens to sign in.
 *
 * It is reached by `chrome.identity.launchWebAuthFlow`, so everything about the
 * request arrives in the query string and none of it is trusted:
 *
 *   redirect_uri    where to send the code. Must be an extension's own
 *                   `chromiumapp.org` callback — see isAllowedExtensionCallback,
 *                   without which this page would be an open redirect with a
 *                   live credential attached.
 *   code_challenge  base64url SHA-256 of a verifier the extension kept. The code
 *                   we mint is useless without it.
 *   state           the extension's nonce, echoed back untouched.
 *
 * A reader with no session never gets here: the proxy sends them to /login with
 * `next` pointing back, so signing in finishes the connection instead of landing
 * them on the account page.
 */
async function Consent({ searchParams }: { searchParams: Params }) {
  const { redirect_uri: redirectUri, code_challenge: codeChallenge, state } =
    await searchParams;

  if (!redirectUri || !isAllowedExtensionCallback(redirectUri)) {
    return (
      <div className="mt-8">
        <Notice>
          This link did not come from the Axon extension, so there is nothing to
          connect. Open Axon from your browser toolbar and try again from there.
        </Notice>
      </div>
    );
  }

  if (!codeChallenge) {
    return (
      <div className="mt-8">
        <Notice>
          This sign-in request is missing its verification challenge. Update the
          Axon extension and try again.
        </Notice>
      </div>
    );
  }

  const session = await readSession();
  if (!session) return null; // The proxy is already redirecting to /login.

  return (
    <ConnectForm
      email={session.email}
      redirectUri={redirectUri}
      codeChallenge={codeChallenge}
      state={state ?? ""}
    />
  );
}

export default function ConnectPage({
  searchParams,
}: {
  searchParams: Params;
}) {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-16">
      <div className="w-full max-w-[24rem]">
        <Brand
          title="Connect the extension"
          lede="The Axon extension in this browser is asking to use your account."
        />

        <Suspense fallback={<div className="mt-8 h-56" />}>
          <Consent searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
