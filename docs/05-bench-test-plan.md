# Bench Test Plan

Purpose: validate the spark core on the bench before any engine test.

## Test Phases

### Phase 0: Documentation Gate

Pass criteria:

- Electrical spec has target input voltage, Vcap, spark energy, max RPM, pickup type, and coil type.
- Block diagram shows Controller Board and CDI Power Board boundaries.
- HV safety doc is reviewed.
- No engine test is scheduled before bench signoff.

### Phase 1: Low-Voltage Controller Bench

Validate controller behavior with HV disabled.

Checks:

- Power rails stable.
- Pickup simulator produces repeatable events.
- RPM calculation matches simulator input.
- Timing map produces expected advance values.
- Trigger output timing is measurable on scope or logic analyzer.
- Watchdog reset leaves trigger output inactive.

### Phase 2: Pickup Simulator And Timing

Validate signal path before real pickup wiring.

Checks:

- Minimum and maximum simulated RPM.
- Missing-tooth or missing-pulse behavior if used.
- Noise rejection / blind window behavior.
- Jitter measurement across RPM range.
- Rev limiter behavior.

### Phase 3: HV Charger With Discharge Disabled

Validate charger without firing the discharge stage.

Checks:

- HV charger starts only when enabled.
- Vcap rises to target range.
- Charge timeout works.
- Overvoltage inhibit works.
- Vcap bleeds down by defined procedure.
- Logs include Vcap and charge time.

### Phase 4: Controlled Discharge Bench

Validate discharge only with an approved dummy load or spark tester.

Checks:

- Trigger command causes one intended discharge.
- No unexpected repeated trigger.
- Vcap drop is logged.
- Discharge inhibit works when Vcap is invalid.
- Board returns to safe state after reset.

### Phase 5: Fault Injection

Required fault cases:

- Input undervoltage.
- Vcap overvoltage.
- Charge timeout.
- Missing pickup.
- Noisy pickup.
- Stuck trigger line.
- Watchdog reset.
- CDI coil disconnected, if safe test method exists.

### Phase 6: Long-Run Bench

Run repeated simulated cycles before engine work.

Logs must include:

```text
time_us,rpm,advance_deg,vbat,vcap,charge_us,event,error
```

## Engine Test Gate

Engine testing remains out of scope until the bench report shows acceptable results for timing, HV charge, Vcap measurement, controlled discharge, fault handling, and long-run stability.
