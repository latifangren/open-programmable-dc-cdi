import fs from "node:fs";

const requiredPaths = [
  "README.md",
  "AGENTS.md",
  "docs/README.md",
  "docs/00-project-goals.md",
  "docs/01-cdi-theory.md",
  "docs/02-system-architecture.md",
  "docs/03-electrical-spec.md",
  "docs/04-hv-safety.md",
  "docs/05-bench-test-plan.md",
  "docs/06-production-checklist.md",
  "docs/07-engine-target-and-design-budget.md",
  "docs/08-power-stage-architecture.md",
  "docs/09-power-stage-block-design.md",
  "docs/10-component-candidate-matrix.md",
  "docs/11-pcb-and-test-jig-plan.md",
  "docs/12-board-interface-contract.md",
  "docs/13-failure-modes.md",
  "docs/14-requirements-traceability.md",
  "docs/15-first-prototype-decisions.md",
  "docs/research/README.md",
  "firmware/README.md",
  "hardware/README.md",
  "hardware/controller-board/README.md",
  "hardware/cdi-power-board/README.md",
  "hardware/cdi-power-board/requirements.md",
  "hardware/cdi-power-board/schematic-checklist.md",
  "hardware/interfaces/README.md",
  "hardware/pickup-conditioner/README.md",
  "hardware/test-jigs/README.md",
  "tools/README.md",
  "calibration/README.md",
  "tests/README.md",
  "manufacturing/README.md",
];

const missing = requiredPaths.filter((requiredPath) => !fs.existsSync(requiredPath));

if (missing.length > 0) {
  console.error("Required repository paths are missing:");
  for (const item of missing) {
    console.error(`- ${item}`);
  }
  process.exit(1);
}

console.log(`Required repository structure present (${requiredPaths.length} paths).`);
