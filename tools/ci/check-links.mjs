import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const ignoredDirs = new Set([".git", ".omo", "node_modules"]);
const markdownFiles = listFiles(root).filter((file) => file.endsWith(".md"));
const failures = [];

for (const file of markdownFiles) {
  const text = fs.readFileSync(file, "utf8");

  for (const link of extractMarkdownLinks(text)) {
    if (shouldSkip(link.target)) {
      continue;
    }

    const targetPath = resolveLink(file, link.target);
    if (!isInsideRoot(targetPath)) {
      failures.push(`${relative(file)}:${link.line}: link target escapes repository: ${link.target}`);
      continue;
    }

    if (!fs.existsSync(targetPath)) {
      failures.push(`${relative(file)}:${link.line}: missing link target: ${link.target}`);
    }
  }
}

if (failures.length > 0) {
  console.error("Broken relative Markdown links found:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Checked ${markdownFiles.length} Markdown files for relative links.`);

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

function extractMarkdownLinks(text) {
  const links = [];
  const lines = text.split(/\r?\n/);

  lines.forEach((line, index) => {
    const pattern = /!?\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
    let match = pattern.exec(line);

    while (match !== null) {
      links.push({ target: match[1], line: index + 1 });
      match = pattern.exec(line);
    }
  });

  return links;
}

function shouldSkip(target) {
  return (
    target.startsWith("http://") ||
    target.startsWith("https://") ||
    target.startsWith("mailto:") ||
    target.startsWith("#")
  );
}

function resolveLink(sourceFile, target) {
  const withoutAnchor = target.split("#")[0];
  const decoded = decodeURIComponent(withoutAnchor);
  return path.resolve(path.dirname(sourceFile), decoded);
}

function isInsideRoot(targetPath) {
  const relativeTarget = path.relative(root, targetPath);
  return relativeTarget === "" || (!relativeTarget.startsWith("..") && !path.isAbsolute(relativeTarget));
}

function relative(file) {
  return path.relative(root, file).replaceAll(path.sep, "/");
}
