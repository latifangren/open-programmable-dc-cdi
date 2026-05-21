# Failure Modes

Status: draft failure-mode list for design review. This is not a completed FMEA and does not claim production safety.

## Purpose

This document captures known ways the system can behave incorrectly and links each risk to detection, mitigation, and test coverage. It should grow whenever hardware, firmware, or bench tests reveal a new risk.

## Failure Mode Table

| ID | Failure | Possible Effect | Detection | Mitigation Direction | Test Coverage |
|---|---|---|---|---|---|
| FM-PICKUP-001 | Pickup noise creates false event | Spark at wrong crank angle | Invalid interval filter, RPM plausibility, scope capture | Input conditioning, hysteresis, blind window, reject impossible intervals | `TEST-PICKUP-003` |
| FM-PICKUP-002 | Missing pickup event | Missed spark or wrong RPM estimate | Timeout, interval history | Disable trigger until signal is plausible again | `TEST-PICKUP-004` |
| FM-PICKUP-003 | Pickup polarity or edge wrong | Timing offset | Bench simulator comparison, timing light later | Configurable edge only after validation, documented setup | `TEST-TIMING-002` |
| FM-CTRL-001 | MCU reset during operation | Charger or trigger state undefined | Reset reason log, watchdog event | Hardware defaults inactive, boot safe state | `TEST-FAULT-007` |
| FM-CTRL-002 | Firmware hangs | Late, early, or repeated trigger risk | Watchdog, heartbeat if used | Watchdog reset, trigger inactive during reset | `TEST-FAULT-008` |
| FM-IF-001 | Board-to-board cable disconnected | Floating command or missing fault data | Fault/ready open detection, Vcap invalid | Pull defaults safe, charger disabled, trigger blocked | `TEST-IF-001` |
| FM-IF-002 | `TRIGGER_CMD` stuck active | Repeated or uncontrolled discharge risk | Pulse-width monitor if implemented, scope during fault test | Time-bounded trigger, power-board rejection where practical | `TEST-IF-002` |
| FM-IF-003 | `CHARGE_EN` stuck active | HV capacitor remains charged or overcharges if regulation fails | Vcap monitor, timeout, overvoltage comparator if used | Local charger stop, fault latch, emergency stop | `TEST-IF-003` |
| FM-HV-001 | Vcap overvoltage | Capacitor, SCR, rectifier, or coil stress | Vcap ADC, optional comparator, external HV meter | Charger stop, fault latch, discharge inhibited | `TEST-HV-004` |
| FM-HV-002 | Vcap feedback missing or wrong | Charger regulation wrong, unsafe energy decision | Plausibility checks, external meter comparison | Charger disabled and trigger blocked on invalid reading | `TEST-VCAP-003` |
| FM-HV-003 | Charge timeout | Weak charger, wrong load, or fault hidden | Charge timer, Vcap slope | Charger disabled, fault logged | `TEST-HV-003` |
| FM-HV-004 | Bleeder open or ineffective | Capacitor remains charged after shutdown | External meter safe-discharge check | Service procedure, measured discharge time, warning labels | `TEST-HV-005` |
| FM-SCR-001 | SCR false trigger from noise | Spark at unintended time | Scope trigger capture, Vcap drop without command | Gate bias, layout separation, snubber or isolation if required | `TEST-DISCH-004` |
| FM-SCR-002 | SCR does not trigger | No spark | Vcap remains high after trigger, no coil event | Gate-drive validation, low-energy trigger test | `TEST-DISCH-002` |
| FM-SCR-003 | SCR or discharge path fails short | Uncontrolled discharge path or no controlled energy storage | Vcap anomaly, input current anomaly, visual/thermal inspection | Fuse/current limit, service fault, no engine test after fault | `TEST-FAULT-009` |
| FM-COIL-001 | CDI coil disconnected | High-voltage stress or no spark | Visual check, waveform anomaly where measurable | Protected bench fixture, test only if safe method exists | `TEST-DISCH-005` |
| FM-POWER-001 | Input undervoltage during cranking | Weak charge, reset, missed spark | Vbat ADC/log, brownout flag | Undervoltage inhibit, restart safe state | `TEST-FAULT-001` |
| FM-POWER-002 | Reverse battery connection | Hardware damage | Bench protection test only with current limit | Reverse protection, fuse/current limit | `TEST-POWER-002` |
| FM-THERM-001 | Charger or SCR overheats | Drift, failure, unsafe handling | Temperature probe, long-run log | Derating, airflow, layout changes, lower duty limit | `TEST-LONG-001` |

## Review Rules

- A failure mode is not closed until a test or inspection method exists.
- A mitigation is not accepted only because firmware intends to handle it.
- HV failure modes require bench evidence before engine testing.
- Any unexpected Vcap drop, unexpected trigger, abnormal smell, visible damage, or excessive temperature stops the test and creates a new failure entry.

## Immediate Gaps

- No schematic exists, so component-level faults are not complete.
- No PCB exists, so layout-induced coupling is not measured.
- No firmware exists, so watchdog and timing behavior are requirements only.
- No bench logs exist, so failure likelihood is unknown.
