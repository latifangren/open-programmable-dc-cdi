# Bench Tests

Status: placeholder.

This folder is for bench test procedures, raw results, and analysis.

No bench test has been run yet. Files here are placeholders until a report records measured evidence.

## Procedures

- [procedures/](procedures/) - planned bench procedures.
- [procedures/low-voltage-dry-run.md](procedures/low-voltage-dry-run.md) - first low-voltage dry-run procedure with HV and engine testing excluded.

## Artifact Storage

- [artifacts/](artifacts/) - raw evidence storage rules.
- [artifacts/logs/](artifacts/logs/) - future CSV logs, serial logs, and event logs.
- [artifacts/scope-captures/](artifacts/scope-captures/) - future oscilloscope and logic-analyzer captures.
- [artifacts/raw-data/](artifacts/raw-data/) - future unprocessed measurement files and setup photos.

Summarized results belong in [../reports/](../reports/). Use [../../docs/validation/bench-test-template.md](../../docs/validation/bench-test-template.md) when creating a measured bench report.

Expected bench areas:

- Pickup simulator timing.
- HV charger behavior with discharge disabled.
- Vcap measurement accuracy.
- Controlled discharge into approved load or spark tester.
- Timing jitter.
- Fault injection.
- Thermal checks.

Engine testing remains blocked until measured bench reports prove the required behavior.
