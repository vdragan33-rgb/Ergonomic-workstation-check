import React, { useState, useEffect } from 'react';
import { Mail, Send, X, CheckCircle2, AlertCircle, User, FileText, Loader2 } from 'lucide-react';
import { AssessmentRecord, ActionItem } from '../types';

interface SendEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'pt' | 'en';
  selectedEmployeeName: string; // 'All' or specific employee name
  records: AssessmentRecord[];
  actionItems: ActionItem[];
  defaultRecipients?: string;
}

export const SendEmailModal: React.FC<SendEmailModalProps> = ({
  isOpen,
  onClose,
  lang,
  selectedEmployeeName,
  records,
  actionItems,
  defaultRecipients,
}) => {
  const isPt = lang === 'pt';

  const [recipientsText, setRecipientsText] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [sending, setSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStatusMessage(null);
      // Populate recipients
      const localOwner = localStorage.getItem('iqas_owner_settings');
      let defaultEmails = 'contact@globalexpertdragan.com, sst@iqas.pt';
      if (localOwner) {
        try {
          const parsed = JSON.parse(localOwner);
          const list = [parsed.ownerEmail, parsed.secondaryEmails].filter(Boolean).join(', ');
          if (list) defaultEmails = list;
        } catch (e) {
          console.error(e);
        }
      } else if (defaultRecipients) {
        defaultEmails = defaultRecipients;
      }
      setRecipientsText(defaultEmails);
    }
  }, [isOpen, defaultRecipients]);

  if (!isOpen) return null;

  // Filter records and action items for target employee
  const isAll = !selectedEmployeeName || selectedEmployeeName === 'all' || selectedEmployeeName === 'Geral';
  const filteredRecords = isAll
    ? records
    : records.filter((r) => r.employeeName && r.employeeName.toLowerCase().trim() === selectedEmployeeName.toLowerCase().trim());

  const filteredActionItems = isAll
    ? actionItems
    : actionItems.filter((a) => a.employeeName && a.employeeName.toLowerCase().trim() === selectedEmployeeName.toLowerCase().trim());

  // Calculate metrics
  const latestRecord = filteredRecords.length > 0
    ? [...filteredRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;

  const scorePercent = latestRecord ? latestRecord.scorePercent : Math.round(
    filteredRecords.reduce((acc, r) => acc + r.scorePercent, 0) / (filteredRecords.length || 1)
  );

  const riskLevel = latestRecord ? latestRecord.riskLevel : (scorePercent >= 85 ? 'low' : scorePercent >= 65 ? 'medium' : 'high');
  const nonCompliantCount = latestRecord ? latestRecord.nonCompliantCount : filteredActionItems.length;
  const improvementCount = latestRecord ? latestRecord.improvementCount : 0;
  const compliantCount = latestRecord ? latestRecord.compliantCount : 15;

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setStatusMessage(null);

    const emailList = recipientsText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.includes('@'));

    if (emailList.length === 0) {
      setSending(false);
      setStatusMessage({
        type: 'error',
        text: isPt ? 'Por favor insira pelo menos um endereço de email válido.' : 'Please enter at least one valid email address.'
      });
      return;
    }

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: emailList,
          employeeName: isAll ? (isPt ? 'Todos os Colaboradores' : 'All Employees') : selectedEmployeeName,
          scorePercent,
          riskLevel,
          nonCompliantCount,
          improvementCount,
          compliantCount,
          customMessage: customNote,
          lang,
        }),
      });

      const data = await res.json();
      setSending(false);

      if (data.success) {
        setStatusMessage({
          type: 'success',
          text: data.message || (isPt ? 'Relatório enviado com sucesso!' : 'Report sent successfully!'),
        });
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setStatusMessage({
          type: 'error',
          text: data.error || (isPt ? 'Ocorreu um erro ao enviar email.' : 'Error sending email report.'),
        });
      }
    } catch (err: any) {
      setSending(false);
      setStatusMessage({
        type: 'error',
        text: err.message || (isPt ? 'Falha na comunicação com o servidor de email.' : 'Failed to communicate with email server.'),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D2D2A]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF9F6] text-[#2D2D2A] w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="p-5 bg-[#4A5D4E] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {isPt ? 'Enviar Relatório de Analytics por Email' : 'Email Analytics Report'}
              </h3>
              <p className="text-xs text-stone-200">
                {isPt ? 'Notificação SST para os destinatários definidos pelo proprietário' : 'Send SST notification to app owner addresses'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSendEmail} className="p-6 space-y-5">
          {/* Target Employee Summary Badge */}
          <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#4A5D4E]/10 rounded-xl text-[#4A5D4E]">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-stone-500 block">
                  {isPt ? 'Colaborador Selecionado' : 'Selected Employee'}
                </span>
                <span className="font-bold text-sm text-[#1A1A17]">
                  {isAll ? (isPt ? 'Todos os Colaboradores (Resumo Geral)' : 'All Employees (Overall Summary)') : selectedEmployeeName}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-stone-500 block">{isPt ? 'Conformidade' : 'Score'}</span>
              <span className="font-mono font-black text-lg text-[#4A5D4E]">{scorePercent}%</span>
            </div>
          </div>

          {statusMessage && (
            <div
              className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              {isPt ? 'Email(s) Destinatário(s) do Proprietário da App' : 'Owner Destination Email Addresses'} *
            </label>
            <input
              type="text"
              required
              value={recipientsText}
              onChange={(e) => setRecipientsText(e.target.value)}
              placeholder="sst@iqas.pt, owner@company.com"
              className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 bg-white text-xs font-medium focus:ring-2 focus:ring-[#4A5D4E] focus:outline-none"
            />
            <p className="text-[11px] text-stone-500 mt-1">
              {isPt
                ? 'Endereços configurados pelo proprietário para receber relatórios de SST e auditorias de conformidade.'
                : 'Configured recipient addresses to receive ergonomic compliance reports.'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              {isPt ? 'Nota / Observação Adicional (Opcional)' : 'Additional Note / Custom Message (Optional)'}
            </label>
            <textarea
              rows={3}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder={isPt ? 'Ex: Segue em anexo o parecer relativo à aquisição do suporte de portátil e cadeira...' : 'E.g. Please review the attached corrective measures...'}
              className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 bg-white text-xs font-medium focus:ring-2 focus:ring-[#4A5D4E] focus:outline-none resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full text-xs font-semibold bg-stone-200 hover:bg-stone-300 text-stone-700 transition"
            >
              {isPt ? 'Cancelar' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={sending}
              className="flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold bg-[#4A5D4E] hover:bg-[#38473C] text-white transition shadow-sm disabled:opacity-50"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isPt ? 'A Enviar Email...' : 'Sending Email...'}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{isPt ? 'Enviar Relatório por Email' : 'Send Analytics Report'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
