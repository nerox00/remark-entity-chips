/**
 * Downloads favicons for all entities and converts them to .webp
 *
 * Usage:
 *   npm install sharp (if not already installed)
 *   node download-favicons.mjs
 *
 * Options:
 *   --force    Re-download even if the .webp file already exists
 *   --dry-run  Show what would be downloaded without doing it
 */

import { readFileSync, existsSync, mkdirSync } from "fs";
import { writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENTITIES_DIR = join(__dirname, "public", "entities");
const ENTITIES_FILE = join(__dirname, "src", "data", "entities.ts");

const force = process.argv.includes("--force");
const dryRun = process.argv.includes("--dry-run");

// Parse entities from the TS source file
function parseEntities() {
  const src = readFileSync(ENTITIES_FILE, "utf-8");
  const entries = [];
  const regex =
    /(?:^|\n)\s{2}(?:"([^"]+)"|([a-zA-Z0-9_-]+)):\s*\{[^}]*domain:\s*"([^"]+)"/g;
  let match;
  while ((match = regex.exec(src)) !== null) {
    const slug = match[1] || match[2];
    const domain = match[3];
    entries.push({ slug, domain });
  }
  return entries;
}

async function downloadFavicon(domain) {
  const url = `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=48`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${domain}`);
  return Buffer.from(await res.arrayBuffer());
}

async function convertToWebp(buffer) {
  const sharp = (await import("sharp")).default;
  return sharp(buffer).resize(16, 16).webp({ quality: 90 }).toBuffer();
}

async function main() {
  if (!existsSync(ENTITIES_DIR)) {
    mkdirSync(ENTITIES_DIR, { recursive: true });
  }

  const entities = parseEntities();
  console.log(`Found ${entities.length} entities\n`);

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const { slug, domain } of entities) {
    const outPath = join(ENTITIES_DIR, `${slug}.webp`);

    if (!force && existsSync(outPath)) {
      skipped++;
      continue;
    }

    if (dryRun) {
      console.log(`[DRY RUN] Would download: ${slug} (${domain})`);
      downloaded++;
      continue;
    }

    try {
      process.stdout.write(`Downloading ${slug} (${domain})...`);
      const raw = await downloadFavicon(domain);
      const webp = await convertToWebp(raw);
      await writeFile(outPath, webp);
      console.log(` OK (${webp.length} bytes)`);
      downloaded++;
      // Small delay to be polite to Google's servers
      await new Promise((r) => setTimeout(r, 200));
    } catch (err) {
      console.log(` FAILED: ${err.message}`);
      failed++;
    }
  }

  console.log(
    `\nDone! Downloaded: ${downloaded}, Skipped: ${skipped}, Failed: ${failed}`
  );
}

main().catch(console.error);
