# First Prototype Decisions

Status: v0.1 candidate decisions for the first HV bench prototype. This is not a schematic, PCB, BOM, or production decision.

## Purpose

This document narrows the next schematic inputs enough to avoid random design drift. Every decision below is still a bench-prototype candidate unless a later test report promotes it.

## Prototype Goal

Build a bench-learning CDI power stage that can validate:

- 12V input protection direction.
- HV capacitor charging to a measured Vcap target.
- Safe Vcap feedback and logging.
- Bleeder/safe-discharge behavior.
- Controlled SCR discharge into a safe load or protected CDI spark fixture.
- Fault behavior before any engine test.

The first prototype is not a motorcycle-fit product board.

## Candidate Decisions

| Area | v0.1 Candidate Decision | Reason | Blocking Work |
|---|---|---|---|
| First Vcap target | 300V bench target | Matches existing 1.0 uF / 45 mJ design budget point | Define hysteresis and overvoltage threshold |
| Secondary Vcap targets | 250V and 350V later bench steps | Supports lower-energy bring-up and upper design target | Validate charger stress and capacitor margin first |
| First capacitor value | 1.0 uF | Existing energy math gives about 45 mJ at 300V | Select pulse-rated film candidate from datasheet |
| Capacitor type | Pulse-rated polypropylene film | Existing power-stage direction and CDI pulse needs | Extract dV/dt, peak current, RMS current, temperature, package |
| Discharge switch | SCR first | Simpler classic CDI discharge path | Select SCR and gate trigger method |
| SCR family direction | ST TYN612 class as one research row, not final | ST page directly confirms 12A standard SCR family, 600V variants, TO-220AB, and CDI application mention | Full datasheet extraction and bench false-trigger tests |
| Trigger interface | Pulse transformer or optocoupler preferred for HV bench | Keeps MCU command away from direct SCR gate assumptions | Choose driver after SCR gate requirements are known |
| Charger topology | Flyback-style charger | Existing architecture baseline for 12V to 250V/300V/350V | Controller, switch, transformer, rectifier, current-limit choice |
| Charger control | Dedicated charger controller or MCU PWM plus analog current limit | Both remain plausible; self-oscillating baseline rejected | Find sourceable controller or define analog current-limit circuit |
| Vcap feedback | Direct HV divider to protected ADC for first bench | Measurable and consistent with current Vcap research | Verify resistor voltage ratings and ADC sampling behavior |
| First divider candidate | 5x 470k high-side + 15k low-side | Good 0V to 3.3V ADC mapping and lower loss than 390k chain | Exact resistor family and package ratings |
| Interface logic | 3.3V-compatible controller-side signals | Keeps MCU assumptions simple | Exact MCU and isolation device |
| `CHARGE_EN` | Active high, power-board pull-down default off | Cable disconnect/reset fail toward charger disabled | Pull value and local gating circuit |
| `TRIGGER_CMD` | Active-high 100 us to 500 us candidate logic pulse | Time-bounded command avoids held-level semantics | SCR driver may require different pulse energy/timing |
| `FAULT_N` | Active-low fault semantics, open means fault | Open-wire behavior fails safe | Pull location and latch policy |
| `READY` | Active high, open means not ready | Default blocks trigger | Define ready criteria |
| Grounding | Shared LV reference for first bench with separated returns | Simpler than full isolation for first bring-up | Revisit after layout/noise review |
| Bench load | Staged dummy load before CDI coil spark gap | Avoids testing unknown charger, SCR, and coil all at once | Define low-energy load and protected spark fixture |

## Rejected For First Prototype

- TCI low-side 12V ignition coil driver as final output stage.
- Electrolytic or ceramic capacitor as main CDI discharge storage.
- Breadboard HV charger or discharge path.
- Raw MCU GPIO directly into SCR gate.
- Self-oscillating charger as baseline programmable architecture.
- Tiny TO-92 SCR for first full-energy CDI discharge.
- Compact production-like PCB before waveform and thermal data exist.

## Schematic Blockers

Before detailed schematic capture, close these items:

1. Pick one HV capacitor candidate with datasheet fields extracted.
2. Pick one SCR candidate with datasheet fields extracted.
3. Pick first SCR trigger method candidate.
4. Pick first Vcap high-voltage resistor family and package.
5. Define ADC protection and sampling assumptions.
6. Define charger current-limit strategy.
7. Pick charger controller style for prototype.
8. Define safe-discharge bleeder target time and threshold.
9. Define low-energy discharge load.
10. Define power-board connector signal order and safe pull locations.

## Datasheet Extraction Priorities

### HV Capacitor

Extract:

- Capacitance and tolerance.
- DC voltage rating.
- Pulse or dV/dt rating.
- Peak current rating or derivable limit.
- RMS current rating if provided.
- Dissipation factor or ESR-relevant data.
- Operating temperature.
- Package and lead spacing.
- Life or pulse-duty notes.

### SCR

Extract:

- `VDRM` / `VRRM`.
- `ITSM`.
- `I2t`.
- `IGT` / `VGT`.
- `IL` / `IH`.
- `dV/dt`.
- `tq` if given.
- Thermal resistance.
- Package current/temperature limits.

### Vcap Divider Resistor

Extract:

- Voltage rating per resistor.
- Power rating.
- Resistance tolerance.
- Temperature coefficient.
- Package size and creepage implications.
- Availability in the chosen values.

## First Bench Build Gate

The first HV PCB may start only when the schematic checklist can answer:

- How the charger stops at Vcap target.
- How the charger stops on invalid Vcap feedback.
- How the SCR cannot fire from controller reset or cable disconnect.
- How Vcap is externally verified.
- How the capacitor is discharged and measured safe.
- Where probes attach without hand-probing raw HV discharge loops.
- What fault stops the test immediately.

## Conclusion

The next work should be exact datasheet extraction for one capacitor path, one SCR path, and one Vcap divider resistor path. Schematic capture before those three are grounded in datasheets would be premature.
