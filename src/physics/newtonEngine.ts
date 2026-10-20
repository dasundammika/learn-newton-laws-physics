/**
 * First-Principles Newtonian Mechanics & Particle Physics Engine
 * Pure TypeScript module (decoupled from DOM/Three.js for deterministic unit testing)
 */

export type LawId = 'law1' | 'law2' | 'law3' | 'particle_lab';

export type LanguageMode = 'mix' | 'sinhala' | 'english';

export interface SimulationParams {
  lawId: LawId;
  appliedForce: number;      // Newtons (N), range [-100, 100]
  massA: number;             // kg, range [1, 50]
  massB: number;             // kg, range [1, 50] (used in Law 3 & collisions)
  frictionCoeff: number;     // mu_k, range [0, 0.8]
  gravity: number;           // m/s^2, default 9.81
  restitution: number;       // e, range [0, 1] (elasticity for Law 3 / particle collisions)
  latticeStiffness: number;  // k_bond (N/m) for 3D JST-2 persistent atom lattice
}

export interface TelemetryPoint {
  t: number;
  positionA: number;
  velocityA: number;
  accelerationA: number;
  momentumA: number;
  positionB: number;
  velocityB: number;
  momentumB: number;
  netForce: number;
  frictionForce: number;
  normalForce: number;
  kineticEnergy: number;
  thermalEnergy: number;
}

export interface SimulationState {
  time: number;
  positionA: number;
  velocityA: number;
  accelerationA: number;
  positionB: number;
  velocityB: number;
  accelerationB: number;
  netForce: number;
  frictionForce: number;
  normalForce: number;
  weightForce: number;
  reactionForce: number; // Law 3 equal & opposite force magnitude
  kineticEnergy: number;
  thermalEnergy: number; // Accumulated microscopic lattice heat from friction
  atomCount: number;     // Number of persistent 3D atoms (mA * 3)
  perAtomForce: number;  // First-principles force per persistent atom
  contactActive: boolean;
  history: TelemetryPoint[];
}

export interface SymbolicCandidate {
  id: string;
  equationLatex: string;
  equationPlain: string;
  complexity: number;
  mse: number;
  rSquared: number;
  isDiscoveredTruth: boolean;
  treeNodes: { label: string; children?: { label: string; children?: { label: string }[] }[] };
  sinhalaNote: string;
  englishNote: string;
}

export function createInitialState(params: SimulationParams): SimulationState {
  const normalForce = params.massA * params.gravity;
  const atomCount = Math.max(8, Math.round(params.massA * 2.7));
  return {
    time: 0,
    positionA: params.lawId === 'law3' ? -4.0 : 0,
    velocityA: params.lawId === 'law1' ? 6.0 : 0, // Law 1 starts with coasting velocity to demonstrate inertia!
    accelerationA: 0,
    positionB: 4.0,
    velocityB: 0,
    accelerationB: 0,
    netForce: 0,
    frictionForce: 0,
    normalForce,
    weightForce: normalForce,
    reactionForce: 0,
    kineticEnergy: params.lawId === 'law1' ? 0.5 * params.massA * 36.0 : 0,
    thermalEnergy: 0,
    atomCount,
    perAtomForce: 0,
    contactActive: false,
    history: [],
  };
}

/**
 * Computes net force, friction force, and acceleration from First Principles
 */
export function computeForcesAndAcceleration(
  velocity: number,
  params: SimulationParams
): {
  netForce: number;
  frictionForce: number;
  normalForce: number;
  acceleration: number;
} {
  const normalForce = params.massA * params.gravity;
  const maxFriction = params.frictionCoeff * normalForce;

  let frictionForce = 0;
  const speedEps = 0.02;

  if (Math.abs(velocity) > speedEps) {
    // Kinetic friction opposes motion (microscopic surface atom interlocking)
    frictionForce = -Math.sign(velocity) * maxFriction;
  } else {
    // Static friction opposes applied force up to maxFriction
    if (Math.abs(params.appliedForce) <= maxFriction) {
      frictionForce = -params.appliedForce;
    } else {
      frictionForce = -Math.sign(params.appliedForce) * maxFriction;
    }
  }

  let netForce = params.appliedForce + frictionForce;
  if (Math.abs(velocity) <= speedEps && Math.abs(params.appliedForce) <= maxFriction) {
    netForce = 0;
  }

  const acceleration = netForce / Math.max(0.1, params.massA);

  return {
    netForce,
    frictionForce,
    normalForce,
    acceleration,
  };
}

/**
 * Resolves 1D elastic/inelastic collision between Body A and Body B (Newton's 3rd Law)
 * Conservation of Momentum: mA*vA + mB*vB = mA*vA' + mB*vB'
 */
export function resolveTwoBodyCollision(
  vA: number,
  vB: number,
  mA: number,
  mB: number,
  restitution: number
): { vAPost: number; vBPost: number; impulseMagnitude: number } {
  const relVel = vA - vB;
  // Only collide if approaching each other
  if (relVel <= 0) {
    return { vAPost: vA, vBPost: vB, impulseMagnitude: 0 };
  }
  const e = Math.max(0, Math.min(1, restitution));
  const totalMass = mA + mB;
  const impulseMagnitude = ((1 + e) * mA * mB * relVel) / totalMass;

  const vAPost = vA - impulseMagnitude / mA;
  const vBPost = vB + impulseMagnitude / mB;

  return { vAPost, vBPost, impulseMagnitude };
}

/**
 * Steps the physics simulation forward by dt seconds
 */
export function stepSimulation(
  state: SimulationState,
  params: SimulationParams,
  dt: number
): SimulationState {
  const clampedDt = Math.min(Math.max(dt, 0.001), 0.05);
  const nextTime = state.time + clampedDt;

  let posA = state.positionA;
  let velA = state.velocityA;
  let accA = 0;
  let posB = state.positionB;
  let velB = state.velocityB;
  let accB = 0;
  let netForce = 0;
  let frictionForce = 0;
  let reactionForce = 0;
  let contactActive = false;
  let dThermal = 0;

  const normalForce = params.massA * params.gravity;

  if (params.lawId === 'law3') {
    // Law 3: Action-Reaction between Pod A and Pod B
    // Continuous magnetic/thruster interaction when close, or applied thruster force pair
    const distance = posB - posA;
    const minSep = 2.2;

    // Mutual action-reaction force when thruster is active or pods repel
    const mutualForce = Math.abs(params.appliedForce);
    const frictionA = Math.abs(velA) > 0.02 ? -Math.sign(velA) * params.frictionCoeff * params.massA * params.gravity : 0;
    const frictionB = Math.abs(velB) > 0.02 ? -Math.sign(velB) * params.frictionCoeff * params.massB * params.gravity : 0;

    if (distance <= minSep && velA - velB > 0) {
      const col = resolveTwoBodyCollision(velA, velB, params.massA, params.massB, params.restitution);
      velA = col.vAPost;
      velB = col.vBPost;
      reactionForce = col.impulseMagnitude / clampedDt;
      contactActive = true;
      posA = (posA + posB) / 2 - minSep / 2;
      posB = posA + minSep;
    } else {
      // Action force on B (+mutualForce), Reaction force on A (-mutualForce)
      const forceOnA = -params.appliedForce + frictionA;
      const forceOnB = params.appliedForce + frictionB;
      accA = forceOnA / params.massA;
      accB = forceOnB / params.massB;
      velA += accA * clampedDt;
      velB += accB * clampedDt;
      reactionForce = mutualForce;
    }

    posA += velA * clampedDt;
    posB += velB * clampedDt;

    // Arena boundary bounce so pods stay inside viewable 3D stage [-14, 14]
    const bound = 13.5;
    if (posA < -bound) {
      posA = -bound;
      velA = Math.abs(velA) * 0.75;
    }
    if (posB > bound) {
      posB = bound;
      velB = -Math.abs(velB) * 0.75;
    }
    if (posA > posB - minSep) {
      posA = posB - minSep;
    }

    netForce = params.appliedForce;
    frictionForce = frictionA;
  } else {
    // Law 1, Law 2, and Particle Lab
    const forces = computeForcesAndAcceleration(velA, params);
    netForce = forces.netForce;
    frictionForce = forces.frictionForce;
    accA = forces.acceleration;

    const nextVel = velA + accA * clampedDt;
    // Prevent friction from reversing velocity across zero in a single timestep
    if (
      params.appliedForce === 0 &&
      Math.sign(nextVel) !== Math.sign(velA) &&
      Math.abs(velA) < 0.5
    ) {
      velA = 0;
      accA = 0;
    } else {
      velA = nextVel;
    }

    posA += velA * clampedDt;

    // Wrap around track [-10, 10] so motion stays centered in the 3D viewport
    if (posA > 10) posA = -10;
    if (posA < -10) posA = 10;

    // Microscopic thermal energy generated by friction: dE_thermal = |f_k * v * dt|
    dThermal = Math.abs(frictionForce * velA * clampedDt);
    reactionForce = normalForce;
  }

  const kineticEnergy =
    0.5 * params.massA * velA * velA +
    (params.lawId === 'law3' ? 0.5 * params.massB * velB * velB : 0);

  const atomCount = Math.max(8, Math.round(params.massA * 2.7));
  const perAtomForce = netForce / atomCount;

  const point: TelemetryPoint = {
    t: Number(nextTime.toFixed(2)),
    positionA: Number(posA.toFixed(3)),
    velocityA: Number(velA.toFixed(3)),
    accelerationA: Number(accA.toFixed(3)),
    momentumA: Number((params.massA * velA).toFixed(3)),
    positionB: Number(posB.toFixed(3)),
    velocityB: Number(velB.toFixed(3)),
    momentumB: Number((params.massB * velB).toFixed(3)),
    netForce: Number(netForce.toFixed(2)),
    frictionForce: Number(frictionForce.toFixed(2)),
    normalForce: Number(normalForce.toFixed(2)),
    kineticEnergy: Number(kineticEnergy.toFixed(2)),
    thermalEnergy: Number((state.thermalEnergy + dThermal).toFixed(2)),
  };

  const history = [...state.history.slice(-79), point];

  return {
    time: nextTime,
    positionA: posA,
    velocityA: velA,
    accelerationA: accA,
    positionB: posB,
    velocityB: velB,
    accelerationB: accB,
    netForce,
    frictionForce,
    normalForce,
    weightForce: normalForce,
    reactionForce,
    kineticEnergy,
    thermalEnergy: state.thermalEnergy + dThermal,
    atomCount,
    perAtomForce,
    contactActive,
    history,
  };
}

/**
 * PySR-2 Inspired Symbolic Regression Pareto Frontier Evaluator
 * Evaluates candidate mathematical formulas against current physical parameters & history
 */
export function evaluateSymbolicRegression(params: SimulationParams): SymbolicCandidate[] {
  const { appliedForce: F, massA: m, frictionCoeff: mu, gravity: g } = params;
  const { netForce, acceleration: trueA } = computeForcesAndAcceleration(2.5, params);

  // Generate 5 synthetic observation states around current (F, m, mu) to compute realistic MSE
  const samples = [0.6, 0.8, 1.0, 1.2, 1.4].map((scale) => {
    const fSample = F * scale;
    const mSample = Math.max(1, m * (2 - scale * 0.5));
    const fFriction = mu * mSample * g;
    const fNet = Math.abs(fSample) > fFriction ? fSample - Math.sign(fSample || 1) * fFriction : 0;
    const aActual = fNet / mSample;
    return { F: fSample, m: mSample, mu, g, fNet, aActual };
  });

  const mseFor = (fn: (s: typeof samples[0]) => number) => {
    const sumSq = samples.reduce((acc, s) => {
      const err = fn(s) - s.aActual;
      return acc + err * err;
    }, 0);
    return Number((sumSq / samples.length).toFixed(4));
  };

  if (params.lawId === 'law3') {
    return [
      {
        id: 'sr_law3_1',
        equationLatex: 'F_{AB} = F_{BA}',
        equationPlain: 'F_AB = +F_BA (Same Direction Error)',
        complexity: 3,
        mse: Number((Math.pow(2 * (F || 10), 2)).toFixed(2)),
        rSquared: 0.12,
        isDiscoveredTruth: false,
        treeNodes: { label: '=', children: [{ label: 'F_AB' }, { label: 'F_BA' }] },
        sinhalaNote: 'දිශාවන් දෙක එකම ලෙස ගත් විට ගම්‍යතා සංස්ථිතිය බිඳ වැටේ.',
        englishNote: 'Fails momentum conservation because opposing vector sign is missing.',
      },
      {
        id: 'sr_law3_2',
        equationLatex: '\\vec{F}_{AB} = -\\vec{F}_{BA}',
        equationPlain: 'F_AB = -F_BA (Exact Action-Reaction)',
        complexity: 4,
        mse: 0.0001,
        rSquared: 0.9999,
        isDiscoveredTruth: true,
        treeNodes: {
          label: '=',
          children: [
            { label: 'F_A→B' },
            { label: '− (Negate)', children: [{ label: 'F_B→A' }] },
          ],
        },
        sinhalaNote: 'PySR සොයාගත් සත්‍ය සමීකරණය: සෑම ක්‍රියාවකටම විශාලත්වයෙන් සමාන හා දිශාවෙන් ප්‍රතිවිරුද්ධ ප්‍රතික්‍රියාවක් ඇත!',
        englishNote: 'Pareto-optimal symbolic law: equal magnitude and opposite vector direction.',
      },
      {
        id: 'sr_law3_3',
        equationLatex: 'm_A \\Delta v_A + m_B \\Delta v_B = 0',
        equationPlain: 'm_A * dv_A = -m_B * dv_B (Momentum Form)',
        complexity: 7,
        mse: 0.0001,
        rSquared: 1.0,
        isDiscoveredTruth: true,
        treeNodes: {
          label: '+',
          children: [
            { label: '×', children: [{ label: 'm_A' }, { label: 'Δv_A' }] },
            { label: '×', children: [{ label: 'm_B' }, { label: 'Δv_B' }] },
          ],
        },
        sinhalaNote: 'ස්කන්ධ දෙක අසමාන වුවද මුළු ගම්‍යතා වෙනස ශුන්‍ය වේ (අඩු ස්කන්ධයට වැඩි ත්වරණයක් ලැබේ).',
        englishNote: 'First-principles momentum conservation derived by integrating F_AB = -F_BA over collision time dt.',
      },
    ];
  }

  const mseLinear = mseFor((s) => 0.15 * s.F);
  const mseNoFriction = mseFor((s) => s.F / s.m);
  const mseExact = mseFor((s) => s.fNet / s.m);

  return [
    {
      id: 'sr_cand_1',
      equationLatex: 'a = k \\cdot F',
      equationPlain: 'a = 0.15 * F (Aristotelian / Mass-Blind)',
      complexity: 3,
      mse: Math.max(0.42, mseLinear),
      rSquared: 0.48,
      isDiscoveredTruth: false,
      treeNodes: {
        label: '×',
        children: [{ label: '0.15' }, { label: 'F_applied' }],
      },
      sinhalaNote: 'ස්කන්ධය (m) නොසලකා හරින නිසා බර වස්තූන් සඳහා විශාල දෝෂයක් (MSE) පෙන්වයි.',
      englishNote: 'Ignores inertial mass (m); fails when mass changes across trials.',
    },
    {
      id: 'sr_cand_2',
      equationLatex: 'a = \\frac{F}{m}',
      equationPlain: 'a = F_applied / m (Ideal Vacuum Law)',
      complexity: 5,
      mse: mu === 0 ? 0.0001 : Math.max(0.08, mseNoFriction),
      rSquared: mu === 0 ? 0.9999 : 0.86,
      isDiscoveredTruth: mu === 0,
      treeNodes: {
        label: '÷ (Divide)',
        children: [{ label: 'F_applied' }, { label: 'm (Mass)' }],
      },
      sinhalaNote:
        mu === 0
          ? 'ඝර්ෂණය ශුන්‍ය (μ = 0) විට පරිපූර්ණව ගැලපෙන නිව්ටන්ගේ දෙවන නියමය!'
          : `ඝර්ෂණය (μ = ${mu.toFixed(2)}) ඇති විට ශුද්ධ බලය වෙනුවට යෙදූ බලය පමණක් ගැනීමෙන් සුළු දෝෂයක් ඇතිවේ.`,
      englishNote:
        mu === 0
          ? 'Exact Pareto-optimal match in frictionless vacuum space!'
          : `Close fit, but misses microscopic surface friction loss (f_k = ${(mu * m * g).toFixed(1)} N).`,
    },
    {
      id: 'sr_cand_3',
      equationLatex: 'a = \\frac{F - \\mu m g}{m}',
      equationPlain: 'a = (F_applied - μ·m·g) / m (Full Net-Force Law)',
      complexity: 9,
      mse: mseExact,
      rSquared: 0.9999,
      isDiscoveredTruth: true,
      treeNodes: {
        label: '÷ (Divide)',
        children: [
          {
            label: '− (Net Force)',
            children: [{ label: 'F_applied' }, { label: 'f_friction (μmg)' }],
          },
          { label: 'm (Mass = N*m0)' },
        ],
      },
      sinhalaNote:
        `සම්පූර්ණ සත්‍ය සමීකරණය: යෙදූ බලයෙන් ඝර්ෂණ බලය අඩු කළ පසු ලැබෙන සම්ප්‍රයුක්ත බලය (${netForce.toFixed(1)} N) ස්කන්ධයෙන් (${m} kg) බෙදූ විට සැබෑ ත්වරණය (${trueA.toFixed(2)} m/s²) ලැබේ!`,
      englishNote:
        `Exact First-Principles discovery: Net Force (${netForce.toFixed(1)} N) divided by total atomic mass (${m} kg) yields ${trueA.toFixed(2)} m/s².`,
    },
  ];
}
