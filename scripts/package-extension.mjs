import { execFile } from "node:child_process";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
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
const archivePath = path.join(rootDir, "artifacts", `quickcopy-${target}.zip`);
const execFileAsync = promisify(execFile);

await rm(outputDir, { recursive: true, force: true });
await mkdir(path.dirname(outputDir), { recursive: true });
await cp(extensionDir, outputDir, { recursive: true });
await rm(path.join(outputDir, "store"), { recursive: true, force: true });

const manifestPath = path.join(outputDir, "manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

if (target === "chromium") {
  delete manifest.browser_specific_settings;
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
await rm(archivePath, { force: true });
await execFileAsync("zip", ["-qr", archivePath, "."], { cwd: outputDir });
console.log(`QuickCopy ${target} package prepared at ${outputDir}`);
console.log(`QuickCopy ${target} store archive prepared at ${archivePath}`);
