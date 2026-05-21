# Reference Repository Analysis

This note summarizes two external ignition projects as research material for Open Programmable DC-CDI:

- `https://github.com/wicaksuu/racing-cdi`
- `https://github.com/wicaksuu/esp32-programable-cdi`

The goal is not to copy either project. The goal is to separate reusable controller ideas from designs that do not match this project's target: a real programmable DC-CDI with HV charger, HV capacitor, controlled discharge switch, CDI coil output, Vcap feedback, and bench validation.

## Summary Matrix

| Project | Platform | Actual Role | CDI Power Stage | Useful For | Not Sufficient For |
| --- | --- | --- | --- | --- | --- |
| `racing-cdi` | STM32H562 / Arduino | Programmable CDI trigger/controller | Not found in tracked source | Timing architecture, VR capture, trigger pulse, rev limiter, SD config | Complete DC-CDI hardware, HV charger, capacitor discharge design |
| `esp32-programable-cdi` | ESP32 / Arduino | Programmable ignition / TCI-like coil driver | Not found; output is low-side coil MOSFET driver | Web UI, map CRUD, simulator, feature surface, ignition maps | Real CDI power core, Vcap regulation, SCR/IGBT capacitor discharge |

## `racing-cdi`

Repository claim: professional programmable racing CDI and complete replacement CDI.

Observed implementation: STM32-based ignition controller that reads pickup input, computes RPM and timing, then emits a short trigger pulse on `PB0`. The docs describe `PB0` as `CDI trigger pulse` and direct connection to a CDI module trigger input. That makes it closer to a programmable CDI brain than a full CDI power board.

Useful details:

- `PA0` is documented as VR input through `MAX9926`.
- `PB0` is documented as CDI trigger output.
- Firmware uses STM32 hardware timers for input capture and output pulse timing.
- RPM is derived from captured period instead of slow polling.
- Ignition output is a short scheduled pulse, not a blocking delay path.
- Rev limiter uses deterministic cut patterns:
  - soft: retard only
  - medium: fire 1 / cut 1
  - hard: fire 1 / cut 3
  - full cut: always cut
- Trigger ISR includes an adaptive blind window to reject false pickup events after ignition noise.
- SD configuration has checksum validation and fallback behavior.
- USB command shell supports field operations such as save, load, export, import, SD directory listing, file transfer, ignition enable, quickshifter enable, telemetry, and calibration.

Missing for this project:

- No visible HV charger design.
- No visible HV storage capacitor design.
- No visible SCR/IGBT capacitor discharge stage.
- No visible Vcap measurement and regulation loop.
- No complete CDI ignition coil power output design.
- No repeatable bench validation evidence in the tracked files.

Engineering takeaway: use this repository as reference for pickup capture, timer-based ignition scheduling, deterministic limiter behavior, SD configuration robustness, and EMI blind-window handling. Do not treat it as a reference CDI power-stage design.

## `esp32-programable-cdi`

Repository claim: smart programmable CDI with web dashboard, maps, quickshifter, launch control, traction control, logging, OTA, and simulator.

Observed implementation: ESP32-based programmable ignition controller with a low-side MOSFET coil driver. The wiring docs show `ESP32 GPIO4 -> gate resistor -> MOSFET gate`, with ignition coil primary connected to `+12V` and switched on the low side. Firmware uses dwell time and coil saturation language. This is closer to TCI or inductive ignition control than classic capacitor-discharge CDI.

Useful details:

- Rich ignition map model with RPM/advance points.
- Dwell time, pickup offset, rev limiter, quickshifter, launch control, anti-wheelie, traction control, and engine-type settings.
- Web dashboard and HTTP API for map and system management.
- SD-backed map CRUD and file management.
- Simulator mode with scenarios such as idle, acceleration, rev limiter, quickshifter, and launch.
- Main loop precomputes ignition state while ISR path stays focused on timing output.
- Advance curve and quickshifter kill time use interpolation.
- Emergency state and shutdown controls are exposed through the UI/API.

Missing for this project:

- No HV charger.
- No HV storage capacitor.
- No SCR/IGBT capacitor discharge stage.
- No Vcap feedback path.
- No CDI coil discharge path.
- Output stage is not a CDI discharge stage; it is a switched 12V ignition coil primary.

Design risks noticed:

- Pin documentation appears to reuse `GPIO22` for both front wheel sensor and I2C SCL in different tables.
- README says up to 41 advance points while firmware allows 50 points.
- Main firmware is a large Arduino `.ino` file, so feature ideas are more reusable than structure.
- Simulator is useful, but it is embedded inside firmware instead of being a clean external validation harness.

Engineering takeaway: use this repository as reference for UI concepts, map CRUD, simulator scenarios, API surface, and optional advanced features. Do not copy the output-stage concept into this project unless intentionally building TCI, which is explicitly out of scope.

## Comparison Against Open Programmable DC-CDI

Open Programmable DC-CDI must remain stricter than both reference projects.

Required in this project:

- 12V input protection.
- HV charger stage.
- HV capacitor with defined target Vcap.
- Vcap measurement and control.
- SCR/IGBT discharge switch.
- CDI ignition coil output.
- Pickup input conditioning.
- Controller-to-power-board trigger isolation/protection.
- Bench-first validation before engine testing.

Neither reference repository currently satisfies the full CDI power-core requirement. Both are still valuable, but mostly for controller firmware, timing, configuration, UI, and test-surface ideas.

## Ideas Worth Reusing

Near-term controller ideas:

- Hardware-timer input capture for pickup timing.
- Hardware-timer output compare or one-shot pulse generation for discharge command.
- Adaptive blind window after spark to reject EMI pickup spikes.
- Deterministic rev limiter patterns instead of random spark cutting.
- Interpolated ignition advance tables.
- Config checksum with known-safe fallback map.
- Clear field diagnostics over serial or USB.

Bench and validation ideas:

- Pickup simulator scenarios before engine test.
- Rev limiter, quickshift, and launch-control simulation as later optional tests.
- Logged timing error, RPM, trigger pulse width, Vcap, charger state, and fault reason.
- SD or host-side export for bench logs.

Later product ideas:

- Web UI for map editing.
- Map import/export.
- OTA or field update flow.
- Multiple maps and map switch input.
- Quickshifter and launch control after CDI core stability is proven.

## Ideas To Avoid For Now

- Calling a low-side MOSFET ignition coil driver a CDI power stage.
- Treating a CDI trigger pulse output as a complete CDI design.
- Adding web UI, traction control, anti-wheelie, or OTA before spark energy, Vcap, and discharge timing are measured.
- Large monolithic firmware before the timing, trigger, safety, and logging modules have stable contracts.
- Production or racing claims without bench reports, oscilloscope captures, thermal data, and fault-injection results.

## Source Notes

The external repositories were cloned into a temporary research directory and inspected from README files, pinout docs, schematic notes, and main firmware sketches. The observations above are source-backed, but they should be rechecked if either upstream repository changes.
