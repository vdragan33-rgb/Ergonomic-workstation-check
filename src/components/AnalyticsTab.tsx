import React, { useState } from 'react';
import { AssessmentRecord, ActionItem } from '../types';
import {
  TrendingUp,
  Building2,
  Home,
  CheckSquare,
  Printer,
  Calendar,
  User,
  Mail,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock
} from 'lucide-react';

interface AnalyticsTabProps {
  records: AssessmentRecord[];
  actionItems: ActionItem[];
  setActionItems: React.Dispatch<React.SetStateAction<ActionItem[]>>;
  lang: 'pt' | 'en';
  onOpenReport: () => void;
  onOpenSendEmail: (employeeName: string) => void;
  onOpenOwnerSettings: () => void;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  records,
  actionItems,
  setActionItems,
  lang,
  onOpenReport,
  onOpenSendEmail,
  onOpenOwnerSettings,
}) => {
  const isPt = lang === 'pt';
  const [activeSubTab, setActiveSubTab] = useState<'evolution' | 'actions'>('evolution');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');

  const toggleActionStatus = (id: string) => {
    setActionItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'completed' ? 'in_progress' : 'completed';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  // Collect unique employee names from records and action items
  const allEmployeeNames = Array.from(
    new Set([
      ...records.map((r) => r.employeeName).filter(Boolean),
      ...actionItems.map((a) => a.employeeName).filter(Boolean)
    ])
  ).sort();

  // Filter records & actions based on employee selection
  const isAll = selectedEmployee === 'all';

  const filteredRecords = isAll
    ? records
    : records.filter(
        (r) => r.employeeName && r.employeeName.toLowerCase().trim() === selectedEmployee.toLowerCase().trim()
      );

  const filteredActionItems = isAll
    ? actionItems
    : actionItems.filter(
        (a) => a.employeeName && a.employeeName.toLowerCase().trim() === selectedEmployee.toLowerCase().trim()
      );

  const homeRecords = filteredRecords.filter((r) => r.setupType === 'home');
  const officeRecords = filteredRecords.filter((r) => r.setupType === 'office');

  const latestHomeScore = homeRecords.length > 0 ? homeRecords[homeRecords.length - 1].scorePercent : 0;
  const latestOfficeScore = officeRecords.length > 0 ? officeRecords[officeRecords.length - 1].scorePercent : 0;

  const avgScore = filteredRecords.length > 0
    ? Math.round(filteredRecords.reduce((acc, r) => acc + r.scorePercent, 0) / filteredRecords.length)
    : 85;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Actions Bar */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4A5D4E] dark:text-emerald-400">
              {isPt ? 'Painel de Controlo IQAS SST' : 'IQAS SST Dashboard'}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#1A1A17] dark:text-white mt-1">
            {isPt ? 'Evolução de Conformidade Ergonómica' : 'Ergonomic Compliance Evolution'}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            {isPt
              ? 'Acompanhe a melhoria progressiva e resultados por colaborador.'
              : 'Track progressive workspace improvements and results by employee name.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="analytics-owner-settings-btn"
            onClick={onOpenOwnerSettings}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition border border-stone-300"
            title={isPt ? 'Definições do proprietário para emails' : 'Owner email settings'}
          >
            <Mail className="w-3.5 h-3.5 text-[#4A5D4E]" />
            <span>{isPt ? 'Emails Proprietário' : 'Owner Email Setup'}</span>
          </button>

          <button
            id="analytics-email-report-btn"
            onClick={() => onOpenSendEmail(selectedEmployee)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-[#4A5D4E] hover:bg-[#38473C] text-white transition shadow-sm"
          >
            <Mail className="w-4 h-4" />
            <span>{isPt ? 'Enviar Relatório por Email' : 'Email Report'}</span>
          </button>

          <button
            id="analytics-report-btn"
            onClick={onOpenReport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-300 transition"
          >
            <Printer className="w-4 h-4" />
            <span>{isPt ? 'Exportar PDF' : 'Export PDF'}</span>
          </button>
        </div>
      </div>

      {/* Employee Filter Selection Bar (REQUIREMENT 4) */}
      <div className="bg-[#E9E6DF] dark:bg-stone-800 p-4 rounded-3xl border border-stone-200 dark:border-stone-700 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#4A5D4E] text-white rounded-2xl">
            <User className="w-5 h-5" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 block">
              {isPt ? 'Filtrar Resultados por Colaborador' : 'Filter Results by Employee Name'}
            </label>
            <span className="text-[11px] text-stone-500 dark:text-stone-400">
              {isPt
                ? 'Selecione um colaborador para ver o seu histórico individual e ações atribuídas'
                : 'Select an employee name to display their individual assessment analytics'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 min-w-[240px]">
          <select
            id="analytics-employee-filter"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 bg-white text-xs font-bold text-[#1A1A17] focus:ring-2 focus:ring-[#4A5D4E] focus:outline-none shadow-sm"
          >
            <option value="all">
              {isPt ? '👥 Todos os Colaboradores (Resumo Geral)' : '👥 All Employees (Overall Analytics)'}
            </option>
            {allEmployeeNames.map((name) => (
              <option key={name} value={name}>
                👤 {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sub-navigation Switcher */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
        <button
          id="analytics-subtab-evolution"
          onClick={() => setActiveSubTab('evolution')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition ${
            activeSubTab === 'evolution'
              ? 'bg-[#4A5D4E] text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>
            {isPt ? 'Progresso & Histórico' : 'Progress & History'}{' '}
            {!isAll && `(${selectedEmployee})`}
          </span>
        </button>

        <button
          id="analytics-subtab-actions"
          onClick={() => setActiveSubTab('actions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition ${
            activeSubTab === 'actions'
              ? 'bg-[#4A5D4E] text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>
            {isPt ? 'Ações Corretivas' : 'Corrective Actions'} ({filteredActionItems.length})
          </span>
        </button>
      </div>

      {/* Subtab 1: Evolution Charts & Comparison */}
      {activeSubTab === 'evolution' && (
        <div className="space-y-6">
          {/* Comparison Cards: Home vs Office */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#4A5D4E]/10 text-[#4A5D4E] dark:text-emerald-300 rounded-2xl">
                  <Home className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase">
                    {isPt ? 'Teletrabalho (Home Office)' : 'Home Office Setup'}
                  </div>
                  <div className="text-2xl font-black text-[#1A1A17] dark:text-white">
                    {latestHomeScore > 0 ? `${latestHomeScore}%` : (isPt ? 'Sem dados' : 'No data')}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
                  {latestHomeScore >= 80 ? (isPt ? 'Risco Baixo' : 'Low Risk') : (isPt ? 'Risco Médio' : 'Medium Risk')}
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#4A5D4E]/10 text-[#4A5D4E] dark:text-emerald-300 rounded-2xl">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase">
                    {isPt ? 'Escritório IQAS (Presencial)' : 'IQAS Office Setup'}
                  </div>
                  <div className="text-2xl font-black text-[#1A1A17] dark:text-white">
                    {latestOfficeScore > 0 ? `${latestOfficeScore}%` : (isPt ? 'Sem dados' : 'No data')}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#4A5D4E] bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full">
                  {isPt ? 'Conforme DL 349/93' : 'DL 349/93 Compliant'}
                </span>
              </div>
            </div>
          </div>

          {/* Historical Timeline Evolution Bar Visualizer */}
          <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-bold text-base text-[#1A1A17] dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#4A5D4E]" />
                <span>
                  {isPt ? 'Histórico de Avaliações Registadas' : 'Historical Assessments Progress'}
                  {!isAll && ` — ${selectedEmployee}`}
                </span>
              </h3>
              <span className="text-xs font-bold text-stone-500">
                {filteredRecords.length} {isPt ? 'registos encontrados' : 'records found'}
              </span>
            </div>

            {filteredRecords.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500 italic bg-stone-50 rounded-2xl">
                {isPt
                  ? `Nenhuma avaliação registada para "${selectedEmployee}". Realize uma nova avaliação na tab Checklist.`
                  : `No recorded assessment found for "${selectedEmployee}".`}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRecords.map((rec) => {
                  const dateFormatted = new Date(rec.date).toLocaleDateString(isPt ? 'pt-PT' : 'en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  });

                  return (
                    <div
                      key={rec.id}
                      className="p-4 rounded-2xl bg-stone-100/70 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60 space-y-2"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span className="font-bold text-[#1A1A17] dark:text-white">{dateFormatted}</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 font-semibold text-stone-700 dark:text-stone-300">
                            {rec.employeeName || 'Colaborador'}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-white dark:bg-stone-900 border border-stone-300 text-stone-600">
                            {rec.setupType === 'home'
                              ? isPt
                                ? 'Teletrabalho'
                                : 'Home'
                              : isPt
                              ? 'Escritório IQAS'
                              : 'Office'}
                          </span>
                        </div>
                        <div className="font-extrabold text-sm text-[#4A5D4E] dark:text-emerald-400">
                          {rec.scorePercent}% {isPt ? 'Conformidade' : 'Compliance'}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-stone-200 dark:bg-stone-700 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#4A5D4E] h-full transition-all duration-500 rounded-full"
                          style={{ width: `${rec.scorePercent}%` }}
                        />
                      </div>

                      {rec.overallNotes && (
                        <p className="text-[11px] text-stone-600 dark:text-stone-300 italic pt-1">
                          "{rec.overallNotes}"
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subtab 2: Action Items */}
      {activeSubTab === 'actions' && (
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-bold text-base text-[#1A1A17] dark:text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-[#4A5D4E]" />
              <span>
                {isPt ? 'Plano de Ações Corretivas e Recomendações SST' : 'Corrective Action Plan & Recommendations'}
                {!isAll && ` — ${selectedEmployee}`}
              </span>
            </h3>
          </div>

          {filteredActionItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-500 italic bg-stone-50 rounded-2xl">
              {isPt
                ? 'Nenhuma ação pendente registada para o filtro selecionado.'
                : 'No pending corrective action items for this selection.'}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredActionItems.map((act) => {
                const isCompleted = act.status === 'completed';

                return (
                  <div
                    key={act.id}
                    className={`p-4 rounded-2xl border transition flex items-start justify-between gap-4 ${
                      isCompleted
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200'
                        : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-[#1A1A17] dark:text-white">
                          {act.itemTitlePt}
                        </span>
                        {act.employeeName && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                            👤 {act.employeeName}
                          </span>
                        )}
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
                          {act.legalRef}
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 dark:text-stone-300">
                        {act.notes || (isPt ? 'Sem observações técnicas.' : 'No notes.')}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-stone-500 pt-1">
                        <span>
                          <strong>{isPt ? 'Atribuído a:' : 'Assigned to:'}</strong> {act.assignedTo || 'SST IQAS'}
                        </span>
                        <span>•</span>
                        <span>
                          <strong>{isPt ? 'Data Limite:' : 'Target Date:'}</strong> {act.targetDate || '2026-03-31'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleActionStatus(act.id)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                          : 'bg-[#4A5D4E] text-white hover:bg-[#38473C]'
                      }`}
                    >
                      {isCompleted ? (isPt ? 'Concluída ✓' : 'Completed ✓') : (isPt ? 'Marcar Concluída' : 'Mark Done')}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
