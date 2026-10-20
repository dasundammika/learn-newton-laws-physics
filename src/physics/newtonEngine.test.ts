import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialState,
  computeForcesAndAcceleration,
  resolveTwoBodyCollision,
  stepSimulation,
  evaluateSymbolicRegression,
  type SimulationParams,
} from './newtonEngine.ts';

const baseParams: SimulationParams = {
  lawId: 'law2',
  appliedForce: 40,
  massA: 10,
  massB: 5,
  frictionCoeff: 0,
  gravity: 9.81,
  restitution: 1.0,
  latticeStiffness: 120,
};

test('Newton 1st Law: zero net force preserves constant velocity (inertia)', () => {
  const params: SimulationParams = {
    ...baseParams,
    lawId: 'law1',
    appliedForce: 0,
    frictionCoeff: 0,
  };
  let state = createInitialState(params);
  assert.equal(state.velocityA, 6.0);

  for (let i = 0; i < 20; i++) {
    state = stepSimulation(state, params, 0.02);
  }
  assert.equal(Number(state.velocityA.toFixed(4)), 6.0);
  assert.equal(state.accelerationA, 0);
  assert.equal(state.thermalEnergy, 0);
});

test('Newton 1st Law with friction: kinetic energy converts into microscopic lattice thermal energy', () => {
  const params: SimulationParams = {
    ...baseParams,
    lawId: 'law1',
    appliedForce: 0,
    massA: 10,
    frictionCoeff: 0.2,
  };
  let state = createInitialState(params);
  const initialKE = state.kineticEnergy;
  state = stepSimulation(state, params, 0.05);

  assert.ok(state.velocityA < 6.0, 'Velocity should decrease under kinetic friction');
  assert.ok(state.thermalEnergy > 0, 'Microscopic lattice thermal energy must increase');
  assert.ok(state.kineticEnergy < initialKE, 'Macroscopic kinetic energy must decrease');
});

test('Newton 2nd Law: F = m * a computes exact acceleration with and without friction', () => {
  const frictionless = computeForcesAndAcceleration(2.0, {
    ...baseParams,
    appliedForce: 50,
    massA: 10,
    frictionCoeff: 0,
  });
  assert.equal(frictionless.netForce, 50);
  assert.equal(frictionless.acceleration, 5.0);

  const withFriction = computeForcesAndAcceleration(2.0, {
    ...baseParams,
    appliedForce: 50,
    massA: 10,
    frictionCoeff: 0.1,
    gravity: 10,
  });
  // Normal force = 100N, kinetic friction = -10N, netForce = 40N, a = 4.0 m/s^2
  assert.equal(withFriction.frictionForce, -10);
  assert.equal(withFriction.netForce, 40);
  assert.equal(withFriction.acceleration, 4.0);
});

test('Newton 3rd Law: two-body elastic collision strictly conserves total momentum', () => {
  const mA = 12;
  const mB = 6;
  const vA = 5.0;
  const vB = -1.0;
  const initialMomentum = mA * vA + mB * vB;

  const { vAPost, vBPost, impulseMagnitude } = resolveTwoBodyCollision(vA, vB, mA, mB, 1.0);
  const finalMomentum = mA * vAPost + mB * vBPost;

  assert.ok(impulseMagnitude > 0);
  assert.equal(Number(finalMomentum.toFixed(6)), Number(initialMomentum.toFixed(6)));
});

test('PySR Symbolic Regression evaluator identifies exact net-force law with lowest MSE', () => {
  const candidates = evaluateSymbolicRegression({
    ...baseParams,
    appliedForce: 60,
    massA: 12,
    frictionCoeff: 0.15,
  });
  assert.equal(candidates.length, 3);
  const best = candidates.find((c) => c.id === 'sr_cand_3');
  assert.ok(best);
  assert.equal(best.mse, 0);
  assert.equal(best.isDiscoveredTruth, true);
});
