import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * A `"use server"` file may only export async functions.
 *
 * Next does not enforce this at build time for every shape. A plain function is caught
 * by `next build`; a const object is not — it compiles, the build goes green, and then
 * the module throws `A "use server" file can only export async functions, found object`
 * the first time it is evaluated, which is the first time a user submits the form. The
 * page renders perfectly until then, so nothing short of submitting finds it.
 *
 * That is exactly how it shipped: initial `useActionState` values were exported from
 * these files, every page loaded, and sign-in answered "Internal Server Error". The
 * values now live in lib/form-state.ts.
 *
 * Read as source rather than imported, deliberately: importing would need Next's `@/`
 * alias and its server runtime, and the thing under test is a rule about how the file
 * is *written*. The directory is walked rather than listed so a new action module is
 * covered the day it is added.
 */

const ACTIONS_DIR = import.meta.dirname;

const actionFiles = readdirSync(ACTIONS_DIR).filter(
  (name) => name.endsWith(".ts") && !name.endsWith(".spec.ts"),
);

/** `export type` / `export interface` are erased at compile time and are allowed. */
const TYPE_EXPORT = /^export\s+(type|interface)\b/;

describe('every "use server" module', () => {
  it("has action files to check at all", () => {
    // Guards the walk itself: a rename that emptied this list would otherwise turn the
    // checks below into zero silently passing tests.
    expect(actionFiles.length).toBeGreaterThan(0);
  });

  for (const file of actionFiles) {
    it(`${file} exports only async functions`, () => {
      const source = readFileSync(join(ACTIONS_DIR, file), "utf8");
      expect(source).toMatch(/^\s*["']use server["']/);

      const offenders = source
        .split("\n")
        .filter((line) => /^export\b/.test(line))
        .filter((line) => !TYPE_EXPORT.test(line))
        .filter((line) => !/^export\s+async\s+function\b/.test(line));

      expect(
        offenders,
        `${file} has an export that is not an async function. A "use server" file may ` +
          "only export those — move constants to lib/form-state.ts.",
      ).toEqual([]);
    });
  }
});
