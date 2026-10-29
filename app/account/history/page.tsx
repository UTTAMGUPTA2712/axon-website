import Link from "next/link";
import { Suspense } from "react";
import { AccountBar } from "@/components/site/account-bar";
import { Brand } from "@/components/brand";
import { api } from "@/lib/api";
import type { Page, PromptRow } from "@/lib/types";

export const metadata = {
  title: "Prompt history",
  robots: { index: false, follow: false },
};

type Params = Promise<{ page?: string; q?: string }>;

const STATUS_LABEL: Record<PromptRow["status"], string> = {
  PENDING: "Running",
  COMPLETED: "Answered",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
};

async function Rows({ searchParams }: { searchParams: Params }) {
  const { page, q } = await searchParams;
  const current = Math.max(1, Number(page) || 1);
  const result = await api<Page<PromptRow>>("/prompts", {
    query: { view: "turns", page: current, limit: 20, q },
  });

  const link = (n: number) =>
    `/account/history?page=${n}${q ? `&q=${encodeURIComponent(q)}` : ""}`;

  if (result.items.length === 0) {
    return (
      <p className="mt-6 text-[14px] text-muted">
        {q
          ? "Nothing matches that search."
          : "No prompts yet. Ask Axon something from the extension."}
      </p>
    );
  }

  return (
    <>
      <ul className="mt-6 divide-y divide-line rounded-xl border border-line bg-surface">
        {result.items.map((row) => (
          <li key={row.id} className="px-5 py-4">
            <div className="flex items-baseline justify-between gap-4 text-[12px] text-faint">
              <time dateTime={row.createdAt}>
                {new Date(row.createdAt).toLocaleString()}
              </time>
              {/* Words, not colour: a failure is named. */}
              <span>{STATUS_LABEL[row.status]}</span>
            </div>
            <p className="mt-1.5 line-clamp-2 text-[14px] text-ink">
              {row.input}
            </p>
            {row.output && (
              <p className="mt-1.5 line-clamp-3 text-[13px] text-muted">
                {row.output}
              </p>
            )}
          </li>
        ))}
      </ul>

      <nav
        className="mt-4 flex items-center justify-between text-[13px] text-muted"
        aria-label="Pages"
      >
        {current > 1 ? (
          <Link className="underline" href={link(current - 1)}>
            Newer
          </Link>
        ) : (
          <span />
        )}
        <span>
          Page {result.meta.page} of {result.meta.pages}
        </span>
        {current < result.meta.pages ? (
          <Link className="underline" href={link(current + 1)}>
            Older
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </>
  );
}

export default function HistoryPage({
  searchParams,
}: {
  searchParams: Params;
}) {
  return (
    <>
      <AccountBar />
      <main className="mx-auto w-full max-w-[40rem] px-6 py-16">
        <Brand
          title="Prompt history"
          lede="What you asked while signed in, and what came back. Signed-out use never appears here: it stays in your browser."
        />
        <form action="/account/history" className="mt-6 flex gap-2">
          <input
            name="q"
            type="search"
            placeholder="Search your prompts"
            aria-label="Search your prompts"
            className="h-10 w-full rounded-md border border-line-strong bg-plane px-3 text-[14px] text-ink outline-none placeholder:text-faint focus:border-signal"
          />
          <button className="h-10 rounded-md border border-line-strong bg-surface px-4 text-[14px] text-ink hover:bg-raised">
            Search
          </button>
        </form>
        <Suspense fallback={<div className="mt-6 h-40" />}>
          <Rows searchParams={searchParams} />
        </Suspense>
        <p className="mt-8 text-[13px]">
          <Link className="text-muted underline" href="/account">
            Back to your account
          </Link>
        </p>
      </main>
    </>
  );
}
