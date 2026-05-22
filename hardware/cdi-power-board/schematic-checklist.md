# CDI Power Board Schematic Checklist

Status: pre-schematic review checklist. This is not a schematic, PCB layout, BOM, validated design, or production release.

## Purpose

This checklist defines what the first CDI Power Board schematic must answer before a bench PCB is considered. It is a gate for review, not evidence that the design is complete.

High voltage warning: the CDI Power Board can store dangerous energy after input power is removed. Do not test the HV section on a breadboard. Engine testing remains blocked until bench reports prove safe charge, measurement, discharge, fault handling, and long-run behavior.

## Required Inputs

| Input | Required before detailed schematic | Current status |
|---|---|---|
| Electrical targets | Vcap target, capacitor value, stored-energy range, max bench repetition rate | Drafted in `docs/03-electrical-spec.md` and `docs/15-first-prototype-decisions.md` |
| HV capacitor path | Exact candidate, datasheet fields, package and mounting constraints | Research only |
| SCR path | Exact candidate, gate trigger needs, false-trigger concerns | Research only |
| Vcap divider path | Resistor family, ratio, ADC protection, calibration method | Research only |
| Charger control | Stop condition, timeout, overvoltage response, current limit | Not closed |
| Safe discharge | Bleeder target time, safe threshold, external meter confirmation | Not closed |
| Bench load | Low-energy dummy load or protected spark fixture | Not closed |
| Interface defaults | Connector pinout, safe pulls, inactive states, fault behavior | Draft only |

## Schematic Review Checklist

### 12V Input Protection

- [ ] Input fuse or current limit is defined for bench work.
- [ ] Reverse battery protection strategy is defined.
- [ ] Transient suppression is listed as candidate or intentionally deferred with reason.
- [ ] Input test points support current-limited bench supply setup.
- [ ] Failure does not leave `CHARGE_EN` or discharge trigger active.

### Low-Voltage Control Defaults

- [ ] `CHARGE_EN` has a hardware-defined inactive state during reset, disconnect, and unpowered-controller cases.
- [ ] `TRIGGER_CMD` has a hardware-defined inactive state during reset, disconnect, and bootloader cases.
- [ ] `FAULT` open or unreadable state is treated as fault by the controller.
- [ ] `READY` open or unreadable state is treated as not ready by the controller.
- [ ] Safe-state behavior supports `REQ-SAFE-001`, `REQ-IF-001`, `REQ-IF-002`, `REQ-IF-003`, `REQ-IF-004`, and `REQ-IF-005`.

### HV Charger

- [ ] Charger topology and controller approach are named.
- [ ] Hardware current limit or equivalent non-firmware-only protection is defined.
- [ ] Charger stops on target Vcap.
- [ ] Charger stops on timeout.
- [ ] Charger stops on invalid or saturated `VCAP_FB`.
- [ ] Charger stops on overvoltage condition.
- [ ] HV secondary rectifier rating, recovery behavior, and package are checked against the charger role.
- [ ] Test points allow measuring charger input current and Vcap ramp without unsafe probing.

### HV Capacitor And Bleeder

- [ ] Main capacitor is pulse-rated film, not selected only by capacitance and voltage.
- [ ] Datasheet dV/dt, peak current, RMS/ripple current, temperature, ESR/dissipation, and package fields are recorded.
- [ ] Capacitor physical mounting supports bench safety and vibration learning.
- [ ] Bleeder is independent from the measurement divider unless explicitly justified.
- [ ] Safe-discharge target time and safe voltage threshold are written on the schematic review notes.
- [ ] Properly rated external HV meter/probe confirmation is required for `TEST-HV-005` per `docs/04-hv-safety.md`.

### Vcap Measurement

- [ ] Divider ratio keeps ADC input inside range at maximum credible Vcap.
- [ ] High-side divider uses multiple suitably rated resistors, not one generic resistor across the full HV node.
- [ ] Resistor voltage rating, power dissipation, tolerance, tempco, and package spacing are checked.
- [ ] ADC input has series resistance, filtering, and clamp/protection strategy.
- [ ] ADC sampling rate and source impedance are compatible.
- [ ] Open, short-low, saturated, and implausible `VCAP_FB` cases inhibit charge and discharge.
- [ ] Properly rated external HV meter/probe comparison is planned for `TEST-VCAP-001` per `docs/04-hv-safety.md`.

### SCR Discharge Stage

- [ ] SCR voltage, surge current, I2t, holding/latching current, dV/dt, gate trigger, thermal, and package limits are recorded.
- [ ] `TRIGGER_CMD` does not directly drive the SCR gate from raw MCU GPIO.
- [ ] Gate driver can supply trigger current with margin.
- [ ] Gate-cathode bias keeps SCR off when trigger is floating.
- [ ] Trigger pulse width and recovery behavior are defined.
- [ ] Snubber or layout mitigation is reviewed for false-trigger risk.
- [ ] Low-energy trigger validation precedes full-energy discharge.
- [ ] False-trigger/noise check is planned for `TEST-DISCH-004`.

### CDI Coil Output And Bench Load

- [ ] CDI ignition coil type is specified separately from a 12V inductive TCI coil.
- [ ] Coil connector and HV secondary handling are mechanically guarded.
- [ ] First discharge test uses approved dummy load, controlled load, or protected spark fixture.
- [ ] Coil disconnected behavior is not tested unless a safe method exists.
- [ ] Scope/probe plan avoids unsafe direct HV secondary probing.

### Board Interface And Grounding

- [ ] Connector pin order separates noisy/HV-adjacent paths from sensitive measurement paths where possible.
- [ ] Return pins and reference strategy are explicit.
- [ ] Shared-reference or isolation boundary decision is recorded.
- [ ] `VCAP_FB`, `FAULT`, `READY`, `CHARGE_EN`, and `TRIGGER_CMD` directions match `docs/12-board-interface-contract.md`.
- [ ] Board disconnect leaves charger disabled and trigger inactive.

### Layout Safety Review

- [ ] HV clearance and creepage assumptions are written before PCB layout.
- [ ] HV capacitor, SCR, charger, and coil current loops are kept away from pickup and controller signals.
- [ ] Vcap divider physical chain spacing is reviewed.
- [ ] Bleeder and safe-discharge path are visibly marked.
- [ ] Test points are reachable without crossing HV nodes by hand.
- [ ] Silkscreen marks HV sections and discharge warnings.

## Blocked Until Closed

- Exact HV capacitor candidate and package are verified from original datasheet.
- Exact SCR candidate and gate-drive approach are verified.
- Exact Vcap divider resistor family, ratio, and ADC protection are verified.
- Charger current-limit method is defined.
- Bleeder discharge target time and safe threshold are defined.
- Low-energy load or protected spark fixture is defined.
- Connector pinout and safe pulls are defined.

## Review Outcome

| Item | Pass / Fail / Blocked | Evidence |
|---|---|---|
| Source-backed parts | Blocked | No final part selection yet |
| Safe defaults | Blocked | Interface contract still draft |
| HV charge control | Blocked | Charger current-limit approach not closed |
| Vcap measurement | Blocked | Divider and ADC protection still research-only |
| Controlled discharge | Blocked | Gate driver and bench load not closed |
| Safe discharge | Blocked | Bleeder target time and threshold not closed |

Checklist completion does not authorize engine testing. Only measured bench reports can unblock engine-test discussion.
