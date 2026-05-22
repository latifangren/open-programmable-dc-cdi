# Datasheet Extraction: SCR

Status: first extraction pass. This document records source-backed facts only. It does not select a final SCR or claim bench validation.

## Scope

The first discharge direction remains SCR-based CDI discharge. The immediate question is whether an ST `TYN612` class SCR is worth carrying into low-energy bench tests.

## Source Rules

- ST product page facts are treated as direct vendor facts when readable.
- Public datasheet mirror excerpts are treated as source-backed but still require manual verification against ST-hosted PDF before purchase or bench stress.
- No SCR is promoted beyond `Research only` in this pass.

## Source Links Checked

- ST TYN612 product page: `https://www.st.com/en/thyristors-scr-and-ac-switches/tyn612.html`
- ST TYN612 datasheet link from product page: `https://www.st.com/resource/en/datasheet/tyn612.pdf`
- Public PDF mirror used only for readable excerpts: `https://www.acdcshop.gr/content/TYN612.pdf`
- Public JLCPCB file excerpt used only as cross-check: `https://jlcpcb.com/api/file/downloadByFileSystemAccessId/8603079096230559744`

## STMicroelectronics TYN612 Family

Readable ST product page facts:

| Field | Value |
|---|---|
| Product status | Active / volume production page shown |
| Description | `12A standard SCRs` |
| Application text includes | capacitive discharge ignition |
| Repetitive peak off-state voltage options | `600V`, `800V`, `1000V` family options |
| TYN612 package | `TO-220AB` |
| TYN612RG gate current entry | `15 mA` max on ST product page |
| TYN612TRG gate current entry | `5 mA` max on ST product page |
| TYN612RG dV/dt entry | `200 V/us` min on ST product page |
| TYN612TRG dV/dt entry | `40 V/us` min on ST product page |

Readable datasheet-excerpt facts:

| Field | TYN612RG | TYN612TRG | Notes |
|---|---:|---:|---|
| `VDRM / VRRM` | `600V` | `600V` | TYN612 variant |
| `IT(RMS)` | `12A` | `12A` | Family feature |
| `ITSM`, 8.3 ms | `115A` | `145A` | Non-repetitive surge, Tj initial `25 C` |
| `ITSM`, 10 ms | `110A` | `140A` | Non-repetitive surge, Tj initial `25 C` |
| `I2t` | `60 A2s` | `98 A2s` | Fusing value excerpt |
| `IGT` max | `15 mA` | `5 mA` | Gate trigger current |
| `VGT` max | `1.3V` | `1.3V` | Gate trigger voltage excerpt |
| `IH` max | `30 mA` | `15 mA` | Holding current excerpt |
| `IL` max | `60 mA` | `30 mA` | Latching current excerpt |
| `dV/dt` min | `200 V/us` | `40 V/us` | VD = 67% VDRM, gate open, Tj `125 C` excerpt |
| `dI/dt` | `50 A/us` | `50 A/us` | Critical rise rate excerpt, conditions must be checked in original datasheet |
| `Rth(j-c)` | `1.3 C/W` | `1.3 C/W` | TO-220AB / D2PAK / DPAK / IPAK excerpt |

## Interpretation For This Project

`TYN612RG` has higher extracted dV/dt immunity than `TYN612TRG`, while `TYN612TRG` has lower gate trigger current. For a noisy CDI discharge environment, the higher dV/dt number may matter more than gate sensitivity, but this is not proven without bench noise and false-trigger testing.

Current preference for research ordering:

1. Keep both `TYN612RG` and `TYN612TRG` as `Research only` rows.
2. Prefer testing `TYN612RG` first if gate driver can supply the required current with margin.
3. Keep `TYN612TRG` as comparison if trigger-driver simplicity becomes limiting.

## Open Checks

- Verify all extracted numbers against the ST-hosted PDF manually.
- Confirm exact current waveform in CDI discharge does not violate `dI/dt` and surge limits.
- Confirm gate trigger circuit, gate-cathode bias, and isolation approach.
- Confirm heatsinking or thermal margin for repeated discharge rate.
- Run low-energy false-trigger tests before full-energy discharge.

## First-Pass Direction

The ST `TYN612` family is worth keeping as a first SCR research path. It is not yet a bench-selected part.
