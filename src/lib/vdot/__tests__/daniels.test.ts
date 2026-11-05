import {
  calculateVDOT,
  calculateVO2Cost,
  calculateSustainableFraction,
  velocityFromVO2,
  predictRaceTimeMinutes,
  calculateTrainingZones,
  calculateRacePredictions,
  computeVDOTResult,
} from '../daniels';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
}

function runTests() {
  console.log('--- Running Daniels-Gilbert Scientific Tests ---');

  // Test 1: Reference 5km in 25:00 -> VDOT ~ 38.3
  const vdot25 = calculateVDOT(5000, 25);
  console.log(`5km in 25:00: VDOT = ${vdot25.toFixed(2)} (Expected ~ 38.3)`);
  assert(Math.abs(vdot25 - 38.3) < 0.1, '5km in 25:00 should yield VDOT ~ 38.3');

  // Test 2: Reference 5km in 20:00 -> VDOT ~ 49.8
  const vdot20 = calculateVDOT(5000, 20);
  console.log(`5km in 20:00: VDOT = ${vdot20.toFixed(2)} (Expected ~ 49.8)`);
  assert(Math.abs(vdot20 - 49.8) < 0.1, '5km in 20:00 should yield VDOT ~ 49.8');

  // Test 3: Reversibility of VO2 and velocity
  const testVelocity = 250; // 250 m/min = 4:00/km
  const vo2 = calculateVO2Cost(testVelocity);
  const recoveredVelocity = velocityFromVO2(vo2);
  console.log(`Reversibility test: input v=${testVelocity}, recovered=${recoveredVelocity.toFixed(4)}`);
  assert(Math.abs(testVelocity - recoveredVelocity) < 0.001, 'VO2 inversion must match original velocity');

  // Test 4: Inverse Race Prediction Root Finding
  const predicted5kTime = predictRaceTimeMinutes(5000, vdot20);
  console.log(`Inverse predicted 5k time for VDOT ${vdot20.toFixed(2)}: ${predicted5kTime.toFixed(4)} min (Expected: 20.000)`);
  assert(Math.abs(predicted5kTime - 20) < 0.01, 'Predicted 5km time must match 20 minutes');

  // Test 5: Training zones order (E should be slower than M, M slower than T, T slower than I, I slower than R)
  const zones = calculateTrainingZones(vdot20);
  assert(zones.length === 5, 'Must have 5 zones (E, M, T, I, R)');
  const [e, m, t, i, r] = zones;
  // Lower pace sec/km = faster speed
  assert(e.paceSecPerKmMin > m.paceSecPerKmMin, 'Zone E must be slower than Zone M');
  assert(m.paceSecPerKmMin > t.paceSecPerKmMin, 'Zone M must be slower than Zone T');
  assert(t.paceSecPerKmMin > i.paceSecPerKmMin, 'Zone T must be slower than Zone I');
  assert(i.paceSecPerKmMin > r.paceSecPerKmMin, 'Zone I must be slower than Zone R');
  console.log('Training zones speed hierarchy verified: E < M < T < I < R');

  // Test 6: Full result computation
  const result = computeVDOTResult(5000, 1500, 'official_race');
  assert(result.vdot === 38.3, 'Rounded VDOT must be 38.3');
  assert(result.predictions.length === 7, 'Must have 7 race predictions');
  console.log('Full VDOT Result object verified successfully.');

  console.log('✅ ALL DANIELS-GILBERT SCIENTIFIC TESTS PASSED!\n');
}

runTests();
