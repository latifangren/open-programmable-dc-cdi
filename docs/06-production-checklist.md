# Production Checklist

Production-ready means measured and documented, not feature-rich.

## Status Levels

| Status | Meaning |
|---|---|
| Concept | Research and architecture only. |
| Prototype | Basic circuit or firmware module exists. |
| Bench Validated | Bench tests pass with logs and measurements. |
| Engine Tested | Controlled engine tests pass after bench signoff. |
| Pre-Production | PCB, enclosure, harness, and BOM are stabilizing. |
| Production Candidate | Test reports, manufacturing files, QC checklist, and release process exist. |

Current status: Concept.

## Required Before Bench Validated

- Electrical spec approved.
- Controller Board schematic.
- CDI Power Board schematic.
- HV safety review.
- Pickup simulator test.
- Timing jitter report.
- HV charger report.
- Vcap measurement report.
- Controlled discharge report.
- Fault injection report.

## Required Before Engine Tested

- Bench validation complete.
- Enclosure or guarded fixture ready.
- Wiring harness strain relief ready.
- Test procedure reviewed.
- Emergency shutdown plan ready.
- Logs enabled.

## Required Before Production Candidate

- Stable schematic and PCB layout.
- Reviewed BOM.
- Manufacturing outputs.
- Assembly instructions.
- QC checklist.
- Firmware release process.
- Known limitations document.
- Failure mode review.
- Safety warnings and user documentation.

## Deferred Features

These are not part of the first production path:

- Wireless dashboard.
- Quickshifter.
- Launch control.
- Traction control.
- Anti-wheelie.

They can only be considered after the spark core is bench validated and engine tested.
