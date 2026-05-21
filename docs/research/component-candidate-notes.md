# Component Candidate Notes

Status: research notes for populating `docs/10-component-candidate-matrix.md`. This is not a BOM and does not select final part numbers.

## Scope

This note records the first real candidate families for the safest next component work:

- HV CDI storage capacitor candidates.
- SCR discharge candidates.
- Vcap divider resistor strategy.

The goal is to reduce blank-sheet uncertainty before schematic work while keeping every candidate at `Research only` status.

## HV Capacitor Candidate Direction

Primary requirement:

- Pulse-rated polypropylene film capacitor.
- 0.68 uF, 1.0 uF, and 1.5 uF values for comparison.
- 630VDC-class research first where size allows.
- Datasheet must expose pulse-relevant ratings such as dV/dt, peak current, RMS/ripple current, dissipation factor, temperature, and package limits.

Candidate families to research:

| Vendor | Family Direction | Why It Is Interesting | Main Risk |
| --- | --- | --- | --- |
| Cornell Dubilier | 940C / 942C pulse polypropylene | High-current pulse film families; axial packages are useful for bench fixtures. | Large size and less PCB-compact mounting. |
| KEMET / YAGEO | R76 / pulse MKP class | Radial boxed polypropylene candidates may fit PCB prototype better. | Exact pulse ratings vary by value and voltage. |
| TDK / EPCOS | B3265x / B3267x pulse MKP class | TDK catalog includes polypropylene film capacitors for snubber, resonant, energy storage, and ignition-related applications. | Need exact type filtering; not every film capacitor is a CDI discharge capacitor. |
| WIMA | FKP1 / MKP10 class | Known pulse-oriented polypropylene families. | Larger lead spacing/package may affect first PCB. |
| Vishay | MKP pulse / snubber class | Good vendor comparison source. | Exact series and availability must be checked. |

Immediate rejection direction:

- Electrolytic as the main CDI discharge capacitor.
- Ceramic as the main CDI discharge capacitor.
- Generic film capacitor with no pulse, dV/dt, or RMS current data.
- Compact 400V part used at 350V target without overshoot/ringing margin.

## SCR Candidate Direction

Primary requirement:

- 600V to 800V class SCR candidates first.
- TO-220 or larger bench-friendly package preferred.
- Gate current must be compatible with isolated or protected trigger driver.
- dV/dt immunity and false-trigger behavior must be tested.
- Surge and repetitive pulse behavior matter more than average current.

Candidate families to research:

| Vendor | Family Direction | Why It Is Interesting | Main Risk |
| --- | --- | --- | --- |
| STMicroelectronics | TYN / TN 600V to 800V class | Common SCR families with useful datasheets and application notes. | Exact gate sensitivity and surge rating must be matched. |
| Littelfuse | Sx010L / Sx012L class | Common TO-220 SCR families with distributor availability. | Need exact dV/dt, IGT, and repetitive pulse validation. |
| WeEn / Nexperia | BT151 / BT152 class | Widely available SCR family direction. | Variant suffixes matter; gate sensitivity and dV/dt differ. |
| Vishay | VS-xxTTS08 / phase-control discrete class | Larger rugged comparison for bench margin. | May be physically larger or overkill for production direction. |

Immediate rejection direction:

- Tiny TO-92 SCR as full-energy CDI discharge switch.
- SCR selected only by voltage rating.
- SCR with unclear surge current data.
- Any SCR gate driven directly by MCU GPIO.

## Vcap Divider Strategy

Measurement target:

- Normal Vcap max target: 350V.
- Measurement design max for first calculations: 450V.
- ADC class assumed for first-pass math: 0V to 3.3V.
- Required ratio for 450V into 3.3V is at least 136.4:1.

Candidate divider ratios:

| Candidate | Approx Ratio | 350V ADC Output | 450V ADC Output | Direction |
| --- | ---: | ---: | ---: | --- |
| 4x 390k + 10k | 157:1 | 2.23V | 2.87V | Good first bench balance. |
| 5x 470k + 15k | 157.7:1 | 2.22V | 2.85V | Lower current with still reasonable low-side impedance. |
| 4x 1M + 27k | 149.1:1 | 2.35V | 3.02V | Lower bleed loss, more ADC settling concern. |
| 5x 1M + 33k | 152.5:1 | 2.30V | 2.95V | Very low current, may need buffer or slow ADC sampling. |

Divider power sanity check:

| Candidate | Current At 350V | Total Power At 350V | Current At 450V | Total Power At 450V |
| --- | ---: | ---: | ---: | ---: |
| 4x 390k + 10k | 0.223 mA | 78 mW | 0.287 mA | 129 mW |
| 5x 470k + 15k | 0.148 mA | 52 mW | 0.190 mA | 86 mW |
| 4x 1M + 27k | 0.087 mA | 30 mW | 0.112 mA | 50 mW |
| 5x 1M + 33k | 0.070 mA | 24 mW | 0.089 mA | 40 mW |

These are total divider values. Individual resistor voltage rating and power rating still matter more than total-chain power.

Important notes:

- Use multiple series high-side resistors for voltage rating, heat distribution, and creepage.
- Verify individual resistor voltage rating; do not assume any 0603/0805 resistor can sit on an HV node.
- The divider is not the main bleeder. Use a separate safe-discharge path.
- Add ADC series resistance, RC filtering, and clamp protection.
- Validate divider reading with an external HV meter before SCR full-energy tests.

Resistor family directions to research:

- Vishay VR25 / VR37 class high-voltage resistors.
- KOA Speer HV resistor families.
- Ohmite Slim-Mox class high-voltage resistors.
- TE Connectivity / YAGEO high-voltage resistor families.

Do not lock resistor footprint until voltage rating, tolerance, temperature coefficient, package creepage, and ADC sampling behavior are checked together.

## Next Datasheet Fields To Fill

HV capacitor rows need:

- Exact series datasheet URL.
- Exact value and voltage ordering code.
- dV/dt.
- Peak current.
- RMS/ripple current.
- Dissipation factor or ESR clue.
- Temperature rating.
- Lead spacing and package dimensions.

SCR rows need:

- Exact part number.
- VDRM / VRRM.
- ITSM and I2t.
- IGT / VGT.
- Latching and holding current.
- dV/dt.
- Package thermal data.

Vcap divider rows need:

- Exact resistor family and package.
- Voltage rating per resistor.
- Tolerance and tempco.
- Power at 350V and 450V.
- ADC input impedance and sampling time compatibility.
- Protection clamp current under fault cases.

## Source Pointers Checked

Research source pointers checked during this pass:

- TDK film capacitor catalog page: confirms polypropylene film options, 630V class options, and film capacitor use in energy storage, snubber/resonant, power supply, and ignition-system contexts.
- Cornell Dubilier 940C / 942C datasheet PDFs: fetched as raw PDF data; exact dV/dt and current rows still need manual datasheet extraction before candidate promotion.
- Vishay thyristor catalog page: confirms discrete thyristor families, voltage categories including 601V to 1000V and above 1000V, and TO-220 / TO-247 / TO-263 package categories.
- Vendor SCR pages from ST and Littelfuse changed or returned 404 from direct URLs; use vendor product search or distributor datasheet links during exact part-number pass.
- High-voltage resistor vendor pages were not consistently fetchable; use exact resistor datasheets during divider schematic pass.

Do not treat these source pointers as complete datasheet verification. They only justify candidate-family inclusion.

## Conclusion

The safest next component path is not the flyback transformer yet. First, verify a pulse capacitor family, an SCR family, and a conservative Vcap divider strategy. These three choices define the discharge energy, discharge stress, and measurement safety needed before charger component selection becomes meaningful.
