import { cp, mkdir, rm, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const standaloneDirectory = resolve(projectRoot, ".next/standalone");
const staticSource = resolve(projectRoot, ".next/static");
const staticTarget = resolve(standaloneDirectory, ".next/static");
const publicSource = resolve(projectRoot, "public");
const publicTarget = resolve(standaloneDirectory, "public");

async function copyDirectory(source, target) {
  try {
    await stat(source);
  } catch {
    return;
  }

  await rm(target, { recursive: true, force: true });
  await mkdir(target, { recursive: true });
  await cp(source, target, { recursive: true });
}

await copyDirectory(staticSource, staticTarget);
await copyDirectory(publicSource, publicTarget);

console.log("Artefacto standalone preparado con recursos estáticos.");
