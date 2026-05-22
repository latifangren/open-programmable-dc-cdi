# CDI Power Board Test Plan

Status: pre-schematic test plan. This is not a bench procedure, test report, validation evidence, schematic, PCB layout, BOM, validated design, production release, or engine-test permission.

## Purpose

This document maps the first CDI Power Board bench evidence that must exist before power-board design decisions can be treated as validated. It bridges the board requirements to future report templates without replacing the project-level bench plan.

The plan is intentionally conservative. It defines what future tests must prove, what evidence must be recorded, and what stops the work. It does not tell an operator how to energize a live HV board.

## Source Documents

- [requirements.md](requirements.md) - CDI Power Board pre-schematic requirements.
- [schematic-checklist.md](schematic-checklist.md) - schematic review gate.
- [../../docs/04-hv-safety.md](../../docs/04-hv-safety.md) - mandatory HV safety rules.
- [../../docs/05-bench-test-plan.md](../../docs/05-bench-test-plan.md) - project bench phase order.
- [../../docs/14-requirements-traceability.md](../../docs/14-requirements-traceability.md) - canonical requirement and test IDs.
- [../../docs/validation/bench-test-template.md](../../docs/validation/bench-test-template.md) - generic future bench report template.
- [../../tests/reports/templates/hv-charge-report.md](../../tests/reports/templates/hv-charge-report.md) - future HV charge report template.
- [../../tests/reports/templates/vcap-measurement-report.md](../../tests/reports/templates/vcap-measurement-report.md) - future Vcap measurement report template.
- [../../tests/reports/templates/controlled-discharge-report.md](../../tests/reports/templates/controlled-discharge-report.md) - future controlled-discharge report template.
- [../../tests/reports/templates/fault-injection-report.md](../../tests/reports/templates/fault-injection-report.md) - future fault-injection report template.
- [../../tests/reports/templates/timing-jitter-report.md](../../tests/reports/templates/timing-jitter-report.md) - future timing report template.

## Scope

Included:

- board-specific evidence planning for HV charger, Vcap measurement, bleeder behavior, SCR trigger behavior, controlled discharge, fault handling, and long-run bench behavior,
- mapping between local `PWR-REQ-*` requirements and canonical `REQ-*` / `TEST-*` IDs,
- acceptance-style expectations for future bench reports,
- abort conditions that require stopping and recording a failure mode.

Excluded:

- final schematic capture,
- final component selection or BOM release,
- live HV step-by-step procedure,
- measured results,
- spark strength, engine performance, or reliability claims,
- engine, vehicle, or road testing.

## Safety Boundary

Every planned HV phase assumes a guarded fixture, current-limited input source, defined discharge method, properly rated Vcap measurement method, and a responsible operator. No HV charger, capacitor, SCR, CDI coil, or discharge loop may be tested on a breadboard.

Engine testing remains blocked until measured bench reports cover timing, HV charge, Vcap measurement, controlled discharge, fault injection, and long-run stability. This test plan does not satisfy `REQ-SAFE-004` by itself.

## Evidence Rules

- A test is not evidence until a report records the setup, hardware revision, firmware or test-script revision, instruments, raw artifacts, pass/fail criteria, and result.
- Report templates are not evidence until filled with measured data and reviewed.
- Planned values such as Vcap target, capacitor value, bleeder target, current limit, and trigger pulse width must remain candidates until backed by schematic review and bench data.
- Any unexpected Vcap rise or drop, unexpected trigger, repeated discharge, abnormal smell, visible damage, excessive temperature, or unsafe fixture condition stops the test.

## Planned Board Test Phases

| Phase | Planned observable | Required evidence | Abort or failure condition | Related IDs |
|---|---|---|---|---|
| Documentation gate | Requirements, schematic checklist, safety rules, and fixture assumptions are reviewed before HV work. | Review notes linking this plan, `requirements.md`, `schematic-checklist.md`, and `docs/04-hv-safety.md`. | Any unresolved safety boundary, missing discharge method, or unclear measurement method. | `REQ-SAFE-004`, `REQ-SAFE-005`, `PWR-REQ-JIG-001` to `PWR-REQ-JIG-004` |
| HV charger with discharge disabled | Charger starts only when enabled, Vcap rises toward target, and stop conditions are observable. | Future HV charge report with Vbat, Vcap, charge time, stop reason, current limit, and external meter reference. | Charger starts unexpectedly, does not stop, overshoots documented limit, or Vcap feedback is implausible. | `REQ-HV-001`, `REQ-HV-002`, `REQ-SAFE-003`, `TEST-HV-001` to `TEST-HV-004`, `PWR-REQ-CHG-001` to `PWR-REQ-CHG-005` |
| Vcap measurement | `VCAP_FB` tracks external HV meter readings well enough for regulation, inhibit, and logging decisions. | Future Vcap report with calibration points, ADC data, external meter readings, and fault-injection notes. | Missing, saturated, shorted, noisy, or implausible feedback fails to inhibit charge and discharge. | `REQ-HV-003`, `REQ-SAFE-002`, `TEST-VCAP-001`, `TEST-VCAP-003`, `PWR-REQ-VCAP-001` to `PWR-REQ-VCAP-005` |
| Safe-discharge and bleeder check | Vcap decays to a defined safe threshold and is verified by a properly rated method. | Future HV charge report or bench report section recording start Vcap, safe threshold, time to threshold, and meter/probe method. | Bleeder path is absent, firmware-only, unmeasured, too slow for the defined threshold, or cannot be externally verified. | `REQ-SAFE-005`, `TEST-HV-005`, `PWR-REQ-CAP-003` to `PWR-REQ-CAP-005` |
| Low-energy SCR trigger validation | Trigger path produces one intended low-energy SCR event and remains off during reset, disconnect, and floating input cases. | Future controlled-discharge or fault report with trigger source, low-energy setup, gate-drive candidate, and event count. | Raw MCU GPIO is used without reviewed driver path, trigger floats active, trigger repeats unexpectedly, or reset can fire the SCR. | `REQ-IF-001`, `REQ-IF-002`, `REQ-IF-006`, `TEST-DISCH-002`, `TEST-IF-001`, `TEST-IF-002`, `PWR-REQ-DISCH-003` to `PWR-REQ-DISCH-005` |
| Controlled discharge into approved load | One valid command creates one intended discharge into approved dummy load, controlled load, or protected spark fixture. | Future controlled-discharge report with load description, enclosure/guarding, Vcap before/after, trigger rate, waveform or log references, and temperature notes. | Load is unapproved, fixture is unguarded, discharge repeats, SCR does not turn off, or Vcap behavior is not understood. | `REQ-HV-004`, `REQ-HV-005`, `TEST-DISCH-001`, `TEST-DISCH-002`, `PWR-REQ-LOAD-001` to `PWR-REQ-LOAD-004` |
| False-trigger and noise check | Charger switching, reset, disconnect, and expected bench noise do not create unintended discharge. | Future controlled-discharge or fault-injection report with false-trigger count, setup notes, and scope/log evidence. | Any uncommanded discharge, Vcap drop without command, or trigger ambiguity. | `TEST-DISCH-004`, `TEST-IF-001`, `TEST-IF-002`, `PWR-REQ-DISCH-004`, `PWR-REQ-DISCH-006` |
| Fault injection | Undervoltage, overvoltage, timeout, invalid Vcap, reset, disconnect, and stuck trigger move the board to a safe state. | Future fault-injection report mapping each fault to expected behavior, observed behavior, and pass/fail result. | Any fault leaves charger enabled, discharge enabled, `READY` misleadingly active, or `FAULT_N` unreadable as safe. | `REQ-SAFE-001` to `REQ-SAFE-003`, `REQ-IF-001` to `REQ-IF-005`, `TEST-FAULT-001`, `TEST-FAULT-007`, `TEST-IF-001` to `TEST-IF-005`, `PWR-REQ-IF-001` to `PWR-REQ-IF-008` |
| Long-run RPM-equivalent bench | Repeated charge and discharge remain stable at planned RPM-equivalent rates before engine discussion. | Future controlled-discharge or long-run report with duration, Vbat, Vcap recovery, missed charge count, false trigger count, temperatures, and raw log links. | Charger cannot recover Vcap, temperature exceeds bench limit, event count is wrong, or any safety condition becomes unclear. | `REQ-HV-006`, `TEST-LONG-001`, `PWR-REQ-JIG-004` |

## Report Template Mapping

| Evidence area | Preferred template | Notes |
|---|---|---|
| HV charge, stop behavior, timeout, overvoltage, bleeder timing | [hv-charge-report.md](../../tests/reports/templates/hv-charge-report.md) | Discharge path remains disabled for this evidence area. |
| Vcap calibration and invalid-feedback behavior | [vcap-measurement-report.md](../../tests/reports/templates/vcap-measurement-report.md) | External HV meter comparison is mandatory before meaningful discharge testing. |
| Controlled discharge, low-energy trigger, false-trigger check, long-run discharge | [controlled-discharge-report.md](../../tests/reports/templates/controlled-discharge-report.md) | Use only with approved load or protected fixture. |
| Fault behavior across charger, Vcap, interface, reset, and trigger cases | [fault-injection-report.md](../../tests/reports/templates/fault-injection-report.md) | Fault cases may reference HV, Vcap, interface, and discharge reports. |
| Controller-side timing before HV enable | [timing-jitter-report.md](../../tests/reports/templates/timing-jitter-report.md) | Timing evidence remains low-voltage-only until HV gates pass. |

## Schematic Inputs This Plan Does Not Close

The following remain blocked until separate review or measured evidence exists:

- charger current-limit method,
- charger controller, switch, magnetics, rectifier, and clamp candidates,
- exact HV capacitor candidate and package,
- exact SCR candidate and gate-drive method,
- exact Vcap divider resistor family, ratio, ADC protection, and sampling assumptions,
- bleeder target time and safe voltage threshold,
- approved dummy load, controlled load, or protected spark fixture,
- connector pin order, safe pull locations, grounding, and isolation boundary,
- HV creepage, clearance, silkscreen warning, and test-point placement assumptions.

## Non-Authorization

Completing this plan does not authorize HV energization, discharge testing, spark testing, engine testing, vehicle testing, or road testing. Those require separate reviewed procedures, controlled fixtures, measured reports, and explicit pass/fail evidence.
