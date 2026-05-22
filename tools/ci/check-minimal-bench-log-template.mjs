import fs from "node:fs";

const templatePath = "tests/bench/artifacts/logs/minimal-bench-log-template.csv";
const expectedHeader = "time_us,rpm,advance_deg,vbat,vcap,charge_us,event,error";

if (!fs.existsSync(templatePath)) {
  console.error(`Missing bench log template: ${templatePath}`);
  process.exit(1);
}

const raw = fs.readFileSync(templatePath, "utf8");
const normalized = raw.replace(/\r\n/g, "\n");
const trimmedFinalNewline = normalized.endsWith("\n") ? normalized.slice(0, -1) : normalized;

if (trimmedFinalNewline !== expectedHeader) {
  console.error("Bench log template must contain exactly one header row:");
  console.error(expectedHeader);
  process.exit(1);
}

console.log("Minimal bench log template is header-only and uses the expected field order.");
