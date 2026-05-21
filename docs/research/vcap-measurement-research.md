# Vcap Measurement Research

Status: targeted research brief. This is not a final divider design, ADC design, isolation decision, or calibration procedure.

## Research Goal

Vcap measurement is mandatory for this DC-CDI. The controller must know whether the storage capacitor is charged, undercharged, overcharged, or unsafe before discharge and before handling.

Project context:

- Selectable Vcap targets: 250V, 300V, and 350V.
- First bench point: 1.0 uF at 300V, about 45 mJ stored.
- SCR discharge baseline.
- Flyback-style charger baseline.
- Motorcycle electrical noise expected.
- Engine testing blocked until Vcap behavior is measured on bench.

## Required Behaviors

Minimum Vcap behavior:

- Detect Vcap before allowing discharge.
- Stop charger at selected target.
- Detect charger overvoltage.
- Detect charger timeout or slow charge.
- Detect undervoltage before spark.
- Detect missing, stuck, or implausible feedback.
- Confirm safe discharge after power-off or test stop.
- Log Vcap during RPM-equivalent repeated discharge tests.

Vcap measurement is a safety function and an energy-control function. Treat it as part of the power stage, not as optional telemetry.

## Measurement Architecture Candidates

### Direct High-Impedance Divider To ADC

Baseline candidate for first bench prototype if layout and protection are controlled.

Pros:

- Simple.
- Low cost.
- Easy to calibrate and log.
- Directly supports firmware thresholds.

Cons:

- Connects HV domain to low-voltage measurement path.
- Requires careful resistor voltage rating and creepage.
- ADC input must survive faults and transients.
- Divider response time and impedance interact with ADC sampling.

Use for early bench if the board has safe probing, clear HV spacing, and conservative protection.

### Isolated Analog Measurement

Candidate for later if grounding/noise or safety needs justify it.

Pros:

- Better domain separation.
- Can reduce fault propagation from HV to controller.

Cons:

- More complex.
- Adds calibration and bandwidth questions.
- May not be necessary for first controlled bench board.

Use when direct divider noise, grounding, or safety tests fail, or if product isolation requirements become explicit.

### Comparator Thresholds Plus ADC

Candidate enhancement.

Pros:

- Hardware overvoltage or ready thresholds can act faster than firmware.
- ADC still supports logging and calibration.

Cons:

- More parts and thresholds.
- Comparator input protection still required.

Use when charger stop or fault behavior should not depend only on firmware polling.

## Divider Design Requirements

Do not choose divider resistors from ratio alone.

Required fields:

| Field | Why It Matters |
| --- | --- |
| Ratio | Maps 350V plus margin into ADC range. |
| High-side resistor voltage rating | Each resistor must survive applied voltage. |
| Total resistance | Sets divider current, heating, noise, and bleed contribution. |
| Tolerance | Vcap accuracy and threshold error. |
| Temperature coefficient | Threshold drift in hot enclosure. |
| Power rating | Continuous stress at high Vcap. |
| Creepage/clearance | HV reliability and safety. |
| ADC source impedance | Sampling accuracy and settling. |
| RC filter value | Noise rejection vs response time. |
| Clamp/protection | ADC survival under faults. |

Use multiple series high-side resistors unless a single resistor is explicitly rated for the voltage and layout stress. Series resistors also spread heat and improve creepage placement.

## Ratio Direction

The divider must measure normal targets and fault margin above them.

Direction:

- Normal target max: 350V.
- Fault margin: measure above 350V, exact value TBD.
- ADC full-scale must not be reached during normal overshoot.
- Firmware thresholds must include divider tolerance and ADC tolerance.

Example only, not final:

```text
If ADC range is 0V to 3.3V and measurement max is 450V:
required divider ratio is at least 450 / 3.3 = 136.4:1
```

This math does not select values. Real values must account for resistor voltage rating, ADC source impedance, protection clamp current, response time, and calibration.

## Response Time Direction

Vcap changes in three relevant ways:

- Slow charging ramp from charger.
- Fast discharge during SCR event.
- Recovery ramp between sparks.

The measurement path does not need to capture the full SCR discharge waveform with ADC sampling, but it must support:

- Accurate pre-discharge Vcap.
- Accurate charger stop decision.
- Recovery trend between simulated sparks.
- Safe handling confirmation after bleeder discharge.

Do not over-filter the divider so much that charger overshoot is hidden. Do not under-filter it so much that ignition noise causes false overvoltage or undervoltage decisions.

## ADC Protection Direction

ADC protection must assume wiring and component faults.

Protection candidates:

- Series resistor into ADC pin.
- RC low-pass near ADC.
- Clamp to ADC reference or rail through controlled current path.
- External low-leakage clamp device.
- ADC buffer if source impedance is too high.

Fault cases to consider:

- Open high-side resistor.
- Open low-side resistor.
- Shorted low-side resistor.
- ADC pin disconnected.
- ADC pin clamped by ESD structure.
- HV transient coupled into divider trace.
- Moisture or contamination reducing surface resistance.

The safe failure direction should be charger disabled and no discharge, not optimistic Vcap ready.

## Calibration Direction

Calibration must be simple enough for bench and production later.

Minimum calibration data:

- ADC zero offset.
- Divider scale factor.
- Reference voltage assumption or measured reference.
- Threshold table for 250V, 300V, and 350V targets.

Bench calibration sequence:

1. Verify divider output at 0V.
2. Apply known low HV value from safe supply if available.
3. Compare Vcap ADC reading with external HV meter at 100V, 200V, 300V, and 350V if equipment allows.
4. Record measured scale factor.
5. Verify overvoltage threshold below unsafe bench limit.
6. Verify safe discharge reading after bleeder action.

Production calibration may later be reduced to resistor tolerance plus reference tolerance, but bench v0.1 should measure actual error.

## Firmware Threshold Requirements

Firmware should treat Vcap as a state input.

Useful threshold categories:

| Category | Meaning | Action |
| --- | --- | --- |
| Below safe handling threshold | HV mostly discharged | Handling may proceed after procedure |
| Below spark threshold | Not enough energy | Inhibit discharge or log weak-spark fault |
| Charge restart threshold | Vcap low enough to top up | Enable charger if allowed |
| Target threshold | Desired Vcap reached | Stop charger |
| Overvoltage threshold | Charger fault or overshoot | Disable charger and latch fault |
| Implausible reading | Sensor fault | Disable charger and discharge |

Thresholds must account for ADC noise, divider tolerance, response time, and charger overshoot.

## Grounding And Layout Risks

Vcap measurement is vulnerable because it connects a high-voltage node to low-voltage logic.

Layout direction:

- Put high-side divider near HV capacitor sense point, not near SCR gate routing.
- Keep divider trace away from discharge loop.
- Keep ADC-side filter close to ADC or measurement input.
- Maintain HV creepage and clearance around top divider nodes.
- Add guard/slotting only after manufacturability is understood.
- Do not share pickup signal return with noisy charger or discharge current return.

Measurement ground must be defined with the overall power-board grounding plan. Accidental chassis return assumptions are not acceptable for v0.1.

## Bench Validation Plan

Recommended Vcap measurement test sequence:

1. Validate divider resistance and soldering before HV.
2. Apply low voltage and verify divider ratio with DMM.
3. Connect ADC path and verify raw counts at low voltage.
4. Increase Vcap in steps and compare against external HV meter.
5. Verify charger stops at target using measured Vcap.
6. Verify charger timeout if Vcap does not rise.
7. Verify overvoltage fault by lowering threshold during bench test.
8. Verify safe discharge indication after bleeder.
9. Run repeated charge/discharge and log Vcap before each simulated spark.
10. Inject divider fault simulations where safe.

Hard stop conditions:

- ADC reading decreases while real Vcap increases.
- Divider output exceeds ADC safe range.
- Vcap reading is noisy enough to cause false charger stop/start.
- Charger overshoot is hidden by measurement filtering.
- Divider resistor heats unexpectedly.
- Safe handling threshold cannot be verified with external meter.
- Fault injection can produce false ready state.

## Candidate Table Template

Use this table during measurement design:

| Candidate | Divider Ratio | Total Resistance | Max Measured Vcap | ADC Range | Filter | Protection | Notes |
| --- | ---: | ---: | ---: | ---: | --- | --- | --- |
| TBD | TBD | TBD | TBD | TBD | TBD | TBD | Research only |
| TBD | TBD | TBD | TBD | TBD | TBD | TBD | Research only |

Do not promote a divider to schematic until resistor voltage ratings, ADC protection, response time, and bench calibration method are defined.

## Research Conclusion

The first Vcap measurement path should be a conservative high-impedance divider with ADC filtering and explicit input protection, unless isolation requirements become clear before hardware. It must support charger termination, overvoltage detection, undervoltage-before-spark detection, and safe-discharge confirmation. Vcap measurement should be validated before SCR discharge tests at meaningful energy.
