import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const target = process.argv[2];
const supportedTargets = new Set(["firefox", "chromium"]);

if (!supportedTargets.has(target)) {
  throw new Error("Choose a supported target: firefox or chromium.");
}

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const extensionDir = path.join(rootDir, "extension");
const outputDir = path.join(rootDir, "artifacts", `quickcopy-${target}`);

await rm(outputDir, { recursive: true, force: true });
await mkdir(path.dirname(outputDir), { recursive: true });
await cp(extensionDir, outputDir, { recursive: true });

const manifestPath = path.join(outputDir, "manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

if (target === "chromium") {
  delete manifest.browser_specific_settings;
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`QuickCopy ${target} package prepared at ${outputDir}`);

