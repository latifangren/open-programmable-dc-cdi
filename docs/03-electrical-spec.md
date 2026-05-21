# Electrical Specification

Status: draft targets. Values below are starting points for design and bench tests, not final production limits.

## Target System

| Item | Draft Target | Notes |
|---|---:|---|
| Nominal input voltage | 12V battery system | Motorcycle/small-engine DC system target. |
| Operating input voltage | 9V to 16V | Must be validated during cranking and charging tests. |
| Transient tolerance | TBD | Use automotive transient standards as test references later. |
| HV capacitor voltage, Vcap | 250V / 300V / 350V selectable | Exact range depends on coil, capacitor, and test results. |
| Spark energy target | 30 mJ to 80 mJ draft range | Must be proven on bench before engine test. |
| Maximum RPM target | 12,000 RPM initial, 20,000 RPM stretch | Single-cylinder timing budget first. |
| Engine target | Single-cylinder 2T under 200cc first | 4T support remains future-compatible, not the first validation target. |
| Pickup type | VR / Hall / pulser input supported by conditioner | Raw GPIO/ADC input is not a production target. |
| Ignition coil type | CDI ignition coil | Not a 12V inductive TCI coil. |
| Discharge switch | SCR or IGBT class, TBD | No part number selected. |
| Controller timing core | TBD | Hardware timer capture/compare is required. |

## Spark Energy Formula

Stored capacitor energy:

```text
E = 0.5 * C * V^2
```

Example for reasoning only:

```text
C = 1 uF
V = 300V
E = 0.5 * 0.000001 * 300^2
E = 45 mJ
```

This does not guarantee spark energy at the plug. Real output depends on capacitor type, discharge path, coil, wiring, plug gap, and losses.

## CDI Power Core Requirements

The final system must include:

- HV charger from 12V input to target Vcap.
- HV capacitor rated for repetitive discharge duty.
- Vcap measurement path.
- SCR/IGBT discharge stage with safe trigger behavior.
- CDI ignition coil output.
- Bleeder and controlled discharge path.
- Fault detection for invalid Vcap, timeout, and unexpected trigger state.

## Open Decisions

- Exact target engine and max RPM.
- Final Vcap range.
- Final capacitor value and energy target.
- VR/Hall/pulser input priority.
- Controller MCU and firmware framework.
- Isolation strategy between controller and power board.
- Bench load and spark tester design.
