# circom-workspace
A basic circom project with jacob rosenthal's scripts. Verifies that a private preimage hashes to a claimed hash.

`yarn` to install dependencies

`yarn compile <CIRCUIT_NAME>` to compile circuit, generate zkey (deterministic), generate solidity verifier contract, generate a proof for the `input.json` input, and verify the proof.

`yarn verify <CIRCUIT_NAME>` to verify the proof.
