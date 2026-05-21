# User Research Summary

This is the concise engineering summary extracted from the original research transcript. The raw transcript is preserved in `raw-user-research.md`.

## Main Finding

The reference projects studied in the original research are not complete CDI systems by themselves.

- An ESP32 design that directly switches a 12V ignition coil through a MOSFET is closer to TCI or inductive ignition.
- An STM32 design that emits a trigger pulse to an external CDI module is closer to a CDI trigger controller.
- A complete CDI must include the HV power core, not only timing logic.

## Required CDI Core

A complete DC-CDI system needs:

- HV charger from battery voltage to capacitor voltage.
- HV discharge capacitor.
- SCR/IGBT discharge switch.
- CDI ignition coil.
- Vcap feedback.
- HV protection and safe discharge path.

## Recommended Direction

Build this project as two boards:

- Controller Board: pickup input, timing, safety logic, trigger output, and logging.
- CDI Power Board: input protection, HV charger, HV capacitor, discharge stage, CDI coil output, and HV safety.

## Development Priority

Do not start from racing features. Start from specification, safety, bench tests, and measured spark-core behavior.
