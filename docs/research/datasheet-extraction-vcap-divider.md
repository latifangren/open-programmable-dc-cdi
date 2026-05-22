# Datasheet Extraction: Vcap Divider Resistors

Status: first extraction pass. This document records source-backed facts only. It does not select final divider parts or claim ADC validation.

## Scope

The current preferred divider strategy is:

```text
HV node -> 5x 470k high-side -> ADC node -> 15k low-side -> ground
```

Nominal ratio is about `157.7:1`. At `450V`, ADC node is about `2.85V`. Each high-side resistor sees about `90V` before transients if voltage sharing is ideal.

## Source Rules

- Divider math comes from the resistor chain values.
- Resistor ratings below come from readable Vishay source excerpts.
- Exact ordering code and package drawing must still be verified before schematic.

## Source Links Checked

- Vishay VR25/VR37/VR68 product page: `https://www.vishay.com/en/product/28907/`
- Vishay VR25/VR37/VR68 datasheet endpoint: `https://www.vishay.com/doc/?28907=`
- Vishay PR01/PR02/PR03 product page: `https://www.vishay.com/en/product/28729/`
- Vishay PR01/PR02/PR03 datasheet: `https://www.vishay.com/docs/28729/pr010203.pdf`
- RS PR03 470k listing checked as availability/detail reference: `https://twen.rs-online.com/web/p/through-hole-resistors/6835940`

## Vishay VR25 / VR37 / VR68 High-Voltage Metal Glaze Family

Readable Vishay excerpts describe VR25, VR37, and VR68 as high-ohmic / high-voltage metal glaze leaded resistors.

Source-backed family specs:

| Field | VR25 | VR37 | VR68 |
|---|---:|---:|---:|
| Resistance range | `100k` to `22M` | `100k` to `33M` | `100k` to `68M` |
| Tolerance options | `+/-10%`, `+/-5%`, `+/-1%` | `+/-10%`, `+/-5%`, `+/-1%` | `+/-10%`, `+/-5%`, `+/-1%` |
| Temperature coefficient | `<= +/-200 ppm/K` | `<= +/-200 ppm/K` | `<= +/-200 ppm/K` |
| Rated dissipation at 70 C | `0.25W` | `0.5W` | `1.0W` |
| Operating voltage AC/DC | `1600V` | `3500V` | `10000V` |
| Operating temperature | `-55 C` to `+155 C` | `-55 C` to `+155 C` | `-55 C` to `+155 C` |
| Thermal resistance | `140 K/W` | `120 K/W` | `70 K/W` |

For a `5x 470k` high-side chain, VR37 has far more voltage rating than required per resistor for a `450V` measurement target. That margin is useful, but physical size, sourcing, and PCB creepage still need checking.

## Vishay PR03 470k Comparison

Readable Vishay/RS excerpts identify `PR03000204703JAC00` as a `470k`, `3W`, `5%`, PR03 metal film resistor with `750V` voltage rating, `0617` package, `16.7 mm` length, `5.2 mm` diameter, and `+250 ppm/C` temperature coefficient in the RS attribute table.

Vishay PR01/PR02/PR03 datasheet excerpts list:

| Field | PR03 |
|---|---:|
| Resistance range | up to `1M` in excerpts |
| Tolerance | `+/-1%`, `+/-5%` |
| Temperature coefficient | `+/-250 ppm/K` |
| Rated dissipation | `3W` class for PR03 variant |
| Operating voltage | `750V` for PR03 class excerpt |
| Operating temperature excerpt | `-55 C` to `+155 C` in RS table |

PR03 is not the preferred high-voltage divider part because VR37 has much higher operating voltage rating. PR03 remains useful as a lower-voltage, high-power comparison option.

## Divider Candidate Check

For `5x 470k + 15k`:

| Item | Value |
|---|---:|
| High-side total | `2.35 Mohm` |
| Low-side | `15k` |
| Total | `2.365 Mohm` |
| Ratio | about `157.7:1` |
| ADC at `350V` | about `2.22V` |
| ADC at `450V` | about `2.85V` |
| Chain current at `450V` | about `190 uA` |
| Total divider power at `450V` | about `86 mW` |
| Per 470k high-side resistor power at `450V` ideal sharing | about `17 mW` |

## Open Checks

- Confirm exact VR37 `470k`, tolerance, packaging, and part number.
- Confirm VR37 dimensions and board spacing.
- Decide whether low-side `15k` should be precision metal film, lower tempco, or part of calibration strategy.
- Define ADC source impedance and sampling time.
- Define ADC clamp current under plausible faults.
- Decide whether divider response time supports charger stop threshold.
- Keep separate bleeder resistor path; this divider is not the main safety bleeder.

## First-Pass Direction

Use Vishay VR37-class high-voltage resistors as the preferred high-side research path for the `5x 470k + 15k` divider. Keep PR03 as comparison only.
