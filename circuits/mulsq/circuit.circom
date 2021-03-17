include "../../node_modules/circomlib/circuits/mimcsponge.circom"

template Main() {
  signal private input a;
  signal input b;

  signal output out;

  signal x[2];
  x[0] <== a*a;
  x[1] <== b*b;

  out <== x[0] * x[1];
}

component main = Main();
