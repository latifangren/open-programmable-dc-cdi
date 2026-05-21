# Component Candidate Matrix

Status: v0.1 research matrix. This is not a BOM and does not select final part numbers.

## Purpose

This document defines how component candidates will be compared before schematic and bench selection. It prevents choosing parts by headline ratings only.

For this project, a component is not selected until its datasheet ratings, failure behavior, layout constraints, and bench test role are understood.

## Selection Rules

General rules:

- Candidate rows may include vendor series, part families, or part numbers, but this revision keeps them at research status.
- No final part number before charger, Vcap measurement, discharge, and bench-load constraints are defined.
- Prefer parts with clear datasheets over convenient hobby-module claims.
- Treat missing pulse, thermal, or protection data as risk.
- Bench availability matters, but availability alone is not engineering suitability.

Required candidate status labels:

| Status | Meaning |
| --- | --- |
| Research only | Interesting, not validated against requirements. |
| Bench candidate | Worth buying/testing after schematic constraints exist. |
| Rejected | Known mismatch or unacceptable risk. |
| Selected for prototype | Chosen for a specific prototype revision only. |
| Production candidate | Requires bench history and manufacturing review. |

No part should jump from research only to production candidate.

## HV Capacitor Matrix

| Vendor | Series | C | VDC | Pulse Rating | dV/dt | Peak Current | RMS Current | Temp | Package | Status | Notes |
| --- | --- | ---: | ---: | --- | ---: | ---: | ---: | ---: | --- | --- | --- |
| Cornell Dubilier | 940C | 0.68 uF | 600V+ class | Pulse polypropylene | TBD datasheet | TBD datasheet | TBD datasheet | TBD datasheet | Axial | Research only | High-current pulse film family; physically bench-friendly, not PCB-compact. |
| Cornell Dubilier | 940C / 942C | 1.0 uF | 600V+ class | Pulse polypropylene | TBD datasheet | TBD datasheet | TBD datasheet | TBD datasheet | Axial | Research only | Strong first bench direction if exact value/stock and pulse ratings check out. |
| KEMET / YAGEO | R76 / pulse MKP class | 1.0 uF | 630V class | Metallized polypropylene pulse class | TBD datasheet | TBD datasheet | TBD datasheet | TBD datasheet | Radial box | Research only | PCB-friendly candidate; must verify pulse current and temperature behavior. |
| TDK / EPCOS | B3265x / B3267x pulse MKP class | 0.68 uF to 1.5 uF | 630V class | Snubber/resonant/pulse MKP class | TBD datasheet | TBD datasheet | TBD datasheet | TBD datasheet | Radial box | Research only | TDK catalog exposes 630V polypropylene options; exact type must be filtered by pulse/dV/dt. |
| WIMA | FKP1 / MKP10 class | 0.68 uF to 1.5 uF | 630V class | Pulse polypropylene class | TBD datasheet | TBD datasheet | TBD datasheet | TBD datasheet | Radial box | Research only | Useful comparison family; verify package size and lead spacing. |
| Vishay | MKP pulse / snubber class | 0.68 uF to 1.5 uF | 630V class | Polypropylene pulse class | TBD datasheet | TBD datasheet | TBD datasheet | TBD datasheet | Radial / axial TBD | Research only | Keep as vendor comparison; exact series must expose pulse-relevant data. |

Hard requirements:

- Pulse-rated polypropylene film direction.
- Voltage margin above 350V target plus overshoot and ringing.
- Credible pulse current data or dV/dt data.
- Repetition-rate heating checked on bench.
- Mechanical support against vibration.

Reject if:

- Electrolytic proposed as main discharge capacitor.
- Ceramic proposed as main discharge capacitor.
- Datasheet gives only capacitance and voltage with no pulse-relevant information.

## SCR Matrix

| Vendor | Part | VDRM/VRRM | ITSM | I2t | IGT/VGT | dV/dt | Package | Status | Notes |
| --- | --- | ---: | ---: | ---: | --- | ---: | --- | --- | --- |
| STMicroelectronics | TYN/TN 600V to 800V class | 600V to 800V class | TBD datasheet | TBD datasheet | TBD datasheet | TBD datasheet | TO-220 class | Research only | Common SCR family direction; verify gate current and repetitive pulse behavior. |
| Littelfuse | Sx010L / Sx012L class | 600V to 800V class | TBD datasheet | TBD datasheet | TBD datasheet | TBD datasheet | TO-220 class | Research only | Bench candidate family if surge and gate specs match driver. |
| WeEn / Nexperia | BT151 / BT152 class | 600V to 800V class | TBD datasheet | TBD datasheet | TBD datasheet | TBD datasheet | TO-220 class | Research only | Widely available SCR family; verify dV/dt and gate sensitivity variants. |
| Vishay | VS-xxTTS08 / phase-control discrete class | 800V class | TBD datasheet | TBD datasheet | TBD datasheet | TBD datasheet | TO-220 / TO-263 class | Research only | Larger rugged comparison; may be overkill but useful for bench margin. |
| Generic small SCR | C106 / X02 / tiny TO-92 class | 400V to 600V class | Low/TBD | TBD | TBD | TBD | TO-92 / small package | Rejected | Too small/suspect for first full-energy CDI discharge unless proven at low-energy only. |

Hard requirements:

- Voltage margin for HV capacitor target and ringing.
- Repetitive surge capability, not only one-shot surge.
- Gate trigger compatible with selected driver.
- dV/dt immunity or snubber plan.
- Package can be probed and cooled on bench.

Reject if:

- Gate trigger current cannot be driven robustly.
- Surge current data is unclear.
- Device false-triggers in low-energy noise tests.

## SCR Gate Driver Matrix

| Candidate | Isolation | Output Type | Trigger Energy | Noise Immunity | Safe Default | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TBD | Optocoupler | Current pulse | TBD | TBD | Off | Research only | Simple isolation candidate. |
| TBD | Pulse transformer | Pulse | TBD | TBD | No pulse | Research only | Good transient separation if suitable. |
| TBD | Protected non-isolated driver | Current pulse | TBD | TBD | Off | Research only | Low-voltage bench only unless justified. |

Hard requirements:

- No trigger on controller reset.
- No trigger on disconnected controller.
- Defined gate-cathode bias.
- Trigger pulse width and current documented.
- False-trigger test before full-energy discharge.

## Flyback Charger Controller Matrix

| Candidate | Type | Input Range | Output Target | Current Limit | Feedback Method | Fault Pins | Status | Notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |
| TBD | Dedicated capacitor charger | TBD | TBD | TBD | Vcap divider | TBD | Research only | Check repetition-rate suitability. |
| TBD | MCU PWM + analog limit | 9V-16V target | 250V-350V | External required | ADC/comparator | Firmware + hardware | Research only | Flexible but must not rely on firmware alone. |
| TBD | Self-oscillating reference | TBD | TBD | Weak/TBD | Poor/TBD | TBD | Rejected for baseline | Reference only unless project scope changes. |

Hard requirements:

- Charger can be disabled by safe state.
- Hardware current limit or equivalent protection.
- Vcap-based termination.
- Timeout behavior.
- Bench-visible switching and current signals.

Reject if:

- Output is uncontrolled open loop.
- No credible current limit exists.
- Controller cannot stop safely on invalid Vcap feedback.

## Flyback Magnetics Matrix

| Candidate | Type | Turns Ratio | Primary L | Saturation Current | Insulation | Availability | Status | Notes |
| --- | --- | ---: | ---: | ---: | --- | --- | --- | --- |
| TBD | Off-the-shelf transformer | TBD | TBD | TBD | TBD | TBD | Research only | Prefer if datasheet is complete. |
| TBD | Custom wound prototype | TBD | TBD | TBD | TBD | Low | Research only | Use only with measurable design notes. |
| TBD | Camera-flash transformer | TBD | TBD | TBD | TBD | TBD | Research only | Risk: repetition rate and documentation. |

Hard requirements:

- Does not saturate at planned current limit.
- Insulation suitable for HV output.
- Leakage inductance can be managed by clamp/snubber.
- Temperature rise acceptable during repeated discharge recovery.

## Primary Switch Matrix

| Vendor | Part | Type | V Rating | Pulsed Current | Gate Drive | Avalanche/Clamp Assumption | Package | Status | Notes |
| --- | --- | --- | ---: | ---: | --- | --- | --- | --- | --- |
| TBD | TBD | MOSFET | TBD | TBD | TBD | TBD | TBD | Research only | Flyback primary switch candidate. |
| TBD | TBD | IGBT/MOSFET | TBD | TBD | TBD | TBD | TBD | Research only | Compare only if stress math supports it. |

Hard requirements:

- Handles reflected voltage plus leakage spike with clamp margin.
- Gate drive available from selected controller.
- Thermal behavior acceptable during repeated charging.
- Fault behavior understood if transformer saturates.

## HV Rectifier Matrix

| Vendor | Part | VRRM | Recovery | Pulsed Current | Package | Status | Notes |
| --- | --- | ---: | --- | ---: | --- | --- | --- |
| TBD | TBD | TBD | Fast/TBD | TBD | TBD | Research only | Flyback secondary rectifier candidate. |
| TBD | TBD | TBD | Fast/TBD | TBD | TBD | Research only | Higher voltage margin comparison. |

Hard requirements:

- Reverse voltage margin above Vcap and ringing.
- Recovery behavior suitable for switching frequency.
- Thermal behavior during repeated charging.

## Vcap Divider Matrix

| Candidate | Ratio | Total Resistance | Max Vcap | ADC Range | Resistor Voltage Margin | Protection | Status | Notes |
| --- | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 4x 390k high-side + 10k low-side | 157:1 | 1.57 Mohm | 450V target | 0V to 3.3V ADC class | About 112.5V per high-side resistor at 450V before transients | Series ADC resistor, RC filter, clamp | Research only | Good first bench balance: 350V maps to about 2.23V, 450V maps to about 2.87V. |
| 5x 470k high-side + 15k low-side | 157.7:1 | 2.365 Mohm | 450V target | 0V to 3.3V ADC class | About 90V per high-side resistor at 450V before transients | Series ADC resistor, RC filter, clamp | Research only | Lower divider current than 390k chain; low-side impedance still ADC-friendly. |
| 4x 1M high-side + 27k low-side | 149.1:1 | 4.027 Mohm | 450V target | 0V to 3.3V ADC class | About 112.5V per high-side resistor at 450V before transients | RC filter, clamp, possible ADC buffer | Research only | Lower bleed loss; ADC settling/noise needs more care. |
| 5x 1M high-side + 33k low-side | 152.5:1 | 5.033 Mohm | 450V target | 0V to 3.3V ADC class | About 90V per high-side resistor at 450V before transients | RC filter, clamp, likely ADC sampling guard time | Research only | Very low divider current; may be too high impedance without buffer or slow sampling. |

Hard requirements:

- Measures above 350V target with margin.
- High-side resistor voltage ratings are valid.
- ADC input protected under plausible faults.
- Response time supports charger stop and recovery logging.
- Calibration method documented.

Preferred resistor direction:

- Use multiple series high-side resistors, not one generic resistor across the full HV node.
- Use resistors with explicit voltage rating, temperature coefficient, tolerance, and power rating.
- Research Vishay VR25/VR37 class, KOA Speer HV class, Ohmite Slim-Mox class, or similar high-voltage resistor families before schematic.
- Keep low-side resistor value low enough for ADC sampling accuracy, or add a buffer and document the failure mode.
- Treat the divider as measurement only; do not rely on it as the primary safe-discharge bleeder.

## Input Protection Matrix

| Function | Candidate | Rating Fields | Status | Notes |
| --- | --- | --- | --- | --- |
| Fuse/current limit | TBD | Current, interrupt behavior | Research only | Must suit bench and motorcycle wiring. |
| Reverse protection | TBD | Current, voltage drop, thermal | Research only | MOSFET or diode strategy TBD. |
| Transient suppression | TBD | Standoff, clamp, pulse power | Research only | Motorcycle spike profile TBD. |
| EMI filter | TBD | Current, impedance, layout | Research only | Must not destabilize charger. |

## Bench Equipment Matrix

| Item | Requirement | Status | Notes |
| --- | --- | --- | --- |
| Current-limited DC supply | 9V, 12V, 16V tests | TBD | Input current logging useful. |
| HV meter/probe | Verify Vcap independently | TBD | Required before HV testing. |
| Oscilloscope probe setup | Gate, current, Vcap divider | TBD | HV probing safety required. |
| Current measurement | Charger input and discharge if possible | TBD | Use safe method first. |
| Spark gap fixture | Controlled spark test | TBD | Must guard HV secondary. |
| Dummy load | Low-energy discharge tests | TBD | Define before SCR full-energy tests. |

## Promotion Gate

A candidate can become `Selected for prototype` only after:

1. Requirement fields are filled from datasheets or measurements.
2. Fault behavior is understood enough for bench.
3. Required protection parts are identified.
4. Test method exists for the stress that matters.
5. It fits the current block design.

Prototype selection is not production selection.

## v0.1 Conclusion

The next real component work should populate this matrix from datasheets after charger-control and Vcap-measurement directions are stable. The matrix should remain conservative: unknown pulse, thermal, voltage, or fault behavior is a reason to slow down, not a reason to guess.
