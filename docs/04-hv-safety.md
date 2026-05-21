# High-Voltage Safety

This project involves high-voltage ignition circuits. Treat every HV node as dangerous until proven discharged with the correct tool and procedure.

## Hard Rules

- Do not test HV circuits on a breadboard.
- Do not touch the CDI Power Board until the HV capacitor is discharged and verified.
- Do not rely on power-off as proof that the capacitor is safe.
- Do not run engine tests before bench validation is complete.
- Do not bypass safety inhibits to make a spark happen.

## Stored Energy Hazard

The HV capacitor can remain charged after input power is disconnected. The CDI Power Board must include:

- Bleeder path across HV capacitor.
- Service-safe discharge procedure.
- Vcap measurement test point or logged value.
- Clear HV warning marking on PCB and enclosure.

No exact resistor values are specified yet. Values must be chosen during electrical design and verified by discharge-time testing.

## Required Safety Behaviors

The system must block discharge when:

- Vcap is outside allowed range.
- Vcap feedback is missing or invalid.
- Charge timeout occurs.
- Pickup signal is invalid or noisy beyond filter limits.
- Controller resets or watchdog trips.
- Board-to-board trigger line is disconnected or stuck active.
- Test mode disables HV output.

## Bench Gate Before Engine Test

Engine testing is blocked until these bench checks pass:

1. Low-voltage controller test.
2. Pickup simulator test.
3. Trigger timing test using scope or logic analyzer.
4. HV charger test with discharge disabled.
5. Vcap measurement sanity test.
6. Controlled discharge into approved bench load or spark tester.
7. Fault injection for overvoltage, undervoltage, timeout, missing pickup, and noisy pickup.
8. Long-run bench test with logged results.

## Physical Safety Expectations

Before any HV bench test:

- Use enclosure or guarded fixture.
- Add strain relief to HV and coil wiring.
- Keep low-voltage debug equipment away from HV return paths.
- Separate low-voltage logic, noisy power, and HV areas on PCB.
- Use visible warning labels.
- Keep one-hand rule and insulated tools policy for live debugging.

This document is mandatory reading before hardware work starts.
