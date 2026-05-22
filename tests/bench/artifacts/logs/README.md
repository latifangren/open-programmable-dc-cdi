# Bench Logs

Status: placeholder. No bench logs are recorded yet.

This folder is for future CSV logs, serial logs, firmware event logs, and test-run metadata from bench-only validation work.

Bench logs should use the fields planned in `../../../docs/05-bench-test-plan.md` where applicable:

```text
time_us,rpm,advance_deg,vbat,vcap,charge_us,event,error
```

Each log must name:

- report ID,
- test ID,
- hardware revision,
- firmware or script revision,
- bench setup or fixture revision,
- operator and date.

Logs without a matching report are raw notes only, not validation evidence.
