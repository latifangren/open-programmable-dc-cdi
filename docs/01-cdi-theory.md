# CDI vs TCI Theory

## CDI

Capacitor Discharge Ignition stores spark energy in a high-voltage capacitor. At the ignition moment, an electronic switch discharges that capacitor through the primary side of a CDI ignition coil.

Minimum CDI energy path:

```text
12V input or magneto
  -> HV charger / inverter
  -> HV discharge capacitor
  -> SCR/IGBT discharge switch
  -> CDI ignition coil
  -> Spark plug
```

## TCI / Inductive Ignition

Transistor Controlled Ignition stores spark energy in the magnetic field of a 12V ignition coil. A transistor or ignition IGBT switches coil current on and off.

Typical TCI path:

```text
12V input
  -> ignition coil primary
  -> transistor / IGBT low-side switch
  -> spark plug
```

A microcontroller driving a MOSFET into a 12V coil is not a full CDI. It may still be useful, but it is a different ignition architecture.

## CDI Trigger Controller

A trigger controller calculates ignition timing and sends a pulse into an external CDI module. It can be precise and useful, but it does not contain the CDI power stage.

Typical trigger-controller path:

```text
Pickup sensor
  -> signal conditioner
  -> MCU timing controller
  -> trigger pulse
  -> external CDI module
```

## Project Position

This repository targets a full programmable DC-CDI system:

```text
Pickup sensor
  -> signal conditioner
  -> MCU timing controller
  -> protected trigger driver
  -> HV charger
  -> HV capacitor
  -> SCR/IGBT discharge switch
  -> CDI ignition coil
  -> spark plug
```

Controller-only designs and TCI coil drivers are useful references, but they are not sufficient for this goal.
