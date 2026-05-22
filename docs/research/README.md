# Research Archive

This folder keeps raw research and source material. It is not the canonical engineering spec.

- `user-research.md` keeps the concise engineering summary extracted from the original research.
- `raw-user-research.md` preserves the original long research notes and transcript.
- `sources.md` keeps the raw reference list.
- `reference-repo-analysis.md` compares external ignition repositories against this project's real DC-CDI scope.
- `scr-discharge-research.md` summarizes SCR discharge-stage requirements and bench risks.
- `hv-capacitor-research.md` summarizes CDI storage capacitor requirements and pulse-rating risks.
- `flyback-charger-research.md` summarizes HV capacitor charger requirements, control options, and bench risks.
- `vcap-measurement-research.md` summarizes Vcap feedback requirements, divider risks, and calibration gates.
- `component-candidate-notes.md` records first real candidate families for HV capacitor, SCR, and Vcap divider research.
- `datasheet-extraction-capacitors.md` records source-backed HV capacitor candidate facts and extraction gaps.
- `datasheet-extraction-scr.md` records source-backed SCR candidate facts and extraction gaps.
- `datasheet-extraction-vcap-divider.md` records source-backed Vcap divider resistor facts and extraction gaps.

Canonical project docs are extracted into numbered files under `docs/`.

Key extracted conclusions:

- The project targets real programmable DC-CDI, not TCI.
- A CDI power core needs HV charger, HV capacitor, SCR/IGBT discharge, and CDI coil.
- Controller-only or trigger-only projects are useful references but not complete CDI systems.
- Bench validation must happen before engine testing.
- HV safety is a first-class requirement.
