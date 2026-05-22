# Pickup Simulator Tool Plan

Status: planned host-side utility only. No simulator implementation or bench result exists yet.

This folder is for a future host-side pickup simulator utility used during low-voltage controller bench work. It does not describe validated hardware, does not prove pickup input behavior, and does not authorize high-voltage or engine testing.

## Purpose

The planned pickup simulator should provide repeatable low-voltage pickup events for BENCH-0001 and later timing tests so RPM calculation, advance lookup, trigger timing, and reset safe-state behavior can be observed before any HV discharge work.

Related documents:

- [Bench test plan](../../docs/05-bench-test-plan.md)
- [Requirements traceability](../../docs/14-requirements-traceability.md)
- [Low-voltage dry-run procedure](../../tests/bench/procedures/low-voltage-dry-run.md)
- [Low-voltage dry-run readiness](../../tests/bench/procedures/low-voltage-dry-run-readiness.md)
- [BENCH-0001 planned report](../../tests/reports/bench-0001-not-run.md)

## Planned Scope

Included:

- host-side generation plan for repeatable RPM-equivalent events,
- fixed-rate simulated pickup pulse modes,
- startup, stop, and reset-safe test sequences,
- timestamped event logging that can align with the bench CSV log template,
- documentation of output level, polarity, and connection assumptions before use.

Excluded:

- direct connection to the CDI Power Board discharge input,
- HV charger control,
- HV capacitor charging,
- SCR or IGBT discharge testing,
- CDI coil, spark plug, or spark tester use,
- engine, vehicle, or road testing.

## Planned Interface

The first implementation should be boring and inspectable. A future CLI or script should state all selected options before output is enabled.

Planned command concepts:

```text
pickup-simulator --rpm <value> --pulse-width-us <value> --duration-s <value>
pickup-simulator --profile low-voltage-dry-run --duration-s <value>
pickup-simulator --sequence startup-reset-safe-state
```

These command examples are planning notes only. No executable command exists yet.

## Planned Output Modes

| Mode | Purpose | BENCH-0001 Use |
|---|---|---|
| Fixed RPM-equivalent pulse train | Basic RPM calculation check | Planned |
| Startup idle sequence | Observe boot and first-event behavior | Planned |
| Stop / missing-pulse sequence | Observe trigger-inhibited behavior after missing pickup | Later planned test |
| Reset-safe sequence | Observe `TRIGGER_CMD` inactive during reset or watchdog recovery | Planned |

The simulator output must be connected only through the planned low-voltage pickup input or isolated conditioning test point. It must not drive any HV, discharge, CDI coil, spark plug, or engine-connected circuit.

## Planned BENCH-0001 Rates

The first dry-run should use conservative RPM-equivalent rates that are easy to observe and stop. Exact values remain setup-dependent until the controller input path and timing firmware exist.

Suggested planning set:

- low idle-equivalent rate,
- midrange rate,
- high but still low-voltage-only bench rate,
- stop / missing-pulse case,
- reset or watchdog safe-state case.

Do not treat these as pass criteria until a measured report records exact values, setup, and evidence.

## Logging Expectations

The simulator should make it possible to correlate generated events with the bench log fields:

```text
time_us,rpm,advance_deg,vbat,vcap,charge_us,event,error
```

For BENCH-0001, `vcap` and `charge_us` remain `0` only when HV is verified absent or disabled. Otherwise use `NA` and explain the condition in report notes.

## Safety Boundary

Before any future simulator implementation is connected to hardware:

- confirm output voltage and polarity are compatible with the low-voltage pickup input path,
- confirm output is disabled by default,
- confirm the timing output observation point is isolated from the CDI Power Board discharge input,
- confirm HV charger, HV capacitor, discharge switch, CDI coil, spark plug, and spark tester are disconnected or positively inhibited,
- stop if wiring differs from the dry-run readiness checklist.

## Non-Authorization

This plan does not authorize HV charger testing, capacitor charging, discharge testing, spark generation, engine testing, vehicle testing, or road testing. Those remain blocked until separate measured bench reports cover the required safety gates.
