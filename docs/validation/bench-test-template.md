# Bench Validation Report Template

Status: template only. This is not a completed bench report, validated design, engine-test permission, production release, final schematic, or final BOM.

## Purpose

Use this template to record measured bench evidence for the experimental DC-CDI controller and CDI Power Board subsystems. A filled report must show what was tested, how it was measured, what failed, and what remains blocked.

This template does not prove that all required DC-CDI power-core blocks exist or have been validated. It only defines the minimum reporting structure for future bench validation.

## Report Metadata

| Field | Entry |
|---|---|
| Report ID | TBD |
| Date | TBD |
| Author / reviewer | TBD |
| Board or fixture revision | TBD |
| Firmware or test-script revision | TBD |
| Related requirement IDs | TBD |
| Related test IDs | TBD |
| Test location | TBD |
| Result | Not run / incomplete / pass / fail |

## High-Voltage Safety Gate

This project involves high-voltage stored energy. Treat every HV node as dangerous until Vcap is discharged and verified with a properly rated method.

Before any HV bench test, record:

- [ ] HV test procedure reviewed.
- [ ] Current-limited 12V source used.
- [ ] Emergency stop or physical power disconnect available.
- [ ] Protected load, dummy load, or guarded spark fixture installed.
- [ ] HV area guarded or enclosed.
- [ ] Insulated tools policy and one-hand rule understood.
- [ ] Properly rated Vcap measurement method available.
- [ ] Discharge procedure available and assigned to one responsible person.
- [ ] No breadboard is used for HV charger, HV capacitor, SCR, CDI coil, or discharge loop.

After every HV test, record:

- [ ] Input power removed.
- [ ] Capacitor discharged by defined procedure.
- [ ] Vcap verified below safe threshold with rated meter or probe.
- [ ] Board marked safe to handle.

## Test Scope

| Item | Entry |
|---|---|
| Test phase | Low-voltage / pickup simulator / HV charger / Vcap / controlled discharge / fault injection / long-run |
| Subsystem under test | TBD |
| Included behavior | TBD |
| Excluded behavior | TBD |
| Maximum Vcap allowed for this test | TBD |
| Discharge path enabled? | Yes / no |
| Engine, vehicle, or road test involved? | No |

Engine, vehicle, or road testing is not allowed in this template. Engine-test discussion remains blocked until measured bench reports cover timing, HV charge, Vcap measurement, controlled discharge, fault injection, and long-run stability.

## Bench Setup

Record enough detail for another maintainer to understand the setup without guessing.

| Item | Entry |
|---|---|
| 12V source model and current limit | TBD |
| Controller board revision | TBD |
| CDI Power Board revision | TBD |
| Test jig or fixture revision | TBD |
| Load type and enclosure | TBD |
| Pickup simulator or trigger source | TBD |
| CDI coil or bench load part | TBD |
| Vcap measurement instrument | TBD |
| Scope / logic analyzer / logger | TBD |
| Temperature measurement method | TBD |
| Photo or diagram reference | TBD |

## Pre-Test Inspection

- [ ] Schematic or wiring diagram matches test setup.
- [ ] Polarity checked before power is applied.
- [ ] Low-voltage rails checked before HV enable.
- [ ] `CHARGE_EN` default state verified inactive.
- [ ] `TRIGGER_CMD` default state verified inactive.
- [ ] `READY` and `FAULT_N` behavior understood for this setup.
- [ ] Bleeder path or manual discharge path verified present.
- [ ] Load connection and enclosure verified.
- [ ] No loose HV wiring, exposed charged node, or unrestrained coil lead.

## Test Conditions

| Condition | Value |
|---|---|
| Vbat range | TBD |
| Vcap target | TBD |
| Current limit | TBD |
| RPM-equivalent rate | TBD |
| Trigger pulse width or command timing | TBD |
| Test duration | TBD |
| Ambient temperature | TBD |
| Firmware configuration | TBD |
| Safety inhibits intentionally enabled | TBD |
| Safety inhibits intentionally disabled | Not allowed unless separately reviewed and documented |

## Procedure

1. State initial safe condition.
2. Apply low-voltage power with HV disabled.
3. Confirm logged rails, trigger state, and fault state.
4. Enable only the subsystem under test.
5. Record measurements and evidence references.
6. Stop immediately on any abort criterion.
7. Remove power.
8. Discharge and verify Vcap safe before handling.

## Measurements

| Measurement | Expected range or criterion | Observed value | Evidence reference | Result |
|---|---|---|---|---|
| Vbat | TBD | TBD | TBD | Not run / pass / fail |
| Vcap ramp | TBD | TBD | TBD | Not run / pass / fail |
| Charge time | TBD | TBD | TBD | Not run / pass / fail |
| Vcap feedback error | TBD | TBD | TBD | Not run / pass / fail |
| Trigger timing | TBD | TBD | TBD | Not run / pass / fail |
| Discharge event count | One intended event only, if discharge is enabled | TBD | TBD | Not run / pass / fail |
| Vcap drop per discharge | TBD | TBD | TBD | Not run / pass / fail |
| Fault response | TBD | TBD | TBD | Not run / pass / fail |
| Temperature rise | TBD | TBD | TBD | Not run / pass / fail |

Bench logs should use the fields planned in `../05-bench-test-plan.md` where applicable:

```text
time_us,rpm,advance_deg,vbat,vcap,charge_us,event,error
```

## Evidence Checklist

- [ ] Test setup photo or diagram.
- [ ] Instrument configuration photo or notes.
- [ ] Scope capture, logic trace, or logger file.
- [ ] Vcap measurement evidence before and after discharge.
- [ ] Fault or abort evidence if a failure occurred.
- [ ] Link to raw data file, if available.

## Abort Criteria

Stop the test and create or update a failure-mode entry if any of these occur:

- unexpected Vcap rise or drop,
- unexpected trigger or repeated discharge,
- charger does not stop at expected limit,
- missing, saturated, or implausible `VCAP_FB`,
- abnormal smell, noise, heat, smoke, or visible damage,
- unstable low-voltage rail,
- fixture, guard, or measurement method becomes unsafe,
- any operator is unsure whether the HV capacitor is discharged.

## Result Summary

| Area | Result | Notes |
|---|---|---|
| Safety gate | Not run / pass / fail | TBD |
| Setup inspection | Not run / pass / fail | TBD |
| Measurement quality | Not run / pass / fail | TBD |
| Requirement coverage | Not run / pass / fail | TBD |
| Fault handling | Not run / pass / fail | TBD |
| Overall test | Not run / incomplete / pass / fail | TBD |

## Follow-Up

- Open failures: TBD.
- Required design changes: TBD.
- Required procedure changes: TBD.
- Required repeat tests: TBD.
- New failure-mode entries: TBD.
- Evidence still missing: TBD.

## Non-Authorization

A completed copy of this template is evidence for the specific bench setup and test conditions recorded in that report only. It does not authorize engine testing by itself.

Engine testing remains blocked until multiple measured bench reports show acceptable timing, HV charge, Vcap measurement, controlled discharge, fault handling, and long-run stability, and those reports are reviewed against the project safety gates.
