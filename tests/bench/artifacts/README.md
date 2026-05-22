# Bench Artifacts

Status: placeholder. No bench artifacts are recorded yet.

This folder is for raw bench evidence produced by future controlled tests. It is not a validation report by itself, and it does not prove that any CDI power-core behavior has passed.

Use this structure only after a bench test has a matching report ID and test ID.

## Artifact Folders

- [logs/](logs/) - CSV logs, serial logs, or machine-readable event logs.
- [scope-captures/](scope-captures/) - oscilloscope or logic-analyzer captures with instrument setup notes.
- [raw-data/](raw-data/) - unprocessed measurement files, photos, and supporting data.

## Naming Rule

Use this pattern for future files:

```text
YYYY-MM-DD_report-id_test-id_short-name.ext
```

Every artifact must be traceable to a report under `../../reports/` or a template-derived report. Do not store summary conclusions only in this folder; put summaries in reports and link the raw evidence here.

## Safety Boundary

Files in this folder are evidence only after they are tied to a reviewed report. Engine testing remains blocked until measured bench reports cover the required safety gates.
