import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const ignoredDirs = new Set([".git", ".omo", "node_modules"]);
const ignoredFiles = new Set([
  "docs/research/raw-user-research.md",
  "tools/ci/check-release-hygiene.mjs",
]);
const textFiles = listFiles(root).filter((file) => isTextPath(file) && !ignoredFiles.has(relative(file)));

const forbiddenPatterns = [
  {
    pattern: /\bproduction-ready\b/i,
    allowedWhen: /(not|nothing here is|no\s+[^\n.]*claim|without bench|until hardware|should not claim|do not claim|before production-candidate status|production-ready claim|requires bench history)/i,
    message: "production-ready wording must be explicitly negative or gated by evidence",
  },
  {
    pattern: /\bfinal BOM\b/i,
    allowedWhen: /(not|no|without|before validation|final BOM claim|does not create|not allowed)/i,
    message: "final BOM wording must not imply the BOM exists",
  },
  {
    pattern: /\bfinal schematic\b/i,
    allowedWhen: /(not|no|without|does not create|not allowed|^-\s*final schematic)/i,
    message: "final schematic wording must not imply the schematic exists",
  },
  {
    pattern: /\bvalidated design\b/i,
    allowedWhen: /(not|no|without|does not create|this is not)/i,
    message: "validated design wording must not imply validation exists",
  },
  {
    pattern: /\bcomplete DC-CDI\b/i,
    allowedWhen: /(must include|do not describe|only describe|claims shall require|controller-only|not complete|needs:|complete DC-CDI hardware)/i,
    message: "complete DC-CDI wording must stay conditional or corrective",
  },
  {
    pattern: /\bTODO\b|\bFIXME\b/i,
    allowedWhen: /docs\/research\/raw-user-research\.md$/,
    message: "TODO/FIXME markers are not allowed outside raw research notes",
  },
];

const failures = [];

for (const file of textFiles) {
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const rule of forbiddenPatterns) {
      if (!rule.pattern.test(line)) {
        continue;
      }

      const relativePath = relative(file);
      const allowed = rule.allowedWhen instanceof RegExp && rule.allowedWhen.test(line);
      const allowedPath = rule.allowedWhen instanceof RegExp && rule.allowedWhen.test(relativePath);

      if (!allowed && !allowedPath) {
        failures.push(`${relativePath}:${index + 1}: ${rule.message}: ${line.trim()}`);
      }
    }
  });
}

if (failures.length > 0) {
  console.error("Release hygiene wording check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Release hygiene wording checked across ${textFiles.length} text files.`);

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

function isTextPath(file) {
  return /\.(md|txt|yml|yaml|json|js|mjs|c|h|cpp|hpp|py|sh|ps1)$/i.test(file);
}

function relative(file) {
  return path.relative(root, file).replaceAll(path.sep, "/");
}
