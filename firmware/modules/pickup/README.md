# Pickup Module

Purpose: convert conditioned pickup events into timestamped engine position events.

Contracts:

- Accept events from a signal conditioner, not raw noisy GPIO in final hardware.
- Reject invalid intervals.
- Support simulator-driven tests.
- Report missing or noisy pickup faults.

No implementation exists yet.
