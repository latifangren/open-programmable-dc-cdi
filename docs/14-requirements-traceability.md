# Requirements Traceability

Status: draft requirements. IDs below define design intent and test coverage targets. They are not verified until matching test reports exist.

## Purpose

This document gives stable IDs for safety, timing, HV, interface, and validation requirements. Test plans and reports should reference these IDs so project maturity can be checked without reading every narrative document.

## Safety Requirements

| Requirement | Statement | Verification |
|---|---|---|
| `REQ-SAFE-001` | Trigger output shall be inactive during controller reset, bootloader, firmware update, and watchdog recovery. | `TEST-FAULT-007` |
| `REQ-SAFE-002` | Discharge shall be inhibited when Vcap feedback is missing, saturated, shorted, or implausible. | `TEST-VCAP-003` |
| `REQ-SAFE-003` | Charger shall be disabled when Vcap is above the configured overvoltage limit. | `TEST-HV-004` |
| `REQ-SAFE-004` | Engine testing shall remain blocked until bench reports cover timing, HV charge, Vcap measurement, controlled discharge, fault injection, and long-run stability. | `TEST-GATE-001` |
| `REQ-SAFE-005` | HV capacitor discharge procedure shall be measured and documented before routine HV bench work. | `TEST-HV-005` |
| `REQ-SAFE-006` | The HV discharge section shall not be tested on a breadboard. | Review inspection |

## Interface Requirements

| Requirement | Statement | Verification |
|---|---|---|
| `REQ-IF-001` | Board-to-board disconnect shall leave charger disabled and trigger inactive. | `TEST-IF-001` |
| `REQ-IF-002` | `TRIGGER_CMD` shall have a defined inactive state using hardware bias or equivalent circuit behavior. | Schematic review, `TEST-IF-002` |
| `REQ-IF-003` | `CHARGE_EN` shall be inactive during controller reset and disconnect. | `TEST-IF-003` |
| `REQ-IF-004` | Fault line open or unreadable state shall be treated as a fault by the controller. | `TEST-IF-004` |
| `REQ-IF-005` | Ready line open or unreadable state shall be treated as not ready by the controller. | `TEST-IF-005` |
| `REQ-IF-006` | Trigger command shall not directly drive an SCR gate from a raw MCU GPIO in the final CDI power architecture. | Schematic review |

## HV Power Requirements

| Requirement | Statement | Verification |
|---|---|---|
| `REQ-HV-001` | HV charger shall charge the storage capacitor to the selected Vcap target under bench input conditions. | `TEST-HV-001` |
| `REQ-HV-002` | Charger shall stop on target, timeout, overvoltage, or invalid feedback. | `TEST-HV-002`, `TEST-HV-003`, `TEST-HV-004` |
| `REQ-HV-003` | Vcap measurement shall be compared against an external HV meter during bench validation. | `TEST-VCAP-001` |
| `REQ-HV-004` | Main discharge capacitor shall be a pulse-rated film candidate until bench evidence supports another choice. | BOM review, `TEST-DISCH-001` |
| `REQ-HV-005` | Discharge stage shall fire only into approved dummy load, controlled load, or protected spark fixture during bench validation. | `TEST-DISCH-001` |
| `REQ-HV-006` | Repeated discharge at 12,000 RPM equivalent shall pass before first engine test. | `TEST-LONG-001` |

## Timing Requirements

| Requirement | Statement | Verification |
|---|---|---|
| `REQ-TIME-001` | Controller shall calculate RPM from conditioned pickup events, not raw unconditioned HV/noisy input. | `TEST-PICKUP-001` |
| `REQ-TIME-002` | Trigger timing shall be measurable with a scope or logic analyzer before HV discharge testing. | `TEST-TIMING-001` |
| `REQ-TIME-003` | Missing pickup behavior shall move the system to trigger-inhibited state until the signal is plausible again. | `TEST-PICKUP-004` |
| `REQ-TIME-004` | Noisy pickup behavior shall be tested with simulator or injected noise before engine test. | `TEST-PICKUP-003` |
| `REQ-TIME-005` | Rev limiter behavior shall be verified with HV disabled before HV discharge tests. | `TEST-TIMING-003` |

## Documentation Requirements

| Requirement | Statement | Verification |
|---|---|---|
| `REQ-DOC-001` | README shall state that the project is not production-ready until hardware, firmware, bench logs, manufacturing files, and test reports exist. | Documentation review |
| `REQ-DOC-002` | Complete DC-CDI claims shall require HV charger, HV capacitor, SCR/IGBT discharge path, CDI coil output, and validation evidence. | Documentation review |
| `REQ-DOC-003` | Component candidates shall remain research-only until datasheet fields and bench constraints are recorded. | Candidate matrix review |
| `REQ-DOC-004` | Test reports shall include hardware revision, firmware revision or test script version, setup, pass/fail criteria, and result. | Report review |

## Test ID Index

| Test ID | Purpose | Current Artifact |
|---|---|---|
| `TEST-GATE-001` | Confirm bench evidence exists before engine test | Planned |
| `TEST-POWER-002` | Reverse battery/protection validation under current-limited conditions | Planned |
| `TEST-PICKUP-001` | Pickup simulator basic capture | Planned |
| `TEST-PICKUP-003` | Noisy pickup rejection | Planned |
| `TEST-PICKUP-004` | Missing pickup inhibit | Planned |
| `TEST-TIMING-001` | Trigger timing measurement with HV disabled | Template |
| `TEST-TIMING-002` | Pickup edge/polarity timing check | Planned |
| `TEST-TIMING-003` | Rev limiter behavior with HV disabled | Planned |
| `TEST-HV-001` | HV charge to target | Template |
| `TEST-HV-002` | Charger stop on target | Template |
| `TEST-HV-003` | Charge timeout | Template |
| `TEST-HV-004` | Vcap overvoltage inhibit | Template |
| `TEST-HV-005` | Bleeder/safe discharge time | Template |
| `TEST-VCAP-001` | Vcap meter comparison | Template |
| `TEST-VCAP-003` | Invalid Vcap feedback inhibit | Template |
| `TEST-DISCH-001` | Controlled discharge setup approval | Template |
| `TEST-DISCH-002` | SCR trigger validation | Template |
| `TEST-DISCH-004` | False trigger/noise check | Template |
| `TEST-DISCH-005` | Coil disconnected behavior if safe method exists | Planned |
| `TEST-FAULT-001` | Undervoltage fault | Template |
| `TEST-FAULT-007` | Watchdog/reset trigger inactive | Template |
| `TEST-FAULT-008` | Firmware hang/watchdog behavior | Planned |
| `TEST-FAULT-009` | Discharge path abnormal condition handling | Planned |
| `TEST-IF-001` | Board-to-board disconnect behavior | Planned |
| `TEST-IF-002` | Stuck trigger command behavior | Planned |
| `TEST-IF-003` | Stuck or reset charger-enable behavior | Planned |
| `TEST-IF-004` | Fault line open behavior | Planned |
| `TEST-IF-005` | Ready line open behavior | Planned |
| `TEST-LONG-001` | Repeated discharge at RPM-equivalent rate | Template |

## Traceability Rules

- New safety behavior gets a requirement ID before schematic or firmware implementation.
- New fault injection tests reference at least one requirement ID.
- A requirement remains unverified until a report links measured result to the ID.
- Requirements may be split when one statement becomes too broad to test clearly.
