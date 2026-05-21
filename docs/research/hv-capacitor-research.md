# HV Capacitor Research

Status: targeted research brief. This is not a BOM and does not select final capacitor part numbers.

## Research Goal

The CDI storage capacitor is not a generic decoupling capacitor. It is repeatedly charged to hundreds of volts and discharged as a short, high-current pulse through an SCR and CDI ignition coil.

This note defines what the first capacitor candidates must satisfy before schematic and bench work.

Project context:

- Older carbureted single-cylinder motorcycles.
- 2-stroke engines under 200cc first.
- Vcap targets: 250V / 300V / 350V selectable.
- First bench point: 1.0 uF at 300V, about 45 mJ stored.
- Draft stored-energy range: 30 mJ to 80 mJ.
- SCR discharge baseline.
- Engine testing blocked until bench validation exists.

## Energy Targets

Stored capacitor energy:

```text
E = 0.5 * C * V^2
```

Candidate energy table:

| Capacitor | 250V | 300V | 350V |
| ---: | ---: | ---: | ---: |
| 0.47 uF | 14.7 mJ | 21.2 mJ | 28.8 mJ |
| 0.68 uF | 21.3 mJ | 30.6 mJ | 41.7 mJ |
| 1.0 uF | 31.3 mJ | 45.0 mJ | 61.3 mJ |
| 1.5 uF | 46.9 mJ | 67.5 mJ | 91.9 mJ |

v0.1 direction:

- Use 1.0 uF at 300V as first bench reference.
- Keep 0.68 uF and 1.5 uF as comparison values.
- Do not chase maximum energy first. Prove safe repeatable discharge first.

## Capacitor Type Direction

Recommended direction for CDI storage:

- Metallized polypropylene film or pulse-rated polypropylene film first.
- Consider film/foil polypropylene if pulse current requirements demand it.
- Avoid electrolytic capacitors for the discharge capacitor.
- Avoid ceramic capacitors as main discharge energy storage.
- Avoid generic polyester film unless the datasheet explicitly supports required pulse stress.

Why polypropylene film first:

- Better pulse behavior than many general-purpose capacitor types.
- Low dielectric loss compared with many alternatives.
- Commonly used in pulse, snubber, resonant, and discharge applications.
- Available in high-voltage values around the target range.

Reality check: “film capacitor” is not enough. The exact series construction and pulse ratings matter.

## Datasheet Parameters That Matter

Do not choose by capacitance and voltage alone.

Required fields to collect for each candidate:

| Field | Why It Matters |
| --- | --- |
| Capacitance tolerance | Energy variation and timing behavior. |
| Rated DC voltage | Must exceed Vcap with margin. |
| Surge / peak voltage rating | Handles overshoot and ringing. |
| dV/dt rating | Converts to peak pulse current capability. |
| Peak current rating | Directly relevant to SCR discharge stress. |
| RMS current / ripple current | Repeated high-RPM pulse heating clue. |
| ESR | Heating and discharge waveform. |
| ESL | Ringing and peak current behavior. |
| Dissipation factor / tan delta | Losses during repeated operation. |
| Self-healing behavior | Failure behavior and pulse aging. |
| Lifetime vs temperature/voltage | Motorcycle heat and long-run reliability. |
| Operating temperature | Under-seat/enclosure heat margin. |
| Lead spacing and lead style | Discharge loop inductance and vibration. |
| Package size | PCB spacing, creepage, mounting. |
| Pulse application note | Evidence it is intended for pulse stress. |

If the datasheet does not give pulse current, dV/dt, RMS current, or application category, treat the part as suspicious for CDI discharge.

## dV/dt And Peak Current

For a capacitor:

```text
I = C * dV/dt
```

This means a capacitor datasheet dV/dt rating can imply peak current capability.

Example reasoning:

```text
C = 1.0 uF
dV/dt rating = 100 V/us
I = 1.0 uF * 100 V/us
I = 100 A
```

This example is only math. Real acceptability still depends on pulse duration, repetition rate, heating, lead construction, and vendor rating conditions.

Design implication:

- CDI capacitor candidates need credible pulse current margin.
- SCR current stress and capacitor pulse current must be evaluated together.
- Bench current waveform is required before final selection.

## Voltage Rating Direction

Target Vcap is selectable up to 350V.

v0.1 voltage direction:

- Research 400VDC parts only if pulse rating and margin are clearly strong.
- Prefer researching 630VDC class parts for early bench margin where size allows.
- Do not assume a 400VDC label is enough for 350V CDI use.
- Account for charger overshoot, ringing, and measurement tolerance.

Practical note: a physically larger 630V pulse film capacitor may be better for the first bench fixture than a compact marginal 400V part.

## Repetition Rate And Heating

2-stroke single-cylinder spark rate:

- 12,000 RPM = 200 sparks/s.
- 16,000 RPM = 266.7 sparks/s.
- 20,000 RPM = 333.3 sparks/s.

At 1.0 uF and 300V:

- Stored energy is about 45 mJ.
- Stored energy throughput at 12,000 RPM is about 9 W.
- Stored energy throughput at 16,000 RPM is about 12 W.
- Stored energy throughput at 20,000 RPM is about 15 W.

Not all stored energy becomes capacitor heat, but repeated pulse current and ESR losses can heat the capacitor. One-shot spark tests do not prove high-RPM reliability.

Bench must check:

- Capacitor temperature rise during repeated discharge.
- Capacitance drift after repeated pulses.
- Vcap recovery consistency.
- Physical or acoustic signs of stress.
- Any bulging, cracking, lead heating, or package discoloration.

## Mechanical And Layout Requirements

The capacitor is part of the HV discharge loop. Mechanical and layout choices affect current, ringing, noise, and survival.

Requirements:

- Keep capacitor-to-SCR-to-coil primary discharge loop short.
- Use wide, low-inductance paths for pulse current.
- Keep Vcap sensing away from the high-current loop.
- Provide mechanical support against vibration.
- Keep creepage/clearance appropriate for HV nodes.
- Do not route low-voltage trigger traces through the discharge loop.
- Mark polarity only if the selected capacitor is polarized; preferred film types should be non-polar.

Mounting notes:

- Radial box film capacitors are PCB-friendly but need vibration support if large.
- Axial pulse capacitors may be easier for prototype fixtures but less PCB-compact.
- The first bench version may prioritize safe probing and mechanical robustness over size.

## Failure Modes

Possible capacitor-related failures:

- Capacitance too low: weak spark or unstable energy.
- Capacitance too high: charger cannot recover Vcap at RPM target.
- Voltage rating too low: dielectric stress or failure.
- Pulse current rating too low: heating, drift, internal damage.
- ESR too high: heating and lower delivered pulse.
- ESL too high: ringing and EMI.
- Poor mounting: cracked leads under vibration.
- Wrong capacitor type: unpredictable lifetime or unsafe failure behavior.

System-level mitigations:

- Vcap measurement.
- Charger timeout.
- Overvoltage cut-off.
- Bench temperature checks.
- Repeated discharge tests.
- Conservative first energy target.

## Bench Validation Plan

Recommended capacitor test sequence:

1. Measure capacitance before installation.
2. Charge to low voltage first and verify Vcap measurement.
3. Validate bleeder discharge time.
4. Discharge into safe dummy load at low Vcap.
5. Increase Vcap in controlled steps.
6. Record Vcap before and after discharge.
7. Record discharge current waveform if equipment allows.
8. Run repeated discharge at 6,000 RPM equivalent.
9. Run repeated discharge at 12,000 RPM equivalent.
10. Run 16,000 RPM equivalent only after lower-rate tests pass.
11. Measure capacitor temperature rise.
12. Re-measure capacitance after testing.

Hard stop conditions:

- Capacitor temperature rises unexpectedly.
- Capacitance shifts meaningfully after short tests.
- Audible or visible package stress appears.
- Vcap waveform shows uncontrolled overshoot or ringing.
- Charger cannot recover Vcap before next spark at target RPM.
- Safe discharge procedure cannot prove Vcap is low before handling.

## Candidate Selection Table Template

Use this table during part research:

| Vendor | Series | C | VDC | dV/dt | Peak Current | RMS Current | ESR/DF | Temp | Package | Notes |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| TBD | TBD | 0.68 uF | TBD | TBD | TBD | TBD | TBD | TBD | TBD | Research only |
| TBD | TBD | 1.0 uF | TBD | TBD | TBD | TBD | TBD | TBD | TBD | Research only |
| TBD | TBD | 1.5 uF | TBD | TBD | TBD | TBD | TBD | TBD | TBD | Research only |

Do not promote any row to design selection until the datasheet has pulse-relevant ratings and bench test requirements are defined.

## References To Recheck During Part Selection

Use vendor technical material and datasheets, not hobby CDI diagrams, for capacitor selection.

Reference sources to recheck:

- TDK / EPCOS film capacitor general technical information.
- KEMET / YAGEO film capacitor technical resources.
- Vishay film capacitor general technical information.
- Cornell Dubilier / Illinois Capacitor power film capacitor resources.
- Candidate datasheets for polypropylene pulse, snubber, resonant, or discharge film capacitors.

Vendor material should be used to confirm dV/dt, peak current, RMS current, lifetime, and mounting limitations for the exact series.

## Research Conclusion

The first CDI storage capacitor should be a pulse-rated polypropylene film capacitor, with 1.0 uF at 300V used as the first bench energy point. Final voltage rating should not be locked yet, but 630VDC-class candidates deserve early attention because the project targets selectable Vcap up to 350V and must survive overshoot, ringing, and repeated discharge.

The next research step should be flyback HV capacitor charger design, because charger sizing depends on the selected capacitance range, Vcap target, and recharge time at 12,000 to 16,000 RPM equivalent operation.
