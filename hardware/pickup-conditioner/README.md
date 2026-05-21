# Pickup Conditioner

Status: placeholder.

This folder is for pickup input conditioning experiments and design notes.

Target inputs:

- VR pickup.
- Hall sensor.
- Existing motorcycle pulser output.

Design rules:

- Do not connect raw pickup signals directly to MCU GPIO in production design.
- Define protection, filtering, thresholding, and hysteresis before schematic release.
- Validate timing delay and jitter with a pickup simulator before engine testing.

Initial focus is single-cylinder 2-stroke engines under 200cc, without locking the design to one motorcycle model.
