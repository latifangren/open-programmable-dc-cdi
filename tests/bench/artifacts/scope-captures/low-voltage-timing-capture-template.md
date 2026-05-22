# Low-Voltage Timing Capture Template

Status: template only. No timing capture is recorded yet.

Use this template to document a future scope or logic-analyzer capture for BENCH-0001 low-voltage timing observation. It is not validation evidence until a measured report links a real capture and records the setup.

## Capture Metadata

| Field | Entry |
|---|---|
| Report ID | BENCH-0001 |
| Test ID | TEST-TIMING-001 |
| Related requirements | REQ-TIME-001, REQ-TIME-002, REQ-SAFE-001 |
| Capture filename | TBD |
| Date | TBD |
| Operator | TBD |
| Hardware revision | TBD |
| Firmware or script revision | TBD |
| Result | Not run |

## Scope

Included:

- pickup simulator input timing,
- isolated low-voltage timing output observation,
- `TRIGGER_CMD` inactive behavior during boot and reset,
- timing relationship notes between simulated pickup and low-voltage output.

Excluded:

- HV charger enable,
- HV capacitor charging,
- SCR or IGBT discharge testing,
- CDI coil, spark plug, or spark tester use,
- engine, vehicle, or road testing.

## Instrument Setup

| Item | Entry |
|---|---|
| Instrument model | TBD |
| Instrument firmware/version | TBD |
| Probe or logic-analyzer input type | TBD |
| Probe attenuation or threshold | TBD |
| Grounding or isolation method | TBD |
| Timebase | TBD |
| Sample rate | TBD |
| Trigger source | TBD |
| Trigger level or threshold | TBD |
| Capture duration | TBD |

## Channel Plan

| Channel | Signal | Expected low-voltage behavior | Notes |
|---|---|---|---|
| CH1 | Pickup simulator output or conditioned pickup signal | Repeatable pulse train | TBD |
| CH2 | Isolated timing output test point | Low-voltage timing decision only | Not CDI Power Board discharge input |
| CH3 | `CHARGE_EN`, if available | Inactive | Optional |
| CH4 | Reset or watchdog marker, if available | Shows safe-state interval | Optional |

## Pre-Capture Checks

- [ ] [Low-voltage dry-run readiness](../../procedures/low-voltage-dry-run-readiness.md) confirmed.
- [ ] Instrument ground or logic-analyzer reference is safe for the low-voltage setup.
- [ ] Timing output is observed only at an isolated low-voltage test point.
- [ ] CDI Power Board discharge input is not connected to the timing observation point.
- [ ] HV charger supply is disconnected or positively inhibited.
- [ ] HV capacitor is absent, or Vcap is verified safe by the project HV safety procedure.
- [ ] CDI coil, spark plug, and spark tester are not connected.
- [ ] Capture filename follows the bench artifact naming rule.

## Expected Evidence

A future capture should show:

- pickup simulator pulse timing or conditioned pickup timing,
- low-voltage timing output relative to the simulated pickup event,
- `CHARGE_EN` remaining inactive if captured,
- `TRIGGER_CMD` or equivalent output inactive during boot and reset if captured,
- no HV, spark, engine, vehicle, or road-test behavior.

## Artifact Link Placeholders

| Artifact | Link |
|---|---|
| Scope or logic-analyzer capture | TBD |
| Instrument setup photo or screenshot | TBD |
| CSV log for same run | TBD |
| BENCH-0001 report update | [../../../reports/bench-0001-not-run.md](../../../reports/bench-0001-not-run.md) |

## Not Evidence Yet

- No timing capture has been recorded by this template.
- No measured timing, jitter, Vcap, discharge, fault, thermal, or long-run result is recorded here.
- No pass/fail decision exists.
- No schematic, PCB, BOM, or hardware revision is validated by this template.

## Non-Authorization

This template does not authorize HV charger testing, capacitor charging, discharge testing, spark generation, engine testing, vehicle testing, or road testing. Those remain blocked until separate measured bench reports cover the required safety gates.
