// Brand sync:  node brand/sync.mjs [--check]
//
// brand/ is the one source for the look of every Axon surface:
//   tokens.css       colour roles, light and dark
//   icon-master.png  the 512px mark every icon size is cut from
//
// Without flags this copies tokens.css and regenerates the icon set into each repo.
// With --check it changes nothing and exits 1 if any target differs from what a sync
// would write, so it can sit in a test or lint step. Icons are compared by decoded
// pixels, not bytes, so a different PNG encoder does not read as drift.

import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = dirname(fileURLToPath(import.meta.url));
const app = resolve(here, "..");
const workspace = resolve(app, "..");
const check = process.argv.includes("--check");

const targets = {
  app,
  admin: join(workspace, "axon-admin"),
  extension: join(workspace, "ask-ai"),
};

// A sibling repo that is not checked out beside this one is skipped, so axon-app's own
// CI (which has only axon-app) can run --check.
const present = (name) => existsSync(targets[name]);

const problems = [];
const written = [];

function report(path, why) {
  problems.push(`${relative(workspace, path)}: ${why}`);
}

function putText(path, text) {
  const current = existsSync(path) ? readFileSync(path, "utf8") : null;
  if (current === text) return;
  if (check) return report(path, current === null ? "missing" : "differs from brand/");
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
  written.push(path);
}

async function pixels(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

async function putPng(path, size) {
  const buffer = await sharp(join(here, "icon-master.png"))
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();
  if (existsSync(path)) {
    const [a, b] = await Promise.all([pixels(path), pixels(buffer)]);
    if (a.width === b.width && a.height === b.height && a.data.equals(b.data)) return;
  }
  if (check) return report(path, existsSync(path) ? "icon differs from icon-master.png" : "missing");
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, buffer);
  written.push(path);
}

/** A maskable icon keeps its mark inside the central 80% safe zone on a solid field. */
async function putMaskable(path, size) {
  const inner = Math.round(size * 0.7);
  const mark = await sharp(join(here, "icon-master.png")).resize(inner, inner).png().toBuffer();
  const buffer = await sharp({
    create: { width: size, height: size, channels: 4, background: "#0e1117" },
  })
    .composite([{ input: mark, gravity: "centre" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
  if (existsSync(path)) {
    const [a, b] = await Promise.all([pixels(path), pixels(buffer)]);
    if (a.data.equals(b.data)) return;
  }
  if (check) return report(path, existsSync(path) ? "maskable icon differs" : "missing");
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, buffer);
  written.push(path);
}

/** ICO with PNG-encoded entries (supported since Vista): 16, 32 and 48. */
async function putIco(path) {
  const sizes = [16, 32, 48];
  const images = await Promise.all(
    sizes.map((s) => sharp(join(here, "icon-master.png")).resize(s, s).png({ compressionLevel: 9 }).toBuffer()),
  );
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = 6 + 16 * sizes.length;
  const entries = images.map((image, i) => {
    const entry = Buffer.alloc(16);
    entry[0] = sizes[i];
    entry[1] = sizes[i];
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(image.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += image.length;
    return entry;
  });
  const ico = Buffer.concat([header, ...entries, ...images]);
  if (existsSync(path) && readFileSync(path).equals(ico)) return;
  if (check) return report(path, existsSync(path) ? "favicon differs" : "missing");
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, ico);
  written.push(path);
}

// --- tokens ---------------------------------------------------------------------

const tokens = readFileSync(join(here, "tokens.css"), "utf8");
putText(join(targets.app, "app/tokens.css"), tokens);
if (present("admin")) putText(join(targets.admin, "app/tokens.css"), tokens);

/**
 * The dark column, under the extension's --axon-* names. ask-ai is its own repo with no
 * way to import this file, so it carries a committed copy its test suite reads.
 */
function darkColumn(css) {
  const block = css.match(/:root\[data-theme="dark"\]\s*\{([^}]*)\}/);
  if (!block) throw new Error("tokens.css: no :root[data-theme=\"dark\"] block");
  const values = {};
  for (const [, name, value] of block[1].matchAll(/--([\w-]+):\s*([^;]+);/g)) values[name] = value.trim();
  const map = {
    "--axon-ink": "plane",
    "--axon-surface": "surface",
    "--axon-surface-raised": "raised",
    "--axon-border": "line",
    "--axon-border-strong": "line-strong",
    "--axon-text-main": "ink",
    "--axon-text-muted": "muted",
    "--axon-text-dim": "faint",
    "--axon-primary": "signal",
    "--axon-primary-ink": "signal-ink",
    "--axon-accent-wash": "signal-wash",
    "--axon-success": "good",
    "--axon-warning": "warn",
    "--axon-error": "crit",
  };
  return Object.fromEntries(
    Object.entries(map).map(([axon, role]) => {
      if (!values[role]) throw new Error(`tokens.css: dark column has no --${role}`);
      return [axon, values[role]];
    }),
  );
}
if (present("extension")) {
  putText(
    join(targets.extension, "tests/brand-tokens.json"),
    JSON.stringify(darkColumn(tokens), null, 2) + "\n",
  );
}

// --- icons ----------------------------------------------------------------------

const webIcons = (root) => [
  putPng(join(root, "public/icon-192.png"), 192),
  putPng(join(root, "public/icon-512.png"), 512),
  putMaskable(join(root, "public/icon-maskable-512.png"), 512),
  putPng(join(root, "public/apple-touch-icon.png"), 180),
  putIco(join(root, "app/favicon.ico")),
];

await Promise.all([
  ...webIcons(targets.app),
  ...(present("admin") ? webIcons(targets.admin) : []),
  // The manifest's own sizes, each cut from the master rather than one file named
  // three times.
  ...(present("extension")
    ? [16, 48, 128].map((size) => putPng(join(targets.extension, `icons/icon-${size}.png`), size))
    : []),
]);

if (check) {
  if (problems.length) {
    console.error("brand drift:\n  " + problems.join("\n  "));
    console.error("run `node brand/sync.mjs` in axon-app to fix");
    process.exit(1);
  }
  console.log("brand: in sync");
} else {
  console.log(written.length ? "wrote:\n  " + written.map((p) => relative(workspace, p)).join("\n  ") : "brand: already in sync");
}
