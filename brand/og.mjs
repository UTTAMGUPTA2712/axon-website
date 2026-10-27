// Regenerates public/assets/og-image.png in the brand palette:  node brand/og.mjs
//
// Not part of `sync.mjs --check`: text is rasterised with whatever sans-serif the machine
// has, so the pixels differ between machines and a drift check would fail for nothing.
// Run it when the tagline or the palette changes and commit the result.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = dirname(fileURLToPath(import.meta.url));
const mark = readFileSync(join(here, "icon-master.png")).toString("base64");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0e1117"/>
  <image x="72" y="56" width="52" height="52" xlink:href="data:image/png;base64,${mark}"/>
  <text x="140" y="92" font-family="Geist, Helvetica, Arial, sans-serif" font-size="32" font-weight="700" fill="#e8ecf3">Axon</text>
  <text x="226" y="92" font-family="Geist, Helvetica, Arial, sans-serif" font-size="20" fill="#a3adbd">Chrome extension</text>
  <text font-family="Geist, Helvetica, Arial, sans-serif" font-size="68" font-weight="700" fill="#e8ecf3">
    <tspan x="72" y="250">An AI layer over</tspan>
    <tspan x="72" y="340">the page you're on.</tspan>
  </text>
  <rect x="72" y="372" width="96" height="4" fill="#8ea4ff"/>
  <text font-family="Geist, Helvetica, Arial, sans-serif" font-size="28" fill="#a3adbd">
    <tspan x="72" y="436">Summarize pages, ask about what's on screen,</tspan>
    <tspan x="72" y="476">and fill forms. Bring your own key, or sign in.</tspan>
  </text>
  <rect x="72" y="516" width="560" height="56" rx="8" fill="#151922" stroke="#6b778c" stroke-width="1"/>
  <circle cx="98" cy="544" r="5" fill="#8ea4ff"/>
  <text x="116" y="552" font-family="Geist, Helvetica, Arial, sans-serif" font-size="24" fill="#e8ecf3">Signed out, your key stays in your browser</text>
  <rect x="772" y="118" width="356" height="400" rx="14" fill="#151922" stroke="#262c39"/>
  <text x="792" y="152" font-family="Geist, Helvetica, Arial, sans-serif" font-size="17" font-weight="700" fill="#e8ecf3">Axon</text>
  <rect x="792" y="176" width="3" height="40" fill="#262c39"/>
  <text x="808" y="194" font-family="Geist, Helvetica, Arial, sans-serif" font-size="15" fill="#a3adbd">What are the key points</text>
  <text x="808" y="214" font-family="Geist, Helvetica, Arial, sans-serif" font-size="15" fill="#a3adbd">on this page?</text>
  <g fill="#1c212c"><rect x="792" y="248" width="300" height="10" rx="5"/><rect x="792" y="274" width="276" height="10" rx="5"/><rect x="792" y="300" width="236" height="10" rx="5"/><rect x="792" y="326" width="290" height="10" rx="5"/><rect x="792" y="352" width="190" height="10" rx="5"/></g>
  <rect x="792" y="396" width="1" height="1" fill="none"/>
  <rect x="772" y="436" width="356" height="1" fill="#262c39"/>
  <text x="792" y="474" font-family="Geist, Helvetica, Arial, sans-serif" font-size="14" fill="#a3adbd">Screenshot   ·   Summarize   ·   Fill form</text>
  <rect x="792" y="486" width="260" height="20" rx="6" fill="#0e1117" stroke="#6b778c"/>
  <rect x="1062" y="484" width="50" height="24" rx="6" fill="#8ea4ff"/>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(join(here, "..", "public/assets/og-image.png"));
console.log("wrote public/assets/og-image.png");
