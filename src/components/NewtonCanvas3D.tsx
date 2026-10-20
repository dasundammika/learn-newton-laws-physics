import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { SimulationParams, SimulationState } from '../physics/newtonEngine';

export type CameraPreset = 'isometric' | 'side' | 'top' | 'chase';

interface NewtonCanvas3DProps {
  params: SimulationParams;
  simState: SimulationState;
  isPlaying: boolean;
  showVectors: boolean;
  showAtomLattice: boolean;
  showPhaseGrid: boolean;
  cameraPreset: CameraPreset;
  onStepFrame: (dt: number) => void;
}

// Pre-allocated scratch math objects (Zero GC in render loop)
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _currentLookAt = new THREE.Vector3(0, 1.2, 0);
const _tempVec = new THREE.Vector3();
const _atomOffset = new THREE.Vector3();

function createTrackRulerTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Dark obsidian laboratory track surface
  ctx.fillStyle = '#0d1322';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle longitudinal maglev rails
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 48, canvas.width, 18);
  ctx.fillRect(0, canvas.height - 66, canvas.width, 18);

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 56, canvas.width, 2);
  ctx.strokeRect(0, canvas.height - 58, canvas.width, 2);

  // Distance tick marks every 1 meter from -16m to +16m
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 22px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';

  const totalMeters = 32;
  for (let m = -16; m <= 16; m++) {
    const u = (m + 16) / totalMeters;
    const x = u * canvas.width;
    const isMajor = m % 2 === 0;
    ctx.strokeStyle = m === 0 ? '#38bdf8' : isMajor ? '#475569' : '#1e293b';
    ctx.lineWidth = m === 0 ? 4 : isMajor ? 2.5 : 1.5;
    ctx.beginPath();
    ctx.moveTo(x, isMajor ? 20 : 80);
    ctx.lineTo(x, isMajor ? canvas.height - 20 : canvas.height - 80);
    ctx.stroke();

    if (isMajor && m > -16 && m < 16) {
      ctx.fillStyle = m === 0 ? '#38bdf8' : '#cbd5e1';
      ctx.fillText(`${m > 0 ? '+' : ''}${m}m`, x, canvas.height / 2 + 8);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  return texture;
}

function createVectorArrow(colorHex: number): {
  group: THREE.Group;
  setVector: (dirX: number, dirY: number, dirZ: number, length: number) => void;
} {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color: colorHex,
    emissive: colorHex,
    emissiveIntensity: 0.35,
    roughness: 0.25,
    metalness: 0.4,
  });

  const shaftGeo = new THREE.CylinderGeometry(0.065, 0.065, 1, 16);
  shaftGeo.translate(0, 0.5, 0);
  const shaft = new THREE.Mesh(shaftGeo, mat);

  const headGeo = new THREE.ConeGeometry(0.18, 0.42, 20);
  headGeo.translate(0, 0.21, 0);
  const head = new THREE.Mesh(headGeo, mat);

  group.add(shaft, head);

  const setVector = (dirX: number, dirY: number, dirZ: number, length: number) => {
    if (length < 0.05) {
      group.visible = false;
      return;
    }
    group.visible = true;
    const clampedLen = Math.min(Math.max(length, 0.35), 5.5);
    const shaftLen = Math.max(0.15, clampedLen - 0.42);
    shaft.scale.set(1, shaftLen, 1);
    head.position.set(0, shaftLen, 0);

    _tempVec.set(dirX, dirY, dirZ).normalize();
    group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), _tempVec);
  };

  return { group, setVector };
}

/**
 * Builds a composite 9-part procedural 3D Physics Sled / Spacecraft Pod (THREE.Group)
 * with grounded bottom-center pivot and internal JST-2 Persistent 3D Atom Lattice
 */
function createCompositePhysicsPod(
  primaryHex: number,
  accentHex: number
): {
  root: THREE.Group;
  hullShell: THREE.Group;
  cargoBlocks: THREE.Mesh[];
  thrusterFlameLeft: THREE.Mesh;
  thrusterFlameRight: THREE.Mesh;
  latticeGroup: THREE.Group;
  atomMeshes: { mesh: THREE.Mesh; basePos: THREE.Vector3; ix: number; iy: number; iz: number }[];
  bondLines: THREE.LineSegments;
} {
  const root = new THREE.Group();
  const hullShell = new THREE.Group();

  // 1. Primary Silhouette: Beveled ExtrudeGeometry Chassis Hull (matte roughness 0.7)
  const hullShape = new THREE.Shape();
  hullShape.moveTo(-1.1, 0.18);
  hullShape.lineTo(1.1, 0.18);
  hullShape.lineTo(1.25, 0.55);
  hullShape.lineTo(0.85, 0.85);
  hullShape.lineTo(-0.85, 0.85);
  hullShape.lineTo(-1.25, 0.55);
  hullShape.closePath();

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 1.3,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.06,
    bevelThickness: 0.06,
  };
  const hullGeo = new THREE.ExtrudeGeometry(hullShape, extrudeSettings);
  hullGeo.translate(0, 0, -0.65);

  const hullMat = new THREE.MeshStandardMaterial({
    color: primaryHex,
    roughness: 0.68,
    metalness: 0.35,
  });
  const hullMesh = new THREE.Mesh(hullGeo, hullMat);
  hullMesh.castShadow = true;
  hullMesh.receiveShadow = true;
  hullShell.add(hullMesh);

  // 2. Secondary Read: Brushed Metallic Trim Rails (roughness 0.22, metalness 0.88)
  const railMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.22,
    metalness: 0.88,
  });
  const railGeo = new THREE.BoxGeometry(2.3, 0.09, 0.12);
  const railFront = new THREE.Mesh(railGeo, railMat);
  railFront.position.set(0, 0.52, 0.72);
  const railBack = new THREE.Mesh(railGeo, railMat);
  railBack.position.set(0, 0.52, -0.72);
  hullShell.add(railFront, railBack);

  // 3. Secondary Read: 4 Maglev Superconducting Levitation Skates
  const skateMat = new THREE.MeshStandardMaterial({
    color: accentHex,
    emissive: accentHex,
    emissiveIntensity: 0.25,
    roughness: 0.3,
    metalness: 0.8,
  });
  const skateGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.14, 20);
  const skateOffsets = [
    [-0.75, 0.09, 0.52],
    [0.75, 0.09, 0.52],
    [-0.75, 0.09, -0.52],
    [0.75, 0.09, -0.52],
  ];
  skateOffsets.forEach(([sx, sy, sz]) => {
    const skate = new THREE.Mesh(skateGeo, skateMat);
    skate.position.set(sx, sy, sz);
    hullShell.add(skate);
  });

  // 4. Secondary Read: Optical Transmissive Canopy Dome (roughness 0.12)
  const domeGeo = new THREE.SphereGeometry(0.55, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
  const domeMat = new THREE.MeshPhysicalMaterial({
    color: 0xbae6fd,
    transparent: true,
    opacity: 0.42,
    roughness: 0.12,
    metalness: 0.05,
    clearcoat: 1.0,
    depthWrite: false,
  });
  const dome = new THREE.Mesh(domeGeo, domeMat);
  dome.position.set(0, 0.85, 0);
  dome.scale.set(1.35, 0.85, 0.95);
  dome.renderOrder = 2;
  hullShell.add(dome);

  // 5. Accent Detail: Dual Lathe-style Thruster Nozzles on Left (-X) and Right (+X)
  const nozzleGeo = new THREE.CylinderGeometry(0.14, 0.24, 0.28, 20);
  nozzleGeo.rotateZ(Math.PI / 2);
  const nozzleMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.32,
    metalness: 0.9,
  });
  const nozzleLeft = new THREE.Mesh(nozzleGeo, nozzleMat);
  nozzleLeft.position.set(-1.32, 0.52, 0);
  const nozzleRight = new THREE.Mesh(nozzleGeo.clone().rotateZ(Math.PI), nozzleMat);
  nozzleRight.position.set(1.32, 0.52, 0);
  hullShell.add(nozzleLeft, nozzleRight);

  // 6. Active Plasma Thruster Plumes
  const flameGeo = new THREE.ConeGeometry(0.2, 0.9, 16);
  const flameMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.85,
  });
  const flameLeft = new THREE.Mesh(flameGeo.clone().rotateZ(Math.PI / 2), flameMat);
  flameLeft.position.set(-1.85, 0.52, 0);
  flameLeft.visible = false;

  const flameRight = new THREE.Mesh(flameGeo.clone().rotateZ(-Math.PI / 2), flameMat);
  flameRight.position.set(1.85, 0.52, 0);
  flameRight.visible = false;
  root.add(flameLeft, flameRight);

  // 7. Dynamic Mass Payload Blocks (stack visually as student increases mass slider!)
  const cargoBlocks: THREE.Mesh[] = [];
  const blockGeo = new THREE.BoxGeometry(0.32, 0.22, 0.36);
  const blockMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.38,
    metalness: 0.65,
  });
  for (let i = 0; i < 8; i++) {
    const block = new THREE.Mesh(blockGeo, blockMat);
    const row = Math.floor(i / 4);
    const col = i % 4;
    block.position.set(-0.54 + col * 0.36, 0.98 + row * 0.25, 0);
    hullShell.add(block);
    cargoBlocks.push(block);
  }

  // 8. Soft Radial Contact Shadow Disc at bottom-center (y = 0.015, no Z-fighting)
  const shadowGeo = new THREE.CircleGeometry(1.45, 32);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x020617,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  });
  const shadowDisc = new THREE.Mesh(shadowGeo, shadowMat);
  shadowDisc.position.set(0, 0.015, 0);
  root.add(shadowDisc);

  // 9. JST-2 Persistent 3D Atom Lattice (3x3x3 = 27 atoms + harmonic spring bonds)
  const latticeGroup = new THREE.Group();
  const atomGeo = new THREE.SphereGeometry(0.11, 16, 16);
  const atomMeshes: { mesh: THREE.Mesh; basePos: THREE.Vector3; ix: number; iy: number; iz: number }[] = [];

  for (let ix = -1; ix <= 1; ix++) {
    for (let iy = 0; iy <= 2; iy++) {
      for (let iz = -1; iz <= 1; iz++) {
        const atomMat = new THREE.MeshStandardMaterial({
          color: ix === 1 ? 0x38bdf8 : ix === -1 ? 0xf59e0b : 0xa855f7,
          emissive: ix === 1 ? 0x0284c7 : 0x4f46e5,
          emissiveIntensity: 0.45,
          roughness: 0.2,
          metalness: 0.3,
        });
        const m = new THREE.Mesh(atomGeo, atomMat);
        const basePos = new THREE.Vector3(ix * 0.55, 0.35 + iy * 0.45, iz * 0.42);
        m.position.copy(basePos);
        latticeGroup.add(m);
        atomMeshes.push({ mesh: m, basePos, ix, iy, iz });
      }
    }
  }

  // Pre-build line segments for inter-atomic bonds
  const bondPositions = new Float32Array(27 * 6 * 3);
  const bondGeo = new THREE.BufferGeometry();
  bondGeo.setAttribute('position', new THREE.BufferAttribute(bondPositions, 3));
  const bondMat = new THREE.LineBasicMaterial({
    color: 0x7dd3fc,
    transparent: true,
    opacity: 0.65,
  });
  const bondLines = new THREE.LineSegments(bondGeo, bondMat);
  latticeGroup.add(bondLines);

  root.add(hullShell, latticeGroup);

  return {
    root,
    hullShell,
    cargoBlocks,
    thrusterFlameLeft: flameLeft,
    thrusterFlameRight: flameRight,
    latticeGroup,
    atomMeshes,
    bondLines,
  };
}

export const NewtonCanvas3D: React.FC<NewtonCanvas3DProps> = ({
  params,
  simState,
  isPlaying,
  showVectors,
  showAtomLattice,
  showPhaseGrid,
  cameraPreset,
  onStepFrame,
}) => {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);

  // Store latest React state/callbacks in refs so WebGLRenderer is initialized strictly once
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const stateRef = useRef(simState);
  stateRef.current = simState;

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const showVectorsRef = useRef(showVectors);
  showVectorsRef.current = showVectors;

  const showAtomLatticeRef = useRef(showAtomLattice);
  showAtomLatticeRef.current = showAtomLattice;

  const showPhaseGridRef = useRef(showPhaseGrid);
  showPhaseGridRef.current = showPhaseGrid;

  const cameraPresetRef = useRef(cameraPreset);
  cameraPresetRef.current = cameraPreset;

  const onStepFrameRef = useRef(onStepFrame);
  onStepFrameRef.current = onStepFrame;

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    const isHeadless =
      navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);

    const width = container.clientWidth || 960;
    const height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090d16);
    scene.fog = new THREE.FogExp2(0x090d16, 0.018);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200);
    camera.position.set(0, 6.8, 14.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isHeadless,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio PBR Environment Reflection via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Balanced 3-Point Warm/Cool Studio Lighting
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    keyLight.position.set(10, 18, 12);
    keyLight.castShadow = !isHeadless;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -18;
    keyLight.shadow.camera.right = 18;
    keyLight.shadow.camera.top = 10;
    keyLight.shadow.camera.bottom = -10;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x0ea5e9, 1.1);
    rimLight.position.set(-12, 8, -10);
    scene.add(rimLight);

    // OrbitControls for interactive 360 inspection
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.minDistance = 4;
    controls.maxDistance = 32;

    // Grounded Track Platform & Distance Ruler
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const rulerTex = createTrackRulerTexture(maxAnisotropy);
    const trackGeo = new THREE.PlaneGeometry(34, 4.4);
    trackGeo.rotateX(-Math.PI / 2);
    const trackMat = new THREE.MeshStandardMaterial({
      map: rulerTex,
      color: 0xffffff,
      roughness: 0.45,
      metalness: 0.2,
    });
    const trackMesh = new THREE.Mesh(trackGeo, trackMat);
    trackMesh.position.y = 0;
    trackMesh.receiveShadow = true;
    scene.add(trackMesh);

    // ManimGX 3D Coordinate Phase Grid (offset at y = -0.02 to prevent coplanar Z-fighting)
    const phaseGrid = new THREE.GridHelper(44, 44, 0x0284c7, 0x1e293b);
    phaseGrid.position.y = -0.02;
    scene.add(phaseGrid);

    // JST-2 3D Bounding World Box Frame (Reference Image 1 homage: "Persistent atoms in 3D space")
    const worldBoxGeo = new THREE.BoxGeometry(28, 6.5, 4.8);
    const worldBoxEdges = new THREE.EdgesGeometry(worldBoxGeo);
    const worldBoxLine = new THREE.LineSegments(
      worldBoxEdges,
      new THREE.LineBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.55 })
    );
    worldBoxLine.position.set(0, 3.25, 0);
    scene.add(worldBoxLine);

    // Create Pod A (Primary Subject) and Pod B (Law 3 Partner Subject)
    const podA = createCompositePhysicsPod(0x1e293b, 0x0ea5e9);
    const podB = createCompositePhysicsPod(0x31102f, 0xf43f5e);
    scene.add(podA.root);
    scene.add(podB.root);

    // Create ManimGX 3D Vector Arrows for Forces & Velocity
    const vecAppliedA = createVectorArrow(0x38bdf8);   // Sky blue: Applied Force F
    const vecFrictionA = createVectorArrow(0xf59e0b);  // Amber: Friction Force f_k
    const vecNormalA = createVectorArrow(0x10b981);    // Emerald: Normal Force N
    const vecWeightA = createVectorArrow(0xa855f7);    // Violet: Weight mg
    const vecActionB = createVectorArrow(0xf43f5e);    // Coral Red: Action Force on B (Law 3)

    scene.add(
      vecAppliedA.group,
      vecFrictionA.group,
      vecNormalA.group,
      vecWeightA.group,
      vecActionB.group
    );

    // Pre-warm shaders
    renderer.compile(scene, camera);

    // Resize observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 960;
      const h = container.clientHeight || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let animId = 0;
    let lastTime = performance.now();
    let elapsedTotal = 0;

    const animate = (now: number) => {
      animId = requestAnimationFrame(animate);

      const rawDt = (now - lastTime) / 1000;
      // Throttle headless software rendering to ~15fps so snapshots/screenshots never stall
      if (isHeadless && rawDt < 0.06) {
        return;
      }
      lastTime = now;
      const dt = Math.min(rawDt, 0.05);
      elapsedTotal += dt;

      if (isPlayingRef.current) {
        onStepFrameRef.current(dt);
      }

      const p = paramsRef.current;
      const s = stateRef.current;

      // Update visibility of Phase Grid & World Lattice
      phaseGrid.visible = showPhaseGridRef.current;
      worldBoxLine.visible = showPhaseGridRef.current;

      // Toggle between Solid Composite Hull vs JST-2 Persistent 3D Atom Lattice
      const atomMode = showAtomLatticeRef.current || p.lawId === 'particle_lab';
      podA.hullShell.visible = !atomMode;
      podA.latticeGroup.visible = true; // Always visible inside glass dome, or prominent in atomMode

      // Update Pod A position & cargo blocks
      podA.root.position.set(s.positionA, 0, 0);
      const visibleBlocksA = Math.min(8, Math.max(1, Math.round(p.massA / 6)));
      podA.cargoBlocks.forEach((blk, idx) => {
        blk.visible = !atomMode && idx < visibleBlocksA;
      });

      // Thruster plumes on Pod A
      const forceMag = Math.abs(p.appliedForce);
      const plumeScale = 0.4 + (forceMag / 100) * 1.4 + Math.sin(elapsedTotal * 28) * 0.08;
      if (p.lawId === 'law3') {
        podA.thrusterFlameRight.visible = p.appliedForce > 1;
        podA.thrusterFlameRight.scale.set(plumeScale, 1, 1);
        podA.thrusterFlameLeft.visible = p.appliedForce < -1;
        podA.thrusterFlameLeft.scale.set(plumeScale, 1, 1);
      } else {
        podA.thrusterFlameLeft.visible = p.appliedForce > 1;
        podA.thrusterFlameLeft.scale.set(plumeScale, 1, 1);
        podA.thrusterFlameRight.visible = p.appliedForce < -1;
        podA.thrusterFlameRight.scale.set(plumeScale, 1, 1);
      }

      // Animate JST-2 Persistent 3D Atoms (spring compression under acceleration + thermal jitter from friction)
      const bondAttr = podA.bondLines.geometry.getAttribute('position') as THREE.BufferAttribute;
      const strainX = -THREE.MathUtils.clamp(s.accelerationA * 0.025, -0.18, 0.18);
      const thermalAmp = Math.min(0.06, Math.sqrt(s.thermalEnergy) * 0.004);

      podA.atomMeshes.forEach((atom, i) => {
        const wave =
          Math.sin(elapsedTotal * 12 + atom.ix * 1.3 + atom.iy) *
          (Math.abs(s.accelerationA) * 0.008 + thermalAmp);
        _atomOffset.copy(atom.basePos);
        _atomOffset.x += atom.ix * strainX + wave;
        _atomOffset.y += Math.cos(elapsedTotal * 15 + i) * thermalAmp;
        atom.mesh.position.copy(_atomOffset);
        const atomScale = atomMode ? 1.15 : 0.65;
        atom.mesh.scale.setScalar(atomScale);
      });

      // Update bond line segments connecting adjacent atoms in the 3x3x3 cube
      let segIdx = 0;
      const atoms = podA.atomMeshes;
      for (let i = 0; i < atoms.length; i++) {
        for (let j = i + 1; j < atoms.length; j++) {
          const distMan =
            Math.abs(atoms[i].ix - atoms[j].ix) +
            Math.abs(atoms[i].iy - atoms[j].iy) +
            Math.abs(atoms[i].iz - atoms[j].iz);
          if (distMan === 1 && segIdx < 160) {
            const p1 = atoms[i].mesh.position;
            const p2 = atoms[j].mesh.position;
            bondAttr.setXYZ(segIdx++, p1.x, p1.y, p1.z);
            bondAttr.setXYZ(segIdx++, p2.x, p2.y, p2.z);
          }
        }
      }
      bondAttr.needsUpdate = true;

      // Pod B (Active in Law 3)
      if (p.lawId === 'law3') {
        podB.root.visible = true;
        podB.root.position.set(s.positionB, 0, 0);
        podB.hullShell.visible = !atomMode;
        const visibleBlocksB = Math.min(8, Math.max(1, Math.round(p.massB / 6)));
        podB.cargoBlocks.forEach((blk, idx) => {
          blk.visible = !atomMode && idx < visibleBlocksB;
        });
        podB.thrusterFlameLeft.visible = p.appliedForce > 1;
        podB.thrusterFlameLeft.scale.set(plumeScale, 1, 1);
      } else {
        podB.root.visible = false;
      }

      // Update ManimGX 3D Force Vector Arrows
      if (showVectorsRef.current) {
        const anchorY = 1.15;
        // Applied Force on A (or Reaction Force on A in Law 3)
        const fApp = p.lawId === 'law3' ? -p.appliedForce : p.appliedForce;
        vecAppliedA.group.position.set(s.positionA, anchorY, 0.85);
        vecAppliedA.setVector(Math.sign(fApp) || 1, 0, 0, Math.abs(fApp) * 0.055);

        // Friction Force on A
        vecFrictionA.group.position.set(s.positionA, 0.25, 0.85);
        vecFrictionA.setVector(
          Math.sign(s.frictionForce) || -1,
          0,
          0,
          Math.abs(s.frictionForce) * 0.055
        );

        // Normal & Weight Forces on A
        vecNormalA.group.position.set(s.positionA, 1.35, 0);
        vecNormalA.setVector(0, 1, 0, Math.min(2.6, s.normalForce * 0.008));

        vecWeightA.group.position.set(s.positionA, 0.85, 0);
        vecWeightA.setVector(0, -1, 0, Math.min(2.6, s.weightForce * 0.008));

        // Action Force on Pod B in Law 3
        if (p.lawId === 'law3') {
          vecActionB.group.position.set(s.positionB, anchorY, 0.85);
          vecActionB.setVector(
            Math.sign(p.appliedForce) || 1,
            0,
            0,
            Math.abs(p.appliedForce) * 0.055
          );
        } else {
          vecActionB.group.visible = false;
        }
      } else {
        vecAppliedA.group.visible = false;
        vecFrictionA.group.visible = false;
        vecNormalA.group.visible = false;
        vecWeightA.group.visible = false;
        vecActionB.group.visible = false;
      }

      // Smooth Camera Preset Choreography via exponential damping
      const preset = cameraPresetRef.current;
      const focusX =
        p.lawId === 'law3' ? (s.positionA + s.positionB) * 0.5 : s.positionA * 0.65;

      if (preset === 'chase') {
        _targetCamPos.set(s.positionA - 5.8, 3.2, 4.5);
        _targetLookAt.set(s.positionA + 1.5, 1.0, 0);
      } else if (preset === 'side') {
        _targetCamPos.set(focusX, 2.4, 14.5);
        _targetLookAt.set(focusX, 1.1, 0);
      } else if (preset === 'top') {
        _targetCamPos.set(focusX, 18.5, 0.01);
        _targetLookAt.set(focusX, 0, 0);
      } else {
        // Isometric default
        _targetCamPos.set(focusX + 3.5, 6.8, 13.5);
        _targetLookAt.set(focusX, 1.2, 0);
      }

      const dampFactor = 1 - Math.exp(-4.5 * dt);
      if (preset === 'chase' || preset === 'side' || preset === 'top') {
        camera.position.lerp(_targetCamPos, dampFactor);
        _currentLookAt.lerp(_targetLookAt, dampFactor);
        controls.target.copy(_currentLookAt);
      } else {
        _currentLookAt.lerp(_targetLookAt, dampFactor * 0.5);
        controls.target.copy(_currentLookAt);
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      rulerTex.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={canvasMountRef}
      data-testid="newton-3d-canvas"
      className="w-full h-full min-h-[420px] relative select-none"
      aria-label="Interactive 3D Newtonian Physics and Persistent Atom Lattice Simulation Viewport"
    />
  );
};
