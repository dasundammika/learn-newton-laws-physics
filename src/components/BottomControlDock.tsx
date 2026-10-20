import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  ChevronDown,
  ChevronUp,
  Atom,
  Compass,
  Grid,
} from 'lucide-react';
import type { SimulationParams } from '../physics/newtonEngine';
import type { CameraPreset } from './NewtonCanvas3D';
import { CURRICULUM_DATA } from '../data/curriculum';

interface BottomControlDockProps {
  params: SimulationParams;
  isPlaying: boolean;
  isCollapsed: boolean;
  showVectors: boolean;
  showAtomLattice: boolean;
  showPhaseGrid: boolean;
  cameraPreset: CameraPreset;
  onUpdateParams: (partial: Partial<SimulationParams>) => void;
  onTogglePlay: () => void;
  onReset: () => void;
  onApplyImpulse: () => void;
  onToggleCollapse: () => void;
  onToggleVectors: () => void;
  onToggleAtomLattice: () => void;
  onTogglePhaseGrid: () => void;
  onSelectCamera: (preset: CameraPreset) => void;
}

export const BottomControlDock: React.FC<BottomControlDockProps> = ({
  params,
  isPlaying,
  isCollapsed,
  showVectors,
  showAtomLattice,
  showPhaseGrid,
  cameraPreset,
  onUpdateParams,
  onTogglePlay,
  onReset,
  onApplyImpulse,
  onToggleCollapse,
  onToggleVectors,
  onToggleAtomLattice,
  onTogglePhaseGrid,
  onSelectCamera,
}) => {
  const activeLaw = CURRICULUM_DATA[params.lawId];

  return (
    <div className="w-full px-3 py-3 lg:p-0 lg:absolute lg:bottom-4 lg:left-1/2 lg:-translate-x-1/2 z-20 lg:w-[min(860px,95%)] pointer-events-auto">
      {/* Collapse / Expand Handle (Cinema / Zen Mode Drawer) */}
      <div className="flex justify-center mb-1.5">
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-expanded={!isCollapsed}
          className="flex items-center gap-1.5 px-3.5 py-1 text-xs font-medium text-slate-300 bg-[#0f172a] border border-slate-700/80 rounded-t-lg hover:text-white hover:border-sky-500/50 transition-colors whitespace-nowrap shrink-0 shadow-md cursor-pointer"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-sky-400" />
              <span>Show Controls (පාලක පුවරුව පෙන්වන්න)</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-sky-400" />
              <span>Hide Controls (3D Cinema Mode)</span>
            </>
          )}
        </button>
      </div>

      {!isCollapsed && (
        <div
          role="region"
          aria-label="Simulation Parameter and 3D Layer Controls"
          className="bg-[#0d1424]/95 border border-slate-800 rounded-xl p-4 shadow-2xl text-slate-100"
        >
          {/* Row 1: Playback, Quick Impulse, Presets & 3D Visualization Layer Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/90">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={onTogglePlay}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Resume</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onApplyImpulse}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-amber-200 bg-amber-500/15 border border-amber-500/40 hover:bg-amber-500/25 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Impulse (+4 m/s)</span>
              </button>

              <button
                type="button"
                onClick={onReset}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* 3D Layer Toggles & Camera Angle Selector */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={onToggleVectors}
                aria-pressed={showVectors}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  showVectors
                    ? 'bg-sky-500/20 text-sky-200 border-sky-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>ManimGX Vectors</span>
              </button>

              <button
                type="button"
                onClick={onToggleAtomLattice}
                aria-pressed={showAtomLattice}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  showAtomLattice || params.lawId === 'particle_lab'
                    ? 'bg-indigo-500/25 text-indigo-200 border-indigo-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <Atom className="w-3.5 h-3.5" />
                <span>JST-2 3D Atoms</span>
              </button>

              <button
                type="button"
                onClick={onTogglePhaseGrid}
                aria-pressed={showPhaseGrid}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  showPhaseGrid
                    ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>3D Lattice Box</span>
              </button>

              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                {(['isometric', 'side', 'top', 'chase'] as CameraPreset[]).map((cam) => (
                  <button
                    key={cam}
                    type="button"
                    onClick={() => onSelectCamera(cam)}
                    className={`px-2 py-1 text-[11px] font-medium rounded-md capitalize transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      cameraPreset === cam
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cam}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Physics Parameter Sliders with Explicit Labels, Numeric Values & Units */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Slider 1: Applied Force F */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="slider-force" className="font-medium text-slate-300">
                  {params.lawId === 'law3' ? 'Interaction Force (බලය F)' : 'Applied Force (යෙදූ බලය F)'}
                </label>
                <span className="font-mono tabular-nums font-semibold text-sky-400">
                  {params.appliedForce > 0 ? `+${params.appliedForce}` : params.appliedForce} N
                </span>
              </div>
              <input
                id="slider-force"
                type="range"
                min={-100}
                max={100}
                step={5}
                value={params.appliedForce}
                onChange={(e) => onUpdateParams({ appliedForce: Number(e.target.value) })}
                className="w-full accent-sky-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>-100 N</span>
                <span>0 N</span>
                <span>+100 N</span>
              </div>
            </div>

            {/* Slider 2: Mass A */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="slider-mass-a" className="font-medium text-slate-300">
                  {params.lawId === 'law3' ? 'Pod A Mass (m_A ස්කන්ධය)' : 'Object Mass (ස්කන්ධය m)'}
                </label>
                <span className="font-mono tabular-nums font-semibold text-amber-400">
                  {params.massA} kg ({Math.max(8, Math.round(params.massA * 2.7))} atoms)
                </span>
              </div>
              <input
                id="slider-mass-a"
                type="range"
                min={2}
                max={40}
                step={1}
                value={params.massA}
                onChange={(e) => onUpdateParams({ massA: Number(e.target.value) })}
                className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>2 kg</span>
                <span>20 kg</span>
                <span>40 kg</span>
              </div>
            </div>

            {/* Slider 3: Friction Coefficient mu */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="slider-friction" className="font-medium text-slate-300">
                  Surface Friction (ඝර්ෂණය μ)
                </label>
                <span className="font-mono tabular-nums font-semibold text-rose-400">
                  μ = {params.frictionCoeff.toFixed(2)}
                </span>
              </div>
              <input
                id="slider-friction"
                type="range"
                min={0}
                max={0.6}
                step={0.05}
                value={params.frictionCoeff}
                onChange={(e) => onUpdateParams({ frictionCoeff: Number(e.target.value) })}
                className="w-full accent-rose-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>0.0 (Vacuum)</span>
                <span>0.3</span>
                <span>0.6 (Rough)</span>
              </div>
            </div>

            {/* Slider 4: Context-specific (Mass B for Law 3, or Restitution / Bond Stiffness) */}
            {params.lawId === 'law3' ? (
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="slider-mass-b" className="font-medium text-slate-300">
                    Pod B Mass (m_B ස්කන්ධය)
                  </label>
                  <span className="font-mono tabular-nums font-semibold text-rose-400">
                    {params.massB} kg
                  </span>
                </div>
                <input
                  id="slider-mass-b"
                  type="range"
                  min={2}
                  max={40}
                  step={1}
                  value={params.massB}
                  onChange={(e) => onUpdateParams({ massB: Number(e.target.value) })}
                  className="w-full accent-rose-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>2 kg (Mini Probe)</span>
                  <span>20 kg</span>
                  <span>40 kg (Heavy)</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="slider-presets" className="font-medium text-slate-300">
                    Quick Experiment Preset
                  </label>
                </div>
                <div className="flex items-center gap-1.5 pt-0.5">
                  {activeLaw.presets.map((preset, idx) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() =>
                        onUpdateParams({
                          appliedForce: preset.appliedForce,
                          massA: preset.massA,
                          massB: preset.massB,
                          frictionCoeff: preset.frictionCoeff,
                          restitution: preset.restitution,
                        })
                      }
                      title={preset.descriptionMix}
                      className="flex-1 px-2 py-1.5 text-[11px] font-medium text-slate-200 bg-slate-800/90 hover:bg-slate-700 border border-slate-700/70 rounded-md truncate cursor-pointer transition-colors"
                    >
                      P{idx + 1}: {preset.label.split('(')[0].trim()}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
