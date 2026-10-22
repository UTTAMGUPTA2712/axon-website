import { safeNext } from "@/lib/config";
import { AuthFormClient } from "./auth-form-client";

/**
 * Reads `next` out of the URL and hands the form a path it has already vetted, so
 * the client component never has to think about where a sign-in is allowed to
 * land. Awaiting searchParams is request-time work, which is why both pages wrap
 * this in `<Suspense>`.
 */
export async function AuthForm({
  mode,
  searchParams,
}: {
  mode: "signIn" | "signUp";
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return <AuthFormClient mode={mode} next={safeNext(next)} />;
}
