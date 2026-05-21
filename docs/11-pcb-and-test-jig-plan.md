# PCB And Test Jig Plan

Status: v0.1 planning document. This is not a PCB layout, manufacturing package, or validated test procedure.

## Purpose

The CDI power stage is high-voltage and high-current. The first PCB and test jig must be designed for safe bench learning, not compact production packaging.

This document defines the recommended prototype stages, PCB constraints, test jig needs, and validation artifacts before any engine test.

## Prototype Strategy

Recommended hardware progression:

1. Low-voltage control mock.
2. HV charger-only bench board.
3. Vcap measurement and bleeder validation board or section.
4. Low-energy SCR discharge fixture.
5. Integrated CDI power-stage bench board.
6. Engine-simulator bench validation.
7. Motorcycle engine test only after documented bench pass.

Do not combine unknown charger, unknown Vcap measurement, unknown SCR trigger, and unknown coil load into one first test.

## Board Partition Direction

Initial direction:

- Keep controller board and CDI power board logically separate.
- Use a power-board interface connector with explicit safe defaults.
- Make the first HV board larger than production target for probe access and creepage.
- Prefer removable/disconnectable sections for charger and discharge tests if practical.

Why not optimize size first:

- Probe access matters more than compact packaging during HV validation.
- Creepage and isolation mistakes are easier to avoid with space.
- Thermal learning needs measurement access.
- First-spin production-like packaging hides failure causes.

## PCB Zones

Recommended physical zones:

| Zone | Contents | Keep Away From |
| --- | --- | --- |
| Input protection | Fuse, reverse protection, TVS, EMI filter | Pickup input, Vcap ADC trace |
| Charger primary | Switch, current sense, transformer primary, clamp | Pickup input, SCR gate, ADC |
| Charger secondary | HV rectifier, HV return path | Low-voltage controls unless spaced |
| HV storage | CDI capacitor, bleeder, Vcap top node | User-accessible edge, logic traces |
| Discharge loop | Capacitor, SCR, coil primary connector | Vcap ADC trace, pickup input |
| Measurement | Divider low side, filter, ADC protection | High-current discharge path |
| Interface | Charger enable, trigger, fault, Vcap output | HV discharge loop |

## Layout Rules For First HV Board

Rules:

- Keep charger primary switching loop compact.
- Keep HV capacitor-to-SCR-to-coil primary loop compact and wide.
- Do not route Vcap measurement through the discharge loop.
- Do not route pickup or trigger logic near the coil primary pulse path.
- Use deliberate creepage/clearance around HV nodes.
- Add silkscreen HV warnings around capacitor and coil nodes.
- Provide mounting support for large film capacitor and magnetics.
- Provide test points away from raw HV and high-current loops.
- Keep bench connectors mechanically secure.

Avoid:

- Breadboard for HV discharge path.
- Long flying leads in the SCR/capacitor/coil loop.
- Shared random ground returns between charger power, SCR pulse, ADC, and pickup.
- Tiny production-like PCB before waveform data exists.

## Test Jig Requirements

The test jig should make unsafe actions hard.

Minimum bench fixture features:

- Current-limited 12V input connection.
- Physical power switch or emergency stop for input supply.
- Visible charger-enabled indicator.
- Visible fault indicator.
- Safe HV capacitor discharge path.
- External Vcap meter connection or fixed probe fixture.
- Protected spark gap or dummy load enclosure.
- Clear `HV charged` and `safe to handle` procedure labels.

Nice-to-have features:

- Interlock that disables charger when enclosure is open.
- Temperature probe mounts for transformer, switch, rectifier, SCR, and capacitor.
- Logic analyzer connector for trigger and status signals.
- Current probe loop or shunt output for charger input current.
- Replaceable test load area.

## Bench Load Direction

Use staged loads:

| Stage | Load | Purpose |
| --- | --- | --- |
| 1 | No discharge, charger only | Validate Vcap charge and stop behavior. |
| 2 | Low-energy dummy load | Validate discharge command and safety. |
| 3 | Controlled discharge load | Measure pulse behavior before coil. |
| 4 | CDI coil with protected spark gap | Validate ignition-like output. |
| 5 | Engine simulator RPM cycling | Validate repeated operation. |

The first spark gap test is not proof of engine readiness. It only proves spark generation under bench conditions.

## Required Measurements

Minimum measurements per bench run:

- Input voltage.
- Input current.
- Vcap target.
- Vcap before discharge.
- Vcap after discharge if measurable.
- Vcap recovery time.
- Charger enable state.
- Trigger timing.
- Fault status.
- Temperature of charger switch, transformer, rectifier, SCR, and capacitor.
- Notes on audible noise, visible arc behavior, or abnormal smell/heat.

For RPM-equivalent tests:

- Spark/discharge rate.
- Duration at rate.
- Missed-charge count.
- Undervoltage-before-spark count.
- Overvoltage events.
- False-trigger events.

## Test Artifacts To Save

Each serious bench run should produce a report under `tests/reports/` later.

Recommended report fields:

- Date.
- Hardware revision.
- Firmware revision or test script version.
- Capacitor candidate.
- SCR candidate.
- Charger candidate.
- Vcap target.
- Input voltage.
- Load type.
- Test rate or RPM equivalent.
- Pass/fail result.
- Waveform captures if available.
- Faults observed.
- Next action.

No production-readiness claim without reports.

## Manufacturing Placeholder Rules

The `manufacturing/` folder must remain placeholder-only until real validated artifacts exist.

Allowed before validation:

- Assembly assumptions.
- BOM candidate notes.
- Test fixture requirements.
- QC checklist drafts.

Not allowed before validation:

- Production Gerber claim.
- Final BOM claim.
- Production programming instructions.
- Fitment claim for a motorcycle model.
- Safety certification implication.

## Engine Test Entry Gate

Engine testing remains blocked until all items pass:

- Charger reaches and holds Vcap targets at 9V, 12V, and 16V input.
- Vcap measurement matches external meter within documented tolerance.
- Bleeder/safe discharge procedure verified.
- SCR trigger works at low energy without false trigger.
- Full-energy bench discharge works into controlled load.
- CDI coil spark gap test works in protected fixture.
- Repeated discharge at 12,000 RPM equivalent passes at selected energy.
- Fault injection disables charger/discharge safely.
- Thermal rise is acceptable for test duration.
- Bench report exists.

16,000 RPM equivalent should pass before treating the design as serious for high-RPM 2T use.

## First PCB Deliverables

Before ordering first HV PCB, create:

- Block schematic reviewed against `docs/09-power-stage-block-design.md`.
- Candidate matrix filled enough for prototype selections.
- Creepage/clearance target notes.
- Test point list.
- Bench fixture wiring sketch.
- Bring-up checklist.
- Emergency shutdown and safe discharge procedure.

## v0.1 Conclusion

The first PCB should be a bench-learning board, not a product board. It should expose measurements, enforce safe defaults, and isolate unknowns. The test jig is part of the design, because uncontrolled HV ignition testing is not acceptable for this project.
