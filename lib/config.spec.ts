import { describe, expect, it, vi } from "vitest";
import { isAllowedExtensionCallback, safeNext } from "./config";

/**
 * The allowlist is read from the environment at module load, so testing a *populated*
 * one means re-importing the module with the variable set. The function is otherwise
 * identical, which is why only the allowlist branch is exercised this way.
 */
async function withIds(value: string) {
  const previous = process.env.AXON_EXTENSION_ID;
  process.env.AXON_EXTENSION_ID = value;
  vi.resetModules();
  const mod = await import("./config");
  process.env.AXON_EXTENSION_ID = previous;
  return mod.isAllowedExtensionCallback;
}

/**
 * These two functions are the whole of what stands between the connect page and an
 * open redirect carrying a live credential, so they are pinned rather than reasoned
 * about.
 *
 * `isAllowedExtensionCallback` is tested against the module's default — no
 * AXON_EXTENSION_ID set, which is the development case and the permissive one. Pinning
 * to a single id only narrows what follows.
 */

const ID = "abcdefghijklmnopabcdefghijklmnop"; // 32 chars from a–p, like a real one

describe("isAllowedExtensionCallback", () => {
  it("accepts what chrome.identity.getRedirectURL actually produces", () => {
    expect(isAllowedExtensionCallback(`https://${ID}.chromiumapp.org/axon`)).toBe(true);
    expect(isAllowedExtensionCallback(`https://${ID}.chromiumapp.org/`)).toBe(true);
  });

  it("refuses any other origin", () => {
    expect(isAllowedExtensionCallback("https://evil.example/cb")).toBe(false);
    expect(isAllowedExtensionCallback("not a url")).toBe(false);
    expect(isAllowedExtensionCallback("javascript:alert(1)")).toBe(false);
  });

  it("refuses the host tricks that look like the real one", () => {
    // Each of these would hand the code to someone else if the check were a substring
    // match rather than an anchored one.
    expect(
      isAllowedExtensionCallback(`https://${ID}.chromiumapp.org.evil.example/`),
    ).toBe(false);
    expect(isAllowedExtensionCallback(`https://evil${ID}.chromiumapp.org/`)).toBe(false);
    expect(isAllowedExtensionCallback(`https://${ID}.chromiumapp.org@evil.example/`)).toBe(
      false,
    );
    // Extension ids are a–p only; anything else is not one.
    expect(
      isAllowedExtensionCallback("https://zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz.chromiumapp.org/"),
    ).toBe(false);
  });

  it("accepts every id it was given, so dev and release can both sign in", async () => {
    const OTHER = "ponmlkjihgfedcbaponmlkjihgfedcba";
    // The case this exists for: one deployed app facing an unpacked development copy
    // and the Web Store release at the same time.
    const allowed = await withIds(` ${ID} , ${OTHER.toUpperCase()} `);

    expect(allowed(`https://${ID}.chromiumapp.org/axon`)).toBe(true);
    expect(allowed(`https://${OTHER}.chromiumapp.org/axon`)).toBe(true);
    expect(allowed("https://aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.chromiumapp.org/axon")).toBe(
      false,
    );
  });

  it("insists on https", () => {
    expect(isAllowedExtensionCallback(`http://${ID}.chromiumapp.org/axon`)).toBe(false);
  });

  it("refuses a callback that already carries a query or fragment", () => {
    // We append our own fragment, so one already there would be dropped; a query we
    // did not put there means nothing to the extension. Either signals a caller doing
    // something other than what this page is for.
    expect(isAllowedExtensionCallback(`https://${ID}.chromiumapp.org/cb?x=1`)).toBe(false);
    expect(isAllowedExtensionCallback(`https://${ID}.chromiumapp.org/cb#x=1`)).toBe(false);
  });
});

describe("safeNext", () => {
  it("keeps a path on this origin", () => {
    expect(safeNext("/extension/connect?code_challenge=x")).toBe(
      "/extension/connect?code_challenge=x",
    );
  });

  it("refuses anything that would leave this origin", () => {
    // A sign-in page that can be made to bounce elsewhere is a phishing primitive, and
    // this one is linked to from the extension.
    expect(safeNext("https://evil.example")).toBe("/account");
    expect(safeNext("//evil.example")).toBe("/account");
    expect(safeNext("\\\\evil.example")).toBe("/account");
  });

  it("falls back for anything that is not a string", () => {
    expect(safeNext(undefined)).toBe("/account");
    expect(safeNext(["/a", "/b"])).toBe("/account");
  });
});
