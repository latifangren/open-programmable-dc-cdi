# Board Interface Contract

Status: draft contract. This document defines required interface behavior before schematic work. Voltage levels, connector part numbers, isolation components, and exact timing limits remain TBD until candidate hardware is selected.

## Purpose

The Controller Board and CDI Power Board must fail safe when powered separately, reset separately, or disconnected. This contract exists so firmware, low-voltage hardware, and high-voltage hardware do not drift into incompatible assumptions.

## Interface Signals

| Signal | Direction | Electrical Level | Default State | Active State | Failure Behavior |
|---|---|---|---|---|---|
| `CHARGE_EN` | Controller -> Power | TBD | Inactive | Enables charger only when power board is valid | Charger disabled when low, open, invalid, or controller reset |
| `TRIGGER_CMD` | Controller -> Power | TBD | Inactive | Time-bounded trigger command | No discharge when low, open, stuck, invalid, or during reset |
| `VCAP_FB` | Power -> Controller | Analog TBD | Invalid | Scaled HV capacitor voltage | Charger and discharge inhibited when missing or implausible |
| `FAULT_N` | Power -> Controller | TBD | Fault | OK when asserted valid | Open or invalid state treated as fault |
| `READY_N` or `READY` | Power -> Controller | TBD | Not ready | Ready only when Vcap and faults are valid | Trigger blocked when not ready |
| `GND_REF` or `ISO_BOUNDARY` | Shared or isolated | TBD | TBD | Reference for interface signals | Must be defined before HV PCB layout |

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

- Logic voltage.
- Pulse width range.
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

- Logic voltage and polarity.
- Pull-up or pull-down location.
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
