# Low-Voltage Dry-Run Readiness

Status: planned readiness check only. Result: not run.

This checklist confirms whether the bench setup is ready to run [low-voltage-dry-run.md](low-voltage-dry-run.md). It is not validation evidence, does not record measured bench results, and does not authorize high-voltage or engine testing.

## Purpose

Use this checklist before BENCH-0001 to confirm that the low-voltage controller setup, logging path, and safety exclusions are ready enough to start the dry-run procedure.

Related documents:

- [Low-voltage dry-run procedure](low-voltage-dry-run.md)
- [BENCH-0001 planned report](../../reports/bench-0001-not-run.md)
- [Minimal bench log template](../artifacts/logs/minimal-bench-log-template.csv)
- [High-voltage safety](../../../docs/04-hv-safety.md)
- [Bench test plan](../../../docs/05-bench-test-plan.md)

## Scope

Included:

- low-voltage controller supply readiness,
- pickup simulator or logic-source readiness,
- isolated low-voltage timing observation point,
- CSV logging readiness,
- safe-state expectations for `CHARGE_EN` and `TRIGGER_CMD`.

Excluded:

- HV charger enable,
- HV capacitor charging,
- SCR or IGBT discharge testing,
- CDI coil, spark plug, or spark tester use,
- engine, vehicle, or road testing.

## Readiness Checks

Do not start the dry-run unless every applicable item is confirmed.

- [ ] Current-limited low-voltage supply is available and set for controller-only work.
- [ ] Pickup simulator, signal generator, or logic source is available with output initially disabled.
- [ ] Oscilloscope or logic analyzer is connected to an isolated low-voltage test point only.
- [ ] Timing output is not connected to the CDI Power Board discharge input.
- [ ] HV charger supply is disconnected or positively inhibited.
- [ ] HV capacitor is absent, or Vcap is verified safe by the project HV safety procedure.
- [ ] Discharge switch gate or trigger drive is disconnected or positively inhibited.
- [ ] CDI coil, spark plug, and spark tester are not connected.
- [ ] `CHARGE_EN` expected safe state is inactive during boot, reset, idle, and dry-run.
- [ ] `TRIGGER_CMD` expected safe state is inactive during boot and reset.
- [ ] Wiring diagram, setup photo, or setup notes are ready to reference from the report.
- [ ] Operator can remove low-voltage input power without reaching across exposed wiring.

## Logging Readiness

- [ ] CSV logger or manual capture path can produce the field order in [minimal-bench-log-template.csv](../artifacts/logs/minimal-bench-log-template.csv).
- [ ] Report ID is planned as `BENCH-0001`.
- [ ] Test phase is planned as low-voltage dry-run.
- [ ] Hardware revision, firmware or script revision, fixture revision, operator, and date can be recorded before the run.
- [ ] `vcap` and `charge_us` will be recorded as `0` only if HV is verified absent or disabled; otherwise they will be recorded as `NA` and explained in report notes.

## Stop Conditions

Do not proceed to the dry-run if any of these are true:

- HV status is uncertain,
- `CHARGE_EN` or `TRIGGER_CMD` cannot be observed at a low-voltage test point,
- wiring does not match the recorded setup,
- the pickup simulator output level is unknown or incompatible,
- the low-voltage supply current limit is not set,
- any operator is unsure whether the setup is low-voltage-only.

## Outcome

If every readiness item is confirmed, the team may start the low-voltage dry-run procedure and keep [../../reports/bench-0001-not-run.md](../../reports/bench-0001-not-run.md) as `Not run` until measured data is actually recorded and reviewed.

If any item is not confirmed, leave BENCH-0001 as `Not run` and update setup notes before trying again.

## Non-Authorization

Completing this readiness checklist does not authorize HV charger testing, capacitor charging, discharge testing, spark generation, engine testing, vehicle testing, or road testing. Those remain blocked until separate measured bench reports cover the required safety gates.
