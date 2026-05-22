# Low-Voltage Dry-Run Procedure

Status: planned procedure. Result: not run.

This procedure is for the first bench dry-run with low-voltage logic only. It is not validation evidence, does not prove CDI power-core behavior, and does not authorize high-voltage or engine testing.

## Purpose

Use this procedure to check that the controller-side bench setup can power up, accept a simulated pickup signal, produce expected low-voltage timing/logging behavior, and remain safe while all CDI high-voltage functions are disabled or physically disconnected.

Related planning documents:

- [Bench test plan](../../../docs/05-bench-test-plan.md)
- [High-voltage safety](../../../docs/04-hv-safety.md)
- [Bench validation report template](../../../docs/validation/bench-test-template.md)
- [Requirements traceability](../../../docs/14-requirements-traceability.md)

## Scope

Included:

- low-voltage controller power-up,
- pickup simulator or logic-source input,
- RPM and advance calculation visibility,
- low-voltage timing output observation,
- logger field capture,
- reset or watchdog safe-state observation.

The timing output must be observed only at an isolated low-voltage test point, not at the CDI Power Board discharge input.

Excluded:

- HV charger enable,
- HV capacitor charging,
- SCR or IGBT discharge testing,
- CDI coil, spark plug, or spark tester use,
- engine, vehicle, or road testing.

## Required Safe State

Before power is applied:

- HV charger supply is disconnected or positively inhibited.
- HV capacitor is not installed, or Vcap is verified safe by the project HV safety procedure.
- Discharge switch gate or trigger drive is disconnected or positively inhibited.
- CDI coil and spark plug leads are not connected.
- Bench supply current limit is set for low-voltage controller work only.
- Operator can remove input power without reaching across exposed wiring.

If any item cannot be confirmed, stop. Do not run this procedure.

## Equipment

- Current-limited low-voltage bench supply.
- Pickup simulator, signal generator, or logic source compatible with the planned pickup input conditioning path.
- Oscilloscope or logic analyzer for trigger and timing observation.
- Optional serial logger or bench script for CSV capture.
- Wiring diagram or setup photo for the dry-run arrangement.

## Expected Observations

These are expected dry-run observations, not pass criteria until a measured report records the setup and evidence.

| Observation | Expected dry-run behavior |
|---|---|
| Low-voltage rails | Stable within the planned controller range |
| `CHARGE_EN` | Inactive during boot, reset, idle, and test run |
| `TRIGGER_CMD` | Inactive during boot and reset; no unintended repeated pulse |
| Pickup input | Simulator pulses are visible at the controller input or conditioned signal |
| RPM | Derived from the simulator rate |
| Advance | Reported or observable as a low-voltage timing decision only |
| Reset or watchdog event | Returns outputs to inactive safe state |

## Log Fields

Use the header-only template at [../artifacts/logs/minimal-bench-log-template.csv](../artifacts/logs/minimal-bench-log-template.csv) if a CSV log is captured:

```text
time_us,rpm,advance_deg,vbat,vcap,charge_us,event,error
```

For this low-voltage dry-run, `vcap` and `charge_us` must be `0` only when the setup verifies HV is absent or disabled. Otherwise use `NA` and explain the reason in the report notes.

## Procedure

1. Record operator, date, hardware revision, firmware or script revision, and bench setup reference.
2. Confirm the required safe state and attach a setup photo or wiring diagram reference.
3. Set the low-voltage bench supply current limit for controller-only work.
4. Connect the pickup simulator or logic source with output disabled.
5. Apply low-voltage power.
6. Confirm low-voltage rails are stable.
7. Confirm `CHARGE_EN` is inactive.
8. Confirm `TRIGGER_CMD` is inactive before pickup pulses are applied.
9. Enable the pickup simulator at the first low RPM-equivalent rate.
10. Record RPM, advance, `vbat`, event, and error fields if logging is available.
11. Observe the low-voltage timing output with a scope or logic analyzer.
12. Repeat at the planned dry-run RPM-equivalent rates.
13. Trigger a reset or watchdog-equivalent event if the setup supports it.
14. Confirm `CHARGE_EN` and `TRIGGER_CMD` return to inactive safe state.
15. Disable the pickup simulator.
16. Remove low-voltage power.
17. Save logs or captures under the bench artifact folders only if they will be linked from a report.

## Abort Criteria

Stop the dry-run and leave the report as incomplete or failed if any of these occur:

- `CHARGE_EN` becomes active,
- `TRIGGER_CMD` pulses during boot, reset, idle, or any unintended condition,
- low-voltage rail is unstable,
- pickup input behavior is saturated, noisy, or not understood,
- abnormal heat, smell, smoke, or visible damage appears,
- operator is unsure whether any HV path is connected or charged,
- wiring no longer matches the recorded setup.

## Evidence Rules

This procedure is not evidence by itself. A dry-run only becomes evidence after a report records the measured setup, links raw artifacts, and states the result.

Future evidence locations:

- [../artifacts/logs/](../artifacts/logs/) - CSV, serial, or event logs.
- [../artifacts/scope-captures/](../artifacts/scope-captures/) - timing captures and instrument setup notes.
- [../artifacts/raw-data/](../artifacts/raw-data/) - setup photos, wiring notes, and raw exports.

Keep [../../reports/bench-0001-not-run.md](../../reports/bench-0001-not-run.md) as `Not run` until actual measured data is reviewed and the report is intentionally updated.

## Non-Authorization

Completing this procedure does not authorize HV charger testing, capacitor charging, discharge testing, spark generation, engine testing, vehicle testing, or road testing. Those remain blocked until separate measured bench reports cover the required safety gates.
