import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  BookOpen,
  GitBranch,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import {
  evaluateSymbolicRegression,
  type LanguageMode,
  type SimulationParams,
  type SimulationState,
} from '../physics/newtonEngine';
import { CURRICULUM_DATA, localizeText } from '../data/curriculum';

interface SymbolicAndConceptDeckProps {
  params: SimulationParams;
  simState: SimulationState;
  languageMode: LanguageMode;
  onUpdateParams: (partial: Partial<SimulationParams>) => void;
}

type DeckTab = 'concepts' | 'symbolic' | 'architecture';

export const SymbolicAndConceptDeck: React.FC<SymbolicAndConceptDeckProps> = ({
  params,
  simState,
  languageMode,
  onUpdateParams,
}) => {
  const [activeTab, setActiveTab] = useState<DeckTab>('concepts');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const curriculum = CURRICULUM_DATA[params.lawId];
  const symbolicCandidates = evaluateSymbolicRegression(params);
  const discoveredLaw =
    symbolicCandidates.find((c) => c.isDiscoveredTruth) || symbolicCandidates[0];

  const quiz = curriculum.quiz;
  const chosenOptionId = selectedAnswers[quiz.id];

  // Build SVG polyline path for live telemetry chart
  const history = simState.history;
  const chartW = 360;
  const chartH = 96;
  const buildPath = (extractor: (pt: typeof history[0]) => number, maxAbs: number) => {
    if (history.length < 2) return `M 0 ${chartH / 2} L ${chartW} ${chartH / 2}`;
    return history
      .map((pt, i) => {
        const x = (i / Math.max(1, history.length - 1)) * chartW;
        const norm = Math.max(-1, Math.min(1, extractor(pt) / Math.max(1, maxAbs)));
        const y = chartH / 2 - norm * (chartH * 0.42);
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  };

  const velPath = buildPath((pt) => pt.velocityA, 15);
  const accPath = buildPath((pt) => pt.accelerationA, 12);

  return (
    <aside
      aria-label="First-Principles Physics Curriculum and Symbolic Discovery Deck"
      className="w-full lg:w-[440px] xl:w-[470px] shrink-0 bg-[#0b101d] border-l border-slate-800/90 flex flex-col h-full overflow-y-auto pb-28 lg:pb-6"
    >
      {/* Segmented Control Bar for Deck Views */}
      <div className="p-4 border-b border-slate-800/90 sticky top-0 bg-[#0b101d]/95 z-10">
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900/95 border border-slate-800 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('concepts')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'concepts'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span>First Principles</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('symbolic')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'symbolic'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5 text-amber-400" />
            <span>PySR Equation</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'architecture'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>3D Tech Stack</span>
          </button>
        </div>
      </div>

      {/* Live Quantitative Telemetry Strip (Always visible for immediate feedback) */}
      <div className="px-5 py-3.5 border-b border-slate-800/80 bg-[#0e1526]">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Real-Time Particle & Continuum Telemetry</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums text-sky-400">
            t = {simState.time.toFixed(1)}s
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800/80">
            <div className="text-[11px] text-slate-400">Net Force</div>
            <div className="text-sm font-mono tabular-nums font-semibold text-sky-300 mt-0.5">
              {simState.netForce.toFixed(1)} N
            </div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800/80">
            <div className="text-[11px] text-slate-400">Accel (a)</div>
            <div className="text-sm font-mono tabular-nums font-semibold text-emerald-300 mt-0.5">
              {simState.accelerationA.toFixed(2)} m/s²
            </div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800/80">
            <div className="text-[11px] text-slate-400">Velocity (v)</div>
            <div className="text-sm font-mono tabular-nums font-semibold text-amber-300 mt-0.5">
              {simState.velocityA.toFixed(2)} m/s
            </div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800/80">
            <div className="text-[11px] text-slate-400">Lattice Heat</div>
            <div className="text-sm font-mono tabular-nums font-semibold text-rose-300 mt-0.5">
              {simState.thermalEnergy.toFixed(1)} J
            </div>
          </div>
        </div>
      </div>

      {/* TAB 1: FIRST-PRINCIPLES & SINHALA-ENGLISH MIX LESSON */}
      {activeTab === 'concepts' && (
        <div className="p-5 space-y-6">
          {/* Header & Core Formula */}
          <div>
            <div className="flex items-center gap-2 text-xs text-sky-400 font-medium mb-1">
              <span>{curriculum.badgeCode}</span>
              <span aria-hidden="true">·</span>
              <span>First-Principles Thinking</span>
              <span aria-hidden="true">·</span>
              <span>{simState.atomCount} Persistent 3D Atoms</span>
            </div>

            <h2 className="text-xl font-semibold text-white tracking-tight leading-snug font-display">
              {localizeText(
                languageMode,
                curriculum.titleMix,
                curriculum.titleSi,
                curriculum.titleEn
              )}
            </h2>

            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              {localizeText(
                languageMode,
                curriculum.subtitleMix,
                curriculum.subtitleSi,
                curriculum.subtitleEn
              )}
            </p>

            {/* Canonical Mathematical Law & Particle Formula Box */}
            <div className="mt-3 p-3.5 rounded-xl bg-slate-900/95 border border-slate-800 space-y-1.5">
              <div className="text-[11px] text-slate-400">
                Macroscopic Continuum Equation · මූලික සමීකරණය
              </div>
              <div className="font-mono text-sm font-semibold text-sky-300 tracking-wide">
                {curriculum.coreFormula}
              </div>
              <div className="pt-1.5 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>3D Particle Lattice Form:</span>
                <span className="font-mono text-indigo-300">{curriculum.particleFormula}</span>
              </div>
            </div>
          </div>

          {/* Deep First-Principles Explanation (Sinhala-English Mix) */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-100">
              Why Does This Happen? (මූලික මූලධර්ම විග්‍රහය)
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed bg-[#0f172a] p-3.5 rounded-xl border border-slate-800/80">
              {localizeText(
                languageMode,
                curriculum.summaryMix,
                curriculum.summarySi,
                curriculum.summaryEn
              )}
            </p>
          </div>

          {/* 3-Step First-Principles Derivation Ladder */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-100">
              3-Step First-Principles Breakdown (පියවරෙන් පියවර තර්කනය)
            </h3>
            <div className="space-y-2.5">
              {curriculum.firstPrinciples.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-sky-400">
                      Step {step.stepNumber} ·{' '}
                      {localizeText(languageMode, step.titleMix, step.titleSi, step.titleEn)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {localizeText(languageMode, step.bodyMix, step.bodySi, step.bodyEn)}
                  </p>
                  <div className="pt-1 font-mono text-xs text-amber-300/95">
                    {step.formula}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-World Application Callout */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-xs font-semibold text-emerald-400 mb-1">
              Real-World Engineering & Everyday Intuition (ප්‍රායෝගික උදාහරණය)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {localizeText(
                languageMode,
                curriculum.realWorldExampleMix,
                curriculum.realWorldExampleSi,
                curriculum.realWorldExampleEn
              )}
            </p>
          </div>

          {/* Interactive Student Concept Check Quiz */}
          <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-200">
                Interactive Concept Check (දැනුම පරීක්ෂාව)
              </span>
              <span>Select 1 answer</span>
            </div>

            <p className="text-xs font-medium text-slate-200 leading-relaxed">
              {localizeText(languageMode, quiz.questionMix, quiz.questionSi, quiz.questionEn)}
            </p>

            <div className="space-y-2">
              {quiz.options.map((opt) => {
                const isSelected = chosenOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      setSelectedAnswers((prev) => ({ ...prev, [quiz.id]: opt.id }))
                    }
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-100'
                          : 'bg-rose-950/60 border-rose-500/60 text-rose-100'
                        : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 shrink-0">
                        {isSelected ? (
                          opt.isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400" />
                          )
                        ) : (
                          <span className="inline-block w-3.5 h-3.5 rounded-full border border-slate-600" />
                        )}
                      </span>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {localizeText(languageMode, opt.labelMix, opt.labelSi, opt.labelEn)}
                        </div>
                        {isSelected && (
                          <div className="text-[11px] opacity-90 pt-1 border-t border-white/10">
                            {localizeText(
                              languageMode,
                              opt.explanationMix,
                              opt.explanationSi,
                              opt.explanationEn
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PYSR 2 SYMBOLIC REGRESSION & LIVE WAVEFORMS */}
      {activeTab === 'symbolic' && (
        <div className="p-5 space-y-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
              <span>PySR v2 Symbolic Regression Engine</span>
              <span aria-hidden="true">·</span>
              <span>Live Equation Search</span>
            </div>
            <h2 className="text-lg font-semibold text-white font-display">
              Discovering Equations from 3D Particle Data
            </h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Inspired by Miles Cranmer’s PySR 2: Instead of memorizing formulas blindly, watch how
              symbolic machine learning searches binary expression trees (+, −, ×, ÷) to discover
              Newton’s exact equation from live 3D particle sensor readings!
            </p>
          </div>

          {/* Live Velocity & Acceleration Waveform Graph */}
          <div className="p-3.5 rounded-xl bg-slate-900/95 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-200">
                Live Sensor Waveforms (v(t) & a(t))
              </span>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="text-amber-400">─ Velocity v(t)</span>
                <span className="text-emerald-400">─ Accel a(t)</span>
              </div>
            </div>

            <svg
              viewBox={`0 0 ${chartW} ${chartH}`}
              className="w-full h-24 bg-[#070b14] rounded-lg border border-slate-800/80 overflow-hidden"
              role="img"
              aria-label="Live velocity and acceleration time-series chart"
            >
              {/* Zero axis line */}
              <line
                x1={0}
                y1={chartH / 2}
                x2={chartW}
                y2={chartH / 2}
                stroke="#1e293b"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
              <path d={velPath} fill="none" stroke="#f59e0b" strokeWidth={2.2} />
              <path d={accPath} fill="none" stroke="#10b981" strokeWidth={2} />
            </svg>

            <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-slate-400">
              <span>Force/Atom: {simState.perAtomForce.toFixed(2)} N/atom</span>
              <span>Momentum p_A: {(params.massA * simState.velocityA).toFixed(1)} kg·m/s</span>
            </div>
          </div>

          {/* PySR Discovered Expression Tree Visual Diagram */}
          <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-sky-400">
                Optimal Symbolic Expression Tree (සමීකරණ ගස)
              </span>
              <span className="text-xs font-mono tabular-nums text-emerald-400">
                R² = {discoveredLaw.rSquared.toFixed(4)}
              </span>
            </div>

            {/* Interactive SVG Binary Operator Tree (homage to PySR 2 reference image) */}
            <div className="bg-[#080c17] border border-slate-800/90 rounded-lg p-3 flex flex-col items-center">
              <svg
                viewBox="0 0 320 145"
                className="w-full max-w-[320px] h-36"
                role="img"
                aria-label="PySR Binary Operator Tree for Newton's Law"
              >
                {/* Edges */}
                <line x1="160" y1="26" x2="95" y2="74" stroke="#38bdf8" strokeWidth="2" />
                <line x1="160" y1="26" x2="225" y2="74" stroke="#38bdf8" strokeWidth="2" />
                {discoveredLaw.treeNodes.children?.[0]?.children && (
                  <>
                    <line x1="95" y1="74" x2="55" y2="122" stroke="#64748b" strokeWidth="1.5" />
                    <line x1="95" y1="74" x2="135" y2="122" stroke="#64748b" strokeWidth="1.5" />
                  </>
                )}

                {/* Root Operator Node */}
                <circle cx="160" cy="26" r="18" fill="#0284c7" stroke="#bae6fd" strokeWidth="1.5" />
                <text
                  x="160"
                  y="30"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="11"
                  fontFamily="IBM Plex Mono, monospace"
                  fontWeight="600"
                >
                  {discoveredLaw.treeNodes.label.split(' ')[0]}
                </text>

                {/* Left Child Node */}
                <rect
                  x="50"
                  y="58"
                  width="90"
                  height="28"
                  rx="6"
                  fill="#1e293b"
                  stroke="#38bdf8"
                  strokeWidth="1.2"
                />
                <text
                  x="95"
                  y="76"
                  textAnchor="middle"
                  fill="#e2e8f0"
                  fontSize="10"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {discoveredLaw.treeNodes.children?.[0]?.label || 'F'}
                </text>

                {/* Right Child Node */}
                <rect
                  x="180"
                  y="58"
                  width="95"
                  height="28"
                  rx="6"
                  fill="#1e293b"
                  stroke="#f59e0b"
                  strokeWidth="1.2"
                />
                <text
                  x="227"
                  y="76"
                  textAnchor="middle"
                  fill="#fde68a"
                  fontSize="10"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {discoveredLaw.treeNodes.children?.[1]?.label || 'm'}
                </text>

                {/* Leaf Nodes if present */}
                {discoveredLaw.treeNodes.children?.[0]?.children && (
                  <>
                    <rect
                      x="18"
                      y="108"
                      width="72"
                      height="24"
                      rx="5"
                      fill="#0f172a"
                      stroke="#475569"
                    />
                    <text
                      x="54"
                      y="124"
                      textAnchor="middle"
                      fill="#bae6fd"
                      fontSize="9.5"
                      fontFamily="IBM Plex Mono, monospace"
                    >
                      {discoveredLaw.treeNodes.children[0].children[0]?.label}
                    </text>

                    <rect
                      x="100"
                      y="108"
                      width="82"
                      height="24"
                      rx="5"
                      fill="#0f172a"
                      stroke="#475569"
                    />
                    <text
                      x="141"
                      y="124"
                      textAnchor="middle"
                      fill="#fda4af"
                      fontSize="9.5"
                      fontFamily="IBM Plex Mono, monospace"
                    >
                      {discoveredLaw.treeNodes.children[0].children[1]?.label}
                    </text>
                  </>
                )}
              </svg>

              <div className="text-xs font-mono text-sky-300 font-semibold mt-1">
                {discoveredLaw.equationPlain}
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {languageMode === 'english'
                ? discoveredLaw.englishNote
                : discoveredLaw.sinhalaNote}
            </p>
          </div>

          {/* Pareto Frontier Candidate Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-200">
              PySR Pareto Frontier (Complexity vs. Sensor Fit Loss)
            </h3>
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900/95 border-b border-slate-800 text-slate-400">
                    <th className="py-2 px-3 font-medium">Candidate Formula</th>
                    <th className="py-2 px-2 font-medium text-right">Complexity</th>
                    <th className="py-2 px-3 font-medium text-right">MSE Loss</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono tabular-nums">
                  {symbolicCandidates.map((cand) => (
                    <tr
                      key={cand.id}
                      className={
                        cand.isDiscoveredTruth
                          ? 'bg-sky-950/35 text-sky-200'
                          : 'bg-[#0b101d] text-slate-400'
                      }
                    >
                      <td className="py-2.5 px-3">
                        <div className="font-semibold">{cand.equationPlain.split('(')[0]}</div>
                        <div className="text-[10px] font-sans text-slate-400 mt-0.5">
                          {languageMode === 'english' ? cand.englishNote : cand.sinhalaNote}
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-right align-top">{cand.complexity}</td>
                      <td className="py-2.5 px-3 text-right align-top">
                        <span
                          className={
                            cand.isDiscoveredTruth ? 'text-emerald-400 font-semibold' : 'text-rose-400'
                          }
                        >
                          {cand.mse.toFixed(4)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REFERENCE TECHNOLOGY ARCHITECTURE (JST-2 + PySR 2 + ManimGX) */}
      {activeTab === 'architecture' && (
        <div className="p-5 space-y-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium mb-1">
              <span>Reference Architecture Synthesis</span>
              <span aria-hidden="true">·</span>
              <span>First-Principles 3D Stack</span>
            </div>
            <h2 className="text-lg font-bold text-white font-['Outfit']">
              How Our 3 Reference Technologies Power This Lab
            </h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              මෙම පද්ධතිය ගොඩනගා ඇත්තේ ඔබ ලබාදුන් නවීනතම 3D Physics සහ AI පර්යේෂණ ආකෘති 3 හි මූලික
              මූලධර්ම (First Principles) එකට සම්බන්ධ කිරීමෙනි:
            </p>
          </div>

          {[
            {
              id: 'ref_jst2',
              title: '01. ViggleAI JST-2 — Full-Stack 3D Physics-Native World Model',
              subtitle:
                'පික්සල් (2D Video) අනුමාන කරනවා වෙනුවට 3D අවකාශයේ ස්ථාවර පරමාණු (Persistent Atoms) සහ බල ක්ෂේත්‍ර මගින් ලෝකය ගොඩනැගීම.',
              imgPath: '/assets/aistudio/image_bd473d6e.png',
              actionLabel: 'Explore 3D Persistent Atom Lattice',
              targetLaw: 'particle_lab' as const,
            },
            {
              id: 'ref_pysr',
              title: '02. Miles Cranmer PySR 2 — Symbolic Equation Discovery',
              subtitle:
                'පරීක්ෂණ දත්ත (Vectors & Sensor Telemetry) විශ්ලේෂණය කර කෙටිම හා නිවැරදිම භෞතික විද්‍යා සමීකරණ ගස (a = F/m) ස්වයංක්‍රීයව සොයා ගැනීම.',
              imgPath: '/assets/aistudio/image_2ad0347d.png',
              actionLabel: 'Inspect Symbolic Regression Tree',
              targetLaw: 'law2' as const,
            },
            {
              id: 'ref_manimgx',
              title: '03. Sina Atalay ManimGX — 3D Mathematical Vector Engine',
              subtitle:
                'සෑම බලයක්ම සහ ප්‍රවේගයක්ම ත්‍රිමාණ දෛශික (3D Force Vectors) සහ ඛණ්ඩාංක පද්ධති මගින් සිසුන්ට පැහැදිලිව දෘශ්‍යමාන කිරීම.',
              imgPath: '/assets/aistudio/image_e2250a58.png',
              actionLabel: 'Test Action-Reaction 3D Vectors',
              targetLaw: 'law3' as const,
            },
          ].map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5"
            >
              <h3 className="text-xs font-semibold text-white">{item.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{item.subtitle}</p>

              {/* Resilient Image Container with Zero-Broken-Image Policy Fallback */}
              <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-[#070b14]">
                {!failedImages[item.id] ? (
                  <img
                    src={item.imgPath}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setFailedImages((prev) => ({ ...prev, [item.id]: true }))
                    }
                    className="w-full h-36 object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-28 flex items-center justify-center p-4 text-xs text-slate-400 bg-gradient-to-br from-slate-900 to-indigo-950/40">
                    <span>{item.title} Architecture Schematic</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  onUpdateParams({ lawId: item.targetLaw });
                  setActiveTab(item.id === 'ref_pysr' ? 'symbolic' : 'concepts');
                }}
                className="flex items-center gap-1.5 text-xs font-medium text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{item.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};
