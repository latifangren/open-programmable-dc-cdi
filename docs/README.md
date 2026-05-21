# Documentation Index

These documents are the engineering source of truth for the project. The raw research notes stay under `docs/research/` for provenance only.

## Reading Order

1. [00-project-goals.md](00-project-goals.md) - project identity, scope, and non-goals.
2. [01-cdi-theory.md](01-cdi-theory.md) - CDI vs TCI vs trigger-controller distinction.
3. [02-system-architecture.md](02-system-architecture.md) - final controller board and CDI power board split.
4. [03-electrical-spec.md](03-electrical-spec.md) - draft electrical targets and open decisions.
5. [04-hv-safety.md](04-hv-safety.md) - high-voltage safety rules and test gates.
6. [05-bench-test-plan.md](05-bench-test-plan.md) - bench-first validation before engine testing.
7. [06-production-checklist.md](06-production-checklist.md) - what must exist before production-candidate status.
8. [07-engine-target-and-design-budget.md](07-engine-target-and-design-budget.md) - initial engine scope, RPM, spark energy, and charger budget.
9. [08-power-stage-architecture.md](08-power-stage-architecture.md) - initial HV charger, discharge switch, Vcap, and safety architecture direction.

## Source Rules

- Canonical engineering decisions belong in numbered files under `docs/`.
- Raw notes, conversation dumps, and uncurated links belong in `docs/research/`.
- Hardware stubs belong in `hardware/`.
- Firmware stubs belong in `firmware/`.
- Tools, calibration, tests, and manufacturing stubs document roadmap boundaries until real artifacts exist.
- No document may claim production readiness without bench test evidence.

## Initial Product Scope

- Primary target: single-cylinder 2-stroke motorcycle engines under 200cc.
- Fuel system target: older carbureted motorcycles, not EFI integration.
- Future-compatible target: 4-stroke support through engine profiles and scheduling rules.
- Non-target: a CDI locked to one motorcycle brand, model, or engine.
