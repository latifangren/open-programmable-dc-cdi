# Hardware

Hardware is not implemented yet. This folder defines the intended structure and responsibilities only.

The project uses two boards:

- `controller-board/` for low-voltage timing and safety decisions.
- `cdi-power-board/` for high-voltage charging, storage, discharge, and CDI coil output.
- `pickup-conditioner/` for VR, Hall, or pulser input front-end experiments.
- `interfaces/` for connector, harness, and board-to-board contracts.
- `test-jigs/` for bench fixtures and safe HV test support.
- `mechanical/` for enclosure, mounting, sealing, and vibration notes.

No schematic, PCB layout, BOM, or component part number is final yet.
