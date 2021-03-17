include "../../node_modules/circomlib/circuits/mimcsponge.circom"

template Main(n) {
  assert(n>2);

  signal private input a;
  signal input b;

  signal output out;

  signal x[n+1];
  x[0] <== a;
  x[1] <== b;

  signal y[n];
  signal z[n];

  for (var i = 1; i<n; i++) {
    y[i] <== x[i]*x[i];
    z[i] <== x[i-1]*x[i-1];
    x[i+1] <== y[i]+z[i];
  }

  out <== x[n];
}

component main = Main(42);
