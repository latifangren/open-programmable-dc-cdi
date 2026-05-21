# Fault Injection Test Report

Status: template. Do not use as evidence until filled with measured results.

## Traceability

- Covers: `REQ-SAFE-001`, `REQ-SAFE-002`, `REQ-SAFE-003`, `REQ-IF-001`, `REQ-IF-002`, `REQ-IF-003`, `REQ-IF-004`, `REQ-IF-005`
- Test IDs: `TEST-FAULT-001`, `TEST-FAULT-007`, `TEST-IF-001`, `TEST-IF-002`, `TEST-IF-003`, `TEST-IF-004`, `TEST-IF-005`

## Hardware And Firmware

- Hardware revision: TBD
- Firmware revision or test script: TBD
- Power-board interface revision: TBD
- Fault injection method: TBD

## Setup

- HV enabled: TBD
- Discharge load: TBD
- Input current limit: TBD
- Observed signals: TBD

## Acceptance Criteria

- Charger disables on required fault cases.
- Trigger remains inactive during reset and disconnect cases.
- Open fault or ready line is treated as unsafe.
- Invalid Vcap feedback inhibits charger and discharge.
- Fault response is logged or externally observable.

## Results

| Fault | Expected Behavior | Observed Behavior | Requirement IDs | Pass/Fail |
|---|---|---|---|---|
| Input undervoltage | TBD | TBD | `REQ-SAFE-001` | TBD |
| Watchdog reset | TBD | TBD | `REQ-SAFE-001` | TBD |
| Board cable disconnect | TBD | TBD | `REQ-IF-001` | TBD |
| Trigger stuck active | TBD | TBD | `REQ-IF-002` | TBD |
| Charger enable stuck active | TBD | TBD | `REQ-IF-003` | TBD |
| Fault line open | TBD | TBD | `REQ-IF-004` | TBD |
| Ready line open | TBD | TBD | `REQ-IF-005` | TBD |
| Vcap feedback invalid | TBD | TBD | `REQ-SAFE-002` | TBD |

## Faults Or Notes

TBD

## Conclusion

TBD
