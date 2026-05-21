# Power Stage Block Design

Status: v0.1 block-level design. This is not a schematic and does not select final component part numbers.

## Purpose

This document turns the current architecture research into the first buildable block plan for the CDI power board. It defines block boundaries, required signals, safety gates, and validation order before detailed schematic work.

The goal is to prevent the project from jumping from concept straight into a dangerous or untestable HV board.

## Scope

Included:

- 12V input protection block.
- Low-voltage control supply block.
- Flyback-style HV charger block.
- HV capacitor and bleeder block.
- Vcap measurement block.
- SCR discharge block.
- CDI coil output block.
- Controller interface block.
- Bench-only instrumentation points.

Excluded for this revision:

- Final component part numbers.
- PCB routing.
- Production enclosure.
- Engine harness pinout.
- Multi-cylinder support.
- EFI or fuel-control interfaces.

## Block Diagram

```text
Motorcycle 12V Input
  -> Fuse / input current limit
  -> Reverse polarity protection
  -> Transient suppression
  -> EMI input filter
  -> Protected 12V rail
       -> LV regulator for control/interface circuits
       -> Flyback charger primary switch + magnetics

Flyback Charger Secondary
  -> HV rectifier
  -> HV capacitor node
       -> Pulse-rated film CDI capacitor
       -> Bleeder / safe discharge path
       -> Vcap divider / measurement protection
       -> SCR anode path
       -> CDI coil primary path

Controller Interface
  -> Charger enable command
  -> Discharge trigger command
  <- Vcap feedback
  <- Fault / ready status
  -> Optional target selection or profile command
```

## Block Responsibilities

### Input Protection

Responsibilities:

- Survive service mistakes and motorcycle electrical noise.
- Limit damage from reverse battery connection.
- Reduce conducted noise into and out of the charger.
- Provide defined behavior during cranking sag.

Required design outputs before schematic:

- Input voltage operating range.
- Fuse or current-limit strategy.
- Reverse-protection strategy.
- Transient suppression class.
- Bench current measurement location.

### Low-Voltage Control Supply

Responsibilities:

- Power any power-board local logic, comparators, isolators, drivers, or status circuits.
- Start in a safe state.
- Brown out safely.

Required behavior:

- Charger disabled during undervoltage.
- Discharge trigger disabled during reset.
- Fault status defaults safe if supply is invalid.

### Flyback HV Charger

Responsibilities:

- Charge the HV capacitor to selected Vcap target.
- Stop on target, timeout, overvoltage, or invalid feedback.
- Recover Vcap after repeated discharge at RPM-equivalent rates.

Required control inputs:

- Charger enable.
- Vcap target or target selection.
- Fault inhibit.

Required feedback outputs:

- Charger active or ready status.
- Fault status.
- Optional input current or temperature later.

### HV Capacitor And Bleeder

Responsibilities:

- Store ignition discharge energy.
- Survive repeated pulse discharge.
- Provide safe decay path after power-off or test stop.

v0.1 direction:

- Pulse-rated polypropylene film capacitor first.
- 1.0 uF at 300V first bench point.
- 0.68 uF and 1.5 uF comparison values.
- 630VDC-class candidates worth researching for early bench margin.

Bleeder requirements:

- Always-on or otherwise fail-safe enough for bench.
- Discharge time measured and documented.
- Safe handling threshold defined and verified by external meter.

### Vcap Measurement

Responsibilities:

- Support charger regulation.
- Confirm enough energy before discharge.
- Detect overvoltage.
- Confirm safe discharge.
- Provide logged data during bench RPM simulation.

v0.1 direction:

- High-impedance resistor divider to protected ADC path for first bench, unless isolation becomes required.
- RC filtering and clamp/protection mandatory.
- Calibration constants mandatory.
- Implausible reading must fault safe.

### SCR Discharge

Responsibilities:

- Dump HV capacitor energy into CDI ignition coil primary when commanded.
- Avoid false triggering from charger noise, ignition noise, reset, or disconnected controller.
- Survive repetitive surge current.

Required design outputs before schematic:

- SCR voltage and surge current class.
- Gate trigger strategy.
- Gate-cathode bias or noise immunity strategy.
- Snubber decision if required by waveform.
- Low-energy trigger test method.

### CDI Coil Output

Responsibilities:

- Connect discharge path to CDI ignition coil primary.
- Support bench spark tester or dummy load first.
- Avoid unsafe exposed HV secondary paths during testing.

Open decisions:

- Specific bench CDI coil.
- Spark gap fixture.
- Dummy load or pulse transformer substitute for early tests.
- Connector type.

## Controller Interface

Minimum signals:

| Signal | Direction | Safe Default | Notes |
| --- | --- | --- | --- |
| Charger enable | Controller to power board | Disabled | Must be inactive on reset/disconnect. |
| Discharge trigger | Controller to power board | No trigger | Must reject noise and stuck states where possible. |
| Vcap feedback | Power board to controller | Fault if invalid | ADC or conditioned measurement path. |
| Fault status | Power board to controller | Fault | Optional for first bench, required later. |
| Ready status | Power board to controller | Not ready | Based on Vcap and no faults. |

Isolation is not finalized. Early low-voltage bench may use protected non-isolated signals. HV bench must revisit isolation after grounding and noise tests.

## Safe-State Rules

Rules that detailed schematic must satisfy:

- Power-up means charger disabled and discharge disabled.
- Controller reset means charger disabled and discharge disabled.
- Bootloader or firmware update mode means charger disabled and discharge disabled.
- Missing Vcap feedback means charger disabled and discharge disabled.
- Overvoltage means charger disabled and fault latched.
- Stuck trigger line must not create repeated uncontrolled sparks.
- Bench emergency stop must remove charger enable and provide safe discharge procedure.

## Bench Instrumentation Points

The first bench board must expose safe measurement points.

Required measurement points:

- Protected 12V input after fuse/protection.
- Charger primary switch gate.
- Charger primary current sense if used.
- HV capacitor Vcap through safe divider output.
- External HV meter point or fixture connection.
- SCR gate command.
- Fault/ready logic.
- Optional temperature points near transformer, switch, rectifier, SCR, and capacitor.

Do not require hand probing near raw HV discharge loop during repeated tests.

## Validation Gates

Detailed schematic work should follow these gates:

1. Vcap measurement divider and protection direction accepted.
2. Charger controller style selected as a candidate, not final production choice.
3. Charger current-limit strategy defined.
4. SCR gate trigger method selected as a candidate.
5. Bench load or spark tester approach defined.
6. Safe discharge process defined.
7. Fault-state behavior documented.

Engine testing remains blocked after schematic. It requires bench results, not only design intent.

## Open Questions

- Dedicated charger controller or MCU PWM plus analog current limit?
- Exact target hysteresis for 250V, 300V, and 350V?
- Direct divider or isolated Vcap measurement for first HV PCB?
- SCR trigger via optocoupler, pulse transformer, or protected driver?
- Bench spark tester vs dummy discharge load first?
- Shared controller/power-board PCB or split boards for first HV prototype?
- Grounding strategy relative to motorcycle chassis and coil return?

## v0.1 Conclusion

The first power-stage design should be a bench-first split into input protection, flyback charger, HV capacitor/bleeder, Vcap measurement, and SCR discharge blocks. Schematic work can start only after candidate-level decisions exist for charger control, Vcap divider protection, SCR gate drive, and bench load.
