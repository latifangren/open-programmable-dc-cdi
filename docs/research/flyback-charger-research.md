# Flyback Charger Research

Status: targeted research brief. This is not a schematic, BOM, magnetics design, or final controller selection.

## Research Goal

The CDI charger must convert a noisy motorcycle 12V battery input into a controlled high-voltage capacitor charge. For this project, the charger must support selectable Vcap targets around 250V, 300V, and 350V for a pulse-rated CDI storage capacitor.

Project context:

- Older carbureted single-cylinder motorcycles.
- 2-stroke engines under 200cc first.
- 12V battery system with cranking sag and charging-system spikes.
- First bench point: 1.0 uF at 300V, about 45 mJ stored.
- Draft stored-energy range: 30 mJ to 80 mJ.
- Initial validation target: 12,000 RPM.
- Design target: 16,000 RPM.
- Engine testing blocked until bench validation exists.

## Why The Charger Matters

A programmable CDI does not only need one high-voltage charge. It needs repeatable charge recovery before the next scheduled spark.

2-stroke single-cylinder spark interval:

| RPM | Spark Rate | Time Between Sparks |
| ---: | ---: | ---: |
| 6,000 | 100/s | 10.0 ms |
| 12,000 | 200/s | 5.0 ms |
| 16,000 | 266.7/s | 3.75 ms |
| 20,000 | 333.3/s | 3.0 ms |

The charger does not always recharge from 0V every spark, but it must restore the energy removed by discharge quickly enough that Vcap stays inside the usable window.

## Stored Energy And Power Budget

Stored capacitor energy:

```text
E = 0.5 * C * V^2
```

Reference energy points:

| Capacitor | 250V | 300V | 350V |
| ---: | ---: | ---: | ---: |
| 0.68 uF | 21.3 mJ | 30.6 mJ | 41.7 mJ |
| 1.0 uF | 31.3 mJ | 45.0 mJ | 61.3 mJ |
| 1.5 uF | 46.9 mJ | 67.5 mJ | 91.9 mJ |

Stored energy throughput for 2-stroke operation:

| RPM | 30 mJ | 45 mJ | 60 mJ | 80 mJ |
| ---: | ---: | ---: | ---: | ---: |
| 6,000 | 3.0 W | 4.5 W | 6.0 W | 8.0 W |
| 12,000 | 6.0 W | 9.0 W | 12.0 W | 16.0 W |
| 16,000 | 8.0 W | 12.0 W | 16.0 W | 21.3 W |
| 20,000 | 10.0 W | 15.0 W | 20.0 W | 26.7 W |

These are stored-energy numbers, not charger input power. Input power must include conversion loss, control loss, margin, and low-input-voltage operation.

Initial charger input class estimate:

| Case | Stored Throughput | Rough Input Class |
| --- | ---: | ---: |
| 12,000 RPM, 45 mJ | 9 W | 15 W to 25 W |
| 16,000 RPM, 45 mJ | 12 W | 20 W to 30 W |
| 20,000 RPM, 45 mJ | 15 W | 25 W to 40 W |

This estimate is only a sizing guide. Bench data must decide real current, heating, and recovery behavior.

## Baseline Topology Direction

Baseline for v0.1 research:

- Flyback-style capacitor charger from 9V to 16V input.
- HV output target controlled by Vcap feedback.
- Charger enable controlled by firmware or power-board controller.
- Hardware current limit required.
- Charger timeout required.
- Overvoltage stop required.

Why flyback-style first:

- Practical voltage ratio from 12V nominal to 250V to 350V class output.
- Magnetics can store and transfer discrete energy per switching cycle.
- Common architecture for small HV capacitor charging.
- Easier to isolate noisy HV switching behavior than a very-high-duty boost path.
- Better fit for controlled charge termination than a simple self-oscillating CDI charger.

Not locked yet:

- Dedicated capacitor-charger controller vs custom PWM control.
- Transformer vs coupled inductor construction.
- Isolated vs non-isolated secondary return strategy.
- Exact switching frequency.
- Exact peak primary current.
- Exact snubber/clamp design.

## Control Strategy Candidates

### Dedicated Capacitor Charger Controller

Pros:

- Designed for charge-control behavior.
- Often includes current-limit and flyback-specific behavior.
- Can simplify stable high-voltage charging.

Cons:

- Part availability and operating limits must be checked.
- May constrain transformer design.
- Documentation and evaluation boards may focus on camera flash, not ignition repetition rates.

Use when the controller supports the required input voltage, target output, repetition rate, and safety hooks.

### MCU PWM Plus Analog Current Limit

Pros:

- Flexible firmware control and logging.
- Vcap target can be tied to calibration profile.
- Easier to experiment with charge profiles.

Cons:

- Firmware fault paths become safety-critical.
- Needs robust analog cycle-by-cycle current limiting.
- Timing noise from ignition scheduling must not disturb charger safety.

Use only if hardware current limiting and safe default states exist without trusting firmware alone.

### Self-Oscillating Charger

Pros:

- Simple and common in low-cost CDI circuits.

Cons:

- Harder to regulate accurately.
- Harder to log and fault-detect.
- Output depends strongly on transformer, input voltage, load, and temperature.

Do not use as v0.1 programmable baseline unless the project intentionally trades control for simplicity.

## Required Charger Functions

Minimum charger behavior:

- Disabled at power-up.
- Disabled during firmware update or bootloader mode.
- Enabled only after controller self-check.
- Stops at selected Vcap target.
- Stops on overvoltage.
- Stops on charger timeout.
- Stops if Vcap feedback is missing or implausible.
- Limits input current during cranking and faults.
- Recovers Vcap fast enough at 12,000 RPM equivalent before engine testing.

Useful charger states:

| State | Charger Behavior | Exit Condition |
| --- | --- | --- |
| Off | Switch disabled | Valid enable command and no faults |
| Precharge | Low-power or limited charging | Vcap feedback verified |
| Charge | Normal current-limited charging | Vcap target reached |
| Hold | Top-up charging or disabled hysteresis | Vcap below restart threshold |
| Fault | Switch disabled | Fault clear process |

## Vcap Termination Direction

Vcap target control must not rely on open-loop timing.

Required termination features:

- Compare measured Vcap against selected target.
- Include hysteresis to avoid rapid on/off chatter.
- Include maximum charge time from low Vcap.
- Include absolute overvoltage threshold above normal target.
- Include implausible feedback detection.

Example threshold direction, not final values:

| Target | Normal Stop | Restart | Fault Overvoltage |
| ---: | ---: | ---: | ---: |
| 250V | TBD | TBD | TBD |
| 300V | TBD | TBD | TBD |
| 350V | TBD | TBD | TBD |

Do not lock thresholds until Vcap measurement accuracy and charger overshoot are measured.

## Magnetics Research Requirements

The transformer or coupled inductor is likely one of the hardest parts.

Research fields to collect:

| Field | Why It Matters |
| --- | --- |
| Turns ratio | Output voltage and reflected stress. |
| Primary inductance | Energy per cycle and peak current. |
| Saturation current | Prevents runaway switch stress. |
| Leakage inductance | Drives voltage spikes and snubber need. |
| Core material | Loss, frequency range, heating. |
| Insulation rating | HV safety between windings. |
| Bobbin creepage | HV reliability. |
| Winding capacitance | EMI and ringing. |
| Temperature rise | Repeated charging reliability. |
| Availability | Avoid one-off magic transformer dependency. |

Open sourcing risk:

- Off-the-shelf camera-flash transformers may not handle required repetition rate.
- Automotive CDI transformers may not expose enough datasheet detail.
- Custom magnetics can work but raises manufacturing burden.

v0.1 should prefer a bench-friendly magnetics path with measurable limits over a tiny production-optimized part.

## Switch, Rectifier, And Clamp Requirements

Primary switch research fields:

- Voltage stress including reflected voltage and leakage spike.
- Pulsed current rating.
- Avalanche rating, if relied on.
- Gate-drive requirement.
- Switching loss and thermal rise.
- Safe behavior under transformer saturation.

HV rectifier research fields:

- Reverse voltage rating above target plus ringing margin.
- Fast recovery behavior.
- Pulsed current handling.
- Reverse recovery noise.
- Thermal behavior under repeated charging.

Clamp/snubber research fields:

- Primary switch voltage limiting.
- Leakage energy dissipation.
- Temperature rise.
- EMI effect.
- Failure mode if clamp part opens or shorts.

Do not skip snubber/clamp planning. Flyback leakage energy can destroy the switch or create noisy false triggers.

## Input Protection And Power Budget

Motorcycle supply assumptions:

- Cranking sag below 12V.
- Charging voltage around 14V class.
- Load dumps or regulator spikes possible.
- Reverse battery connection possible during service.
- Ignition and plug noise coupled into wiring.

Required input-side design topics:

- Fuse or current-limited path.
- Reverse polarity protection.
- TVS or transient suppression.
- EMI filter before charger switch loop.
- Brownout behavior.
- Input current measurement during bench.

Bench must test at least:

- 9V input.
- 12V input.
- 16V input.
- Current-limited supply behavior.
- Startup into discharged capacitor.
- Repeated discharge while charging.

## EMI And Layout Risks

High-risk nodes:

- Primary switch drain/collector.
- Transformer primary loop.
- HV rectifier loop.
- HV capacitor discharge loop.
- SCR gate path.
- Vcap divider input.
- Pickup input.

Layout direction:

- Keep primary switching loop compact.
- Keep discharge loop compact and separate from charger control.
- Keep Vcap divider away from SCR/coil pulse loop.
- Keep pickup conditioner away from HV switching and discharge loops.
- Use a deliberate return strategy, not random chassis return.
- Provide probe points that do not require unsafe hand positioning.

EMI validation cannot be postponed until final PCB. The first HV bench board should already support scope probing and failure isolation.

## Bench Validation Plan

Recommended charger test sequence:

1. Validate charger control at low voltage with no HV capacitor installed.
2. Validate switch gate waveform into safe dummy conditions.
3. Charge a small HV capacitor to a low target first.
4. Verify Vcap reading against an external HV meter.
5. Verify charger stop, restart, and timeout.
6. Increase targets toward 250V, then 300V, then 350V only if stable.
7. Test input at 9V, 12V, and 16V.
8. Record charge time from discharged capacitor to target.
9. Record recovery time after simulated discharge.
10. Run repeated discharge at 6,000 RPM equivalent.
11. Run repeated discharge at 12,000 RPM equivalent.
12. Run 16,000 RPM equivalent only after lower-rate tests pass.
13. Measure charger switch, transformer, rectifier, clamp, and capacitor temperature.
14. Inject faults: missing Vcap, shorted divider low side, open divider high side simulation, disabled load, charger timeout, and low input voltage.

Hard stop conditions:

- Charger overshoots target uncontrolled.
- Vcap feedback is unstable or implausible.
- Switch voltage exceeds measured safe margin.
- Transformer saturates or overheats.
- Rectifier or clamp overheats.
- Input current exceeds bench supply limit unexpectedly.
- EMI causes false SCR trigger or pickup event.
- Charger cannot recover Vcap at 12,000 RPM equivalent for the chosen energy point.
- Safe discharge procedure cannot prove Vcap is low before handling.

## Candidate Comparison Template

Use this table during charger controller and magnetics research:

| Candidate | Type | Input Range | Output Range | Current Limit | Control Method | Magnetics Path | Notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- |
| TBD | Dedicated charger controller | TBD | TBD | TBD | TBD | TBD | Research only |
| TBD | MCU PWM + analog limit | TBD | TBD | TBD | TBD | TBD | Research only |
| TBD | Self-oscillating reference | TBD | TBD | TBD | TBD | TBD | Reference only |

Do not promote any candidate to design selection until Vcap measurement, current limit, switch stress, and bench test requirements are defined.

## Research Conclusion

The v0.1 charger should remain a flyback-style HV capacitor charger with closed-loop Vcap termination, hardware current limiting, charger timeout, and overvoltage protection. The first practical target is not maximum voltage or smallest size. The first target is repeatable charging of 1.0 uF to 300V, then recovery after repeated discharge at 12,000 RPM equivalent.

The next coupled research item is Vcap measurement, because charger safety and spark-energy control depend on credible high-voltage feedback.
