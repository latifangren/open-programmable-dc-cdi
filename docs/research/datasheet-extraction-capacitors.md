# Datasheet Extraction: HV Capacitors

Status: first extraction pass. This document records source-backed facts only. It does not select a final capacitor or claim bench validation.

## Scope

The first CDI bench target is still `1.0 uF @ 300V`, about `45 mJ` stored energy. Capacitor candidates here are checked for pulse-relevant data before any schematic or bench purchase decision.

## Source Rules

- Values below come from readable vendor or search-result excerpts available during this pass.
- Raw PDF fetches that produced unreadable PDF text are not treated as extracted facts.
- Exact ordering, stock, and original PDF review remain required before buying.

## Source Links Checked

- CDE Type 940C catalog: `https://www.cde.com/resources/catalogs/940C.pdf`
- CDE Type 940 catalog: `https://www.cde.com/resources/catalogs/940.pdf`
- WIMA FKP 1 product page: `https://www.wima.de/en/our-product-range/pulse-capacitors/fkp-1/`
- WIMA FKP 1 PDF path attempted: `https://www.wima.de/wp-content/uploads/media/e_WIMA_FKP_1.pdf`

## Cornell Dubilier Type 940C

Readable source excerpts describe Type 940C as polypropylene pulse/snubber capacitors with dual metallized electrodes, self-healing behavior, high peak current capability, low ESR, low inductance, and high dV/dt.

General source-backed specs:

| Field | Value |
|---|---|
| Capacitance range | `0.01 uF` to `4.7 uF` |
| Tolerance | `+/-10%` standard, `+/-5%` optional |
| Rated voltage range | `600Vdc` to `3000Vdc` |
| Operating temperature | `-55 C` to `+105 C` |
| Voltage derating note | Full rated voltage at `85 C`, derated linearly to `50%` rated at `105 C` |
| Life test | `2000 h @ 85 C`, `125%` rated DC voltage |
| Life expectancy | `60000 h @ rated Vdc, 70 C`; `30000 h @ rated Vac, 70 C` |
| Insulation resistance | `> 100000 Mohm x uF` |

Candidate rows from readable CDE 940C excerpts:

| Part | Capacitance | VDC | ESR | ESL | dV/dt | Peak Current | RMS Current | Dimensions | Status |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| `940C6P68K-F` | `0.68 uF` | `600Vdc` | `6 mohms` | `23 nH` | `196 V/us` | `134 A` | `8.1 A @ 100 kHz, 70 C` | `18.0 mm D x 34.0 mm L`, `1.0 mm` lead | Research only |
| `940C6W1K-F` | `1.0 uF` | `600Vdc` | `6 mohms` | `24 nH` | `196 V/us` | `196 A` | `8.9 A @ 100 kHz, 70 C` | `21.0 mm D x 34.0 mm L`, `1.0 mm` lead | Research only |
| `940C6W1P5K-F` | `1.5 uF` | `600Vdc` | `5 mohms` | `26 nH` | `196 V/us` | `295 A` | `10.9 A @ 100 kHz, 70 C` | `25.0 mm D x 34.0 mm L`, `1.2 mm` lead | Research only |

Energy at `300V`:

| Capacitance | Stored Energy |
|---:|---:|
| `0.68 uF` | about `30.6 mJ` |
| `1.0 uF` | about `45.0 mJ` |
| `1.5 uF` | about `67.5 mJ` |

Open checks:

- Confirm values against original CDE PDF manually.
- Check current distributor stock and lead style.
- Check mounting method for vibration and bench safety.
- Check whether axial package fits first HV board/test jig layout.
- Confirm CDI discharge pulse stress is within ratings after real waveform measurement.

## WIMA FKP1

Readable WIMA excerpts describe FKP1 as polypropylene pulse capacitors for very high pulse applications with metal foil electrodes and metallized internal series connection.

Source-backed family specs:

| Field | Value |
|---|---|
| Capacitance range | `100 pF` to `4.7 uF` |
| Rated voltage range | `400Vdc`, `630Vdc`, `1000Vdc`, `1250Vdc`, `1600Vdc`, `2000Vdc`, `4000Vdc`, `6000Vdc` |
| Tolerance | `+/-20%`, `+/-10%`, `+/-5%` |
| Operating temperature | `-55 C` to `+105 C` |
| Dielectric | Polypropylene film |
| Dissipation factor at 1 kHz and +20 C | `< 5 x 10^-4` in source excerpt |
| Pulse table value | `6600 V/us` for `1.0 uF` to `2.2 uF` at `630Vdc` in readable WIMA page excerpt |

Open checks:

- Extract exact `1.0 uF / 630Vdc` part number and physical dimensions from WIMA table.
- Confirm whether that exact part is orderable without special enquiry.
- Derive peak current from `I = C x dV/dt` only after exact capacitance and table applicability are confirmed.
- Compare package size against CDE 940C axial options.

## First-Pass Direction

`940C6W1K-F` is the clearest source-backed first capacitor candidate from this pass because the available excerpts include capacitance, voltage, dV/dt, peak current, RMS current, ESR, ESL, temperature, and dimensions.

It remains `Research only` until original PDF review, stock check, mounting plan, and bench stress plan are complete.
