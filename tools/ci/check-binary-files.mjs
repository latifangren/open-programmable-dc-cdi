import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const ignoredDirs = new Set([".git", ".omo", "node_modules"]);
const allowedBinaryExtensions = new Set([]);
const files = listFiles(root);
const failures = [];

for (const file of files) {
  if (isLikelyText(file)) {
    continue;
  }

  const extension = path.extname(file).toLowerCase();
  if (!allowedBinaryExtensions.has(extension)) {
    failures.push(relative(file));
  }
}

if (failures.length > 0) {
  console.error("Unexpected binary files found:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  console.error("Add a documented exception only when a binary artifact is intentional.");
  process.exit(1);
}

console.log(`Checked ${files.length} files for unexpected binary content.`);

function listFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (ignoredDirs.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function isLikelyText(file) {
  const sample = fs.readFileSync(file, { encoding: null });
  const size = Math.min(sample.length, 4096);

  for (let index = 0; index < size; index += 1) {
    if (sample[index] === 0) {
      return false;
    }
  }

  return true;
}

function relative(file) {
  return path.relative(root, file).replaceAll(path.sep, "/");
}
