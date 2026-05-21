# Bootloader

Status: placeholder.

This folder is reserved for bootloader and firmware update decisions.

No update mechanism is selected yet. OTA and web update flows are deferred until the CDI spark core is bench validated.

Minimum future requirements:

- Safe fallback or recovery path after failed update.
- Output disabled during update.
- Version and calibration compatibility checks.
- No HV discharge command while firmware integrity is unknown.
