# Firmware

Firmware is not implemented yet. This folder defines module boundaries and test-first contracts only.

No MCU, RTOS, HAL, Arduino, PlatformIO, CMake, or framework choice is final.

The first firmware target is deterministic single-cylinder ignition control for 2-stroke engines under 200cc. 4-stroke support should stay possible through engine profiles and scheduling rules, but it is not the first validation target.

Required firmware qualities:

- Deterministic pickup timestamp handling.
- Testable RPM and timing calculations.
- Safe trigger output behavior.
- HV safety interlocks.
- Bench logging.
- Watchdog-safe default output state.
