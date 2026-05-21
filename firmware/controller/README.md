# Controller Firmware

Future controller firmware will coordinate pickup input, timing calculation, safety checks, trigger scheduling, and logging.

Current status: no code.

Planned runtime modes:

- Simulator mode: no HV output.
- Bench low-voltage mode: trigger observable, HV disabled.
- HV bench mode: HV enabled under safety gates.
- Engine test mode: blocked until bench validation passes.

These are planning labels only. No firmware framework, build system, or implementation exists yet.