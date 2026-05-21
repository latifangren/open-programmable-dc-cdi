# Engine Target And Design Budget

Status: v0.1 design budget. These numbers are working targets for architecture and bench planning, not final production limits.

## Target Application

Primary target:

- Older carbureted motorcycles.
- Single-cylinder engines.
- 2-stroke engines under 200cc.
- 12V battery electrical system.
- CDI ignition coil, not 12V inductive TCI coil.
- Existing pickup or pulser signal, conditioned before the MCU.

Future-compatible target:

- 4-stroke single-cylinder support through engine profiles and scheduling rules.
- Alternate pickup offsets.
- Multiple generic calibration profiles.

Explicit non-targets for the first phase:

- EFI integration.
- Fuel control.
- ECU replacement.
- CAN bus or injector control.
- Brand-specific CDI replacement with hardcoded assumptions.
- Multi-cylinder ignition.

The first useful product shape is a programmable DC-CDI that can be adapted to many older carbureted small motorcycles through wiring, pickup conditioning, and calibration profiles.

## Engine Assumptions

| Item | v0.1 Target | Notes |
| --- | ---: | --- |
| Engine cycle | 2-stroke first | Fires every crank revolution. |
| Displacement class | Under 200cc | Small motorcycle focus. |
| Cylinder count | 1 | Multi-cylinder is out of scope. |
| Fuel system | Carburetor | No EFI dependency. |
| Ignition output | 1 CDI coil | Not wasted spark multi-output. |
| Pickup input | VR/pulser first | Hall support can be added later. |
| Electrical system | 12V battery | Must tolerate cranking sag and charging variation. |

## RPM Budget

| RPM | Rev/s | 2T Spark Rate | Time Between Sparks | 4T Spark Rate | 4T Time Between Sparks |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 1,000 | 16.7 | 16.7/s | 60.0 ms | 8.3/s | 120.0 ms |
| 3,000 | 50.0 | 50.0/s | 20.0 ms | 25.0/s | 40.0 ms |
| 6,000 | 100.0 | 100.0/s | 10.0 ms | 50.0/s | 20.0 ms |
| 12,000 | 200.0 | 200.0/s | 5.0 ms | 100.0/s | 10.0 ms |
| 16,000 | 266.7 | 266.7/s | 3.75 ms | 133.3/s | 7.5 ms |
| 20,000 | 333.3 | 333.3/s | 3.0 ms | 166.7/s | 6.0 ms |

RPM target definitions:

- Initial validation target: 12,000 RPM.
- Design target: 16,000 RPM.
- Stretch target: 20,000 RPM.

Reality check: because 2-stroke fires every revolution, it is the harder initial energy-throughput case than equivalent single-cylinder 4-stroke operation.

## Spark Energy Budget

Stored capacitor energy:

```text
E = 0.5 * C * V^2
```

Candidate stored-energy table:

| Capacitor | 250V | 300V | 350V |
| ---: | ---: | ---: | ---: |
| 0.47 uF | 14.7 mJ | 21.2 mJ | 28.8 mJ |
| 0.68 uF | 21.3 mJ | 30.6 mJ | 41.7 mJ |
| 1.0 uF | 31.3 mJ | 45.0 mJ | 61.3 mJ |
| 1.5 uF | 46.9 mJ | 67.5 mJ | 91.9 mJ |

v0.1 target range:

- First bench point: 1.0 uF at 300V, about 45 mJ stored energy.
- Draft useful range: 30 mJ to 80 mJ stored energy.
- Conservative low-energy point: 0.68 uF at 300V, about 30.6 mJ.
- High-energy candidate: 1.0 uF at 350V or 1.5 uF at 300V.

Stored energy is not plug energy. Real spark output depends on capacitor ESR/ESL, discharge switch, CDI coil, wiring, plug gap, pressure, and losses.

## Charger Power Budget

Stored energy throughput for 2-stroke operation:

| RPM | Spark Rate | 30 mJ | 45 mJ | 60 mJ | 80 mJ |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 6,000 | 100/s | 3.0 W | 4.5 W | 6.0 W | 8.0 W |
| 12,000 | 200/s | 6.0 W | 9.0 W | 12.0 W | 16.0 W |
| 16,000 | 266.7/s | 8.0 W | 12.0 W | 16.0 W | 21.3 W |
| 20,000 | 333.3/s | 10.0 W | 15.0 W | 20.0 W | 26.7 W |

These are capacitor stored-energy numbers only. HV charger input power must be higher because of converter losses, charge profile losses, standby draw, and margin.

Initial charger class estimate:

- 12,000 RPM and 45 mJ: stored throughput is about 9 W; charger input class likely about 15 W to 25 W.
- 16,000 RPM and 45 mJ: stored throughput is about 12 W; charger input class likely about 20 W to 30 W.
- 20,000 RPM and 45 mJ: stored throughput is about 15 W; charger input class likely about 25 W to 40 W.

Design implication: the HV charger cannot be selected by voltage alone. It must be sized for recharge time at high RPM, low battery voltage, and target Vcap.

## Recharge-Time Budget

At 2-stroke design target:

- 12,000 RPM gives 5.0 ms between sparks.
- 16,000 RPM gives 3.75 ms between sparks.
- 20,000 RPM gives 3.0 ms between sparks.

The charger does not need to complete a full zero-to-target charge every cycle during steady operation, but it must recover the discharged energy quickly enough to keep Vcap inside limits. Bench tests must measure Vcap droop during RPM sweep and repeated discharge.

Minimum bench measurements:

- Vcap before discharge.
- Vcap immediately after discharge.
- Vcap recovery curve.
- Vcap at next scheduled spark.
- Charger current from 9V, 12V, and 16V inputs.
- Charger temperature during repeated discharge.

## Timing Budget

Required controller behavior:

- Hardware timestamp capture for pickup input.
- Hardware timer scheduling for CDI discharge command.
- No blocking delay in ignition-critical path.
- Deterministic fault state when pickup interval is invalid.
- Measurable timing jitter on bench.

Initial timing targets:

| Item | v0.1 Target | Notes |
| --- | ---: | --- |
| Pickup timestamp resolution | 1 us or better | Better if MCU timer allows it. |
| Scheduled trigger resolution | 1 us or better | Must be verified with oscilloscope or logic analyzer. |
| Bench timing jitter target | TBD after MCU choice | Must be measured, not claimed. |
| Trigger pulse width | TBD | Must match CDI power-board trigger stage. |
| Invalid pickup handling | No discharge | Fail safe. |

## Pickup And Calibration Budget

Initial pickup priority:

1. VR or motorcycle pulser input through conditioner.
2. Hall input after basic VR/pulser path is understood.
3. Raw GPIO input is not a production design.

Calibration model must support:

- Engine cycle: 2-stroke first, 4-stroke later.
- Pickup offset in crank degrees.
- RPM-to-advance map.
- Rev limiter RPM.
- Safe cranking behavior.
- Optional Vcap target selection.

Older carbureted motorcycles should not require EFI signals. If throttle position, gear, or temperature are added later, they are optional corrections, not first-phase dependencies.

## Safety Budget

Mandatory safety features before HV engine discussion:

- Vcap measurement.
- Charger enable control.
- Discharge inhibit path.
- Bleeder or controlled discharge path.
- HV-safe test points.
- Fault latch or fault state.
- Startup output disabled.
- Watchdog/reset output disabled.
- Safe handling procedure after power-off.

Engine testing remains blocked until bench validation proves Vcap behavior, timing behavior, discharge control, and fault handling.

## Component Selection Gate

Do not select final core components until these are decided or measured:

- Target Vcap range.
- Capacitor value range.
- Stored energy target.
- Recharge-time target at 12,000 and 16,000 RPM.
- Minimum input voltage during cranking.
- Pickup conditioner direction.
- Discharge switch architecture: SCR or IGBT.
- HV charger topology.
- Bench load or spark tester design.

Component research can start after this budget is accepted, but part numbers should stay candidates until bench evidence exists.
