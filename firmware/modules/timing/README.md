# Timing Module

Purpose: calculate RPM, crank angle, ignition advance, and trigger delay.

Contracts:

- Use deterministic timestamp inputs.
- Produce testable outputs for known RPM and advance-map cases.
- Bound results at low RPM, high RPM, and invalid input intervals.
- Expose data needed for timing jitter reports.

No implementation exists yet.
