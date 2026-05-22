# Open Programmable DC-CDI

Open Programmable DC-CDI is an experimental project to build a real programmable DC-CDI system, not a controller-only ignition project and not a TCI coil driver.

The first target is older carbureted small single-cylinder motorcycles, especially 2-stroke engines under 200cc. The architecture should not intentionally block later 4-stroke support, but 4-stroke behavior is not the first validation target.

A real DC-CDI system must include the CDI power core:

- 12V input protection and high-voltage charger
- High-voltage discharge capacitor
- SCR/IGBT discharge switch
- CDI ignition coil output
- Pickup signal conditioning
- Programmable ignition timing and safety logic
- Bench logging and diagnostics

## Current Status

Status: documentation and repository skeleton stage.

No production hardware, firmware, schematic, PCB layout, BOM, or validated bench result exists yet. This repository should not claim production readiness until the electrical spec, safety checks, bench tests, manufacturing files, and test reports exist.

## Project Maturity

| Area | Status |
|---|---|
| Architecture | Drafted |
| Electrical spec | Drafted |
| HV safety rules | Drafted |
| Power-stage block design | Drafted |
| Component candidates | Research only |
| Board interface contract | Draft |
| Failure modes | Draft |
| Requirements traceability | Draft |
| First prototype decisions | Draft |
| Controller schematic | Not started |
| CDI power schematic | Not started |
| Firmware implementation | Not started |
| Bench test logs | Not started |
| Engine test | Blocked |
| Production files | Not started |

## Architecture

The project is split into two boards:

1. Controller Board
   - Reads pickup input
   - Calculates RPM and crank angle
   - Applies ignition timing map and rev limit
   - Runs safety logic
   - Sends a protected trigger command to the CDI Power Board

2. CDI Power Board
   - Protects the 12V input
   - Charges the HV capacitor
   - Measures Vcap
   - Discharges the capacitor through SCR/IGBT stage
   - Drives a CDI ignition coil

Read the full architecture in [docs/02-system-architecture.md](docs/02-system-architecture.md).

## Safety

This project involves high voltage ignition circuits. HV capacitors can remain charged after power-off. Do not test the HV section on a breadboard. Engine testing is blocked until bench validation passes.

Read [docs/04-hv-safety.md](docs/04-hv-safety.md) before any hardware work.

## Documentation

Start here:

- [Project goals](docs/00-project-goals.md)
- [CDI vs TCI theory](docs/01-cdi-theory.md)
- [System architecture and block diagram](docs/02-system-architecture.md)
- [Electrical specification](docs/03-electrical-spec.md)
- [High-voltage safety](docs/04-hv-safety.md)
- [Bench test plan](docs/05-bench-test-plan.md)
- [Production checklist](docs/06-production-checklist.md)
- [Engine target and design budget](docs/07-engine-target-and-design-budget.md)
- [Power stage architecture](docs/08-power-stage-architecture.md)
- [Power stage block design](docs/09-power-stage-block-design.md)
- [Component candidate matrix](docs/10-component-candidate-matrix.md)
- [PCB and test jig plan](docs/11-pcb-and-test-jig-plan.md)
- [Board interface contract](docs/12-board-interface-contract.md)
- [Failure modes](docs/13-failure-modes.md)
- [Requirements traceability](docs/14-requirements-traceability.md)
- [First prototype decisions](docs/15-first-prototype-decisions.md)
- [Source-backed parts research](docs/research/source-backed-parts-research.md)
- [CDI power-board requirements](hardware/cdi-power-board/requirements.md)
- [CDI power-board schematic checklist](hardware/cdi-power-board/schematic-checklist.md)
- [Research archive](docs/research/README.md)

## Repository Layout

- `docs/` - canonical engineering docs and research archive.
- `hardware/` - controller board, CDI power board, pickup conditioner, interfaces, fixtures, and mechanical notes.
- `firmware/` - controller firmware skeleton, timing modules, drivers, safety, logging, and tests.
- `tools/` - bench and field utilities such as pickup simulator, map editor, log viewer, and flasher.
- `calibration/` - draft maps and engine profiles after bench validation rules exist.
- `tests/` - bench, engine, and report artifacts. Engine tests are blocked until bench gates pass.
- `manufacturing/` - future production outputs, assembly notes, QC checklist, and test fixture data.

## Development Order

1. Lock electrical targets.
2. Validate controller timing with a pickup simulator.
3. Validate HV charger with discharge disabled.
4. Validate Vcap measurement.
5. Validate controlled discharge on a bench jig.
6. Run long bench tests and fault injection.
7. Only then discuss engine testing.

Advanced features such as wireless UI, quickshifter, launch control, or traction control are deferred until the spark core is stable and measured.
