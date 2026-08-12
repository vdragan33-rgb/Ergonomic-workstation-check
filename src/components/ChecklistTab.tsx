import React, { useState } from 'react';
import {
  SetupType,
  ComplianceStatus,
  AssessmentItemState,
  ChecklistCategory
} from '../types';
import { CHECKLIST_CATEGORIES } from '../data/checklistItems';
import { compressImage } from '../lib/imageUtils';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Camera,
  FileText,
  Save,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Info,
  Filter,
  Printer,
  User,
  Search,
  PlusCircle,
  Cloud,
  Check,
  Loader2,
  Eye,
  Trash2,
  X
} from 'lucide-react';

interface ChecklistTabProps {
  setupType: SetupType;
  lang: 'pt' | 'en';
  itemStates: Record<string, AssessmentItemState>;
  setItemStates: React.Dispatch<React.SetStateAction<Record<string, AssessmentItemState>>>;
  employeeName: string;
  setEmployeeName: (name: string) => void;
  department: string;
  setDepartment: (dept: string) => void;
  evaluatorName: string;
  setEvaluatorName: (evaluator: string) => void;
  savedEmployeeList: string[];
  onSelectEmployeeProfile: (employeeName: string) => void;
  onNewAssessment: () => void;
  onSaveAssessment: () => void;
  onOpenReport: () => void;
  onAskGeminiForItem: (itemTitle: string, legalRef: string) => void;
  isAutoSaved?: boolean;
}

export const ChecklistTab: React.FC<ChecklistTabProps> = ({
  setupType,
  lang,
  itemStates,
  setItemStates,
  employeeName,
  setEmployeeName,
  department,
  setDepartment,
  evaluatorName,
  setEvaluatorName,
  savedEmployeeList,
  onSelectEmployeeProfile,
  onNewAssessment,
  onSaveAssessment,
  onOpenReport,
  onAskGeminiForItem,
  isAutoSaved = true,
}) => {
  const isPt = lang === 'pt';
  const [filterNonCompliantOnly, setFilterNonCompliantOnly] = useState(false);
  const [processingImageItemId, setProcessingImageItemId] = useState<string | null>(null);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'cat-screen': true,
    'cat-keyboard-mouse': true,
    'cat-desk': false,
    'cat-chair': true,
    'cat-environment': false,
    'cat-safety-telework': false,
    'cat-habits-breaks': true
  });
  const [openTips, setOpenTips] = useState<Record<string, boolean>>({});

  const handleStatusChange = (itemId: string, newStatus: ComplianceStatus) => {
    setItemStates((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        status: newStatus
      }
    }));
  };

  const handleNotesChange = (itemId: string, notesText: string) => {
    setItemStates((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        notes: notesText
      }
    }));
  };

  const handlePhotoUpload = async (itemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setProcessingImageItemId(itemId);
      const compressedBase64 = await compressImage(file, 800, 800, 0.75);
      setItemStates((prev) => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          photoUrl: compressedBase64
        }
      }));
    } catch (err) {
      console.error('Failed to compress image:', err);
      alert(isPt ? 'Erro ao processar imagem.' : 'Failed to process image.');
    } finally {
      setProcessingImageItemId(null);
      e.target.value = ''; // Reset input value so re-selecting same file works
    }
  };

  const handleRemovePhoto = (itemId: string) => {
    setItemStates((prev) => {
      const updated = { ...prev[itemId] };
      delete updated.photoUrl;
      return {
        ...prev,
        [itemId]: updated
      };
    });
  };

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const toggleTip = (itemId: string) => {
    setOpenTips((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  // Calculate statistics
  let totalEvaluated = 0;
  let compliantCount = 0;
  let improvementCount = 0;
  let nonCompliantCount = 0;
  let naCount = 0;

  CHECKLIST_CATEGORIES.forEach((cat) => {
    cat.items.forEach((item) => {
      const state = itemStates[item.id] || { status: 'compliant' };
      if (state.status === 'compliant') compliantCount++;
      else if (state.status === 'improvement') improvementCount++;
      else if (state.status === 'non_compliant') nonCompliantCount++;
      else if (state.status === 'na') naCount++;
    });
  });

  totalEvaluated = compliantCount + improvementCount + nonCompliantCount;
  const rawScore = totalEvaluated > 0 ? (compliantCount + improvementCount * 0.5) / totalEvaluated : 1;
  const scorePercent = Math.round(rawScore * 100);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Controls & Save Panel */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4A5D4E] dark:text-emerald-400">
              {isPt ? 'Checklist de SST em Portugal' : 'Portuguese SST Checklist'}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium">
              {setupType === 'home'
                ? isPt
                  ? 'Teletrabalho (Art. 165-171 CT)'
                  : 'Home Office'
                : isPt
                ? 'Escritório IQAS (DL 349/93)'
                : 'IQAS Office'}
            </span>
            {isAutoSaved && (
              <span className="flex items-center gap-1 text-[11px] font-bold px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Cloud className="w-3 h-3 text-emerald-600" />
                <span>{isPt ? 'Guardado Automaticamente no Firebase' : 'Auto-Saved to Firebase'}</span>
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold text-[#1A1A17] dark:text-white mt-1">
            {isPt ? 'Avaliação Ergonómica Digital' : 'Digital Ergonomic Assessment'}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            {isPt
              ? 'Registe os dados do colaborador. Todos os valores são guardados e recuperáveis por nome em tempo real.'
              : 'Enter employee assessment details. Data is auto-saved and retrievable by name.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="filter-noncompliant-btn"
            onClick={() => setFilterNonCompliantOnly(!filterNonCompliantOnly)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold transition border ${
              filterNonCompliantOnly
                ? 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-300'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-200'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>
              {filterNonCompliantOnly
                ? isPt
                  ? 'A mostrar Não-Conformes'
                  : 'Showing Non-Compliant'
                : isPt
                ? 'Filtrar Problemas'
                : 'Filter Issues'}
            </span>
          </button>

          <button
            id="open-report-btn"
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-300 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isPt ? 'Relatório Oficial SST' : 'Official Report'}</span>
          </button>

          <button
            id="save-assessment-btn"
            onClick={onSaveAssessment}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold bg-[#4A5D4E] hover:bg-[#38473C] text-white transition shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isPt ? 'Guardar Avaliação' : 'Save Record'}</span>
          </button>
        </div>
      </div>

      {/* Employee Identification & Profile Retrieval Card (REQUIREMENT 2 & 3) */}
      <div className="bg-[#FAF9F6] dark:bg-stone-900 p-6 rounded-3xl border border-stone-300 dark:border-stone-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#4A5D4E] text-white rounded-xl">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#1A1A17] dark:text-white">
                {isPt ? 'Identificação do Colaborador Avaliado' : 'Assessed Employee Information'}
              </h3>
              <p className="text-xs text-stone-500">
                {isPt
                  ? 'Recupere dados guardados por nome ou introduza uma nova avaliação'
                  : 'Retrieve saved records by employee name or start a new assessment'}
              </p>
            </div>
          </div>

          {/* Retrieve Saved Employee Dropdown & New Button */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white dark:bg-stone-800 px-3 py-1.5 rounded-2xl border border-stone-300 dark:border-stone-700">
              <Search className="w-3.5 h-3.5 text-stone-400" />
              <select
                id="retrieve-employee-select"
                onChange={(e) => {
                  if (e.target.value) {
                    onSelectEmployeeProfile(e.target.value);
                  }
                }}
                defaultValue=""
                className="bg-transparent text-xs font-bold text-stone-800 dark:text-stone-200 focus:outline-none cursor-pointer"
              >
                <option value="" disabled>
                  {isPt ? '🔍 Recuperar por Nome...' : '🔍 Retrieve Saved Employee...'}
                </option>
                {savedEmployeeList.map((emp) => (
                  <option key={emp} value={emp}>
                    {emp}
                  </option>
                ))}
              </select>
            </div>

            <button
              id="new-employee-assessment-btn"
              onClick={onNewAssessment}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold bg-stone-200 hover:bg-stone-300 text-stone-800 dark:bg-stone-800 dark:text-stone-200 transition"
              title={isPt ? 'Limpar e iniciar nova avaliação' : 'Start fresh assessment'}
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#4A5D4E]" />
              <span>{isPt ? 'Nova Avaliação' : 'New Assessment'}</span>
            </button>
          </div>
        </div>

        {/* Inputs for Employee Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
              {isPt ? 'Nome Completo do Colaborador' : 'Employee Full Name'} *
            </label>
            <input
              type="text"
              required
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              placeholder="e.g. Ana Silva"
              className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-bold text-[#1A1A17] dark:text-white focus:ring-2 focus:ring-[#4A5D4E] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
              {isPt ? 'Departamento / Unidade' : 'Department / Unit'}
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. IQAS - Direção de Acreditação"
              className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-bold text-[#1A1A17] dark:text-white focus:ring-2 focus:ring-[#4A5D4E] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
              {isPt ? 'Avaliador / Técnico SST' : 'Evaluator / SST Officer'}
            </label>
            <input
              type="text"
              value={evaluatorName}
              onChange={(e) => setEvaluatorName(e.target.value)}
              placeholder="e.g. Técnico SST IQAS"
              className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-bold text-[#1A1A17] dark:text-white focus:ring-2 focus:ring-[#4A5D4E] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Metric Breakdown Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-emerald-50/90 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 p-5 rounded-3xl flex items-center gap-3 shadow-sm">
          <div className="p-3 bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 rounded-2xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-200">
              {compliantCount}
            </div>
            <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              {isPt ? 'Conforme' : 'Compliant'}
            </div>
          </div>
        </div>

        <div className="bg-amber-50/90 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 p-5 rounded-3xl flex items-center gap-3 shadow-sm">
          <div className="p-3 bg-amber-500/20 text-amber-800 dark:text-amber-300 rounded-2xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-900 dark:text-amber-200">
              {improvementCount}
            </div>
            <div className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              {isPt ? 'A Melhorar' : 'Needs Work'}
            </div>
          </div>
        </div>

        <div className="bg-rose-50/90 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 p-5 rounded-3xl flex items-center gap-3 shadow-sm">
          <div className="p-3 bg-rose-500/20 text-rose-800 dark:text-rose-300 rounded-2xl">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-rose-900 dark:text-rose-200">
              {nonCompliantCount}
            </div>
            <div className="text-xs font-semibold text-rose-700 dark:text-rose-400">
              {isPt ? 'Não Conforme' : 'Non-Compliant'}
            </div>
          </div>
        </div>

        <div className="bg-[#E9E6DF] dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-5 rounded-3xl flex items-center gap-3 shadow-sm">
          <div className="p-3 bg-[#4A5D4E]/20 text-[#4A5D4E] dark:text-emerald-300 rounded-2xl">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#1A1A17] dark:text-white">
              {scorePercent}%
            </div>
            <div className="text-xs font-semibold text-stone-600 dark:text-stone-300">
              {isPt ? 'Índice Geral' : 'Overall Index'}
            </div>
          </div>
        </div>
      </div>

      {/* Checklist Categories List */}
      <div className="space-y-4">
        {CHECKLIST_CATEGORIES.map((category: ChecklistCategory) => {
          // Filter items if active
          const visibleItems = category.items.filter((item) => {
            const st = itemStates[item.id]?.status || 'compliant';
            if (filterNonCompliantOnly) {
              return st === 'non_compliant' || st === 'improvement';
            }
            return true;
          });

          if (filterNonCompliantOnly && visibleItems.length === 0) return null;

          const isExpanded = expandedCategories[category.id] ?? true;

          // Category progress calculation
          let catCompliant = 0;
          category.items.forEach((it) => {
            const s = itemStates[it.id]?.status || 'compliant';
            if (s === 'compliant') catCompliant++;
            else if (s === 'improvement') catCompliant += 0.5;
          });
          const catPercent = Math.round((catCompliant / category.items.length) * 100);

          return (
            <div
              key={category.id}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl overflow-hidden shadow-sm transition"
            >
              {/* Category Header Bar */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full px-6 py-4 bg-stone-100/70 dark:bg-stone-800/60 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-between text-left transition border-b border-stone-200/80 dark:border-stone-800"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-[#4A5D4E]/10 text-[#4A5D4E] dark:text-emerald-300 font-bold text-sm">
                    {category.titlePt.slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#1A1A17] dark:text-white">
                      {isPt ? category.titlePt : category.titleEn}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {isPt ? category.descriptionPt : category.descriptionEn}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2">
                    <div className="w-28 h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#4A5D4E] rounded-full transition-all"
                        style={{ width: `${catPercent}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 w-10 text-right">
                      {catPercent}%
                    </span>
                  </div>

                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-stone-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-stone-400" />
                  )}
                </div>
              </button>

              {/* Items List */}
              {isExpanded && (
                <div className="p-6 divide-y divide-stone-100 dark:divide-stone-800/80 space-y-6">
                  {visibleItems.map((item) => {
                    const currentState = itemStates[item.id] || { status: 'compliant' };
                    const isTipOpen = !!openTips[item.id];

                    return (
                      <div key={item.id} className="pt-4 first:pt-0 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1 max-w-2xl">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-sm text-[#1A1A17] dark:text-white">
                                {isPt ? item.titlePt : item.titleEn}
                              </h4>
                              <span className="text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                                {item.legalRef}
                              </span>
                              {item.priority === 'high' && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300">
                                  {isPt ? 'Prioridade Elevada' : 'High Priority'}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                              {isPt ? item.descriptionPt : item.descriptionEn}
                            </p>
                          </div>

                          {/* Compliance Status Selector Toggle */}
                          <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-full self-start sm:self-auto border border-stone-200 dark:border-stone-700">
                            <button
                              id={`status-compliant-${item.id}`}
                              onClick={() => handleStatusChange(item.id, 'compliant')}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition ${
                                currentState.status === 'compliant'
                                  ? 'bg-[#4A5D4E] text-white shadow-sm'
                                  : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span className="hidden md:inline">
                                {isPt ? 'Conforme' : 'Compliant'}
                              </span>
                            </button>

                            <button
                              id={`status-improvement-${item.id}`}
                              onClick={() => handleStatusChange(item.id, 'improvement')}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition ${
                                currentState.status === 'improvement'
                                  ? 'bg-amber-600 text-white shadow-sm'
                                  : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white'
                              }`}
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span className="hidden md:inline">
                                {isPt ? 'A Melhorar' : 'Needs Work'}
                              </span>
                            </button>

                            <button
                              id={`status-noncompliant-${item.id}`}
                              onClick={() => handleStatusChange(item.id, 'non_compliant')}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition ${
                                currentState.status === 'non_compliant'
                                  ? 'bg-rose-600 text-white shadow-sm'
                                  : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white'
                              }`}
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span className="hidden md:inline">
                                {isPt ? 'Não Conforme' : 'Issue'}
                              </span>
                            </button>

                            <button
                              id={`status-na-${item.id}`}
                              onClick={() => handleStatusChange(item.id, 'na')}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition ${
                                currentState.status === 'na'
                                  ? 'bg-stone-600 text-white shadow-sm'
                                  : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white'
                              }`}
                            >
                              <HelpCircle className="w-3.5 h-3.5" />
                              <span className="hidden md:inline">N/A</span>
                            </button>
                          </div>
                        </div>

                        {/* Action Bar & Quick Tip */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                          <button
                            onClick={() => toggleTip(item.id)}
                            className="flex items-center gap-1 text-[#4A5D4E] dark:text-emerald-400 hover:underline font-semibold"
                          >
                            <Info className="w-3.5 h-3.5" />
                            <span>
                              {isTipOpen
                                ? isPt
                                  ? 'Ocultar dica'
                                  : 'Hide verification tip'
                                : isPt
                                ? 'Como verificar este requisito'
                                : 'How to verify'}
                            </span>
                          </button>

                          {(currentState.status === 'non_compliant' ||
                            currentState.status === 'improvement') && (
                            <button
                              onClick={() =>
                                onAskGeminiForItem(item.titlePt, item.legalRef)
                              }
                              className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#4A5D4E]/10 text-[#4A5D4E] dark:text-emerald-300 hover:bg-[#4A5D4E]/20 font-semibold border border-[#4A5D4E]/20"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>{isPt ? 'Consultar IA para Corrigir' : 'Ask AI to Fix'}</span>
                            </button>
                          )}
                        </div>

                        {/* Verification Tip Box */}
                        {isTipOpen && (
                          <div className="bg-[#E9E6DF]/70 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 p-3.5 rounded-2xl text-xs text-stone-800 dark:text-stone-200 flex items-start gap-2.5">
                            <Info className="w-4 h-4 text-[#4A5D4E] dark:text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold block mb-0.5 text-[#1A1A17] dark:text-white">
                                {isPt ? 'Dica de Verificação Técnica:' : 'Technical Check:'}
                              </span>
                              {isPt ? item.verificationTipPt : item.verificationTipEn}
                            </div>
                          </div>
                        )}

                        {/* Optional Notes & Photo Attachments */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <input
                            type="text"
                            placeholder={
                              isPt
                                ? 'Adicionar observação / ação corretiva...'
                                : 'Add notes or corrective measure...'
                            }
                            value={currentState.notes || ''}
                            onChange={(e) => handleNotesChange(item.id, e.target.value)}
                            className="w-full text-xs px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-[#4A5D4E]"
                          />

                          <div className="flex items-center gap-2 flex-wrap">
                            {processingImageItemId === item.id ? (
                              <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs font-semibold text-stone-600 dark:text-stone-300">
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#4A5D4E]" />
                                <span>{isPt ? 'A otimizar...' : 'Processing...'}</span>
                              </div>
                            ) : (
                              <label className="cursor-pointer flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 transition shrink-0">
                                <Camera className="w-3.5 h-3.5 text-[#4A5D4E]" />
                                <span>
                                  {currentState.photoUrl
                                    ? isPt
                                      ? 'Alterar Foto'
                                      : 'Change Photo'
                                    : isPt
                                    ? 'Anexar Foto'
                                    : 'Attach Photo'}
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handlePhotoUpload(item.id, e)}
                                  className="hidden"
                                />
                              </label>
                            )}

                            {currentState.photoUrl && (
                              <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 p-1.5 rounded-2xl border border-stone-200 dark:border-stone-700">
                                <button
                                  type="button"
                                  onClick={() => setPreviewPhotoUrl(currentState.photoUrl!)}
                                  className="relative group overflow-hidden rounded-xl shrink-0"
                                  title={isPt ? 'Ver imagem em tamanho grande' : 'View full size image'}
                                >
                                  <img
                                    src={currentState.photoUrl}
                                    alt="Evidência"
                                    className="w-9 h-9 object-cover rounded-xl border border-stone-300 dark:border-stone-600 group-hover:scale-105 transition"
                                  />
                                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-white">
                                    <Eye className="w-3.5 h-3.5" />
                                  </div>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setPreviewPhotoUrl(currentState.photoUrl!)}
                                  className="text-xs font-semibold text-[#4A5D4E] dark:text-emerald-400 hover:underline flex items-center gap-1"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>{isPt ? 'Ver Foto' : 'View Photo'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleRemovePhoto(item.id)}
                                  className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                                  title={isPt ? 'Remover foto' : 'Remove photo'}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox Photo Preview Modal */}
      {previewPhotoUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewPhotoUrl(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-stone-900 p-2 rounded-3xl overflow-hidden border border-stone-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewPhotoUrl(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-stone-800/80 hover:bg-stone-700 text-white rounded-full transition shadow"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={previewPhotoUrl}
              alt="Foto de Evidência Ergonómica"
              className="w-full max-h-[80vh] object-contain rounded-2xl"
            />

            <div className="p-3 text-center text-xs text-stone-300 font-medium">
              {isPt ? 'Fotografia de Evidência Ergonómica da Avaliação SST' : 'Ergonomic Evidence Photo'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
