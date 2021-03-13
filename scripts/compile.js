require('dotenv').config();

const { execSync } = require('child_process');
const fs = require('fs');

const wasmOutPath = process.argv[2];
const zkeyOutPath = process.argv[3];
const deterministic = process.argv[4] === 'true';
const circuitsList = process.argv[5];

// TODO: add an option to generate with entropy for production keys

if (process.argv.length !== 6) {
  console.log('usage');
  console.log(
    'compile wasm_out_path zkey_out_path [`true` if deterministic / `false` if not] comma,seperated,list,of,circuits'
  );
  process.exit(1);
}

const cwd = process.cwd();

for (circuitName of circuitsList.split(',')) {
  if (!process.env[circuitName + '_beacon']) {
    console.log('ERROR! you probably dont have an .env file');
    process.exit(1);
  }

  process.chdir(cwd + '/circuits/' + circuitName);

  // doesnt catch yet
  // https://github.com/iden3/snarkjs/pull/75
  try {
    execSync(
      'npx circom circuit.circom --r1cs --wasm --sym',
      { stdio: 'inherit' }
    );
    execSync(
      'npx snarkjs r1cs info circuit.r1cs',
      { stdio: 'inherit' }
    );
    execSync(
      'npx snarkjs zkey new circuit.r1cs pot15_final.ptau circuit_' + circuitName + '.zkey',
      { stdio: 'inherit' }
    );
    if (deterministic) {
      execSync(
        'npx snarkjs zkey beacon circuit_' +
          circuitName +
          '.zkey circuit.zkey ' +
          process.env[circuitName + '_beacon'] +
          ' 10',
        { stdio: 'inherit' }
      );
    } else {
      execSync(
        'npx snarkjs zkey contribute circuit_' +
          circuitName +
          '.zkey circuit.zkey ' +
          `-e="${Date.now()}"`,
        { stdio: 'inherit' }
      );
    }
    execSync(
      'npx snarkjs zkey export verificationkey circuit.zkey verification_key.json',
      { stdio: 'inherit' }
    );
    execSync(
      'npx snarkjs wtns calculate circuit.wasm inputs/input.json witness.wtns',
      {
        stdio: 'inherit',
      }
    );
    execSync(
      'npx snarkjs groth16 prove circuit.zkey witness.wtns proof.json public.json',
      { stdio: 'inherit' }
    );
    execSync(
      'npx snarkjs groth16 verify verification_key.json public.json proof.json',
      { stdio: 'inherit' }
    );

    execSync(
      'mkdir -p ./compiled/',
      { stdio: 'inherit' }
    );
    execSync(
      'mkdir -p ./keys/',
      { stdio: 'inherit' }
    );
    execSync(
      'mkdir -p ./contracts/',
      { stdio: 'inherit' }
    );

    fs.copyFileSync(
      'circuit.wasm',
      cwd + '/circuits/' + circuitName + '/' + wasmOutPath + '/circuit.wasm'
    );
    fs.unlinkSync('circuit.wasm');
    fs.copyFileSync(
      'circuit.zkey',
      cwd + '/circuits/' + circuitName + '/' + zkeyOutPath + '/circuit_final.zkey'
    );
    fs.unlinkSync('circuit.zkey');
    fs.copyFileSync(
      'verification_key.json',
      cwd + '/circuits/' + circuitName + '/' + zkeyOutPath + '/verification_key.json'
    );
    fs.unlinkSync('verification_key.json');

    execSync(
      'npx snarkjs zkey export solidityverifier keys/circuit_final.zkey contracts/verifier.sol',
      { stdio: 'inherit' }
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
