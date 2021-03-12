const snarkjs = require("snarkjs");
const fs = require("fs");

const circuitsList = process.argv[2];

if (process.argv.length !== 3) {
  console.log('usage');
  console.log(
    'verify comma,seperated,list,of,circuits'
  );
  process.exit(1);
}

console.log(circuitsList);

async function run() {

  for (circuitName of circuitsList.split(',')) {

    const input = JSON.parse(fs.readFileSync("./circuits/" + circuitName + "/input.json"));

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(input,
      "./circuits/" + circuitName + "/compiled/circuit.wasm",
      "./circuits/" + circuitName + "/keys/circuit_final.zkey"
    );

    console.log("Proof: ");
    console.log(JSON.stringify(proof, null, 1));

    const vKey = JSON.parse(fs.readFileSync("./circuits/" + circuitName + "/keys/verification_key.json"));

    const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

    if (res === true) {
        console.log(circuitName + ": Verification OK");
    } else {
        console.log(circuitName + ": Invalid proof");
    }

  }

}

run().then(() => {
  process.exit(0);
});


// const snarkjs = require("snarkjs");
// const fs = require("fs");
//
// async function run() {
//   const { proof, publicSignals } = await snarkjs.groth16.fullProve(
//       {
//         "x": "1764",
//         "hash": "15893827533473716138720882070731822975159228540693753428689375377280130954696"
//       },
//         "./circuits/hash/compiled/circuit.wasm",
//         "./circuits/hash/keys/circuit_final.zkey"
//       );
//     console.log("Proof: ");
//     console.log(JSON.stringify(proof, null, 1));
//
//     const vKey = JSON.parse(fs.readFileSync("./circuits/hash/keys/verification_key.json"));
//
//     const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);
//
//     if (res === true) {
//         console.log("Verification OK");
//     } else {
//         console.log("Invalid proof");
//     }
//
// }
//
// run().then(() => {
//     process.exit(0);
// });
