import React, { useState, useEffect } from 'react';
import { AppOwnerSettings } from '../types';
import { getOwnerSettingsFromFirestore, saveOwnerSettingsToFirestore } from '../lib/firebase';
import { Mail, Settings, X, Save, CheckCircle2, ShieldCheck } from 'lucide-react';

interface OwnerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'pt' | 'en';
  onSettingsSaved?: (settings: AppOwnerSettings) => void;
}

export const OwnerSettingsModal: React.FC<OwnerSettingsModalProps> = ({
  isOpen,
  onClose,
  lang,
  onSettingsSaved,
}) => {
  const isPt = lang === 'pt';

  const [ownerEmail, setOwnerEmail] = useState('contact@globalexpertdragan.com');
  const [secondaryEmails, setSecondaryEmails] = useState('sst@iqas.pt, hr@iqas.pt');
  const [orgName, setOrgName] = useState('IQAS - Instituto Português de Acreditação');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Load saved settings from Firestore or LocalStorage
      const local = localStorage.getItem('iqas_owner_settings');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (parsed.ownerEmail) setOwnerEmail(parsed.ownerEmail);
          if (parsed.secondaryEmails) setSecondaryEmails(parsed.secondaryEmails);
          if (parsed.organizationName) setOrgName(parsed.organizationName);
        } catch (e) {
          console.error(e);
        }
      }

      getOwnerSettingsFromFirestore().then((remote) => {
        if (remote) {
          if (remote.ownerEmail) setOwnerEmail(remote.ownerEmail);
          if (remote.secondaryEmails) setSecondaryEmails(remote.secondaryEmails);
          if (remote.organizationName) setOrgName(remote.organizationName);
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const newSettings: AppOwnerSettings = {
      ownerEmail,
      secondaryEmails,
      organizationName: orgName,
      defaultLanguage: lang,
    };

    localStorage.setItem('iqas_owner_settings', JSON.stringify(newSettings));
    await saveOwnerSettingsToFirestore(newSettings);
    if (onSettingsSaved) onSettingsSaved(newSettings);

    setLoading(false);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D2D2A]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF9F6] text-[#2D2D2A] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="p-5 bg-[#4A5D4E] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {isPt ? 'Definições do Proprietário & Email' : 'App Owner Email Settings'}
              </h3>
              <p className="text-xs text-stone-200">
                {isPt ? 'Configurar destinatários dos relatórios de analytics' : 'Configure destination emails for analytics reports'}
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

        {/* Body Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {savedSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                {isPt
                  ? 'Definições do proprietário guardadas com sucesso no Firebase!'
                  : 'Owner settings saved successfully to Firebase!'}
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              {isPt ? 'Email Principal do Proprietário / Responsável SST' : 'Primary Owner Email Address'} *
            </label>
            <input
              type="email"
              required
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              placeholder="e.g. owner@iqas.pt"
              className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 bg-white text-xs font-medium focus:ring-2 focus:ring-[#4A5D4E] focus:outline-none"
            />
            <p className="text-[11px] text-stone-500 mt-1">
              {isPt ? 'Receberá cópia direta de todos os relatórios enviados.' : 'Will receive copies of all generated analytics reports.'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              {isPt ? 'Outros Email(s) Destinatários (Separados por vírgula)' : 'Secondary Email Recipients (Comma-separated)'}
            </label>
            <input
              type="text"
              value={secondaryEmails}
              onChange={(e) => setSecondaryEmails(e.target.value)}
              placeholder="sst@iqas.pt, hr@iqas.pt"
              className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 bg-white text-xs font-medium focus:ring-2 focus:ring-[#4A5D4E] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              {isPt ? 'Nome da Organização / Empresa' : 'Organization / Company Name'}
            </label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="IQAS"
              className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 bg-white text-xs font-medium focus:ring-2 focus:ring-[#4A5D4E] focus:outline-none"
            />
          </div>

          <div className="p-3.5 bg-stone-100/80 rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-stone-800">
              <ShieldCheck className="w-4 h-[#4A5D4E]" />
              <span>{isPt ? 'Sincronização Firebase Ativa' : 'Firebase Cloud Sync'}</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {isPt
                ? 'Estes emails são guardados no Firestore e sincronizados em tempo real para permitir o envio instantâneo de relatórios de analytics por colaborador.'
                : 'These configuration settings are saved securely to Firestore and synchronized in real-time.'}
            </p>
          </div>

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
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold bg-[#4A5D4E] hover:bg-[#38473C] text-white transition shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? (isPt ? 'A Guardar...' : 'Saving...') : (isPt ? 'Guardar Definições' : 'Save Email Settings')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
