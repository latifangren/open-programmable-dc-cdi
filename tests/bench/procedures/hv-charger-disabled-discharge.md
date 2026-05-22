# HV Charger With Discharge Disabled Procedure

Status: planned procedure. Result: not run.

This procedure is a planned HV charger-only procedure with the discharge path disabled. It is not validation evidence, does not record measured data, and does not authorize spark generation, discharge testing, engine testing, vehicle testing, or road testing.

## Purpose

Use this procedure to plan the first HV charger bench check after low-voltage controller behavior is understood. The intended evidence is limited to charger enable behavior, Vcap rise, charger stop behavior, timeout or fault behavior, and safe-discharge confirmation while the discharge stage remains disabled.

This document is a procedure plan, not permission to energize hardware. A future run still needs reviewed hardware, guarded fixture, rated measurement method, operator assignment, and report setup before any HV is applied.

## Related Documents

- [CDI power-board test plan](../../../hardware/cdi-power-board/test-plan.md)
- [High-voltage safety](../../../docs/04-hv-safety.md)
- [Bench test plan](../../../docs/05-bench-test-plan.md)
- [Requirements traceability](../../../docs/14-requirements-traceability.md)
- [HV charge report template](../../reports/templates/hv-charge-report.md)
- [Bench validation report template](../../../docs/validation/bench-test-template.md)

## Traceability

- Covers: `REQ-HV-001`, `REQ-HV-002`, `REQ-SAFE-003`, `REQ-SAFE-005`
- Test IDs: `TEST-HV-001`, `TEST-HV-002`, `TEST-HV-003`, `TEST-HV-004`, `TEST-HV-005`
- Related local requirements: `PWR-REQ-CHG-001` to `PWR-REQ-CHG-005`, `PWR-REQ-CAP-003` to `PWR-REQ-CAP-005`, `PWR-REQ-VCAP-001` to `PWR-REQ-VCAP-005`

## Scope

Included:

- charger enable and inhibit behavior,
- Vcap ramp observation with a properly rated external measurement method,
- charger stop on target, timeout, overvoltage, or fault,
- input current-limit and charge-time logging plan,
- bleeder or safe-discharge confirmation plan,
- report field preparation for the future HV charge report.

Excluded:

- SCR or IGBT discharge testing,
- CDI coil, spark plug, spark gap, or spark tester use,
- controlled discharge, false-trigger, or long-run discharge testing,
- final schematic, PCB, BOM, or component value selection,
- spark strength, engine performance, or reliability claims,
- engine, vehicle, or road testing.

## Required Safety Gate

Do not start a future run unless every applicable gate is confirmed and recorded in setup notes:

- [ ] `docs/04-hv-safety.md` has been reviewed for this setup.
- [ ] Schematic, wiring diagram, or fixture diagram matches the bench setup.
- [ ] HV charger section is mounted in a guarded fixture or enclosure.
- [ ] No HV charger, HV capacitor, SCR, CDI coil, or discharge loop is on a breadboard.
- [ ] Input supply has a defined current limit and physical disconnect method.
- [ ] Vcap is measured with a properly rated external HV meter or probe method.
- [ ] Bleeder or safe-discharge path is present and documented.
- [ ] One responsible operator is assigned to remove power, discharge, and verify safe Vcap.
- [ ] Future report file and raw artifact locations are prepared before the run.

If any item is not confirmed, leave the result as `Not run` and update setup notes before trying again.

## Required Safe State

Before any future charger-only run:

- Discharge path must remain disabled or positively inhibited for the entire charger-only procedure.
- Do not rely on firmware alone for discharge safety.
- Discharge switch gate or trigger drive must be disconnected, inhibited, or otherwise proven unable to fire.
- CDI coil, spark plug, spark gap, and spark tester must not be connected.
- `TRIGGER_CMD` must be inactive before charger work begins.
- `CHARGE_EN` must be inactive during boot, reset, setup, and idle.
- Vcap must be treated as dangerous until discharged and verified with a properly rated method.

If discharge inhibition, Vcap state, fixture state, or measurement rating is uncertain, stop and leave the result as `Not run` or failed in the future report.

## Equipment And Fixture Prerequisites

- Current-limited input supply with physical disconnect.
- Guarded HV charger fixture or enclosure.
- HV capacitor candidate installed only if reviewed for this charger-only setup.
- Bleeder or documented safe-discharge path.
- Properly rated external Vcap meter or probe method.
- Low-voltage observation point for `CHARGE_EN`, `READY`, `FAULT_N`, and any charger status signals.
- Scope, logic analyzer, or logger only where the measurement method keeps low-voltage instruments away from HV return paths.
- Setup photo, wiring diagram, or fixture diagram for the future report.

## Gated Procedure Plan

This plan defines gates for a future reviewed procedure run. It does not include live-HV operating instructions.

1. Confirm the required safety gate and required safe state.
2. Record operator, date, hardware revision, firmware or test-script revision, charger candidate, HV capacitor candidate, Vcap measurement method, and fixture reference.
3. Record input supply current-limit setting as a field name or `TBD`; do not add sample numeric readings to this planned procedure.
4. Confirm discharge path remains disabled or positively inhibited.
5. Confirm `CHARGE_EN`, `TRIGGER_CMD`, `READY`, and `FAULT_N` expected startup states at low-voltage observation points.
6. Prepare the future HV charge report before any measured run.
7. During a future approved run, record only the observations allowed by the reviewed setup and stop on any abort criterion.
8. After any future run, remove input power, discharge by the defined method, and verify Vcap below the safe threshold with the rated method before handling.

## Planned Checks

These are planned checks, not pass criteria until a measured report records setup, evidence, and result.

| Check | Planned observation | Evidence target |
|---|---|---|
| Charger enable | Charger starts only when enabled. | `TEST-HV-001` in the HV charge report. |
| Vcap ramp | Vcap rises toward the documented target range without unsupported overshoot claim. | Vcap log, external meter reference, and charge time. |
| Charger stop | Charger stops on target, timeout, overvoltage, invalid feedback, emergency stop, or fault. | `TEST-HV-002`, `TEST-HV-003`, `TEST-HV-004`. |
| Safe discharge | Vcap decays to a defined safe threshold and is externally verified. | `TEST-HV-005` bleeder check section. |
| Logging | Future report records Vbat, Vcap, charge time, stop reason, and pass/fail result. | [HV charge report template](../../reports/templates/hv-charge-report.md). |
| Inhibit boundary | Discharge path remains disabled before, during, and after charger-only work. | Setup notes and low-voltage observation notes. |

## Log And Report Fields

Use the future [HV charge report template](../../reports/templates/hv-charge-report.md) for measured evidence. Planned fields include:

- hardware revision,
- firmware revision or test script,
- charger candidate,
- HV capacitor candidate,
- Vcap measurement candidate,
- discharge stage enabled: `no`,
- input supply current limit: `TBD`,
- Vcap target: `TBD`,
- external HV meter: `TBD`,
- bleeder path: `TBD`,
- Vbat,
- target Vcap,
- measured Vcap,
- charge time,
- stop reason,
- safe threshold,
- time to threshold,
- pass/fail result.

Do not include sample numeric readings or measured data in this planned procedure. Use field names, `TBD`, or `NA` only; measured values belong only in a completed report linked to raw artifacts.

## Abort Criteria

Stop the future run and leave the report as incomplete or failed if any of these occur:

- discharge inhibition is uncertain,
- charger starts unexpectedly,
- charger does not stop at the documented condition,
- Vcap rises unexpectedly or cannot be verified by the rated method,
- Vcap feedback is missing, saturated, noisy, or implausible,
- input current, temperature, sound, smell, smoke, or visible condition is abnormal,
- fixture guard, enclosure, wiring, or measurement setup becomes unsafe,
- setup no longer matches the recorded diagram or photo,
- any operator is unsure whether the HV capacitor is charged or discharged.

## Evidence Rules

This procedure is not evidence by itself. A charger-only bench run becomes evidence only after a matching report records measured setup, links raw artifacts, and states the result.

Future evidence should be recorded through:

- [../../reports/templates/hv-charge-report.md](../../reports/templates/hv-charge-report.md) - summarized measured HV charge report.
- [../artifacts/logs/](../artifacts/logs/) - future CSV, serial, or event logs.
- [../artifacts/scope-captures/](../artifacts/scope-captures/) - future instrument captures and setup notes.
- [../artifacts/raw-data/](../artifacts/raw-data/) - setup photos, wiring notes, and raw exports.

Do not mark this procedure as run until a measured report is intentionally created and reviewed.

## Non-Authorization

Completing this planned procedure does not authorize discharge testing, spark generation, engine testing, vehicle testing, or road testing. Those remain blocked until separate measured bench reports cover timing, HV charge, Vcap measurement, controlled discharge, fault handling, and long-run stability.
