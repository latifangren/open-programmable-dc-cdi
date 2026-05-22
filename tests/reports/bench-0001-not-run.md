# Bench Report 0001 - Low-Voltage Dry-Run Plan

Status: planned report only. Result: Not run.

This file reserves the first bench report slot for the planned low-voltage dry-run. It is not completed validation evidence and does not show that any CDI subsystem has passed a test.

Use [../../docs/validation/bench-test-template.md](../../docs/validation/bench-test-template.md) when turning this stub into a real report.

## Planned Scope

| Field | Entry |
|---|---|
| Report ID | BENCH-0001 |
| Test phase | Phase 1 - low-voltage controller dry-run |
| Related test IDs | TEST-PICKUP-001, TEST-TIMING-001, TEST-FAULT-007 |
| Related requirement IDs | REQ-TIME-001, REQ-TIME-002, REQ-SAFE-001, REQ-IF-003 |
| Hardware revision | TBD |
| Firmware or script revision | TBD |
| Result | Not run |

Planned procedure and setup references:

- [Low-voltage dry-run procedure](../bench/procedures/low-voltage-dry-run.md)
- [Low-voltage dry-run readiness](../bench/procedures/low-voltage-dry-run-readiness.md)
- [Minimal bench log template](../bench/artifacts/logs/minimal-bench-log-template.csv)
- [Low-voltage timing capture template](../bench/artifacts/scope-captures/low-voltage-timing-capture-template.md)

Included planned behavior:

- low-voltage controller power-up,
- pickup simulator or logic-source input,
- RPM and advance visibility,
- isolated low-voltage timing output observation,
- CSV logging readiness,
- reset or watchdog safe-state observation.

Excluded behavior:

- HV charger enable,
- HV capacitor charging,
- SCR or IGBT discharge testing,
- CDI coil, spark plug, or spark tester use,
- engine, vehicle, or road testing.

## Expected Evidence

When this report is intentionally updated after a real dry-run, it should link:

- setup photo, wiring note, or diagram,
- CSV log using the minimal bench log template,
- scope or logic-analyzer capture from an isolated low-voltage test point,
- notes showing `CHARGE_EN` stayed inactive,
- notes showing `TRIGGER_CMD` stayed inactive during boot and reset,
- reset or watchdog safe-state observation if the setup supports it.

## Future Evidence Locations

- [bench/artifacts/logs/](../bench/artifacts/logs/) - future logs.
- [bench/artifacts/scope-captures/](../bench/artifacts/scope-captures/) - future scope or logic-analyzer captures.
- [bench/artifacts/raw-data/](../bench/artifacts/raw-data/) - future raw measurement data and setup photos.

## Not Evidence Yet

- No test has been run for this report.
- No measured Vcap, timing, discharge, fault, thermal, or long-run result is recorded here.
- No pass/fail decision exists.
- No schematic, PCB, BOM, or hardware revision is validated by this stub.

## Non-Authorization

This stub does not authorize engine, vehicle, or road testing. Engine testing remains blocked until measured bench reports cover timing, HV charge, Vcap measurement, controlled discharge, fault handling, and long-run stability.
