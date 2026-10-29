"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { clearSession, readSession } from "@/lib/session";
import type { AccountState } from "@/lib/form-state";

function message(error: unknown): string {
  if (error instanceof ApiError) {
    return error.status === 429
      ? "Too many attempts. Wait a minute and try again."
      : error.message;
  }
  return "Could not reach Axon. Check your connection and try again.";
}

export async function updateName(
  _previous: AccountState,
  formData: FormData,
): Promise<AccountState> {
  const session = await readSession();
  if (!session) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  if (name.length > 120) return { error: "Keep your name under 120 characters.", done: null };

  try {
    await api(`/users/${session.userId}`, { method: "PATCH", body: { name } });
  } catch (error) {
    return { error: message(error), done: null };
  }
  revalidatePath("/account");
  return { error: null, done: "Saved." };
}

export async function revokeSession(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  try {
    await api(`/account/sessions/${id}`, { method: "DELETE" });
  } catch {
    // Already gone is the outcome that was asked for.
  }
  revalidatePath("/account");
}

/**
 * Irreversible, so the API asks for the password again. The redirect sits outside the
 * try for the same reason as in signIn: redirect() throws.
 */
export async function deleteAccount(
  _previous: AccountState,
  formData: FormData,
): Promise<AccountState> {
  const password = String(formData.get("password") ?? "");
  if (!password) return { error: "Enter your password to confirm.", done: null };

  try {
    await api("/account/delete", { method: "POST", body: { password } });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return { error: "That password is not correct.", done: null };
    }
    return { error: message(error), done: null };
  }

  await clearSession();
  redirect("/?deleted=1");
}
