import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Brand } from "@/components/brand";
import { safeNext } from "@/lib/config";
import { readSession } from "@/lib/session";
import { AuthForm } from "../auth-form";

export const metadata = {
  title: "Create an account — Axon",
  robots: { index: false, follow: false },
};

type Params = Promise<{ next?: string }>;

async function RedirectIfSignedIn({ searchParams }: { searchParams: Params }) {
  const { next } = await searchParams;
  if (await readSession()) redirect(safeNext(next));
  return null;
}

export default function RegisterPage({
  searchParams,
}: {
  searchParams: Params;
}) {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-16">
      <Suspense fallback={null}>
        <RedirectIfSignedIn searchParams={searchParams} />
      </Suspense>

      <div className="w-full max-w-[26rem] rounded-xl border border-line bg-surface p-8">
        <Brand
          title="Create an Axon account"
          lede="An account gives you a daily free quota and keeps your model choices across browsers. The extension also works with your own API key and no account at all."
        />

        <Suspense fallback={<div className="mt-8 h-[18rem]" />}>
          <AuthForm mode="signUp" searchParams={searchParams} />
        </Suspense>

        <p className="mt-6 text-[13px] text-muted">
          Already have one?{" "}
          <Link href="/login" className="text-signal underline">
            Sign in
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
