# Project Goals

## Goal

Build a real programmable DC-CDI system with separated control and high-voltage power stages.

This project is not just an ignition timing controller. It must eventually include the CDI power core: HV charger, HV discharge capacitor, SCR/IGBT discharge switch, and CDI ignition coil output.

## Non-Goals For The First Phase

- No engine testing before bench validation.
- No web UI, quickshifter, launch control, traction control, or anti-wheelie work.
- No production-ready claim.
- No exact component part numbers until electrical targets and tests justify them.
- No firmware framework choice until module contracts and tests are defined.

## First Engineering Milestone

The first milestone is a bench-validated spark core:

1. Pickup simulator produces repeatable events.
2. Controller calculates RPM, crank angle, and trigger timing.
3. CDI Power Board charges HV capacitor to target Vcap.
4. Vcap measurement is logged and bounded.
5. Discharge stage fires into an approved bench load or spark tester.
6. Fault handling blocks unsafe discharge.

## Success Definition

The project becomes credible when measurements exist, not when features are listed. Minimum proof must include timing jitter logs, HV charge behavior, Vcap regulation, controlled discharge evidence, and safety fault tests.
