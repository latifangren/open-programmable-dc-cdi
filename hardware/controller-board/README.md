# Controller Board

The Controller Board handles low-voltage control.

Responsibilities:

- Read conditioned pickup signal.
- Capture event timestamps with deterministic timing.
- Calculate RPM and crank angle.
- Apply ignition advance map.
- Enforce rev limiter and safety inhibit logic.
- Send trigger command to CDI Power Board.
- Log timing and fault data.

Open decisions:

- MCU family.
- Input capture timer design.
- Board-to-board interface.
- Power supply and protection details.
- Debug and logging connector.

The Controller Board must not directly drive a 12V inductive ignition coil in the final DC-CDI architecture.
