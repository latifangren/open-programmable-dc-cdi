# CDI Power Board Requirements

Status: pre-schematic requirements. This is not a schematic, PCB layout, BOM, validated design, production release, or engine-test permission.

## Purpose

This document locks the first measurable requirements for the CDI Power Board before schematic capture. It turns the existing draft electrical spec, safety rules, block design, interface contract, and research notes into reviewable gates.

The requirements below define what the first bench-oriented power core must be able to prove. They do not select final parts or claim that any HV behavior has been bench-tested.

## Source Documents

- [../../docs/03-electrical-spec.md](../../docs/03-electrical-spec.md) - draft electrical targets and open decisions.
- [../../docs/04-hv-safety.md](../../docs/04-hv-safety.md) - mandatory HV safety rules and engine-test gate.
- [../../docs/05-bench-test-plan.md](../../docs/05-bench-test-plan.md) - staged bench validation order.
- [../../docs/08-power-stage-architecture.md](../../docs/08-power-stage-architecture.md) - power-stage architecture direction.
- [../../docs/09-power-stage-block-design.md](../../docs/09-power-stage-block-design.md) - block-level pre-schematic design gates.
- [../../docs/12-board-interface-contract.md](../../docs/12-board-interface-contract.md) - controller/power-board signal behavior.
- [../../docs/14-requirements-traceability.md](../../docs/14-requirements-traceability.md) - current requirement and test IDs.
- [../../docs/15-first-prototype-decisions.md](../../docs/15-first-prototype-decisions.md) - v0.1 bench-prototype candidate decisions.
- [../../docs/validation/bench-test-template.md](../../docs/validation/bench-test-template.md) - template for future measured bench reports; not completed validation evidence.
- [../../docs/research/source-backed-parts-research.md](../../docs/research/source-backed-parts-research.md) - research-only component shortlist.
- [schematic-checklist.md](schematic-checklist.md) - schematic review gate.

## Scope

Included:

- 12V input protection behavior.
- Flyback-style HV charger requirements.
- HV discharge capacitor and bleeder requirements.
- Vcap measurement and diagnostics requirements.
- SCR-first discharge-stage requirements.
- CDI coil output and bench-load requirements.
- Controller interface safe defaults.
- Bench validation gates before any engine work.

Excluded:

- Final component selection.
- Final schematic or PCB routing.
- Production enclosure, harness, or manufacturing files.
- Engine installation or road testing.
- Multi-cylinder, EFI, quickshifter, launch-control, or traction-control features.

## Safety Boundary

The CDI Power Board handles high-voltage stored energy. The HV section must not be tested on a breadboard. Every HV node is dangerous until the capacitor is discharged and verified with a properly rated method.

Engine testing remains blocked until bench reports cover timing, HV charge, Vcap measurement, controlled discharge, fault injection, and long-run stability. Schematic completion alone does not satisfy `REQ-SAFE-004`.

## Operating Envelope

| Item | Pre-schematic requirement | Verification |
|---|---|---|
| Input voltage | Design for a 12V motorcycle battery system with draft operating range of 9V to 16V. | Review against `docs/03-electrical-spec.md`; later `TEST-FAULT-001`. |
| Vcap targets | Support 300V as first bench target, with 250V and 350V as later bench steps if charger and capacitor stress allow. | `TEST-HV-001`, `TEST-HV-002`. |
| Stored energy reasoning | Use `E = 0.5 * C * V^2`; the current 1.0 uF / 300V reasoning point is about 45 mJ stored energy, not guaranteed plug energy. | Calculation review; later controlled discharge report. |
| Initial RPM-equivalent load | Design validation around 12,000 RPM equivalent single-cylinder 2T spark rate before engine testing. | `TEST-LONG-001`. |
| Coil class | Use CDI ignition coil path, not a 12V inductive TCI coil driver. | Schematic review; controlled bench load approval. |

## Power-Core Requirements

### Input Protection

| ID | Requirement | Verification |
|---|---|---|
| `PWR-REQ-IN-001` | The 12V input shall include a fuse or current-limit strategy for bench bring-up. | Schematic review; `TEST-POWER-002` where applicable. |
| `PWR-REQ-IN-002` | Reverse-battery behavior shall be defined before schematic release. | Schematic review. |
| `PWR-REQ-IN-003` | Transient suppression shall be selected as a candidate or explicitly deferred with a documented reason. | Schematic review. |
| `PWR-REQ-IN-004` | Cranking sag or undervoltage shall leave charger and discharge disabled. | `TEST-FAULT-001`. |

### HV Charger

| ID | Requirement | Verification |
|---|---|---|
| `PWR-REQ-CHG-001` | The first detailed design shall use a flyback-style charger candidate unless a documented review replaces it. | Architecture review. |
| `PWR-REQ-CHG-002` | Charger shall start only when `CHARGE_EN` is active and local fault conditions allow charging. | `REQ-IF-003`, `TEST-IF-003`. |
| `PWR-REQ-CHG-003` | Charger shall stop on target Vcap, timeout, overvoltage, invalid `VCAP_FB`, or emergency stop. | `REQ-HV-002`, `REQ-SAFE-003`, `TEST-HV-002`, `TEST-HV-003`, `TEST-HV-004`. |
| `PWR-REQ-CHG-004` | Charger current-limit method shall be defined before detailed schematic capture. | Schematic review. |
| `PWR-REQ-CHG-005` | Charger input current and Vcap ramp shall be measurable without hand-probing raw HV discharge loops. | Bench fixture review; `TEST-HV-001`. |

### HV Capacitor And Bleeder

| ID | Requirement | Verification |
|---|---|---|
| `PWR-REQ-CAP-001` | Main discharge capacitor shall remain a pulse-rated film candidate until bench evidence supports another choice. | `REQ-HV-004`, BOM review, `TEST-DISCH-001`. |
| `PWR-REQ-CAP-002` | Candidate capacitor review shall record capacitance, DC voltage rating, dV/dt or pulse rating, peak current, RMS current if available, temperature, package, and mounting constraints. | Datasheet review. |
| `PWR-REQ-CAP-003` | The bleeder path shall not rely only on firmware. | Schematic review; `TEST-HV-005`. |
| `PWR-REQ-CAP-004` | Safe-discharge time and safe voltage threshold shall be defined before routine HV bench work. | `REQ-SAFE-005`, `TEST-HV-005`. |
| `PWR-REQ-CAP-005` | Vcap-safe confirmation shall require a properly rated external HV meter or probe method. | `TEST-HV-005`; `docs/04-hv-safety.md`. |

### Vcap Measurement

| ID | Requirement | Verification |
|---|---|---|
| `PWR-REQ-VCAP-001` | `VCAP_FB` shall support charger regulation, discharge inhibit, overvoltage detection, and bench logging. | `REQ-HV-003`, `TEST-VCAP-001`, `TEST-VCAP-003`. |
| `PWR-REQ-VCAP-002` | Divider ratio shall keep controller-side measurement inside ADC range at maximum credible Vcap. | Schematic review; calibration report. |
| `PWR-REQ-VCAP-003` | High-side divider shall use suitably voltage-rated resistor chain behavior, not one generic resistor across the full HV node. | Schematic review; datasheet review. |
| `PWR-REQ-VCAP-004` | ADC input shall include protection and filtering appropriate for the chosen divider impedance and sampling rate. | Schematic review; `TEST-VCAP-001`. |
| `PWR-REQ-VCAP-005` | Missing, saturated, shorted, or implausible `VCAP_FB` shall inhibit charge and discharge. | `REQ-SAFE-002`, `TEST-VCAP-003`. |

### SCR Discharge Stage

| ID | Requirement | Verification |
|---|---|---|
| `PWR-REQ-DISCH-001` | The first discharge-stage candidate shall be SCR-based unless a documented review replaces it. | Architecture review. |
| `PWR-REQ-DISCH-002` | SCR review shall record voltage rating, surge current, I2t, latching/holding current, dV/dt, gate trigger, thermal, and package constraints. | Datasheet review. |
| `PWR-REQ-DISCH-003` | `TRIGGER_CMD` shall not directly drive the SCR gate from raw MCU GPIO. | `REQ-IF-006`, schematic review. |
| `PWR-REQ-DISCH-004` | SCR gate input shall have a defined off state when trigger is low, floating, reset, or disconnected. | `REQ-IF-001`, `REQ-IF-002`, `TEST-IF-001`, `TEST-IF-002`. |
| `PWR-REQ-DISCH-005` | Low-energy trigger validation shall precede full-energy discharge tests. | `TEST-DISCH-002`. |
| `PWR-REQ-DISCH-006` | False-trigger and noise behavior shall be tested before engine-test discussion. | `TEST-DISCH-004`. |

### CDI Coil Output And Bench Load

| ID | Requirement | Verification |
|---|---|---|
| `PWR-REQ-LOAD-001` | First discharge shall use an approved dummy load, controlled load, or protected spark fixture. | `REQ-HV-005`, `TEST-DISCH-001`. |
| `PWR-REQ-LOAD-002` | CDI coil primary path shall be separated from a 12V TCI coil-driver interpretation. | Schematic review. |
| `PWR-REQ-LOAD-003` | Coil disconnected behavior shall not be tested unless a safe method exists. | `TEST-DISCH-005` if applicable. |
| `PWR-REQ-LOAD-004` | HV secondary probing plan shall avoid unsafe direct probing and must use appropriate instrumentation. | Bench procedure review. |

## Interface Requirements

| ID | Requirement | Verification |
|---|---|---|
| `PWR-REQ-IF-001` | Board-to-board disconnect shall leave charger disabled and trigger inactive. | `REQ-IF-001`, `TEST-IF-001`. |
| `PWR-REQ-IF-002` | `CHARGE_EN` shall default inactive during reset, disconnect, bootloader, firmware update, and watchdog recovery. | `REQ-IF-003`, `REQ-SAFE-001`, `TEST-IF-003`, `TEST-FAULT-007`. |
| `PWR-REQ-IF-003` | `TRIGGER_CMD` shall be a time-bounded command with hardware-defined inactive behavior. | `REQ-IF-002`, `TEST-IF-002`. |
| `PWR-REQ-IF-004` | Open or unreadable `FAULT_N` shall be treated as fault. | `REQ-IF-004`, `TEST-IF-004`. |
| `PWR-REQ-IF-005` | Open or unreadable `READY` shall be treated as not ready. | `REQ-IF-005`, `TEST-IF-005`. |
| `PWR-REQ-IF-006` | Grounding or isolation boundary shall be defined before HV PCB layout. | Interface and layout review. |
| `PWR-REQ-IF-007` | Invalid CDI Power Board low-voltage supply or brownout shall disable charger and discharge. | Interface review; `TEST-FAULT-001`. |
| `PWR-REQ-IF-008` | Test mode or bench-inhibit mode shall disable HV output unless a specific HV test procedure enables it. | Procedure review; `TEST-GATE-001`. |

## Layout And Test-Jig Requirements

| ID | Requirement | Verification |
|---|---|---|
| `PWR-REQ-LAYOUT-001` | First HV board shall use deliberate creepage and clearance assumptions around HV capacitor, charger secondary, SCR, and coil nodes. | Layout review before PCB order. |
| `PWR-REQ-LAYOUT-002` | Silkscreen or fixture labeling shall mark HV charged areas, capacitor discharge warnings, and safe-handle procedure status. | Layout and fixture review. |
| `PWR-REQ-LAYOUT-003` | Test points shall be placed away from raw HV and high-current discharge loops where practical. | Layout review; bench fixture review. |
| `PWR-REQ-JIG-001` | Bench fixture shall include current-limited 12V input and a physical power switch or emergency stop. | Test-jig review. |
| `PWR-REQ-JIG-002` | Bench fixture shall provide visible charger-enabled and fault indicators. | Test-jig review. |
| `PWR-REQ-JIG-003` | Protected spark gap, controlled load, or dummy load enclosure shall be defined before discharge testing. | `TEST-DISCH-001`. |
| `PWR-REQ-JIG-004` | Any unexpected Vcap drop, unexpected trigger, abnormal smell, visible damage, or excessive temperature shall stop the test and create a new failure-mode entry. | Bench procedure review; `TEST-LONG-001`. |

## Measurement And Diagnostics

The first bench board shall expose measurement points that support review without routine hand probing near raw HV loops:

- protected 12V input after protection,
- charger primary control or switch node through an appropriate safe method,
- charger current sense if used,
- protected `VCAP_FB`,
- properly rated Vcap verification fixture or connection point,
- SCR trigger command,
- fault and ready status.

Bench logs should include at least the fields planned in `docs/05-bench-test-plan.md`:

```text
time_us,rpm,advance_deg,vbat,vcap,charge_us,event,error
```

## Validation Gates

| Gate | Must be true before proceeding | Evidence |
|---|---|---|
| Schematic start | Charger current limit, Vcap measurement path, SCR trigger method, safe-discharge target, bench load, layout safety assumptions, and test-jig safety features are defined as candidates. | Updated schematic checklist. |
| HV charger bench | Discharge path disabled; current-limited input setup and Vcap measurement method defined. | `TEST-HV-001` to `TEST-HV-004` templates and report. |
| Controlled discharge bench | Approved dummy load, controlled load, or protected spark fixture exists. | `TEST-DISCH-001`, `TEST-DISCH-002`. |
| Fault-injection bench | Undervoltage, overvoltage, timeout, invalid Vcap, reset, and trigger faults have procedures. | `TEST-FAULT-*`, `TEST-IF-*`, `TEST-VCAP-003`. |
| Engine-test discussion | Timing, HV charge, Vcap measurement, controlled discharge, fault injection, and long-run reports exist. | `REQ-SAFE-004`, `TEST-GATE-001`, `TEST-LONG-001`. |

## Blocked Until Closed

- Exact HV capacitor candidate is verified from original datasheet and stock.
- Exact SCR candidate and gate-drive method are verified.
- Exact Vcap divider resistor family, ratio, ADC protection, and sampling assumptions are verified.
- Charger controller style, switch, magnetics, rectifier, and current-limit method are defined.
- Safe-discharge bleeder target time and safe voltage threshold are defined.
- Low-energy dummy load or protected spark fixture is defined.
- Connector pin order, safe pull locations, and grounding or isolation boundary are defined.
- Bench fixture plan shows how Vcap is measured without unsafe routine probing.
- Bench fixture indicators, labels, emergency stop, and protected load enclosure are defined.
- Creepage, clearance, silkscreen warning, and test-point placement assumptions are defined before PCB layout.
- Stop-test and new-failure-entry procedure is written for unexpected Vcap drop, trigger, smell, damage, or excessive temperature.

## Non-Authorization

Meeting this requirements document does not authorize engine testing. It only authorizes moving toward a reviewed schematic draft when the blocked items are closed. Engine testing remains blocked until measured bench reports prove the required behavior.
