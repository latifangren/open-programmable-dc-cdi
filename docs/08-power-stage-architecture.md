# Power Stage Architecture

Status: v0.1 architecture direction. This document chooses a baseline direction for research and bench planning, not final component part numbers.

## Purpose

The CDI Power Board must turn a 9V to 16V motorcycle battery input into controlled capacitor-discharge ignition energy.

The power board must include:

- 12V input protection.
- HV charger.
- HV capacitor.
- Vcap measurement.
- Discharge switch.
- CDI ignition coil output.
- Bleeder or safe discharge path.
- Fault behavior that fails safe.

This project must not become a TCI coil driver. The output stage is a capacitor-discharge stage for a CDI ignition coil.

## Baseline v0.1 Decision

Baseline architecture for first serious research and bench prototype:

- HV charger: flyback-style 12V-to-250V/300V/350V capacitor charger.
- Discharge switch: SCR-based discharge first.
- Energy storage: pulse-rated film capacitor, initial bench point around 1.0 uF at 300V.
- Feedback: high-impedance Vcap divider to controller ADC or isolated measurement path, exact implementation TBD.
- Trigger interface: protected controller-to-power-board trigger, isolation strategy TBD.
- Safety: hardware bleeder, charger enable control, discharge inhibit behavior, and Vcap fault detection.

Reasoning:

- The target is older carbureted single-cylinder 2-stroke motorcycles under 200cc.
- 2-stroke operation is the harder energy-throughput case because it fires every crank revolution.
- Design budget expects about 45 mJ first bench point and 12,000 RPM initial validation.
- SCR discharge is simpler and closer to classic CDI behavior than IGBT for v0.1.
- Flyback-style charging is a realistic starting point for repeatedly charging a small HV capacitor from a 12V battery system.

## Block Diagram

```text
12V Battery Input
  -> Fuse / reverse protection / transient protection
  -> EMI input filter
  -> LV regulator for power-board control circuits, if needed
  -> HV Charger Switch + Magnetics
  -> HV Rectifier
  -> HV Capacitor
       -> Vcap Divider / Measurement
       -> Bleeder / Safe Discharge Path
       -> SCR Discharge Switch
       -> CDI Ignition Coil Primary
       -> HV Return / Power Ground Strategy, TBD

Controller Board Interface
  -> Charger enable
  -> Discharge trigger command
  -> Vcap feedback
  -> Fault status
  -> Safe-state defaults
```

## HV Charger Options

### Flyback-Style Charger

Recommended baseline for v0.1 research.

Pros:

- Practical for stepping 12V battery input to 250V to 350V class output.
- Magnetics can provide useful energy transfer per cycle.
- Common pattern for small capacitor chargers and ignition-like HV supplies.
- Can be controlled by charger enable, current limit, and Vcap feedback.
- Better architecture fit than a simple non-isolated boost when voltage ratio and noise are high.

Cons:

- Requires transformer or coupled inductor design.
- Layout, snubbering, switch stress, and EMI are nontrivial.
- Needs careful Vcap regulation and charge timeout behavior.
- Magnetics selection may become one of the hardest parts.

Use when:

- Targeting 250V to 350V Vcap from 9V to 16V input.
- Need repeated recharge at 12,000 to 16,000 RPM 2-stroke spark rates.
- Need closed-loop Vcap behavior.

### Boost Converter Charger

Candidate, not baseline.

Pros:

- Conceptually simple.
- Fewer custom magnetic assumptions than flyback if using suitable inductor/controller.
- Can be regulated with Vcap feedback.

Cons:

- Very high duty cycle and switch stress for 12V to 300V class conversion.
- Diode, switch, layout, and EMI stress can become severe.
- Less attractive for robust motorcycle noise environment at this voltage ratio.

Use only if research shows a credible HV capacitor charger design that meets recharge time, stress, and EMI requirements.

### Blocking Oscillator / Simple Self-Oscillating Charger

Not recommended as primary programmable baseline.

Pros:

- Common in simple CDI circuits.
- Can be low-cost and simple.

Cons:

- Harder to control precisely.
- Harder to log, regulate, and fault-detect cleanly.
- Output can vary strongly with input voltage, load, temperature, and transformer tolerances.
- Poor fit for measured programmable Vcap targets unless redesigned with feedback and safety gates.

Use only as historical reference or emergency low-complexity experiment, not as the main architecture.

## Discharge Switch Options

### SCR Discharge

Recommended baseline for v0.1.

Pros:

- Classic CDI discharge device.
- Simple gate trigger behavior.
- Naturally latches through the high-current discharge pulse.
- Mature architecture for capacitor discharge into CDI coil primary.
- Good fit for first bench prototype and older small-engine CDI behavior.

Cons:

- Once triggered, it cannot be turned off by the controller until current falls below holding current.
- Requires correct commutation behavior from the LC discharge path.
- Gate drive must be robust against noise and false triggering.
- Repetitive surge current rating matters more than headline voltage rating.

Use when:

- First goal is reliable capacitor dump into CDI coil.
- Turn-off control is not required during the discharge pulse.
- Bench tests can validate false-trigger immunity and repetitive pulse behavior.

### IGBT Discharge

Candidate for later comparison, not baseline.

Pros:

- Controller can turn it on and off.
- Easier to implement active pulse-width experiments.
- May allow different discharge shaping options.

Cons:

- Gate drive is more complex.
- Device stress and protection need careful design.
- Overcurrent and avalanche behavior must be understood.
- It can make v0.1 harder without proving more value for basic CDI spark generation.

Use when:

- SCR bench prototype proves core requirements but later control flexibility is needed.
- A suitable gate driver and protection strategy are defined.
- Bench data justifies added complexity.

## HV Capacitor Direction

Initial candidate range from design budget:

- 0.68 uF at 300V: about 30.6 mJ stored.
- 1.0 uF at 300V: about 45.0 mJ stored.
- 1.0 uF at 350V: about 61.3 mJ stored.
- 1.5 uF at 300V: about 67.5 mJ stored.

Baseline bench point:

- 1.0 uF at 300V.

Selection requirements:

- Pulse discharge capable.
- Voltage rating above selected Vcap with safety margin.
- Low enough ESR and ESL for CDI pulse behavior.
- Repetitive discharge life suitable for engine spark rates.
- Mechanical mounting suitable for vibration.

Do not select final capacitor from capacitance and voltage alone. Pulse current rating, construction, temperature, and life matter.

## Vcap Measurement Direction

Vcap measurement is mandatory.

Minimum behavior:

- Measure before enabling discharge.
- Detect undervoltage before spark.
- Detect overvoltage and stop charger.
- Detect missing or invalid feedback.
- Log Vcap during bench RPM sweeps.

Candidate implementation:

- High-value resistor divider from HV capacitor to ADC range.
- RC filtering at ADC input.
- Clamp/protection at ADC input.
- Calibration constants in firmware.
- Divider discharge contribution included in bleeder and safety analysis.

Open decisions:

- Direct ADC divider vs isolated measurement.
- Divider impedance and response time.
- ADC input protection strategy.
- Calibration method.
- Vcap fault thresholds.

## Controller Interface Direction

The controller board should not directly touch uncontrolled HV nodes.

Interface signals to define:

- Charger enable.
- Discharge trigger.
- Vcap feedback.
- Fault status.
- Power-board ready.
- Optional power-board temperature.

Safe-state requirements:

- Disconnected trigger line must mean no discharge.
- Reset controller must mean no discharge.
- Power-board startup must mean charger disabled and discharge disabled.
- Stuck-active trigger must be detectable or physically limited.
- Firmware update mode must disable charger and discharge.

Isolation/protection candidates:

- Optocoupler trigger interface.
- Digital isolator for logic signals.
- Pulse transformer for SCR trigger, if suitable.
- Non-isolated protected interface only for early low-voltage bench work.

Do not finalize connector or isolation until grounding, measurement, and bench fixture strategy are defined.

## Input Protection Direction

Motorcycle 12V systems are noisy. The power board must assume reverse polarity, load variation, cranking sag, regulator spikes, ignition noise, and bad grounding are possible.

Required protection areas:

- Fuse or current-limited input path.
- Reverse polarity protection.
- Transient suppression.
- EMI filtering.
- Separate noisy power current paths from measurement and logic return.
- Brownout behavior that disables charger and discharge safely.

Open decisions:

- Exact transient test profile.
- TVS class and rating.
- Reverse protection style.
- Grounding and enclosure strategy.

## Bench Prototype Sequence

Do not build the full HV discharge system in one jump.

Recommended sequence:

1. Low-voltage charger-control mock with no HV output.
2. HV charger charges capacitor with discharge path disabled.
3. Vcap divider measurement validated against HV meter.
4. Charger regulation and timeout tested at 9V, 12V, and 16V input.
5. Bleeder and manual discharge procedure validated.
6. SCR trigger tested at low energy or with safe test fixture.
7. Controlled discharge into approved bench load or spark tester.
8. Repeated discharge RPM simulation at 6,000, 12,000, and 16,000 RPM equivalent.
9. Fault injection: overvoltage, undervoltage, missing Vcap, stuck trigger, charger timeout, noisy pickup.

Engine tests remain blocked until this sequence produces documented results.

## Decisions Locked For Now

- This is a real DC-CDI power stage, not TCI.
- First charger research should focus on flyback-style HV capacitor charging.
- First discharge research should focus on SCR-based capacitor discharge.
- Vcap feedback is mandatory.
- Bleeder or safe discharge path is mandatory.
- Input protection is mandatory.
- No final part numbers until architecture research and bench constraints are written.

## Open Questions

- Exact Vcap range after first charger feasibility research.
- Exact capacitor value after coil and discharge tests.
- SCR gate trigger method.
- Whether controller-to-power-board interface must be isolated in v0.1 hardware.
- HV charger controller style: discrete, PWM from MCU, or dedicated controller.
- Magnetics sourcing strategy.
- Bench spark tester or dummy load design.
- Grounding strategy between controller, power board, coil, and motorcycle chassis.
