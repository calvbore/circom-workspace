# circom-workspace
A basic circom project forked from [briangu33/circom-starter](https://github.com/briangu33/circom-starter) and inspired by modifications in [nulven/zk-browser](https://github.com/nulven/zk-browser).

`yarn` to install dependencies

`yarn compile <CIRCUIT_NAME>` to compile circuit, generate zkey (deterministic), generate solidity verifier contract, generate a proof for the `input.json` input, and verify the proof.

`yarn verify <CIRCUIT_NAME> <OPTIONAL-INPUT.json>` to verify the proof, with optional alternative input json.

`yarn draft <CIRCUIT_NAME> <OVERWRITE_EXISTING>` to generate a new circuit template, with option to overwrite circuit with existing name.

`yarn call <CIRCUIT_NAME> <OPTIONAL-INPUT.json>` to generate solidity call data for `verifyProof()` in `verifier.sol`, with optional alternative input json.
