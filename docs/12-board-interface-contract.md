# Board Interface Contract

Status: draft contract with v0.2 candidate defaults. This document defines required interface behavior before schematic work. Connector part numbers, isolation components, and exact timing limits remain TBD until candidate hardware is selected.

## Purpose

The Controller Board and CDI Power Board must fail safe when powered separately, reset separately, or disconnected. This contract exists so firmware, low-voltage hardware, and high-voltage hardware do not drift into incompatible assumptions.

## v0.2 Candidate Defaults For First HV Prototype

These defaults are candidates for the first bench-learning prototype only. They are not production interface selections.

| Item | Candidate Direction | Reason | Still TBD |
|---|---|---|---|
| Interface logic class | 3.3V-compatible logic on controller side | Keeps common MCU ADC/GPIO assumptions simple for first prototype | Exact MCU, isolator, and connector |
| `CHARGE_EN` polarity | Active high | Low/open/reset can mean charger disabled | Pull value, isolator input current, local gating |
| `CHARGE_EN` default | Power-board pull-down to inactive | Cable disconnect and controller reset fail toward charger off | Pull-down value and leakage budget |
| `TRIGGER_CMD` polarity | Active-high time-bounded pulse | Avoids level-held trigger semantics | Pulse width and receiver circuit |
| `TRIGGER_CMD` candidate pulse | 100 us to 500 us logic command into trigger receiver | Long enough for bench timing visibility, short enough to discourage level-control behavior | SCR gate-driver requirements may change this |
| `FAULT_N` polarity | Active low fault line, open treated as fault | Name and behavior match fail-safe open-wire handling | Pull location and whether latching is local |
| `READY` polarity | Active high ready line, open treated as not ready | Default open state blocks trigger | Exact ready criteria |
| Vcap measurement | Direct high-side divider to protected ADC path for first bench | Matches current Vcap research direction and keeps first prototype measurable | Isolation need after noise/grounding review |
| Grounding | Shared low-voltage reference for first bench, with separated noisy returns | Simpler first bring-up than full isolation | Must be revisited before HV PCB layout |
| Trigger isolation | Pulse transformer or optocoupler preferred for HV bench | Reduces direct MCU-to-SCR coupling risk | Exact driver after SCR selection |

Open-safe behavior is mandatory even if the exact candidate changes.

## Interface Signals

| Signal | Direction | Electrical Level | Default State | Active State | Failure Behavior |
|---|---|---|---|---|---|
| `CHARGE_EN` | Controller -> Power | 3.3V-compatible candidate | Low/open | High enables charger only when power board is valid | Charger disabled when low, open, invalid, or controller reset |
| `TRIGGER_CMD` | Controller -> Power | 3.3V-compatible candidate | Low/open | Active-high pulse into trigger receiver | No discharge when low, open, stuck, invalid, or during reset |
| `VCAP_FB` | Power -> Controller | Analog 0V to 3.3V ADC class candidate | Invalid | Scaled HV capacitor voltage | Charger and discharge inhibited when missing or implausible |
| `FAULT_N` | Power -> Controller | 3.3V-compatible candidate | Low/open fault | High means no reported fault | Open or invalid state treated as fault |
| `READY` | Power -> Controller | 3.3V-compatible candidate | Low/open not ready | High means ready | Trigger blocked when low, open, or invalid |
| `GND_REF` or `ISO_BOUNDARY` | Shared or isolated | Shared LV reference candidate | TBD | Reference for interface signals | Must be defined before HV PCB layout |

## Required Safe States

- If the Controller Board is unpowered, the CDI Power Board charger is disabled and discharge trigger is inactive.
- If the CDI Power Board low-voltage supply is invalid, charger and discharge are disabled.
- If the board-to-board cable is disconnected, charger and discharge are disabled.
- If `VCAP_FB` is missing, saturated, shorted, or implausible, charger and discharge are inhibited.
- If `FAULT_N` is open or unreadable, the Controller Board treats the power board as faulted.
- If `READY` is open or unreadable, the Controller Board treats the power board as not ready.
- During controller reset, bootloader, firmware update, or watchdog recovery, `CHARGE_EN` and `TRIGGER_CMD` remain inactive.

## Trigger Command Requirements

The trigger command must not be a raw unprotected MCU pin directly driving the SCR gate.

Minimum requirements:

- Defined inactive state with hardware bias.
- Time-bounded pulse or encoded command, not a level that can create repeated discharge by itself.
- Protection or isolation suitable for the selected power-board topology.
- Rejection of floating input behavior.
- Bench-visible test point for timing verification.

Open decisions:

- Exact logic voltage after MCU and isolation choice.
- Final pulse width range after SCR gate-driver choice.
- Minimum recovery time between valid trigger commands.
- Whether trigger isolation uses optocoupler, pulse transformer, digital isolator, or local gate driver.
- Whether the power board independently blocks trigger when Vcap is invalid.

## Charger Enable Requirements

`CHARGE_EN` authorizes the power board to charge the HV capacitor. It is not proof that charging is safe by itself.

Minimum requirements:

- Inactive on controller reset and disconnect.
- Gated by power-board local fault logic where practical.
- Disabled on Vcap overvoltage, invalid Vcap feedback, undervoltage, charge timeout, and emergency stop.
- Bench-visible status indicator or test point.

Open decisions:

- Exact logic voltage after MCU and isolation choice.
- Pull-down value and location.
- Whether charger enable crosses an isolation boundary.
- Whether target Vcap is selected by discrete pins, analog reference, firmware command, or fixed bench build option.

## Vcap Feedback Requirements

`VCAP_FB` is safety-critical measurement data. It supports charger regulation, discharge authorization, overvoltage detection, and safe-handling checks.

Minimum requirements:

- Divider/protection path rated for expected HV plus margin.
- ADC input protection and filtering.
- Calibration constants documented in firmware or test report.
- External meter comparison during bench validation.
- Implausible reading fault behavior.

Open decisions:

- Exact divider ratio.
- ADC reference voltage.
- Sampling rate and filter constants.
- Allowed measurement error before trigger inhibit.
- Direct divider versus isolated measurement.

## Fault And Ready Requirements

Fault and ready lines must be readable before enabling discharge.

Minimum fault cases:

- Vcap overvoltage.
- Vcap feedback invalid.
- Charge timeout.
- Power-board undervoltage.
- Trigger input stuck or invalid, if detectable.
- Charger disabled by emergency stop or interlock.

Open decisions:

- Active-low or active-high fault polarity.
- Latched versus auto-clearing faults.
- Whether fault detail is discrete pins, serial data, blink code, or log-only for first bench.

## Grounding And Isolation

The first low-voltage bench may use non-isolated protected signals. HV bench must revisit grounding after charger, SCR, coil, and measurement topology are selected.

Questions to answer before HV PCB layout:

- Is the controller ground tied to power-board low-voltage ground?
- Where does CDI coil primary return current flow?
- Does charger switching current share any return path with pickup timing or Vcap ADC?
- Is trigger isolation required to reduce false trigger risk?
- Is Vcap measurement isolated or direct-divided?

## Connector Requirements

No connector is selected yet.

Minimum connector behavior:

- Keyed or otherwise hard to misplug.
- Current and voltage ratings suitable for signal class.
- Enough pins for separated returns if required.
- Strain relief or retention suitable for bench vibration and later motorcycle testing.
- Pinout keeps noisy or sensitive signals separated where possible.

## Acceptance Gate

Before detailed schematic work, this document must be updated with at least:

- Selected logic voltage class.
- Signal polarity.
- Pull default location.
- Trigger pulse timing candidate.
- Vcap divider candidate.
- Fault/ready polarity.
- Grounding or isolation decision for first HV prototype.
