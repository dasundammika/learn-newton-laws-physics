import type { LawId, LanguageMode } from '../physics/newtonEngine';

export interface FirstPrincipleStep {
  stepNumber: string;
  titleMix: string;
  titleSi: string;
  titleEn: string;
  bodyMix: string;
  bodySi: string;
  bodyEn: string;
  formula: string;
}

export interface QuizQuestion {
  id: string;
  questionMix: string;
  questionSi: string;
  questionEn: string;
  options: {
    id: string;
    labelMix: string;
    labelSi: string;
    labelEn: string;
    isCorrect: boolean;
    explanationMix: string;
    explanationSi: string;
    explanationEn: string;
  }[];
}

export interface LawCurriculum {
  id: LawId;
  shortTabLabel: string;
  badgeCode: string;
  titleMix: string;
  titleSi: string;
  titleEn: string;
  subtitleMix: string;
  subtitleSi: string;
  subtitleEn: string;
  coreFormula: string;
  particleFormula: string;
  summaryMix: string;
  summarySi: string;
  summaryEn: string;
  realWorldExampleMix: string;
  realWorldExampleSi: string;
  realWorldExampleEn: string;
  firstPrinciples: FirstPrincipleStep[];
  presets: {
    label: string;
    descriptionMix: string;
    appliedForce: number;
    massA: number;
    massB: number;
    frictionCoeff: number;
    restitution: number;
  }[];
  quiz: QuizQuestion;
}

export function localizeText(
  mode: LanguageMode,
  mix: string,
  si: string,
  en: string
): string {
  if (mode === 'sinhala') return si;
  if (mode === 'english') return en;
  return mix;
}

export const CURRICULUM_DATA: Record<LawId, LawCurriculum> = {
  law1: {
    id: 'law1',
    shortTabLabel: '01. First Law (අවස්ථිතිය)',
    badgeCode: '01. Law of Inertia',
    titleMix: 'Newton’s 1st Law — අවස්ථිති නියමය (Law of Inertia)',
    titleSi: 'නිව්ටන්ගේ පළමු නියමය — අවස්ථිති නියමය',
    titleEn: 'Newton’s First Law — The Law of Inertia',
    subtitleMix: 'බාහිර අසංතුලිත බලයක් (Unbalanced External Force) නොමැති නම් වස්තුවක ප්‍රවේගය වෙනස් නොවේ.',
    subtitleSi: 'බාහිර අසංතුලිත බලයක් ක්‍රියා නොකරන තාක් කල් නිශ්චල වස්තුවක් නිශ්චලවම පවතින අතර චලනය වන වස්තුවක් ඒකාකාර ප්‍රවේගයෙන්ම චලනය වේ.',
    subtitleEn: 'A body remains at rest or moves at constant velocity in a straight line unless acted upon by a net external force.',
    coreFormula: 'ΣF = 0   <=>   dv/dt = 0   (v = constant)',
    particleFormula: 'Σ F_ext,i = 0   =>   p_lattice = Σ (m_0 * v_i) = const',
    summaryMix:
      'ඇයි අපි තල්ලු කරන බෝලයක් ටික දුරක් ගිහින් නතර වෙන්නේ? Aristotle හිතුවේ "චලනය පවත්වා ගන්න දිගටම බලයක් ඕනේ" කියලා. නමුත් First Principles (මූලික මූලධර්ම) වලින් බැලුවම, වස්තුව නතර වෙන්නේ පොළොවේ පරමාණු (Surface Atoms) සහ වස්තුවේ පරමාණු අතර ඇතිවන විද්‍යුත් චුම්භක ගැටීම් (Friction / ඝර්ෂණය) නිසා චාලක ශක්තිය (Kinetic Energy) තාප ශක්තිය (Thermal Vibrations) බවට පත්වීමෙනුයි! Friction = 0 කළොත් වස්තුව සදාකාලිකව එකම වේගයෙන් ගමන් කරයි.',
    summarySi:
      'සාමාන්‍ය ජීවිතයේදී චලනය වන වස්තුවක් නතර වන්නේ ඝර්ෂණ බලය නිසාය. මූලික පරමාණුක මට්ටමින් බැලූ විට, පෘෂ්ඨ දෙකක පරමාණු එකිනෙක ගැටීමෙන් චාලක ශක්තිය පරමාණුක කම්පන (තාපය) බවට පත් වේ. ඝර්ෂණය ඉවත් කළ විට (μ = 0), කිසිදු බලයක් නොමැතිව වස්තුව ඒකාකාර ප්‍රවේගයෙන් දිගටම ගමන් කරයි.',
    summaryEn:
      'In everyday life, sliding objects stop only because microscopic surface atoms collide and convert macroscopic kinetic energy into atomic thermal vibrations (friction). Strip away friction (μ = 0) from First Principles, and an object glides forever at constant velocity without needing any engine force.',
    realWorldExampleMix:
      '🚌 Bus Brake Example: බස් එකක් එකපාරටම බ්‍රේක් ගැහුවම ඔයාව ඉස්සරහට විසිවෙන්නේ ඇයි? බස් එකට බ්‍රේක් බලය ලැබුණත්, ඔයාගේ ශරීරයේ පරමාණු (Mass Lattice) තවමත් පරණ ප්‍රවේගයෙන්ම (Inertia) ඉස්සරහට යන්න උත්සාහ කරන නිසයි!',
    realWorldExampleSi:
      'ධාවනය වන බස් රථයක් හදිසියේ තිරිංග තද කළ විට මගීන් ඉදිරියට විසිවන්නේ ඔවුන්ගේ සිරුරේ ඇති අවස්ථිතිය (පැවති ප්‍රවේගය පවත්වා ගැනීමේ ගුණය) නිසාය.',
    realWorldExampleEn:
      'When a moving bus brakes suddenly, your body continues moving forward at the bus’s previous velocity because no horizontal force has directly decelerated your torso yet.',
    firstPrinciples: [
      {
        stepNumber: '01',
        titleMix: 'Strip Everyday Illusion (සාමාන්‍ය මිථ්‍යාව ඉවත් කරමු)',
        titleSi: 'සාමාන්‍ය නිරීක්ෂණයේ මිථ්‍යාව හඳුනා ගැනීම',
        titleEn: 'Deconstruct the Everyday Illusion',
        bodyMix:
          'මේසයක් උඩ පොතක් තල්ලු කළාම ඒක නතර වෙනවා. ඒකෙන් පේන්නේ "වස්තුවක ස්වභාවික තත්ත්වය නිශ්චලතාවය" වගේ. නමුත් ඒක ඇත්තක්ද? නැහැ! එතන නොපෙනෙන බාහිර බලයක් (Friction / ඝර්ෂණය) ක්‍රියාත්මක වෙනවා.',
        bodySi:
          'මේසයක් මත තල්ලු කළ පොතක් නතර වන්නේ චලනයට බලයක් අවශ්‍ය නිසා නොව, මේසය මගින් පොත මත ප්‍රතිවිරුද්ධ ඝර්ෂණ බලයක් යොදන නිසාය.',
        bodyEn:
          'A book pushed across a table stops not because rest is its natural requirement, but because an unseen opposing force—friction—acts on it.',
        formula: 'F_net = F_applied - f_kinetic',
      },
      {
        stepNumber: '02',
        titleMix: 'Zoom into 3D Persistent Atoms (පරමාණුක දැලිස දෙස බලමු)',
        titleSi: 'ත්‍රිමාණ පරමාණුක දැලිසේ ක්‍රියාකාරිත්වය',
        titleEn: 'Atomic Lattice & Thermal Energy Transfer',
        bodyMix:
          'JST-2 3D Atom Lattice එක දිහා බලන්න: වස්තුවක් කියන්නේ Spring බන්ධන වලින් බැඳුණු පරමාණු (Persistent Atoms) පොකුරක්. රළු පොළොවක ඇතිල්ලෙනකොට පරමාණු කම්පනය වෙලා චාලක ශක්තිය (½mv²) තාපය (E_thermal) බවට හැරෙනවා.',
        bodySi:
          'ඕනෑම ඝන වස්තුවක් යනු එකිනෙක බැඳුණු පරමාණු ජාලයකි. පෘෂ්ඨයේ ඝර්ෂණය නිසා වස්තුවේ ඒකාකාර චාලක ශක්තිය පරමාණුක කම්පන (තාප ශක්තිය) බවට පරිවර්තනය වේ.',
        bodyEn:
          'Every solid object is a 3D lattice of bonded atoms. Surface roughness excites atomic vibrations, draining macroscopic ½mv² into microscopic heat E_thermal.',
        formula: 'ΔK_macro = -ΔE_thermal = -∫ f_k · v dt',
      },
      {
        stepNumber: '03',
        titleMix: 'Pure Vacuum Limit (අභ්‍යවකාශයේ සත්‍ය ස්වභාවය)',
        titleSi: 'ඝර්ෂණය ශුන්‍ය කළ විට ලැබෙන මූලික නියමය',
        titleEn: 'The Zero-Friction Vacuum Limit',
        bodyMix:
          'දැන් පහළ Slider එකෙන් Friction (μ) = 0.00 කරන්න! පරමාණුක ශක්ති හානිය නතර වූ සැණින්, F_net = 0 විට වස්තුව කිසිම බලයක් නැතිව 6.0 m/s නියත ප්‍රවේගයෙන් දිගටම යනවා. මේක තමයි අවස්ථිතිය (Inertia)!',
        bodySi:
          'ඝර්ෂණ සංගුණකය μ = 0 කළ විට ශක්ති හානිය නතර වේ. එවිට සම්ප්‍රයුක්ත බලය ශුන්‍ය (∑F = 0) නම් ප්‍රවේගය සදාකාලිකව නියතව පවතී.',
        bodyEn:
          'Set Friction μ = 0.00 in the dock below: thermal dissipation vanishes, and with ∑F = 0 the sled coasts at 6.0 m/s indefinitely.',
        formula: 'μ → 0, F_applied = 0  =>  a = 0, v(t) = v_0',
      },
    ],
    presets: [
      {
        label: 'Deep Space Probe (μ = 0)',
        descriptionMix: 'අභ්‍යවකාශයේ ඝර්ෂණය නැති විට 6 m/s නියත ප්‍රවේගයෙන් ගමන් කිරීම',
        appliedForce: 0,
        massA: 12,
        massB: 10,
        frictionCoeff: 0,
        restitution: 0.9,
      },
      {
        label: 'Rough Asphalt Brake (μ = 0.35)',
        descriptionMix: 'රළු පාරකදී ඝර්ෂණය නිසා චාලක ශක්තිය තාපය වී නතර වීම',
        appliedForce: 0,
        massA: 12,
        massB: 10,
        frictionCoeff: 0.35,
        restitution: 0.8,
      },
      {
        label: 'Balanced Cruise (F = f_k)',
        descriptionMix: 'යොදන බලය සහ ඝර්ෂණ බලය සමාන වූ විට ශුද්ධ බලය 0 වීම',
        appliedForce: 23.5,
        massA: 12,
        massB: 10,
        frictionCoeff: 0.2,
        restitution: 0.8,
      },
    ],
    quiz: {
      id: 'q_law1',
      questionMix:
        'අභ්‍යවකාශයේ (Friction = 0) 10 m/s ප්‍රවේගයෙන් යන යානයක එන්ජිම OFF කළොත් කුමක් සිදුවේද?',
      questionSi:
        'ඝර්ෂණය නොමැති ගැඹුරු අභ්‍යවකාශයේ 10 m/s ප්‍රවේගයෙන් ගමන් කරන යානයක එන්ජිම ක්‍රියා විරහිත කළ විට කුමක් සිදුවේද?',
      questionEn:
        'If a spacecraft moving at 10 m/s in deep frictionless space turns off its thruster engine, what happens next?',
      options: [
        {
          id: 'opt1',
          labelMix: 'එය වහාම නතර වේ (Stops immediately)',
          labelSi: 'එය වහාම නතර වේ',
          labelEn: 'It stops immediately because there is no engine force',
          isCorrect: false,
          explanationMix: 'වැරදියි! චලනය පවත්වා ගැනීමට බලයක් අවශ්‍ය නැත; බලයක් අවශ්‍ය වන්නේ ප්‍රවේගය වෙනස් කිරීමට පමණි.',
          explanationSi: 'වැරදියි! ප්‍රවේගය පවත්වා ගැනීමට බලයක් අවශ්‍ය නොවේ.',
          explanationEn: 'Incorrect. Force is required to change velocity, not to maintain it.',
        },
        {
          id: 'opt2',
          labelMix: '10 m/s නියත ප්‍රවේගයෙන් දිගටම ගමන් කරයි (Keeps moving at 10 m/s forever)',
          labelSi: '10 m/s ඒකාකාර ප්‍රවේගයෙන් සදාකාලිකව ඉදිරියටම ගමන් කරයි',
          labelEn: 'It continues coasting at a constant 10 m/s in a straight line',
          isCorrect: true,
          explanationMix: 'හරියටම හරි! ∑F = 0 නිසා අවස්ථිතිය (Inertia) මගින් යානය 10 m/s නියත ප්‍රවේගයෙන්ම දිගටම ගමන් කරයි.',
          explanationSi: 'නිවැරදියි! බාහිර ප්‍රතිරෝධී බලයක් නොමැති නිසා ඒකාකාර ප්‍රවේගය වෙනස් නොවේ.',
          explanationEn: 'Correct! With zero net external force (∑F = 0), acceleration is zero and velocity stays 10 m/s.',
        },
        {
          id: 'opt3',
          labelMix: 'ක්‍රමයෙන් වේගය අඩුවී නතර වේ (Slowly decelerates to rest)',
          labelSi: 'ක්‍රමයෙන් වේගය අඩුවී නතර වේ',
          labelEn: 'It gradually slows down until it comes to rest',
          isCorrect: false,
          explanationMix: 'වැරදියි! අභ්‍යවකාශයේ වායු ප්‍රතිරෝධය හෝ ඝර්ෂණය නොමැති නිසා වේගය අඩු වීමට හේතුවක් නැත.',
          explanationSi: 'වැරදියි! ඝර්ෂණය නොමැති නිසා ශක්ති හානියක් සිදු නොවේ.',
          explanationEn: 'Incorrect. Without friction or drag particles, nothing removes kinetic energy.',
        },
      ],
    },
  },
  law2: {
    id: 'law2',
    shortTabLabel: '02. Second Law (F = ma)',
    badgeCode: '02. Force & Acceleration',
    titleMix: 'Newton’s 2nd Law — බලය, ස්කන්ධය සහ ත්වරණය (F = ma)',
    titleSi: 'නිව්ටන්ගේ දෙවන නියමය — ගම්‍යතා වෙනස්වීමේ සීඝ්‍රතාවය (F = ma)',
    titleEn: 'Newton’s Second Law — Force, Mass & Acceleration (F = ma)',
    subtitleMix: 'වස්තුවක ගම්‍යතාව වෙනස් වීමේ සීඝ්‍රතාවය ඒ මත යොදන අසංතුලිත බලයට අනුලෝමව සමානුපාතික වේ.',
    subtitleSi: 'වස්තුවක ත්වරණය ශුද්ධ බලයට අනුලෝමවත්, එහි ස්කන්ධයට ප්‍රතිලෝමවත් සමානුපාතික වේ (a = F_net / m).',
    subtitleEn: 'The acceleration of a body is directly proportional to the net force acting on it and inversely proportional to its inertial mass.',
    coreFormula: 'F_net = dp/dt = m · a   =>   a = (F_applied - f_k) / m',
    particleFormula: 'a_lattice = F_net / (N_atoms · m_atom)',
    summaryMix:
      'ඇයි වැඩි ස්කන්ධයක් (Mass) තියෙන ලොරියක් වේගවත් කරන්න කාර් එකකට වඩා වැඩි බලයක් (Force) ඕන වෙන්නේ? First Principles වලින් හිතමු: ස්කන්ධය වැඩි වෙනවා කියන්නේ වස්තුව ඇතුළේ තියෙන Persistent 3D Atoms ගණන (N) වැඩි වෙන එකයි. ඔයා යොදන මුළු බලය (F_net) ඒ පරමාණු N ගණන අතරේ බෙදී යනවා (F_atom = F_net / N). පරමාණු ගණන දෙගුණ වුණොත්, එක පරමාණුවකට ලැබෙන බලය භාගයක් වෙන නිසා ත්වරණය (Acceleration) හරියටම භාගයක් (a = F/m) වෙනවා!',
    summarySi:
      'ස්කන්ධය යනු වස්තුවක අඩංගු පදාර්ථ (පරමාණු) ප්‍රමාණයයි. එකම බලයක් යෙදූ විට වැඩි පරමාණු සංඛ්‍යාවක් සහිත වස්තුවක එක් පරමාණුවක් මත ක්‍රියා කරන බලය අඩු වන බැවින් එහි ත්වරණය අඩු වේ. PySR සංකේතාත්මක විශ්ලේෂණයෙන් ද a = F_net / m යන්න තහවුරු වේ.',
    summaryEn:
      'From First Principles, inertial mass m is proportional to the count N of persistent atoms in the 3D lattice. An external force F_net must accelerate all N atoms simultaneously through inter-atomic bonds, so each atom experiences F_net / N, yielding a = F_net / m.',
    realWorldExampleMix:
      '🛒 Supermarket Trolley vs Heavy Truck: හිස් ට්‍රොලියක් (m = 5 kg) 40 N බලයකින් තල්ලු කළොත් a = 8 m/s² කින් විදිනවා. හැබැයි බඩු පුරවපු ට්‍රොලියක් (m = 40 kg) ඒ 40 N බලයෙන්ම තල්ලු කළොත් ලැබෙන්නේ a = 1 m/s² ක් විතරයි!',
    realWorldExampleSi:
      'හිස් කරත්තයක් තල්ලු කිරීමට වඩා බඩු පිරවූ කරත්තයක් එකම ත්වරණයකින් චලනය කිරීමට වැඩි බලයක් යෙදිය යුතුය.',
    realWorldExampleEn:
      'Pushing an empty 5 kg cart with 40 N produces 8 m/s² acceleration, whereas a loaded 40 kg cart under the same 40 N accelerates at only 1 m/s².',
    firstPrinciples: [
      {
        stepNumber: '01',
        titleMix: 'Force Changes Momentum (බලය මගින් ගම්‍යතාව වෙනස් කරයි)',
        titleSi: 'ගම්‍යතාව සහ බලය අතර මූලික සම්බන්ධය',
        titleEn: 'Force as Rate of Momentum Transfer',
        bodyMix:
          'වස්තුවක චලිත ප්‍රමාණය (Momentum) කියන්නේ p = m · v. තත්පරයකට ගම්‍යතාව වෙනස් වෙන ප්‍රමාණය තමයි ශුද්ධ බලය: F_net = dp/dt.',
        bodySi:
          'වස්තුවක ස්කන්ධය හා ප්‍රවේගයේ ගුණිතය ගම්‍යතාවයයි (p = mv). ගම්‍යතාව වෙනස් වීමේ සීඝ්‍රතාවය යෙදූ සම්ප්‍රයුක්ත බලයට සමාන වේ.',
        bodyEn:
          'Linear momentum p = m·v measures total motion content. Net force is strictly the time rate of momentum transfer: F_net = dp/dt.',
        formula: 'F_net = dp / dt = m · (dv / dt) = m · a',
      },
      {
        stepNumber: '02',
        titleMix: 'Why Divide by Mass m? (ඇයි ස්කන්ධයෙන් බෙදන්නේ?)',
        titleSi: 'පරමාණුක දැලිස හරහා බලය බෙදී යාම',
        titleEn: 'Force Distribution Across N Lattice Atoms',
        bodyMix:
          '3D viewport එකේ Mass slider එක වැඩි කරලා බලන්න: පරමාණු කැට (Lattice Cubes) ගණන වැඩි වෙනවා. එකම F_net බලය පරමාණු ගොඩක් අතරේ බෙදෙන නිසා එක පරමාණුවකට ලැබෙන ත්වරණය අඩු වෙනවා.',
        bodySi:
          'ස්කන්ධය වැඩි වන විට වස්තුවේ පරමාණු ගණන ඉහළ යයි. එවිට යොදන බලය පරමාණු සියල්ල අතර බෙදී යන බැවින් ත්වරණය ප්‍රතිලෝමව අඩු වේ.',
        bodyEn:
          'Increasing mass adds more atomic nodes to the 3D sled lattice. The same applied force must tension more inter-atomic springs, lowering acceleration.',
        formula: 'a = F_net / m = (F_applied - μmg) / (N · m_0)',
      },
      {
        stepNumber: '03',
        titleMix: 'PySR Symbolic Discovery (දත්ත වලින් සමීකරණය සෙවීම)',
        titleSi: 'පරීක්ෂණ දත්ත ඇසුරින් සමීකරණය තහවුරු කිරීම',
        titleEn: 'Symbolic Regression Verification (PySR)',
        bodyMix:
          'දකුණු පැත්තේ PySR Symbolic Tree එක බලන්න! විවිධ F සහ m අගයන්වලදී ලැබෙන ත්වරණ දත්ත (Telemetry) පරීක්ෂා කරලා MSE දෝෂය 0.0001 වන සත්‍ය සමීකරණය a = (F - μmg)/m බව ස්වයංක්‍රීයව තහවුරු කරනවා.',
        bodySi:
          'පරීක්ෂණ දත්ත ගැලපීමේදී අවම දෝෂයක් (MSE ≈ 0) ලබා දෙන සමීකරණ ගස වන්නේ a = (F - μmg) / m යන්නයි.',
        bodyEn:
          'Inspect the PySR Symbolic Discovery panel: across multiple (F, m) sensor samples, the expression tree (F - μmg)/m achieves zero residual MSE.',
        formula: 'Loss(T) = (1/K) ∑ [ a_measured - T(F, m, μ) ]² → 0',
      },
    ],
    presets: [
      {
        label: 'Light Cart Sprint (m = 5 kg, F = 50 N)',
        descriptionMix: 'අඩු ස්කන්ධයකට වැඩි බලයක් යෙදූ විට ඉහළ ත්වරණයක් (a = 10 m/s²)',
        appliedForce: 50,
        massA: 5,
        massB: 10,
        frictionCoeff: 0,
        restitution: 0.8,
      },
      {
        label: 'Heavy Freight Load (m = 25 kg, F = 50 N)',
        descriptionMix: 'එකම 50 N බලය 25 kg ස්කන්ධයකට යෙදූ විට ත්වරණය 2 m/s² දක්වා අඩුවීම',
        appliedForce: 50,
        massA: 25,
        massB: 10,
        frictionCoeff: 0,
        restitution: 0.8,
      },
      {
        label: 'Frictional Drag Track (μ = 0.25)',
        descriptionMix: 'ඝර්ෂණය සහිත පෘෂ්ඨයකදී ශුද්ධ බලය F_net = F - μmg මගින් ත්වරණය තීරණය වීම',
        appliedForce: 60,
        massA: 10,
        massB: 10,
        frictionCoeff: 0.25,
        restitution: 0.8,
      },
    ],
    quiz: {
      id: 'q_law2',
      questionMix:
        'ඝර්ෂණය නැති පෘෂ්ඨයක් මත 8 kg වස්තුවකට 32 N බලයක් යෙදුවොත් ලැබෙන ත්වරණය (a) කොපමණද? ස්කන්ධය 16 kg කළොත් කුමක් වේද?',
      questionSi:
        'සුමට පෘෂ්ඨයක් මත ඇති 8 kg වස්තුවකට 32 N බලයක් යෙදූ විට ත්වරණය කොපමණද? ස්කන්ධය 16 kg දක්වා දෙගුණ කළහොත් ත්වරණයට කුමක් සිදුවේද?',
      questionEn:
        'A 32 N net force acts on an 8 kg mass on a frictionless track. What is its acceleration, and what happens if mass doubles to 16 kg?',
      options: [
        {
          id: 'opt1',
          labelMix: 'a = 4 m/s², ස්කන්ධය 16 kg කළ විට a = 2 m/s² වේ',
          labelSi: 'ත්වරණය 4 m/s² වන අතර ස්කන්ධය දෙගුණ කළ විට 2 m/s² දක්වා අඩුවේ',
          labelEn: 'a = 4 m/s², and halving to 2 m/s² when mass doubles to 16 kg',
          isCorrect: true,
          explanationMix: 'විශිෂ්ටයි! a = F/m = 32 / 8 = 4 m/s². ස්කන්ධය 16 kg වූ විට a = 32 / 16 = 2 m/s² වේ.',
          explanationSi: 'නිවැරදියි! a = F/m අනුව 32/8 = 4 m/s² සහ 32/16 = 2 m/s² වේ.',
          explanationEn: 'Spot on! By a = F/m, 32 N / 8 kg = 4 m/s², and doubling mass to 16 kg halves acceleration to 2 m/s².',
        },
        {
          id: 'opt2',
          labelMix: 'a = 256 m/s², ස්කන්ධය වැඩි කළ විට ත්වරණය වැඩි වේ',
          labelSi: 'ත්වරණය 256 m/s² වන අතර ස්කන්ධය සමඟ වැඩි වේ',
          labelEn: 'a = 256 m/s², and increases to 512 m/s² when mass doubles',
          isCorrect: false,
          explanationMix: 'වැරදියි! ත්වරණය සෙවීමට බලය ස්කන්ධයෙන් බෙදිය යුතුය (a = F / m), වැඩි නොකළ යුතුය.',
          explanationSi: 'වැරදියි! a = F/m මිස F×m නොවේ.',
          explanationEn: 'Incorrect. Acceleration is Force divided by Mass (a = F/m), not multiplied.',
        },
        {
          id: 'opt3',
          labelMix: 'a = 4 m/s², ස්කන්ධය වෙනස් කළත් ත්වරණය වෙනස් නොවේ',
          labelSi: 'ත්වරණය 4 m/s² වන අතර ස්කන්ධය මත රඳා නොපවතී',
          labelEn: 'a = 4 m/s², and remains 4 m/s² regardless of mass',
          isCorrect: false,
          explanationMix: 'වැරදියි! වැඩි ස්කන්ධයකට වැඩි අවස්ථිතියක් (More Atoms) ඇති නිසා ත්වරණය අඩුවේ.',
          explanationSi: 'වැරදියි! ත්වරණය ස්කන්ධයට ප්‍රතිලෝමව සමානුපාතික වේ.',
          explanationEn: 'Incorrect. Inertial mass resists acceleration inversely (a = F/m).',
        },
      ],
    },
  },
  law3: {
    id: 'law3',
    shortTabLabel: '03. Third Law (ක්‍රියා-ප්‍රතික්‍රියා)',
    badgeCode: '03. Action & Reaction',
    titleMix: 'Newton’s 3rd Law — ක්‍රියාව සහ ප්‍රතික්‍රියාව (Action & Reaction)',
    titleSi: 'නිව්ටන්ගේ තුන්වන නියමය — ක්‍රියාව සහ ප්‍රතික්‍රියාව',
    titleEn: 'Newton’s Third Law — Symmetry of Action & Reaction',
    subtitleMix: 'සෑම ක්‍රියාවකටම විශාලත්වයෙන් සමාන හා දිශාවෙන් ප්‍රතිවිරුද්ධ ප්‍රතික්‍රියාවක් වස්තු දෙකක් අතර පවතී.',
    subtitleSi: 'වස්තුවක් තවත් වස්තුවක් මත බලයක් යොදන සෑම විටම, දෙවන වස්තුව මගින් පළමු වස්තුව මත විශාලත්වයෙන් සමාන හා දිශාවෙන් ප්‍රතිවිරුද්ධ බලයක් යොදයි.',
    subtitleEn: 'Whenever Body A exerts a force on Body B, Body B simultaneously exerts a force of equal magnitude and opposite direction on Body A.',
    coreFormula: 'F_{A→B} = −F_{B→A}   =>   m_A Δv_A = −m_B Δv_B',
    particleFormula: 'F_{ij} = −∇V(|r_i − r_j|) = −F_{ji}',
    summaryMix:
      'ඇයි බලයකට කවදාවත් තනියම පවතින්න බැරි? First Principles (මූලික පරමාණුක මූලධර්ම) වලින් බලමු: බලයක් කියන්නේ පරමාණු දෙකක විද්‍යුත් චුම්භක ක්ෂේත්‍ර (Electromagnetic Fields) අතර සිදුවන අන්තර්ක්‍රියාවක් (Interaction). Pod A වල පරමාණු Pod B වල පරමාණු තල්ලු කරනකොට, ඒ විද්‍යුත් ක්ෂේත්‍රයම දෙපැත්තටම එක හා සමානව ක්‍රියා කරනවා (F_AB = -F_BA). බල දෙක සමාන වුණාට, ස්කන්ධය අඩු වස්තුව වැඩි ත්වරණයකින් (a = F/m) පිටිපස්සට විසිවෙනවා!',
    summarySi:
      'විශ්වයේ කිසිදු බලයක් හුදකලාව නොපවතී. බලයක් යනු වස්තු දෙකක පරමාණුක ක්ෂේත්‍ර අතර ඇතිවන අන්‍යෝන්‍ය අන්තර්ක්‍රියාවකි. ක්‍රියාව සහ ප්‍රතික්‍රියාව එකම අවස්ථාවේදී වස්තු දෙකක් මත ක්‍රියා කරන බැවින් ඒවා එකිනෙක අවලංගු නොවේ.',
    summaryEn:
      'From First Principles, forces arise from symmetric pair potentials V(|r_i - r_j|) between particles. Because the distance between Atom A and Atom B is symmetric, the gradient forces are strictly equal and opposite (F_AB = -F_BA), guaranteeing total momentum conservation.',
    realWorldExampleMix:
      '🚀 Rocket Propulsion & Boat Jump: රොකට් එකක් උඩට යන්නේ පොළොව තල්ලු කරලා නෙවෙයි! රොකට් එන්ජිමෙන් අධික වේගයෙන් පිටවන වායු අංශු (Exhaust Gas Particles) පහළට තල්ලු කරනකොට (Action), ඒ වායු අංශු මගින් රොකට් එක උඩට තල්ලු කරනවා (Reaction)!',
    realWorldExampleSi:
      'රොකට්ටුවක් ඉහළට ගමන් කරන්නේ එය මගින් ඉන්ධන වායු අංශු පහළට තල්ලු කරන විට (ක්‍රියාව), එම වායු අංශු මගින් රොකට්ටුව ඉහළට තල්ලු කරන (ප්‍රතික්‍රියාව) නිසාය.',
    realWorldExampleEn:
      'A rocket accelerates in vacuum by expelling high-velocity gas particles backward (Action on exhaust), which simultaneously push the rocket nozzle forward with equal force (Reaction on rocket).',
    firstPrinciples: [
      {
        stepNumber: '01',
        titleMix: 'Two Different Bodies (බල දෙක ක්‍රියා කරන්නේ වස්තු දෙකක් මතයි!)',
        titleSi: 'ක්‍රියාව සහ ප්‍රතික්‍රියාව එකිනෙක අවලංගු නොවන්නේ ඇයි?',
        titleEn: 'Why Action & Reaction Never Cancel Out',
        bodyMix:
          'ගොඩක් සිසුන්ට වරදින තැනක්: "ක්‍රියාවයි ප්‍රතික්‍රියාවයි සමාන හා ප්‍රතිවිරුද්ධ නම් ඒ දෙක කැපිලා ගිහින් වස්තුව නතර වෙන්න එපැයි?" නැහැ! F_A→B ක්‍රියා කරන්නේ B මත. F_B→A ක්‍රියා කරන්නේ A මත. වස්තු දෙකක් මත ක්‍රියා කරන බල එකිනෙක කැපෙන්නේ නැහැ!',
        bodySi:
          'ක්‍රියා බලය ක්‍රියා කරන්නේ දෙවන වස්තුව මත වන අතර ප්‍රතික්‍රියා බලය ක්‍රියා කරන්නේ පළමු වස්තුව මතය. වස්තු දෙකක් මත යෙදෙන බල එකිනෙක අවලංගු නොවේ.',
        bodyEn:
          'Students often ask: "If F_AB = -F_BA, why don’t they cancel to zero?" Because F_AB acts on Body B while F_BA acts on Body A! Forces only cancel when applied to the same body.',
        formula: 'a_A = −F / m_A ,   a_B = +F / m_B',
      },
      {
        stepNumber: '02',
        titleMix: 'Equal Force ≠ Equal Acceleration (බල සමාන වුවත් ත්වරණ වෙනස්!)',
        titleSi: 'ස්කන්ධ අසමාන වූ විට ත්වරණ වෙනස් වන ආකාරය',
        titleEn: 'Equal Forces Produce Asymmetric Accelerations',
        bodyMix:
          '3D Scene එකේ Pod A (වැඩි ස්කන්ධයක්) සහ Pod B (අඩු ස්කන්ධයක්) අතර ගැටීම හෝ Thruster බලය බලන්න: දෙන්නටම ලැබෙන බලය (N) හරියටම සමානයි. හැබැයි සැහැල්ලු Pod B වැඩි වේගයකින් විසිවෙනවා!',
        bodySi:
          'වස්තු දෙක මත ක්‍රියා කරන බල විශාලත්වයෙන් සමාන වුවද, ස්කන්ධය අඩු වස්තුවට වැඩි ත්වරණයක් (a = F/m) ලැබේ.',
        bodyEn:
          'Watch Pod A and Pod B in the 3D arena: the orange and cyan force arrows have identical length |F|, yet the lighter pod experiences a much larger acceleration.',
        formula: '|F_{A→B}| = |F_{B→A}|  =>  m_A |a_A| = m_B |a_B|',
      },
      {
        stepNumber: '03',
        titleMix: 'Conservation of Momentum (ගම්‍යතා සංස්ථිති නියමය)',
        titleSi: 'මුළු රේඛීය ගම්‍යතාව නියතව පැවතීම',
        titleEn: 'Emergence of Momentum Conservation',
        bodyMix:
          'F_AB + F_BA = 0 කියන සමීකරණය කාලය (dt) සමඟ අනුකලනය කළාම මුළු ගම්‍යතාව (p_total = m_A v_A + m_B v_B) ගැටුමට පෙර සහ පසු නියතව පවතින බව ඔප්පු වෙනවා.',
        bodySi:
          'නිව්ටන්ගේ තුන්වන නියමයේ සෘජු ප්‍රතිඵලයක් ලෙස පද්ධතියක මුළු ගම්‍යතාව (m_A v_A + m_B v_B) සංස්ථිතික වේ.',
        bodyEn:
          'Integrating F_AB + F_BA = 0 over interaction time dt directly proves that total system momentum p_total = m_A v_A + m_B v_B is invariant.',
        formula: 'Δp_total = ∫ (F_{A→B} + F_{B→A}) dt = 0',
      },
    ],
    presets: [
      {
        label: 'Symmetric Pods (m_A = 10 kg, m_B = 10 kg)',
        descriptionMix: 'සමාන ස්කන්ධ දෙකක් අතර ප්‍රතිවිරුද්ධ හා සමාන ප්‍රවේග හුවමාරුව',
        appliedForce: 35,
        massA: 10,
        massB: 10,
        frictionCoeff: 0,
        restitution: 1.0,
      },
      {
        label: 'Heavy Mother-Ship vs Mini Probe (25 kg vs 5 kg)',
        descriptionMix: 'බල දෙක සමාන වුවත් 5 kg යානය 5 ගුණයක වැඩි ත්වරණයකින් විසිවීම',
        appliedForce: 40,
        massA: 25,
        massB: 5,
        frictionCoeff: 0,
        restitution: 0.95,
      },
      {
        label: 'High-Speed Elastic Collision',
        descriptionMix: 'පූර්ණ ප්‍රත්‍යාස්ථ ගැටුමකදී ක්‍රියා-ප්‍රතික්‍රියා ආවේගය (Impulse)',
        appliedForce: -45,
        massA: 15,
        massB: 8,
        frictionCoeff: 0,
        restitution: 1.0,
      },
    ],
    quiz: {
      id: 'q_law3',
      questionMix:
        'විශාල ට්‍රක් රථයක් (2000 kg) සහ කුඩා මෝටර් රථයක් (500 kg) මුහුණට මුහුණ ගැටෙන විට, වැඩි බලයක් (Force) යෙදෙන්නේ කුමන වාහනය මතද?',
      questionSi:
        '2000 kg බර ට්‍රක් රථයක් සහ 500 kg බර කුඩා මෝටර් රථයක් එකිනෙක ගැටෙන මොහොතේදී වැඩි බලයක් ක්‍රියා කරන්නේ කුමන රථය මතද?',
      questionEn:
        'When a heavy 2000 kg truck collides head-on with a small 500 kg car, which vehicle experiences the greater magnitude of impact force?',
      options: [
        {
          id: 'opt1',
          labelMix: 'කුඩා මෝටර් රථය මත වැඩි බලයක් යෙදේ',
          labelSi: 'කුඩා මෝටර් රථය මත වැඩි බලයක් යෙදේ',
          labelEn: 'The small 500 kg car experiences a much larger force',
          isCorrect: false,
          explanationMix: 'වැරදියි! කුඩා රථයට වැඩි වන්නේ ත්වරණය (a = F/m) මිස බලය (Force) නොවේ.',
          explanationSi: 'වැරදියි! කුඩා රථයේ වේග වෙනස (ත්වරණය) වැඩි වුවද බල දෙක සමාන වේ.',
          explanationEn: 'Incorrect! The car suffers greater acceleration (a = F/m), but the force magnitude is identical.',
        },
        {
          id: 'opt2',
          labelMix: 'වාහන දෙකම මත හරියටම සමාන විශාලත්වයකින් යුත් බල ක්‍රියා කරයි (|F_AB| = |F_BA|)',
          labelSi: 'රථ දෙකම මත හරියටම සමාන විශාලත්වයකින් යුත් බල ක්‍රියා කරයි',
          labelEn: 'Both vehicles experience the exact same force magnitude (|F_truck| = |F_car|)',
          isCorrect: true,
          explanationMix: 'හරියටම හරි! නිව්ටන්ගේ 3 වන නියමය අනුව බල දෙක සමානයි. නමුත් කුඩා කාර් එකේ ස්කන්ධය 4 ගුණයකින් අඩු නිසා එයට 4 ගුණයක මන්දනයක් (Deceleration) ඇතිවේ!',
          explanationSi: 'නිවැරදියි! ක්‍රියාව සහ ප්‍රතික්‍රියාව සැමවිටම විශාලත්වයෙන් සමාන වේ.',
          explanationEn: 'Correct! Newton’s 3rd Law guarantees |F_AB| = |F_BA|. The car sustains more damage only because its smaller mass undergoes 4× greater deceleration.',
        },
        {
          id: 'opt3',
          labelMix: 'ට්‍රක් රථය මත වැඩි බලයක් යෙදේ',
          labelSi: 'ට්‍රක් රථය මත වැඩි බලයක් යෙදේ',
          labelEn: 'The heavy 2000 kg truck experiences the larger force',
          isCorrect: false,
          explanationMix: 'වැරදියි! අන්තර්ක්‍රියා බල යුගලය සැමවිටම සමාන වේ.',
          explanationSi: 'වැරදියි! බල දෙක සැමවිටම සමාන වේ.',
          explanationEn: 'Incorrect. Pairwise interaction forces are always equal in magnitude.',
        },
      ],
    },
  },
  particle_lab: {
    id: 'particle_lab',
    shortTabLabel: '04. 3D Particle World (JST-2 + PySR)',
    badgeCode: '04. First-Principles World Model',
    titleMix: '3D Physics-Native Particle World — මූලික පරමාණුක ආකෘතිය (JST-2 + PySR + ManimGX)',
    titleSi: 'ත්‍රිමාණ අංශු භෞතික විද්‍යා ආකෘතිය — මූලික මූලධර්ම විශ්ලේෂණය',
    titleEn: 'First-Principles 3D Particle Lattice & Symbolic Law Discovery',
    subtitleMix: 'Pixel අනුමාන වෙනුවට 3D අවකාශයේ ස්ථාවර පරමාණු (Persistent Atoms), බල දෛශික (ManimGX Vectors) සහ PySR සමීකරණ සෙවීම.',
    subtitleSi: 'ත්‍රිමාණ අවකාශයේ පරමාණුක බන්ධන, දෛශික ක්ෂේත්‍ර සහ දත්ත මගින් භෞතික නියම සොයාගැනීමේ පරීක්ෂණාගාරය.',
    subtitleEn: 'Inspired by Viggle JST-2, ManimGX & PySR 2: Persistent 3D atomic lattices, vector field geometry, and live symbolic regression.',
    coreFormula: 'm_i r̈_i = F_ext,i − ∑_j k_bond (|r_i − r_j| − L_0) r̂_{ij} − γ v_i',
    particleFormula: 'Macroscopic Law (F = ma)  ⟸  Emerges from ∑_{i=1}^N (m_0 r̈_i)',
    summaryMix:
      'ඔබ ලබාදුන් Reference තාක්ෂණයන් 3 එකට ක්‍රියාත්මක වන ආකාරය මෙතැනින් අත්විඳින්න! (1) Viggle JST-2 මෙන් වස්තුවක් පික්සල් ගොඩක් ලෙස නොව 3D අවකාශයේ Spring බන්ධන වලින් බැඳුණු පරමාණු (27 Persistent Atoms) ලෙස ගොඩනගා ඇත. (2) ManimGX මෙන් සෑම බලයක්ම ත්‍රිමාණ දෛශික ඊතල (3D Force Vector Arrows) සහ ඛණ්ඩාංක ජාල මගින් දෘශ්‍යමාන කරයි. (3) PySR 2 මෙන් පරමාණුක චලිත දත්ත (Sensor Data) විශ්ලේෂණය කර නිව්ටන්ගේ සමීකරණ ගස (Symbolic Expression Tree) ස්වයංක්‍රීයව සොයා ගනී!',
    summarySi:
      'මෙම ත්‍රිමාණ පරීක්ෂණාගාරය මගින් ඕනෑම විශාල වස්තුවක චලිතය එහි අභ්‍යන්තර පරමාණුක දැලිසේ (3D Persistent Atom Lattice) අන්තර්ක්‍රියා මගින් ගොඩනැගෙන ආකාරය පෙන්වයි.',
    summaryEn:
      'Unites all three reference architectures: (1) JST-2 Persistent 3D Atom Lattice where macroscopic inertia emerges from coupled harmonic masses; (2) ManimGX 3D mathematical vector fields; and (3) PySR 2 Symbolic Regression discovering F = ma directly from telemetry.',
    realWorldExampleMix:
      '🔬 Solid State & Crash Simulation: වාහනයක හෝ පාලමක බලයක් යෙදෙනකොට මුලින්ම තල්ලු වෙන්නේ ඉදිරිපස පරමාණු තට්ටුවයි. ඒ පරමාණු අතර තියෙන විද්‍යුත් Spring බන්ධන (k_bond) හරහා තමයි ශබ්දයේ වේගයෙන් අනිත් පරමාණු වලට බලය සම්ප්‍රේෂණය වෙන්නේ!',
    realWorldExampleSi:
      'ඝන වස්තුවකට බලයක් යෙදූ විට එම බලය වස්තුව පුරා ගමන් කරන්නේ අන්තර්-පරමාණුක බන්ධන හරහා ප්‍රත්‍යාස්ථ තරංගයක් ලෙසිනි.',
    realWorldExampleEn:
      'When you push one side of a steel block, the force propagates across the 3D atomic lattice via inter-atomic electromagnetic springs before the whole center of mass accelerates.',
    firstPrinciples: [
      {
        stepNumber: '01',
        titleMix: 'JST-2: Persistent Atoms in 3D Space (ත්‍රිමාණ පරමාණු ජාලය)',
        titleSi: 'ත්‍රිමාණ අවකාශයේ ස්ථාවර පරමාණුක ආකෘතිය',
        titleEn: 'JST-2 Architecture: Persistent Atoms in 3D Space',
        bodyMix:
          'ඇයි 2D වීඩියෝවකින් භෞතික විද්‍යාව තේරුම් ගන්න බැරි? සැබෑ ලෝකය පවතින්නේ 3D අවකාශයේ පරමාණු සහ බල ක්ෂේත්‍ර මතයි. මැද තියෙන 3×3×3 පරමාණුක දැලිසට බලයක් දීලා බලන්න—එක පරමාණුවකින් අනිකට බලය ගලා යන හැටි පෙනේවි!',
        bodySi:
          'සැබෑ ලෝකයේ වස්තූන් ත්‍රිමාණ පරමාණුක ජාලයකින් සමන්විත වේ. බාහිර බලයක් යෙදූ විට පරමාණු අතර බන්ධන හරහා චලිතය සම්ප්‍රේෂණය වේ.',
        bodyEn:
          'Instead of pixel-space approximations, the 3×3×3 persistent atom lattice models internal spring deformations and center-of-mass kinematics in true 3D.',
        formula: 'R_cm = (1/N) ∑ r_i ,   M R̈_cm = ∑ F_ext,i',
      },
      {
        stepNumber: '02',
        titleMix: 'ManimGX: 3D Vector Field & Phase Space (ත්‍රිමාණ දෛශික)',
        titleSi: 'ත්‍රිමාණ දෛශික ක්ෂේත්‍ර සහ ඛණ්ඩාංක දෘශ්‍යකරණය',
        titleEn: 'ManimGX 3D Vector Geometry & Phase Trajectories',
        bodyMix:
          'සෑම පරමාණුවක් මතම ක්‍රියා කරන ප්‍රවේග දෛශික (Velocity Vectors) සහ සම්ප්‍රයුක්ත බල දෛශික 3D අවකාශයේ සජීවීව ඇඳේ. Internal Forces (∑F_ij = 0) එකිනෙක කැපී යන නිසා මුළු වස්තුවම F_ext = M·a අනුව චලනය වේ!',
        bodySi:
          'අභ්‍යන්තර පරමාණුක බල නිව්ටන්ගේ 3 වන නියමය අනුව එකිනෙක අවලංගු වන බැවින් සමස්ත වස්තුවේ ත්වරණය තීරණය වන්නේ බාහිර ශුද්ධ බලය මගින් පමණි.',
        bodyEn:
          'Because internal inter-atomic forces cancel pairwise by Newton’s 3rd Law (∑F_ij = 0), the sum over all atoms collapses cleanly to F_ext = M·a_cm!',
        formula: '∑_i ∑_{j≠i} F_{ij} = 0  ⇒  ∑_i m_0 r̈_i = F_ext',
      },
      {
        stepNumber: '03',
        titleMix: 'PySR 2: Symbolic Regression Tree (සමීකරණ ගස ගොඩනැගීම)',
        titleSi: 'සංකේතාත්මක ප්‍රතිගමනය මගින් භෞතික නියම සොයා ගැනීම',
        titleEn: 'PySR 2: Symbolic Equation Discovery from Telemetry',
        bodyMix:
          'පරමාණු 27 හි සංවේදක දත්ත (Position, Velocity, Force) PySR ඇල්ගොරිතමයට ලබා දුන් විට, කෙටිම සහ නිවැරදිම ගණිතමය ප්‍රකාශන ගස (Binary Operator Tree: ÷, −, ×) ලෙස නිව්ටන්ගේ නියමය සොයා ගනී.',
        bodySi:
          'සංවේදක දත්ත ඇසුරින් භෞතික විද්‍යාත්මක සමීකරණය ස්වයංක්‍රීයව ගොඩනැගීම මෙහිදී සිදු කෙරේ.',
        bodyEn:
          'Searches the space of binary operator trees (+, −, ×, ÷) to find the most parsimonious closed-form physical equation fitting the 3D particle telemetry.',
        formula: 'Tree: [ ÷ ] → ( [ − ] → (F, μmg),  m )',
      },
    ],
    presets: [
      {
        label: 'Rigid Diamond Lattice (k = 220 N/m)',
        descriptionMix: 'ඉතා ශක්තිමත් පරමාණුක බන්ධන ඇති විට මුළු දැලිසම එකවර ත්වරණය වීම',
        appliedForce: 45,
        massA: 12,
        massB: 10,
        frictionCoeff: 0.05,
        restitution: 0.95,
      },
      {
        label: 'Soft Elastic Gel Lattice (k = 45 N/m)',
        descriptionMix: 'මෘදු පරමාණුක බන්ධන ඇති විට බලය තරංගයක් ලෙස පරමාණු හරහා ගමන් කිරීම',
        appliedForce: 55,
        massA: 15,
        massB: 10,
        frictionCoeff: 0.1,
        restitution: 0.85,
      },
      {
        label: 'High Thermal Dissipation (μ = 0.45)',
        descriptionMix: 'අධික ඝර්ෂණය නිසා පරමාණුක කම්පන (Thermal Jitter) උපරිම වීම',
        appliedForce: 30,
        massA: 10,
        massB: 10,
        frictionCoeff: 0.45,
        restitution: 0.7,
      },
    ],
    quiz: {
      id: 'q_particle',
      questionMix:
        'පරමාණු බිලියන ගණනකින් සෑදුණු වස්තුවක අභ්‍යන්තර පරමාණු එකිනෙක තල්ලු කරගත්තත්, වස්තුව ඉබේම ඉදිරියට ත්වරණය නොවන්නේ ඇයි?',
      questionSi:
        'වස්තුවක් තුළ ඇති පරමාණු එකිනෙක මත ප්‍රබල අභ්‍යන්තර බල යෙදුවද, බාහිර බලයක් නොමැතිව වස්තුව ඉබේ චලනය නොවන්නේ ඇයි?',
      questionEn:
        'Why do the trillions of strong internal forces between atoms inside a solid block never cause the block as a whole to self-accelerate?',
      options: [
        {
          id: 'opt1',
          labelMix: 'නිව්ටන්ගේ 3 වන නියමය අනුව අභ්‍යන්තර බල යුගල (F_ij = -F_ji) එකතුව ශුන්‍ය වන නිසා',
          labelSi: 'නිව්ටන්ගේ තුන්වන නියමය අනුව සියලු අභ්‍යන්තර ක්‍රියා-ප්‍රතික්‍රියා බල යුගල එකිනෙක අවලංගු වන නිසා',
          labelEn: 'By Newton’s 3rd Law, all internal pairwise forces cancel out (∑ F_ij = 0)',
          isCorrect: true,
          explanationMix: 'විශිෂ්ටයි! සෑම පරමාණු දෙකක් අතරම F_ij + F_ji = 0 වන නිසා මුළු අභ්‍යන්තර බල එකතුව 0 වේ. වස්තුවේ ස්කන්ධ කේන්ද්‍රය ත්වරණය කළ හැක්කේ බාහිර බලයකට (F_ext) පමණි!',
          explanationSi: 'නිවැරදියි! අභ්‍යන්තර බල යුගලවල ශුද්ධ එකතුව ශුන්‍ය වන බැවින් ස්කන්ධ කේන්ද්‍රය ත්වරණය වන්නේ බාහිර බලයකින් පමණි.',
          explanationEn: 'Exactly right! Pairwise symmetry F_ij = -F_ji makes the sum of all internal forces vanish identically.',
        },
        {
          id: 'opt2',
          labelMix: 'පරමාණු වලට ස්කන්ධයක් නොමැති නිසා',
          labelSi: 'පරමාණු වලට ස්කන්ධයක් නොමැති නිසා',
          labelEn: 'Because individual atoms have zero inertial mass',
          isCorrect: false,
          explanationMix: 'වැරදියි! වස්තුවේ මුළු ස්කන්ධය හැදෙන්නේම ඒ පරමාණු සියල්ලේ ස්කන්ධ එකතුවෙනි (M = N·m_0).',
          explanationSi: 'වැරදියි! පරමාණු වල ස්කන්ධයේ එකතුවෙන් වස්තුවේ මුළු ස්කන්ධය සෑදේ.',
          explanationEn: 'Incorrect. Macroscopic mass M is the sum of the masses of its constituent atoms.',
        },
        {
          id: 'opt3',
          labelMix: 'ගුරුත්වාකර්ෂණය නිසා පරමාණු නිශ්චලව පවතින නිසා',
          labelSi: 'ගුරුත්වාකර්ෂණය මගින් පරමාණු අගුළු දමා ඇති නිසා',
          labelEn: 'Because gravity locks internal atoms in place',
          isCorrect: false,
          explanationMix: 'වැරදියි! අභ්‍යවකාශයේ (Zero Gravity) වුවද අභ්‍යන්තර බල මගින් වස්තුවක් ඉබේ ත්වරණය කළ නොහැක.',
          explanationSi: 'වැරදියි! ගුරුත්වය නොමැති අවකාශයේ වුවද මෙය වලංගු වේ.',
          explanationEn: 'Incorrect. Even in zero-gravity deep space, internal forces cancel pairwise.',
        },
      ],
    },
  },
};
