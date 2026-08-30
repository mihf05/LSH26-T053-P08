/**
 * Downloads the landing page images and vectors from Figma into public/landing.
 *
 *   npm run assets:landing
 *
 * The URLs come from the Figma MCP asset host and expire roughly 7 days after
 * they were issued. If a download 404s, re-export the asset from the Figma file
 * by hand instead: open node 1:265 ("Desktop") in
 * https://figma.com/design/QMI63rM4YzUCDpN91OtS6Z, select the layer named in
 * lib/landing-assets.ts, and export it to public/landing with the file name and
 * size listed there.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";

const HOST = "https://www.figma.com/api/mcp/asset";
const OUT = "public/landing";

// Parsed straight out of the manifest so the two can never drift apart.
const source = readFileSync("lib/landing-assets.ts", "utf8");
const assets = [...source.matchAll(
  /\{\s*file:\s*"([^"]+)",\s*id:\s*"([^"]+)"/g,
)].map(([, file, id]) => ({ file, id }));

if (assets.length === 0) {
  console.error("No assets found in lib/landing-assets.ts");
  process.exit(1);
}

await mkdir(OUT, { recursive: true });

let ok = 0;
const failed = [];

for (const { file, id } of assets) {
  const ext = file.endsWith(".svg") ? "svg" : "png";
  const url = `${HOST}/${id}.${ext}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await writeFile(`${OUT}/${file}`, Buffer.from(await res.arrayBuffer()));
    console.log(`  ${file}`);
    ok++;
  } catch (e) {
    failed.push(`${file}: ${e.message}`);
  }
}

console.log(`\n${ok}/${assets.length} downloaded into ${OUT}`);
if (failed.length > 0) {
  console.error(`\nFailed:\n  ${failed.join("\n  ")}`);
  console.error(
    "\nThe Figma asset URLs expire after about a week. Re-export those layers\nfrom the Figma file by hand -- see lib/landing-assets.ts for names and sizes.",
  );
  process.exit(1);
}
