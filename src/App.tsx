/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import {
  createInitialState,
  stepSimulation,
  type LawId,
  type LanguageMode,
  type SimulationParams,
  type SimulationState,
} from './physics/newtonEngine';
import { CURRICULUM_DATA, localizeText } from './data/curriculum';
import { NewtonCanvas3D, type CameraPreset } from './components/NewtonCanvas3D';
import { BottomControlDock } from './components/BottomControlDock';
import { SymbolicAndConceptDeck } from './components/SymbolicAndConceptDeck';

const INITIAL_PARAMS: SimulationParams = {
  lawId: 'law1',
  appliedForce: 0,
  massA: 12,
  massB: 8,
  frictionCoeff: 0.0,
  gravity: 9.81,
  restitution: 0.95,
  latticeStiffness: 150,
};

export default function App() {
  const [params, setParams] = useState<SimulationParams>(INITIAL_PARAMS);
  const [simState, setSimState] = useState<SimulationState>(() =>
    createInitialState(INITIAL_PARAMS)
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [showAtomLattice, setShowAtomLattice] = useState<boolean>(false);
  const [showPhaseGrid, setShowPhaseGrid] = useState<boolean>(true);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('isometric');
  const [languageMode, setLanguageMode] = useState<LanguageMode>('mix');

  const handleSelectLaw = useCallback((lawId: LawId) => {
    const nextDefaults: Partial<SimulationParams> =
      lawId === 'law1'
        ? { lawId, appliedForce: 0, frictionCoeff: 0.0, massA: 12 }
        : lawId === 'law2'
        ? { lawId, appliedForce: 45, frictionCoeff: 0.1, massA: 10 }
        : lawId === 'law3'
        ? { lawId, appliedForce: 40, frictionCoeff: 0.0, massA: 16, massB: 8 }
        : { lawId, appliedForce: 50, frictionCoeff: 0.15, massA: 12 };

    setParams((prev) => {
      const merged = { ...prev, ...nextDefaults };
      setSimState(createInitialState(merged));
      return merged;
    });
    if (lawId === 'particle_lab') {
      setShowAtomLattice(true);
    }
  }, []);

  const handleUpdateParams = useCallback((partial: Partial<SimulationParams>) => {
    setParams((prev) => {
      const next = { ...prev, ...partial };
      if (partial.lawId && partial.lawId !== prev.lawId) {
        setSimState(createInitialState(next));
      }
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    setSimState(createInitialState(params));
  }, [params]);

  const handleApplyImpulse = useCallback(() => {
    setSimState((prev) => ({
      ...prev,
      velocityA: prev.velocityA + (params.lawId === 'law3' ? -4.5 : 4.5),
      velocityB:
        params.lawId === 'law3'
          ? prev.velocityB + (4.5 * params.massA) / params.massB
          : prev.velocityB,
    }));
  }, [params.lawId, params.massA, params.massB]);

  const handleStepFrame = useCallback((dt: number) => {
    setParams((currentParams) => {
      setSimState((prevState) => stepSimulation(prevState, currentParams, dt));
      return currentParams;
    });
  }, []);

  const cycleLanguageMode = useCallback(() => {
    setLanguageMode((prev) =>
      prev === 'mix' ? 'sinhala' : prev === 'sinhala' ? 'english' : 'mix'
    );
  }, []);

  const activeLaw = CURRICULUM_DATA[params.lawId];

  return (
    <div
      data-state={isPlaying ? 'playing' : 'paused'}
      className="min-h-screen lg:h-screen w-full flex flex-col bg-[#090d16] text-slate-100 overflow-x-hidden lg:overflow-hidden"
    >
      {/* Top Navigation Bar — Strict 3-Zone Contract: [Brand Title] — [4 Nav Links] — [1 Primary Action] */}
      <header className="flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 py-3 border-b border-slate-800/90 bg-[#0b101d] shrink-0 z-20">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            handleSelectLaw('law1');
          }}
          className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 font-display"
        >
          Prathama Physics 3D
        </a>

        {/* Zone 2: 4 Concise Single-Line Navigation Links */}
        <nav
          aria-label="Newton's Laws Simulation Modules"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400"
        >
          {(['law1', 'law2', 'law3', 'particle_lab'] as LawId[]).map((id) => {
            const item = CURRICULUM_DATA[id];
            const isActive = params.lawId === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleSelectLaw(id)}
                className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                  isActive
                    ? 'text-sky-400 border-sky-400 font-semibold'
                    : 'text-slate-400 border-transparent hover:text-slate-100'
                }`}
              >
                {item.shortTabLabel}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action Button (Language Mode Switcher) */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={cycleLanguageMode}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {languageMode === 'mix'
              ? 'සිංහල + EN Mix'
              : languageMode === 'sinhala'
              ? 'සිංහල පමණයි'
              : 'English Only'}
          </button>
        </div>
      </header>

      {/* Mobile Module Switcher Bar (Visible on < md viewports so mobile users can switch all 4 laws) */}
      <div className="flex md:hidden items-center gap-1.5 px-3 py-2 bg-[#0d1424] border-b border-slate-800 overflow-x-auto shrink-0">
        {(['law1', 'law2', 'law3', 'particle_lab'] as LawId[]).map((id) => {
          const item = CURRICULUM_DATA[id];
          const isActive = params.lawId === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => handleSelectLaw(id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'text-slate-400 bg-slate-900/60'
              }`}
            >
              {item.shortTabLabel}
            </button>
          );
        })}
      </div>

      {/* Main Two-Zone Educational Sandbox Layout */}
      <main className="flex-1 flex flex-col lg:flex-row min-h-0 relative">
        {/* Left/Center Zone: 3D Interactive Stage + Dock */}
        <section
          aria-label="3D Physics Viewport Stage"
          className="relative flex-1 flex flex-col bg-[#090d16] min-w-0 lg:h-full overflow-hidden"
        >
          {/* Minimal Top-Left Scene Spec Overlay (Clean unboxed metadata, zero viewport center occlusion) */}
          <div className="absolute top-3.5 left-4 sm:left-5 right-4 z-10 pointer-events-none max-w-2xl space-y-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-300 font-mono">
              <span className="text-sky-400 font-semibold">{activeLaw.badgeCode}</span>
              <span aria-hidden="true">·</span>
              <span>x = {simState.positionA.toFixed(1)} m</span>
              <span aria-hidden="true">·</span>
              <span>v = {simState.velocityA.toFixed(2)} m/s</span>
              <span aria-hidden="true">·</span>
              <span>a = {simState.accelerationA.toFixed(2)} m/s²</span>
            </div>
            <h1
              className="text-base sm:text-xl font-semibold text-white tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              {localizeText(
                languageMode,
                activeLaw.titleMix,
                activeLaw.titleSi,
                activeLaw.titleEn
              )}
            </h1>
            {/* Vector Color Legend */}
            {showVectors && (
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-0.5 text-[11px] font-mono text-slate-300">
                <span className="text-sky-400">
                  → F_app ({params.appliedForce} N)
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-400">
                  ← f_friction ({simState.frictionForce.toFixed(1)} N)
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400">
                  ↑ Normal N ({simState.normalForce.toFixed(0)} N)
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-purple-400">
                  ↓ Weight mg ({simState.weightForce.toFixed(0)} N)
                </span>
                {params.lawId === 'law3' && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-rose-400">
                      ↔ Action-Reaction (|F_AB| = |F_BA| = {Math.abs(params.appliedForce)} N)
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Three.js WebGL Canvas Container */}
          <div className="w-full h-[380px] sm:h-[460px] lg:flex-1 lg:h-full relative">
            <NewtonCanvas3D
              params={params}
              simState={simState}
              isPlaying={isPlaying}
              showVectors={showVectors}
              showAtomLattice={showAtomLattice}
              showPhaseGrid={showPhaseGrid}
              cameraPreset={cameraPreset}
              onStepFrame={handleStepFrame}
            />
          </div>

          {/* Unified Collapsible Bottom Control Dock (Centered within the 3D Viewport Stage on Desktop, stacked cleanly on Mobile) */}
          <BottomControlDock
            params={params}
            isPlaying={isPlaying}
            isCollapsed={isDockCollapsed}
            showVectors={showVectors}
            showAtomLattice={showAtomLattice}
            showPhaseGrid={showPhaseGrid}
            cameraPreset={cameraPreset}
            onUpdateParams={handleUpdateParams}
            onTogglePlay={() => setIsPlaying((p) => !p)}
            onReset={handleReset}
            onApplyImpulse={handleApplyImpulse}
            onToggleCollapse={() => setIsDockCollapsed((c) => !c)}
            onToggleVectors={() => setShowVectors((v) => !v)}
            onToggleAtomLattice={() => setShowAtomLattice((a) => !a)}
            onTogglePhaseGrid={() => setShowPhaseGrid((g) => !g)}
            onSelectCamera={(preset) => setCameraPreset(preset)}
          />
        </section>

        {/* Right Zone: First-Principles Curriculum, Sinhala-English Explanations & PySR Symbolic Tree */}
        <SymbolicAndConceptDeck
          params={params}
          simState={simState}
          languageMode={languageMode}
          onUpdateParams={handleUpdateParams}
        />
      </main>
    </div>
  );
}
