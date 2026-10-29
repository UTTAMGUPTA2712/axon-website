import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AccountBar } from "@/components/site/account-bar";
import { Brand, Notice } from "@/components/brand";
import { safeNext } from "@/lib/config";
import { readSession } from "@/lib/session";
import { AuthForm } from "../auth-form";

export const metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

type Params = Promise<{ expired?: string; next?: string }>;

/**
 * Each of these reads request-time data, so each sits behind its own boundary.
 * With Cache Components the page shell is prerendered and only these stream,
 * which is why the heading appears instantly on a cold load.
 */
async function RedirectIfSignedIn({ searchParams }: { searchParams: Params }) {
  const { next } = await searchParams;
  if (await readSession()) redirect(safeNext(next));
  return null;
}

async function ExpiredNotice({ searchParams }: { searchParams: Params }) {
  const { expired } = await searchParams;
  if (expired !== "1") return null;
  return (
    <div className="mt-6">
      <Notice tone="warn">
        Your session ended. Sign in again to continue.
      </Notice>
    </div>
  );
}

export default function LoginPage({ searchParams }: { searchParams: Params }) {
  return (
    <>
      <AccountBar />
      <main className="flex min-h-[calc(100dvh-4.5rem)] items-center justify-center px-6 py-16">
        <Suspense fallback={null}>
          <RedirectIfSignedIn searchParams={searchParams} />
        </Suspense>

        <div className="w-full max-w-[26rem] rounded-xl border border-line bg-surface p-8">
          <Brand
            title="Sign in to Axon"
            lede="One account for the web app and the browser extension."
          />

          <Suspense fallback={null}>
            <ExpiredNotice searchParams={searchParams} />
          </Suspense>

          <Suspense fallback={<div className="mt-8 h-[13.5rem]" />}>
            <AuthForm mode="signIn" searchParams={searchParams} />
          </Suspense>

          <p className="mt-6 text-[13px] text-muted">
            No account yet?{" "}
            <Link href="/register" className="text-signal underline">
              Create one
            </Link>
            .
          </p>
        </div>
      </main>
    </>
  );
}
