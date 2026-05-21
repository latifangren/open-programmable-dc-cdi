# Research Archive

This folder keeps raw research and source material. It is not the canonical engineering spec.

- `user-research.md` keeps the concise engineering summary extracted from the original research.
- `raw-user-research.md` preserves the original long research notes and transcript.
- `sources.md` keeps the raw reference list.
- `reference-repo-analysis.md` compares external ignition repositories against this project's real DC-CDI scope.
- `scr-discharge-research.md` summarizes SCR discharge-stage requirements and bench risks.
- `hv-capacitor-research.md` summarizes CDI storage capacitor requirements and pulse-rating risks.

Canonical project docs are extracted into numbered files under `docs/`.

Key extracted conclusions:

- The project targets real programmable DC-CDI, not TCI.
- A CDI power core needs HV charger, HV capacitor, SCR/IGBT discharge, and CDI coil.
- Controller-only or trigger-only projects are useful references but not complete CDI systems.
- Bench validation must happen before engine testing.
- HV safety is a first-class requirement.
