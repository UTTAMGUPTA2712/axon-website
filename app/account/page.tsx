import { Suspense } from "react";
import { AccountBar } from "@/components/site/account-bar";
import { Brand } from "@/components/brand";
import { api } from "@/lib/api";
import { readSession } from "@/lib/session";
import type { Usage, User } from "@/lib/types";
import { SignOutButton } from "./sign-out-button";

export const metadata = {
  title: "Your account",
  robots: { index: false, follow: false },
};

/**
 * Everything on this page reads the session cookie or an uncached fetch, so each
 * block streams inside its own boundary. Nothing uses `"use cache"` on purpose: a
 * stale quota figure is worse than a slower page.
 */
async function Identity() {
  const session = await readSession();
  if (!session) return null;

  const { user } = await api<{ authenticated: boolean; user: User }>(
    "/authenticate",
  );

  return (
    <dl className="divide-y divide-line">
      <Row label="Signed in as" value={user.email} mono />
      {user.name && <Row label="Name" value={user.name} />}
      <Row label="Plan" value={user.plan?.name ?? "Free"} />
      {user.subscriptionStatus !== "NONE" && (
        <Row
          label="Subscription"
          value={user.subscriptionStatus.toLowerCase()}
        />
      )}
    </dl>
  );
}

async function Quota() {
  const usage = await api<Usage>("/usage");

  if (usage.unlimited) {
    return (
      <p className="text-[13px] text-muted">
        Your plan has no daily prompt limit.{" "}
        <span className="font-mono tnum">{usage.used}</span> used today.
      </p>
    );
  }

  const limit = usage.limit ?? 0;
  const fraction = limit > 0 ? Math.min(1, usage.used / limit) : 0;

  return (
    <section>
      <div className="flex items-baseline justify-between">
        <h2 className="text-[13px] font-medium text-muted">Prompts today</h2>
        <p className="font-mono text-[15px] tnum text-ink">
          {usage.used} / {limit}
        </p>
      </div>

      {/* Length carries the magnitude; one hue only. The figure above says it in
          words, so the bar is never the only way to read this. */}
      <div
        role="img"
        aria-label={`${usage.used} of ${limit} prompts used today`}
        className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-raised"
      >
        <div
          className="h-full bg-signal"
          style={{ width: `${Math.round(fraction * 100)}%` }}
        />
      </div>

      <p className="mt-2 text-[12px] text-faint">
        Resets at{" "}
        {new Date(usage.resetsAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
        .
      </p>
    </section>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3">
      <dt className="text-[13px] text-muted">{label}</dt>
      <dd
        className={`text-right text-[14px] text-ink ${mono ? "font-mono" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}

export default function AccountPage() {
  return (
    <>
      <AccountBar />
      <main className="mx-auto w-full max-w-[36rem] px-6 py-16">
        <Brand
          title="Your Axon account"
          lede="Your plan, today's quota, and the session the browser extension signs in with."
        />

        <div className="mt-8 rounded-xl border border-line bg-surface px-6 py-2">
          <Suspense fallback={<div className="h-32" />}>
            <Identity />
          </Suspense>
        </div>

        <div className="mt-4 rounded-xl border border-line bg-surface p-6">
          <Suspense fallback={<div className="h-20" />}>
            <Quota />
          </Suspense>
        </div>

        <section className="mt-4 rounded-xl border border-line bg-surface p-6">
          <h2 className="text-[15px] font-medium text-ink">The extension</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-muted">
            Open Axon in your browser toolbar and choose{" "}
            <span className="text-ink">Log in to Axon</span>. It will bring you
            back here to approve the connection — you will not type your
            password into the extension.
          </p>
        </section>

        <div className="mt-6">
          <SignOutButton />
        </div>
      </main>
    </>
  );
}
