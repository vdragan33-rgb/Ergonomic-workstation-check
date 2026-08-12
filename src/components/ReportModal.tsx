import React from 'react';
import { SetupType, AssessmentItemState } from '../types';
import { CHECKLIST_CATEGORIES } from '../data/checklistItems';
import { X, Printer, ShieldCheck, AlertTriangle, FileText } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  setupType: SetupType;
  lang: 'pt' | 'en';
  itemStates: Record<string, AssessmentItemState>;
  overallScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  evaluatorName: string;
  department: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  setupType,
  lang,
  itemStates,
  overallScore,
  riskLevel,
  evaluatorName,
  department
}) => {
  if (!isOpen) return null;

  const isPt = lang === 'pt';
  const currentDate = new Date().toLocaleDateString(isPt ? 'pt-PT' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Extract non-compliant and improvement items
  const nonCompliantItemsList: { title: string; legalRef: string; notes?: string; photoUrl?: string; category: string }[] = [];
  const improvementItemsList: { title: string; legalRef: string; notes?: string; photoUrl?: string; category: string }[] = [];

  CHECKLIST_CATEGORIES.forEach((cat) => {
    cat.items.forEach((item) => {
      const state = itemStates[item.id] || { status: 'compliant' };
      if (state.status === 'non_compliant') {
        nonCompliantItemsList.push({
          title: item.titlePt,
          legalRef: item.legalRef,
          notes: state.notes,
          photoUrl: state.photoUrl,
          category: cat.titlePt
        });
      } else if (state.status === 'improvement') {
        improvementItemsList.push({
          title: item.titlePt,
          legalRef: item.legalRef,
          notes: state.notes,
          photoUrl: state.photoUrl,
          category: cat.titlePt
        });
      }
    });
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D2D2A]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF9F6] text-[#2D2D2A] w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 my-8">
        {/* Top Control Bar */}
        <div className="p-4 bg-[#2D2D2A] text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">
              {isPt ? 'Relatório Oficial de Avaliação Ergonómica - IQAS' : 'Official Ergonomic Report'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-[#4A5D4E] hover:bg-[#38473C] text-white transition shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>{isPt ? 'Imprimir / Exportar PDF' : 'Print / Export PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-stone-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 space-y-6 print:p-0 print:text-black">
          {/* Document Header */}
          <div className="border-b-2 border-[#2D2D2A] pb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#4A5D4E] text-white font-black flex items-center justify-center text-sm">
                  IQ
                </div>
                <h1 className="font-black text-xl tracking-tight text-[#1A1A17]">
                  IQAS - Instituto Português de Acreditação
                </h1>
              </div>
              <p className="text-xs text-stone-600 mt-1 font-semibold">
                Serviços de Segurança e Saúde no Trabalho (SST) | Avaliação Ergonómica de Postos de Trabalho
              </p>
            </div>

            <div className="text-right text-xs text-stone-600 space-y-0.5">
              <div><strong className="text-stone-900">Data:</strong> {currentDate}</div>
              <div><strong className="text-stone-900">Ref. Legal:</strong> Decreto-Lei n.º 349/93</div>
              <div><strong className="text-stone-900">Âmbito:</strong> Lei n.º 102/2009 (SST)</div>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-stone-100/80 border border-stone-200 text-xs">
            <div>
              <span className="text-stone-500 uppercase block text-[10px] font-bold">Colaborador / Avaliador:</span>
              <span className="font-bold text-stone-900">{evaluatorName || 'Ana Silva'}</span>
            </div>
            <div>
              <span className="text-stone-500 uppercase block text-[10px] font-bold">Departamento IQAS:</span>
              <span className="font-bold text-stone-900">{department || 'Direção de Acreditação'}</span>
            </div>
            <div>
              <span className="text-stone-500 uppercase block text-[10px] font-bold">Tipo de Posto:</span>
              <span className="font-bold text-stone-900">
                {setupType === 'home' ? 'Teletrabalho (Home)' : 'Escritório IQAS (Presencial)'}
              </span>
            </div>
            <div>
              <span className="text-stone-500 uppercase block text-[10px] font-bold">Índice de Conformidade:</span>
              <span className="font-black text-[#4A5D4E] text-sm">{overallScore}% ({riskLevel === 'low' ? 'Risco Baixo' : riskLevel === 'medium' ? 'Risco Médio' : 'Risco Elevado'})</span>
            </div>
          </div>

          {/* Non-Conformities Section */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-stone-900 border-b border-stone-200 pb-1 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>1. Não-Conformidades Detetadas ({nonCompliantItemsList.length})</span>
            </h3>

            {nonCompliantItemsList.length === 0 ? (
              <p className="text-xs text-stone-500 italic">
                Nenhuma não-conformidade crítica detetada. O posto de trabalho cumpre integralmente os requisitos do Decreto-Lei 349/93.
              </p>
            ) : (
              <div className="space-y-2 text-xs">
                {nonCompliantItemsList.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                    <div className="flex justify-between font-bold text-stone-900">
                      <span>{item.title}</span>
                      <span className="font-mono text-rose-700 text-[11px]">{item.legalRef}</span>
                    </div>
                    <div className="text-stone-600 text-[11px] mt-0.5">{item.category}</div>
                    {item.notes && <div className="text-rose-900 mt-1 italic font-medium">Nota: "{item.notes}"</div>}
                    {item.photoUrl && (
                      <div className="mt-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                          Foto de Evidência:
                        </span>
                        <img
                          src={item.photoUrl}
                          alt="Evidência"
                          className="w-32 h-24 object-cover rounded-lg border border-rose-300"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Improvements Section */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-stone-900 border-b border-stone-200 pb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>2. Oportunidades de Melhoria / Ações Aconselhadas ({improvementItemsList.length})</span>
            </h3>

            {improvementItemsList.length === 0 ? (
              <p className="text-xs text-stone-500 italic">Nenhum ponto a melhorar assinalado.</p>
            ) : (
              <div className="space-y-2 text-xs">
                {improvementItemsList.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="flex justify-between font-bold text-stone-900">
                      <span>{item.title}</span>
                      <span className="font-mono text-amber-800 text-[11px]">{item.legalRef}</span>
                    </div>
                    {item.notes && <div className="text-amber-900 mt-1 italic font-medium">Nota: "{item.notes}"</div>}
                    {item.photoUrl && (
                      <div className="mt-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                          Foto de Evidência:
                        </span>
                        <img
                          src={item.photoUrl}
                          alt="Evidência"
                          className="w-32 h-24 object-cover rounded-lg border border-amber-300"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sign-off Signature Blocks */}
          <div className="pt-8 grid grid-cols-2 gap-8 border-t border-stone-200 text-xs">
            <div className="space-y-8">
              <div>
                <span className="font-bold block text-stone-900">O/A Colaborador(a) IQAS:</span>
                <span className="text-stone-500 text-[11px]">{evaluatorName || 'Ana Silva'}</span>
              </div>
              <div className="border-b border-stone-300 w-48"></div>
              <span className="text-[10px] text-stone-400 block">Assinatura / Validação</span>
            </div>

            <div className="space-y-8">
              <div>
                <span className="font-bold block text-stone-900">Técnico/a de Segurança e Saúde no Trabalho (SST):</span>
                <span className="text-stone-500 text-[11px]">Serviço de Prevenção de Riscos IQAS</span>
              </div>
              <div className="border-b border-stone-300 w-48"></div>
              <span className="text-[10px] text-stone-400 block">Assinatura / Parecer SST</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
