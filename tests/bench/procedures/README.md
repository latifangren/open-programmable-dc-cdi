# Bench Procedures

Status: planned procedures only. No bench procedure has been run yet.

This folder contains step-by-step bench procedures. A procedure is not validation evidence until a matching report records measured data and links raw artifacts.

## Available Procedures

- [low-voltage-dry-run.md](low-voltage-dry-run.md) - controller-side dry-run with HV charger, HV capacitor, discharge stage, CDI coil, and engine testing excluded.
- [low-voltage-dry-run-readiness.md](low-voltage-dry-run-readiness.md) - pre-run readiness checklist for BENCH-0001; not validation evidence.
- [hv-charger-disabled-discharge.md](hv-charger-disabled-discharge.md) - planned HV charger-only procedure with discharge path disabled; not validation evidence.

## Procedure Rules

- Keep procedure scope explicit.
- Record what is included and excluded.
- Link raw logs, captures, and setup photos from a report.
- Leave report stubs marked `Not run` until measured evidence exists.
- Stop if the setup differs from the written procedure.

Engine, vehicle, and road testing remain blocked until measured bench reports cover timing, HV charge, Vcap measurement, controlled discharge, fault handling, and long-run stability.
