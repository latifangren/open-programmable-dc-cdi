# Firmware

Firmware is not implemented yet. This folder defines module boundaries and test-first contracts only.

No MCU, RTOS, HAL, Arduino, PlatformIO, CMake, or framework choice is final.

Required firmware qualities:

- Deterministic pickup timestamp handling.
- Testable RPM and timing calculations.
- Safe trigger output behavior.
- HV safety interlocks.
- Bench logging.
- Watchdog-safe default output state.
