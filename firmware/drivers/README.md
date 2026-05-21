# Drivers

Status: placeholder.

This folder is for MCU-facing drivers and hardware abstraction after the MCU and framework are chosen.

Expected driver areas:

- Timer capture and compare.
- Pickup input capture.
- CDI trigger output.
- Vcap ADC measurement.
- HV charger enable or control.
- Fault inputs.
- Nonvolatile storage.
- Serial, USB, or debug transport.

Driver code must expose testable interfaces instead of hiding timing logic inside interrupt side effects.
