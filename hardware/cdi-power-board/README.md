# CDI Power Board

The CDI Power Board handles high-voltage energy.

Responsibilities:

- Protect 12V input.
- Charge HV capacitor to target Vcap.
- Measure Vcap.
- Discharge HV capacitor through SCR/IGBT stage.
- Drive CDI ignition coil.
- Provide bleeder and safe discharge behavior.
- Report fault status to the Controller Board.

Must not:

- Fire when trigger input is floating.
- Fire when the controller is reset.
- Charge the HV capacitor when `CHARGE_EN` is inactive.
- Depend only on firmware for HV discharge safety.
- Treat a missing or invalid `VCAP_FB` signal as safe.
- Claim production readiness without bench reports.

Safety note: this board can store dangerous energy after power-off. Read `docs/04-hv-safety.md` before design or test work.

Pre-schematic review checklist: [schematic-checklist.md](schematic-checklist.md).

No power-stage implementation exists yet.
