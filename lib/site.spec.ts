import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { EXTENSION_VERSION, FAQ, PAGES, SITE_DESCRIPTION, jsonLd } from "./site";

const root = resolve(__dirname, "..");

/** Every source file that can put words in front of a reader. */
function copyFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return copyFiles(path);
    return /\.(tsx?|json)$/.test(name) && !name.endsWith(".spec.ts") ? [path] : [];
  });
}

describe("claims match what the server does", () => {
  // axon-server exists, keeps accounts and stores prompt runs. Copy that says otherwise
  // is wrong, and on a privacy policy it is a Web Store policy problem.
  const banned = [/no backend/i, /(?<!signed out,? )there is no axon server\b/i, /no account to create/i, /no "?us"? in the request path/i, /there is no .?us.?\b/i];

  for (const file of ["app", "components", "lib"].flatMap((d) => copyFiles(join(root, d)))) {
    it(`${file.slice(root.length + 1)} does not deny the server`, () => {
      const text = readFileSync(file, "utf8");
      for (const phrase of banned) expect(text).not.toMatch(phrase);
    });
  }

  it("the description names both modes", () => {
    expect(SITE_DESCRIPTION).toMatch(/own API key/);
    expect(SITE_DESCRIPTION).toMatch(/sign in/);
  });
});

describe("one source of truth", () => {
  it("EXTENSION_VERSION is the extension's manifest version", () => {
    const manifest = resolve(root, "../ask-ai/manifest.json");
    if (!existsSync(manifest)) return; // axon-app checked out alone
    expect(JSON.parse(readFileSync(manifest, "utf8")).version).toBe(EXTENSION_VERSION);
  });

  it("every page has a distinct path and a description that fits a result snippet", () => {
    expect(new Set(PAGES.map((p) => p.path)).size).toBe(PAGES.length);
    for (const page of PAGES) {
      expect(page.description.length, page.path).toBeLessThanOrEqual(200);
    }
  });

  it("the structured data carries an Organization, a breadcrumb and a FAQ", () => {
    const types = jsonLd("/pricing")["@graph"].map((n) => (n as { "@type": string })["@type"]);
    expect(types).toContain("Organization");
    expect(types).toContain("BreadcrumbList");
    expect(FAQ.length).toBeGreaterThan(0);
  });
});
