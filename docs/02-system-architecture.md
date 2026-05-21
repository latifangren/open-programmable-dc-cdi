# System Architecture

## Final Block Diagram

```text
Pickup Sensor
  -> Signal Conditioner
  -> Controller Board
       - pickup timestamp capture
       - RPM and crank-angle calculation
       - ignition timing map
       - rev limit
       - safety decision
       - trigger output
       - logging
  -> Board-to-Board Interface
       - trigger command
       - charger enable
       - Vcap feedback
       - fault status
       - shared reference / isolated boundary, TBD
  -> CDI Power Board
       - 12V input protection
       - HV charger
       - Vcap measurement divider
       - HV discharge capacitor
       - SCR/IGBT discharge switch
       - CDI coil output
       - bleeder / safe discharge path
       - fault protection
  -> CDI Ignition Coil
  -> Spark Plug
```

## Controller Board Responsibility

The Controller Board owns low-voltage control and timing decisions:

- Accept conditioned pickup events.
- Calculate RPM and crank angle.
- Apply ignition advance map.
- Enforce rev limit and safety inhibit states.
- Send trigger command only when power-board state is valid.
- Log timing, Vbat, Vcap, trigger, and fault events.

The Controller Board does not directly drive a 12V inductive ignition coil as the final CDI architecture.

## CDI Power Board Responsibility

The CDI Power Board owns high-voltage energy handling:

- Protect 12V input from reverse polarity and transients.
- Charge HV capacitor to target Vcap.
- Report Vcap and fault state.
- Discharge HV capacitor through SCR/IGBT stage.
- Drive a CDI ignition coil.
- Provide bleeder and service-safe discharge behavior.

## Interface Boundary

The board-to-board interface is not finalized. It must eventually define:

- Trigger signal voltage and timing.
- Charger enable behavior.
- Vcap feedback scaling.
- Fault status line or packet.
- Grounding or isolation strategy.
- Default safe state when cable is disconnected.

No connector, pinout, or isolation component is selected yet.
