# Tests

Status: placeholder.

This folder is for validation artifacts outside firmware unit tests.

Current status: no completed bench report or engine-test report exists yet.

## Folders

- [bench/](bench/) - future bench procedures, raw evidence, and analysis notes.
- [bench/procedures/](bench/procedures/) - planned bench procedures that are not evidence until measured reports exist.
- [reports/](reports/) - summarized report templates and not-run report stubs.
- [engine/](engine/) - blocked until bench gates pass.

Test order:

1. Bench tests.
2. Fault injection.
3. Long-run bench tests.
4. Engine tests only after bench gates pass.

Engine testing is blocked until the HV safety and bench test plan requirements are met.
