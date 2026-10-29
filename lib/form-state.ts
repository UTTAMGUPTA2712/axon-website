/**
 * The shapes and starting values `useActionState` needs for the forms on this app.
 *
 * They live here rather than beside their actions because a `"use server"` file may
 * only export async functions. A type export is erased and so is harmless, but a const
 * object is not: it compiles cleanly, passes `next build`, and then throws
 * `A "use server" file can only export async functions, found object` the first time
 * the action module is evaluated — which is the first time anyone submits the form.
 * The build cannot catch it, so keeping these out of the action files is the fix.
 */

export interface AuthState {
  error: string | null;
}

export const INITIAL_AUTH_STATE: AuthState = { error: null };

export interface ConnectState {
  error: string | null;
}

export const INITIAL_CONNECT_STATE: ConnectState = { error: null };

/** For the account forms: an error to show, or a confirmation to show instead. */
export interface AccountState {
  error: string | null;
  done: string | null;
}

export const INITIAL_ACCOUNT_STATE: AccountState = { error: null, done: null };
