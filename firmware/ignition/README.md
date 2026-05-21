# Ignition

Status: placeholder.

This folder is for ignition scheduling logic that is independent from a specific motorcycle brand or engine model.

Initial target:

- Single-cylinder.
- 2-stroke under 200cc.
- One pickup reference event per cycle unless an engine profile defines otherwise.
- One CDI discharge output.

Future-compatible areas:

- 4-stroke scheduling.
- Alternate pickup offsets.
- Multiple map profiles.
- Rev limiter patterns.

Engine-specific values belong in calibration profiles, not hardcoded logic.
