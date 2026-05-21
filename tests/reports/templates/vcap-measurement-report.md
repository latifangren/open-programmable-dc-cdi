# Vcap Measurement Test Report

Status: template. Do not use as evidence until filled with measured results.

## Traceability

- Covers: `REQ-HV-003`, `REQ-SAFE-002`
- Test IDs: `TEST-VCAP-001`, `TEST-VCAP-003`

## Hardware And Firmware

- Hardware revision: TBD
- Firmware revision or test script: TBD
- Divider candidate: TBD
- ADC reference: TBD
- External HV meter: TBD

## Setup

- Charger candidate: TBD
- Vcap range tested: TBD
- ADC sample rate/filter: TBD
- Calibration constants: TBD

## Acceptance Criteria

- ADC-derived Vcap matches external meter within documented tolerance.
- Missing, shorted, saturated, or implausible Vcap feedback creates fault behavior.
- Charger and discharge are inhibited when Vcap feedback is invalid.

## Calibration Results

| Point | External Vcap | ADC Counts | Calculated Vcap | Error | Pass/Fail |
|---|---:|---:|---:|---:|---|
| TBD | TBD | TBD | TBD | TBD | TBD |

## Fault Injection Results

| Fault | Expected Behavior | Observed Behavior | Pass/Fail |
|---|---|---|---|
| Vcap feedback open | TBD | TBD | TBD |
| Vcap feedback short low | TBD | TBD | TBD |
| Vcap feedback saturated | TBD | TBD | TBD |

## Faults Or Notes

TBD

## Conclusion

TBD
