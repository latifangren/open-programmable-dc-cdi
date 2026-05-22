# Source-Backed Parts Research

Status: Research only. This is not a BOM, purchase list, schematic release, or prototype selection.

## Purpose

This note consolidates the component facts that are source-backed enough to guide the next pre-schematic review. It does not promote any part above `Research only`. A candidate becomes a bench candidate only after original datasheets, ordering codes, stock, package fit, mounting, and test role are checked together.

Canonical decision gates remain in:

- [../10-component-candidate-matrix.md](../10-component-candidate-matrix.md)
- [../15-first-prototype-decisions.md](../15-first-prototype-decisions.md)
- [datasheet-extraction-capacitors.md](datasheet-extraction-capacitors.md)
- [datasheet-extraction-scr.md](datasheet-extraction-scr.md)
- [datasheet-extraction-vcap-divider.md](datasheet-extraction-vcap-divider.md)

## Source Rules

- Use original vendor datasheets or readable vendor pages before schematic capture.
- Treat distributor stock as availability evidence only, not engineering suitability.
- Keep source-excerpt data separate from manually verified PDF data when the PDF text extraction is unclear.
- Do not select a final part until the candidate has a defined schematic role, package/footprint plan, and bench stress test.
- Do not infer CDI suitability from a headline voltage, capacitance, or current rating alone.

## Current Shortlist

| Block | Candidate path | Source-backed facts | Still open | Status |
|---|---|---|---|---|
| HV discharge capacitor | Cornell Dubilier `940C6W1K-F` | `1.0 uF`, `600Vdc`, polypropylene pulse/snubber family, source excerpts include dV/dt, peak current, RMS current, temperature, ESR/ESL, and axial dimensions. | Manual original PDF check, live stock, lead style, mounting support, board/test-jig fit, bench stress role. | Research only |
| HV discharge capacitor alternative | WIMA `FKP1` family | Polypropylene pulse capacitor family; official WIMA page describes high pulse loading, broad capacitance/voltage range, and radial PCM options. | Exact `1.0 uF / 630Vdc` order code, dimensions, distributor stock, comparison against CDE axial package. | Research only |
| SCR discharge switch | ST `TYN612RG` / `TYN612TRG` | ST product pages identify a 12A standard SCR family, `TO-220AB`, 600V variants, gate-current variants, and CDI as a listed application. | Manual ST PDF verification, exact RG/TRG tradeoff, gate driver margin, false-trigger test, thermal behavior under repeated discharge. | Research only |
| Vcap divider high-side resistors | Vishay `VR37` class, `470k` target | VR37 is a high-ohmic / high-voltage metal glaze leaded family. Source-backed extraction lists high operating voltage margin, temperature range, and resistance range that includes `470k`. | Exact ordering code, package drawing, tolerance, AEC/UL status for exact value, board spacing, ADC sampling behavior. | Research only |
| Vcap divider comparison | Vishay `PR03 470k` | PR03 is a power metal film family with flameproof coating and a 3W class package. | Not preferred as HV divider baseline; keep only as lower-voltage/power comparison unless schematic constraints justify it. | Research only |

## Candidate Promotion Gate

Do not move any row above `Research only` until all checks below are complete:

1. Original datasheet fields have been manually verified.
2. Exact orderable part number is recorded.
3. Package, footprint, creepage, clearance, and mounting are compatible with the first bench board.
4. The part has a defined role in the schematic checklist.
5. The bench test or stress that matters for that part is named.

For the HV capacitor, the stress check must include Vcap target, stored energy, repetitive pulse behavior, and physical mounting. For the SCR, it must include gate trigger margin, false-trigger behavior, and repeated discharge observation. For the Vcap divider, it must include voltage rating, ADC protection, calibration, and failure behavior.

## Open Checks Before Schematic

- Confirm one capacitor candidate from the original vendor PDF and current stock.
- Confirm one SCR candidate from the original vendor PDF and current stock.
- Confirm exact Vcap divider resistor ordering code and board spacing.
- Define ADC protection and sampling assumptions for `VCAP_FB`.
- Define SCR gate-drive topology; no raw MCU GPIO to SCR gate.
- Define safe-discharge bleeder target time and safe voltage threshold.
- Define low-energy dummy load or protected spark fixture before full-energy discharge tests.

## Current Decision

The project should continue with source-backed pre-schematic research, not final BOM selection. The next useful hardware artifact is the [CDI Power Board Schematic Checklist](../../hardware/cdi-power-board/schematic-checklist.md), which exposes these unresolved items before anyone draws detailed circuitry.
