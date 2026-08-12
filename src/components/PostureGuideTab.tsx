import React, { useState } from 'react';
import { PORTUGUESE_LEGISLATION_DOCS } from '../data/legalRequirements';
import {
  Monitor,
  Eye,
  User,
  Sparkles,
  Maximize2,
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface PostureGuideTabProps {
  lang: 'pt' | 'en';
}

interface Hotspot {
  id: string;
  namePt: string;
  nameEn: string;
  x: number; // percentage
  y: number; // percentage
  recommendationPt: string;
  recommendationEn: string;
  legalRef: string;
  angleTarget: string;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'hs-eyes-screen',
    namePt: '1. Nível dos Olhos e Ecrã',
    nameEn: '1. Eye Level & Screen',
    x: 65,
    y: 22,
    recommendationPt: 'Topo da área útil do ecrã alinhado com a linha de visão. Distância de 50 cm a 70 cm (braço estendido).',
    recommendationEn: 'Top of screen aligned with eye line. Distance 50-70 cm (arm length).',
    legalRef: 'DL 349/93 Anexo II, 1.a',
    angleTarget: 'Visão 0° a -15°'
  },
  {
    id: 'hs-neck',
    namePt: '2. Cervical e Posição da Cabeça',
    nameEn: '2. Cervical & Head Alignment',
    x: 52,
    y: 22,
    recommendationPt: 'Cabeça equilibrada sobre os ombros sem projeção frontal (evitar síndrome de pescoço de texto).',
    recommendationEn: 'Head centered over shoulders without forward chin protrusion.',
    legalRef: 'Lei 102/2009 & ACT',
    angleTarget: 'Flexão < 10°'
  },
  {
    id: 'hs-elbows',
    namePt: '3. Cotovelos e Apoio de Antebraços',
    nameEn: '3. Elbow Angle & Forearm Support',
    x: 46,
    y: 44,
    recommendationPt: 'Cotovelos junto ao tronco fletidos a 90.º-100.º. Mãos apoiadas na mesa 10-15 cm antes do teclado.',
    recommendationEn: 'Elbows at 90-100 degrees near torso. Wrists resting on desk 10-15 cm in front of keys.',
    legalRef: 'DL 349/93 Anexo II, 2.b',
    angleTarget: '90° - 100°'
  },
  {
    id: 'hs-lumbar',
    namePt: '4. Curvatura Lombar e Encosto',
    nameEn: '4. Lumbar Support & Backrest Tilt',
    x: 35,
    y: 48,
    recommendationPt: 'Costas bem apoiadas no encosto com almofada lombar ajustada à curva fisiológica da coluna.',
    recommendationEn: 'Back supported against backrest with lumbar contour filling lower spine curve.',
    legalRef: 'DL 349/93 Anexo II, 4.c',
    angleTarget: 'Tronco 90° - 105°'
  },
  {
    id: 'hs-knees-seat',
    namePt: '5. Quadril e Altura do Assento',
    nameEn: '5. Hip & Seat Clearance',
    x: 42,
    y: 68,
    recommendationPt: 'Ancas ligeiramente acima do nível dos joelhos (ângulo de 90.º-100.º). Folga de 2 a 3 dedos atrás dos joelhos.',
    recommendationEn: 'Hips slightly above knees. Leave 2-3 finger clearance behind knees.',
    legalRef: 'DL 349/93 Anexo II, 4.b',
    angleTarget: 'Joelho 90° - 100°'
  },
  {
    id: 'hs-feet',
    namePt: '6. Pés Assentes no Chão / Apoio',
    nameEn: '6. Feet Flat on Floor / Footrest',
    x: 52,
    y: 88,
    recommendationPt: 'Pés totalmente assentes no chão. Utilizar apoio de pés se as pernas ficarem suspensas.',
    recommendationEn: 'Feet resting flat on floor. Use a footrest if seat height leaves heels dangling.',
    legalRef: 'DL 349/93 Anexo II, 4.e',
    angleTarget: 'Tornozelo 90°'
  }
];

export const PostureGuideTab: React.FC<PostureGuideTabProps> = ({ lang }) => {
  const isPt = lang === 'pt';
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot>(HOTSPOTS[0]);

  return (
    <div className="space-y-8 pb-12">
      {/* Intro Header */}
      <div className="bg-[#4A5D4E] text-white p-6 rounded-3xl shadow-sm border border-[#38473C]">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-200">
            {isPt ? 'Normas Ergonómicas em Portugal' : 'Portuguese Ergonomic Standards'}
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">
            {isPt ? 'Guia Postural e Diagrama do Posto de Trabalho' : 'Postural Guide & Workstation Diagram'}
          </h2>
          <p className="text-xs text-stone-100/90 mt-2 leading-relaxed">
            {isPt
              ? 'Consulte os ângulos articulares neutros, distâncias de segurança e regulação de equipamentos recomendados pela Autoridade para as Condições do Trabalho (ACT) e ISO 9241-5.'
              : 'Review neutral joint angles, distance thresholds, and equipment adjustability recommended by ACT and ISO 9241-5.'}
          </p>
        </div>
      </div>

      {/* Interactive 2D Posture Visualizer & Hotspots */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Diagram Stage */}
        <div className="lg:col-span-7 bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-[#1A1A17] dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-[#4A5D4E]" />
              <span>{isPt ? 'Diagrama de Análise Postural' : 'Postural Analysis Stage'}</span>
            </h3>
            <span className="text-xs text-stone-500 font-medium">
              {isPt ? 'Clique nos pontos destacados' : 'Click hotspot nodes'}
            </span>
          </div>

          {/* SVG Silhouette Interactive Canvas */}
          <div className="relative w-full aspect-[4/3] bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex items-center justify-center">
            {/* Visual Background Grid & Ergonomic Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-stone-300 dark:text-stone-700" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Stylized Workstation SVG Graphic */}
            <svg viewBox="0 0 500 380" className="w-full h-full max-h-[340px] drop-shadow-sm">
              {/* Desk */}
              <rect x="230" y="190" width="180" height="12" rx="3" fill="#78716C" />
              <rect x="380" y="202" width="16" height="130" fill="#A8A29E" />
              <rect x="250" y="202" width="16" height="130" fill="#A8A29E" />

              {/* Monitor */}
              <rect x="310" y="80" width="12" height="110" rx="2" fill="#57534E" />
              <rect x="300" y="185" width="32" height="6" fill="#57534E" />
              <rect x="320" y="90" width="10" height="85" rx="3" fill="#4A5D4E" opacity="0.9" />
              {/* Screen Eye Distance Line */}
              <line x1="240" y1="105" x2="320" y2="105" stroke="#4A5D4E" strokeWidth="2" strokeDasharray="4 4" />

              {/* Keyboard & Mouse */}
              <rect x="255" y="186" width="35" height="4" rx="1" fill="#292524" />
              <rect x="295" y="186" width="12" height="4" rx="2" fill="#4A5D4E" />

              {/* Ergonomic Chair */}
              <rect x="150" y="120" width="16" height="110" rx="8" fill="#2D2D2A" /> {/* Backrest */}
              <path d="M 152 170 Q 165 170 152 190" fill="none" stroke="#4A5D4E" strokeWidth="4" /> {/* Lumbar highlight */}
              <rect x="150" y="220" width="75" height="16" rx="5" fill="#2D2D2A" /> {/* Seat */}
              <rect x="180" y="236" width="12" height="60" fill="#78716C" /> {/* Gas lift */}
              <path d="M 140 296 L 232 296" stroke="#44403C" strokeWidth="6" strokeLinecap="round" /> {/* 5-star base */}
              <circle cx="140" cy="302" r="6" fill="#1C1917" />
              <circle cx="232" cy="302" r="6" fill="#1C1917" />

              {/* Human Silhouette Sitting Position */}
              <circle cx="215" cy="105" r="22" fill="#4A5D4E" opacity="0.9" /> {/* Head */}
              <path d="M 215 127 L 205 220" stroke="#4A5D4E" strokeWidth="24" strokeLinecap="round" opacity="0.9" /> {/* Spine */}
              <path d="M 205 220 L 255 220" stroke="#4A5D4E" strokeWidth="22" strokeLinecap="round" opacity="0.9" /> {/* Thigh */}
              <path d="M 255 220 L 255 295" stroke="#4A5D4E" strokeWidth="18" strokeLinecap="round" opacity="0.9" /> {/* Lower leg */}
              <path d="M 210 145 L 240 185 L 275 185" stroke="#849B89" strokeWidth="12" strokeLinejoin="round" fill="none" /> {/* Arm */}
            </svg>

            {/* Clickable Hotspot Node Overlays */}
            {HOTSPOTS.map((hs) => {
              const isSelected = selectedHotspot.id === hs.id;
              return (
                <button
                  key={hs.id}
                  onClick={() => setSelectedHotspot(hs)}
                  style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-lg ${
                    isSelected
                      ? 'bg-[#4A5D4E] text-white ring-4 ring-[#4A5D4E]/30 scale-125 z-20'
                      : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-white border-2 border-[#4A5D4E] hover:scale-110 z-10'
                  }`}
                  title={isPt ? hs.namePt : hs.nameEn}
                >
                  {hs.id.replace('hs-', '').slice(0, 2)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hotspot Details Card */}
        <div className="lg:col-span-5 bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4A5D4E] dark:text-emerald-400">
              {selectedHotspot.angleTarget}
            </span>
            <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
              {selectedHotspot.legalRef}
            </span>
          </div>

          <h3 className="text-lg font-bold text-[#1A1A17] dark:text-white">
            {isPt ? selectedHotspot.namePt : selectedHotspot.nameEn}
          </h3>

          <div className="bg-[#E9E6DF]/70 dark:bg-stone-800/80 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2">
            <div className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase">
              {isPt ? 'Recomendação Técnica ACT / SST:' : 'ACT Technical Specification:'}
            </div>
            <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
              {isPt ? selectedHotspot.recommendationPt : selectedHotspot.recommendationEn}
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-[#1A1A17] dark:text-white uppercase tracking-wider">
              {isPt ? 'Checklist Rápida de Verificação:' : 'Quick Verification Checklist:'}
            </h4>
            <ul className="text-xs text-stone-600 dark:text-stone-300 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4A5D4E] shrink-0" />
                <span>{isPt ? 'Sem tensão estática nos trapézios/ombros' : 'No static trapezoid tension'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4A5D4E] shrink-0" />
                <span>{isPt ? 'Apoio contínuo e estável de membros' : 'Stable continuous limb support'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4A5D4E] shrink-0" />
                <span>{isPt ? 'Livre de compressão na fossa poplítea' : 'No popliteal compression'}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Official Portuguese Legal Framework Directory */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#4A5D4E] dark:text-emerald-400" />
          <h3 className="font-bold text-lg text-[#1A1A17] dark:text-white">
            {isPt ? 'Legislação e Regulamentação de SST em Portugal' : 'Portuguese SST Legal Directory'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PORTUGUESE_LEGISLATION_DOCS.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-2xl bg-stone-100/70 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#4A5D4E] dark:text-emerald-400">
                  {doc.code}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#4A5D4E]/10 text-[#4A5D4E] dark:text-emerald-300">
                  SST / EDV
                </span>
              </div>
              <h4 className="font-bold text-xs text-[#1A1A17] dark:text-white">
                {doc.titlePt}
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                {doc.scopePt}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
