# SCR Discharge Research

Status: targeted research brief. This is not a schematic and does not select final part numbers.

## Research Goal

The v0.1 power-stage architecture uses an SCR as the first discharge switch candidate. This note captures what must be true for an SCR CDI discharge stage to be credible for this project.

Target project context:

- Older carbureted single-cylinder motorcycles.
- 2-stroke engines under 200cc first.
- CDI coil output, not TCI low-side coil driving.
- Vcap target range: 250V / 300V / 350V.
- First bench energy point: about 1.0 uF at 300V, or about 45 mJ stored.
- Engine testing blocked until bench validation exists.

## Baseline SCR CDI Concept

Classic SCR CDI discharge path:

```text
HV Charger
  -> HV Capacitor charged to Vcap
  -> SCR anode
  -> SCR cathode / return path
  -> CDI ignition coil primary
  -> discharge current pulse
```

The controller does not directly shape the spark by holding the SCR on. It sends a trigger pulse to the SCR gate. After triggering, the SCR latches while discharge current is above its latching/holding requirement, then turns off when the discharge current naturally falls below holding current.

Implication: SCR CDI is simple and realistic for v0.1, but the controller cannot turn the discharge off mid-pulse like an IGBT.

## Parameters That Matter

Do not choose SCR by voltage rating alone. For CDI discharge, the important parameters are:

- Repetitive off-state voltage rating: must exceed maximum Vcap plus transients.
- Non-repetitive surge current rating: must survive capacitor discharge pulses.
- Repetitive peak current and thermal behavior: must survive repeated sparks at high RPM.
- I2t rating: useful for comparing pulse stress, if pulse shape is known.
- Gate trigger current and gate trigger voltage: must match the trigger driver with margin.
- Latching current: gate pulse must last long enough for anode current to latch.
- Holding current: discharge path must naturally fall below this so SCR turns off.
- Critical dV/dt: must avoid false triggering from fast voltage edges and ignition noise.
- Commutated dV/dt / turn-off behavior: must tolerate the discharge waveform and recharge behavior.
- Junction temperature and package thermal impedance: repeated pulse operation can heat the die even when average current looks small.

## Gate Trigger Direction

The SCR gate should be treated as a power-stage input, not a bare MCU GPIO destination.

v0.1 trigger requirements:

- Provide gate current above SCR trigger-current requirement with margin.
- Keep gate pulse long enough for anode current to exceed latching current.
- Add gate-cathode resistor or defined bias so the gate cannot float.
- Protect trigger path from HV and ignition noise.
- Default state must be no-trigger during reset, boot, brownout, and firmware update.
- A disconnected controller cable must not trigger discharge.

Candidate trigger methods:

- Optocoupler driving SCR gate network.
- Pulse transformer trigger, if pulse energy and isolation needs justify it.
- Non-isolated transistor driver only for low-voltage early bench experiments.

Do not connect MCU pin directly to SCR gate in the final architecture.

## False Trigger Risks

SCR false triggering is a major CDI risk because the system contains fast HV edges and ignition noise.

False trigger sources:

- High dV/dt across SCR anode-cathode.
- Capacitive coupling into the gate.
- Floating gate node.
- Coil secondary noise coupling into primary or trigger wiring.
- Poor PCB return path.
- Long trigger cable between controller and power board.
- Charger switching noise.
- Vcap recharge transient after a discharge.

Mitigation candidates:

- Gate-cathode resistor.
- Short gate loop area.
- Shielded or tightly routed trigger path.
- RC snubber across SCR or discharge path, if bench waveforms require it.
- Physical separation between HV discharge loop and low-voltage trigger logic.
- Trigger isolation between controller and power board.
- Keep SCR gate driver reference local to SCR cathode/return strategy.

Snubber values cannot be guessed from paper alone. They must be tuned from bench waveforms because too much snubbing can waste energy, distort the discharge pulse, or stress parts differently.

## Current Stress Reality

Stored energy looks modest, but peak discharge current can still be high.

Example stored energy:

```text
E = 0.5 * C * V^2
C = 1.0 uF
V = 300V
E = 45 mJ
```

This does not imply a low-current event. Peak current depends on capacitor ESR/ESL, SCR dynamic behavior, CDI coil primary impedance, wiring inductance, and spark condition. The pulse can be short and high-current while average power remains moderate.

Design implication:

- Need oscilloscope current measurement plan before claiming SCR margin.
- Need repeated-pulse testing, not one-shot spark testing only.
- Need temperature observation during simulated high RPM operation.

## Turn-Off And Recharge Behavior

SCR turn-off depends on current falling below holding current after the discharge pulse. In CDI, the LC discharge path normally commutates naturally, but this must be proven on bench.

Bench checks required:

- SCR turns off after each discharge.
- Charger recharge does not accidentally keep or retrigger SCR conduction.
- Vcap recovers normally after discharge.
- SCR does not false-trigger while Vcap is charging.
- SCR does not false-trigger when pickup/trigger wiring is noisy.

If SCR fails to turn off or false-triggers during recharge, the layout, trigger network, snubbering, SCR selection, or grounding strategy is wrong.

## Bench Validation Plan For SCR Stage

Do not start at full 300V discharge into an ignition coil.

Recommended sequence:

1. Gate driver low-voltage test with SCR or equivalent test load.
2. Verify default no-trigger state during reset and power cycling.
3. Verify trigger pulse width and gate current with scope.
4. Low-energy capacitor discharge into safe dummy load.
5. Check SCR latching and turn-off behavior.
6. Increase Vcap in controlled steps.
7. Add CDI coil only after dummy-load behavior is understood.
8. Measure anode-cathode voltage waveform.
9. Measure discharge current with suitable probe or current shunt designed for pulse work.
10. Check false trigger immunity with charger switching active.
11. Repeat discharge at 6,000, 12,000, and 16,000 RPM equivalent spark rates.
12. Log Vcap before discharge, after discharge, and before next scheduled spark.

Hard stop conditions:

- SCR triggers without command.
- SCR stays conducting after discharge.
- Gate network overheats.
- Vcap measurement becomes invalid during discharge.
- Charger cannot recover Vcap before next spark at target RPM.
- Any bench setup cannot prove capacitor is discharged before handling.

## Schematic Requirements Before First PCB

The first real schematic must include:

- SCR with voltage, surge current, dV/dt, gate trigger, and package notes.
- Gate driver network.
- Gate-cathode bias resistor.
- Trigger input protection or isolation.
- HV capacitor discharge loop kept physically short.
- Vcap divider protected from discharge noise.
- Bleeder or controlled discharge path.
- HV test point strategy.
- Measurement points for gate pulse, SCR anode/cathode, Vcap, and discharge current.
- Clear separation between controller logic, charger switching loop, and discharge loop.

## Candidate Datasheet Checklist

When reviewing candidate SCRs, capture these fields in a table:

| Field | Why It Matters |
| --- | --- |
| VDRM / VRRM | Must exceed Vcap and transient margin. |
| ITSM | One-shot surge current survival clue. |
| I2t | Pulse stress comparison if pulse shape is known. |
| IGT / VGT | Gate driver sizing. |
| IL | Gate pulse duration and latching behavior. |
| IH | Natural turn-off behavior after discharge. |
| dV/dt | False-trigger immunity. |
| tq / turn-off data | Recharge and commutation margin. |
| Tj max | Thermal safety margin. |
| Package | Thermal and layout practicality. |
| Automotive / ruggedness notes | Useful for motorcycle electrical environment. |

## Practical v0.1 Direction

Use SCR for the first discharge prototype if research finds a candidate with:

- Voltage rating comfortably above 350V Vcap plus margin.
- Repetitive pulse behavior credible for 12,000 to 16,000 RPM equivalent testing.
- Gate trigger requirements compatible with an isolated or protected trigger driver.
- dV/dt immunity high enough or snubberable in a noisy ignition layout.
- Package that can be mounted and probed safely on a bench fixture.

Avoid:

- Tiny SCRs selected only because voltage rating is high.
- Random CDI scooter schematic values copied without pulse-current proof.
- Direct MCU gate drive.
- No gate-cathode bias.
- No Vcap measurement.
- No way to measure discharge current.

## References To Recheck During Part Selection

- STMicroelectronics, `AN2703 SCRs in AC circuits`. Useful for SCR parameter interpretation, turn-off behavior, dV/dt, and datasheet reading even though the application examples are AC-oriented.
- STMicroelectronics, `AN4608 SCRs in automotive applications`. Useful for automotive-style SCR concerns and harsh electrical environment framing.
- onsemi technical documentation / thyristor handbook material. Useful for general thyristor operation, ratings, and application behavior.
- Candidate SCR datasheets from ST, Littelfuse, WeEn/Nexperia, Vishay, or other reputable semiconductor vendors.

Use vendor datasheets and application notes over hobby CDI diagrams when selecting parts.

## Research Conclusion

SCR remains the right v0.1 discharge baseline because it matches classic CDI behavior and keeps the first discharge stage simpler than IGBT. The risk is not conceptual; the risk is underestimating pulse current, false triggering, turn-off behavior, and layout noise.

Next research should focus on HV pulse capacitors because capacitor construction and pulse rating directly determine SCR stress and discharge waveform.
