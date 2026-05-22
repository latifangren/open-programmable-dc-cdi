# Bench Logs

Status: placeholder. No bench logs are recorded yet.

This folder is for future CSV logs, serial logs, firmware event logs, and test-run metadata from bench-only validation work.

Bench logs should use the fields planned in `../../../../docs/05-bench-test-plan.md` where applicable:

```text
time_us,rpm,advance_deg,vbat,vcap,charge_us,event,error
```

Use [minimal-bench-log-template.csv](minimal-bench-log-template.csv) as the header-only CSV template. It contains no sample data and is not validation evidence.

## Field Meanings

| Field | Meaning |
|---|---|
| `time_us` | Timestamp in microseconds from the logger or test script reference |
| `rpm` | RPM-equivalent value derived from pickup simulator or trigger interval |
| `advance_deg` | Planned ignition advance in crank degrees for the logged event |
| `vbat` | Low-voltage supply measurement in volts |
| `vcap` | HV capacitor feedback value in volts, or `NA` when not measured |
| `charge_us` | Charger activity or charge-time value in microseconds, or `NA` when not measured |
| `event` | Short event label such as boot, trigger, reset, inhibit, or fault |
| `error` | Empty field for no error, or a short error code explained by the report |

For a low-voltage dry-run, `vcap` and `charge_us` may be `0` only when the setup verifies the HV path is absent or disabled. Otherwise use `NA` and explain the condition in the linked report.

Each log must name:

- report ID,
- test ID,
- hardware revision,
- firmware or script revision,
- bench setup or fixture revision,
- operator and date.

Logs without a matching report are raw notes only, not validation evidence.
