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

Safety note: this board can store dangerous energy after power-off. Read `docs/04-hv-safety.md` before design or test work.

No power-stage implementation exists yet.
