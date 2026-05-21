# Safety

Status: placeholder.

This folder is for firmware safety logic and fault handling.

Required safety behavior:

- Default CDI trigger output disabled at boot and fault.
- Block discharge when Vcap is out of bounds.
- Block discharge when pickup timing is invalid.
- Block discharge during update, reset, or watchdog recovery.
- Log fault reason for bench review.

Safety logic must be validated on the bench before any engine test.
