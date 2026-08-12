import React from 'react';
import { SetupType } from '../types';
import {
  ClipboardCheck,
  Compass,
  BarChart3,
  Bot,
  HeartPulse,
  Building2,
  Home,
  ShieldAlert,
  Globe,
  Mail
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'checklist' | 'posture' | 'analytics' | 'gemini' | 'breaks';
  setActiveTab: (tab: 'checklist' | 'posture' | 'analytics' | 'gemini' | 'breaks') => void;
  setupType: SetupType;
  setSetupType: (type: SetupType) => void;
  lang: 'pt' | 'en';
  setLang: (lang: 'pt' | 'en') => void;
  overallScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  onOpenOwnerSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  setupType,
  setSetupType,
  lang,
  setLang,
  overallScore,
  riskLevel,
  onOpenOwnerSettings,
}) => {
  const isPt = lang === 'pt';

  const riskBadgeColor =
    riskLevel === 'low'
      ? 'bg-emerald-500/20 text-emerald-100 border-emerald-400/30'
      : riskLevel === 'medium'
      ? 'bg-amber-500/20 text-amber-100 border-amber-400/30'
      : 'bg-rose-500/20 text-rose-100 border-rose-400/30';

  const riskLabel =
    riskLevel === 'low'
      ? isPt ? 'Risco Baixo' : 'Low Risk'
      : riskLevel === 'medium'
      ? isPt ? 'Risco Médio' : 'Medium Risk'
      : isPt ? 'Risco Elevado' : 'High Risk';

  return (
    <header className="bg-[#4A5D4E] text-white border-b border-[#3B4D3E] sticky top-0 z-40 shadow-sm">
      {/* Top Corporate Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white font-bold text-xl shadow-inner">
            I
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight text-white">
                IQAS Ergonomia
              </h1>
              <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-white/15 text-stone-100 border border-white/20">
                SST Portugal
              </span>
            </div>
            <p className="text-xs text-stone-200/80">
              {isPt
                ? 'Avaliador de Postos de Trabalho | DL 349/93 & Lei 102/2009'
                : 'Workspace Ergonomics Evaluator | PT Legislation'}
            </p>
          </div>
        </div>

        {/* Setup Switcher & Language Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Setup Type Toggle */}
          <div className="bg-black/15 p-1 rounded-full border border-white/15 flex items-center gap-1">
            <button
              id="setup-toggle-home"
              onClick={() => setSetupType('home')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                setupType === 'home'
                  ? 'bg-white text-[#4A5D4E] shadow-sm'
                  : 'text-stone-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>{isPt ? 'Teletrabalho (Home)' : 'Home Office'}</span>
            </button>
            <button
              id="setup-toggle-office"
              onClick={() => setSetupType('office')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                setupType === 'office'
                  ? 'bg-white text-[#4A5D4E] shadow-sm'
                  : 'text-stone-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{isPt ? 'Escritório IQAS' : 'IQAS Office'}</span>
            </button>
          </div>

          {/* Compliance & Risk Badge */}
          <div
            className={`px-3.5 py-1.5 rounded-full border flex items-center gap-2 text-xs font-semibold ${riskBadgeColor}`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{riskLabel}</span>
            <span className="opacity-40">|</span>
            <span className="font-bold text-white">{overallScore}%</span>
          </div>

          {/* Language Toggle & Owner Settings Button */}
          <div className="flex items-center gap-1.5">
            <button
              id="owner-settings-header-btn"
              onClick={onOpenOwnerSettings}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-stone-100 hover:text-white hover:bg-white/20 border border-white/20 transition"
              title={isPt ? 'Definições do proprietário / Configurar emails' : 'App owner email settings'}
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isPt ? 'Emails SST' : 'Owner Email'}</span>
            </button>

            <button
              id="language-toggle-btn"
              onClick={() => setLang(isPt ? 'en' : 'pt')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-stone-100 hover:text-white hover:bg-white/20 border border-white/20 transition"
              title="Mudar idioma / Toggle language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="uppercase font-bold">{lang}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none">
          <button
            id="tab-btn-checklist"
            onClick={() => setActiveTab('checklist')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
              activeTab === 'checklist'
                ? 'bg-white text-[#4A5D4E] shadow-sm font-bold'
                : 'text-stone-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>{isPt ? '1. Checklist Digital' : '1. Digital Checklist'}</span>
          </button>

          <button
            id="tab-btn-posture"
            onClick={() => setActiveTab('posture')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
              activeTab === 'posture'
                ? 'bg-white text-[#4A5D4E] shadow-sm font-bold'
                : 'text-stone-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{isPt ? '2. Guia & Diagrama' : '2. Posture Guide'}</span>
          </button>

          <button
            id="tab-btn-analytics"
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-white text-[#4A5D4E] shadow-sm font-bold'
                : 'text-stone-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{isPt ? '3. Analytics & Progresso' : '3. Analytics Dashboard'}</span>
          </button>

          <button
            id="tab-btn-gemini"
            onClick={() => setActiveTab('gemini')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
              activeTab === 'gemini'
                ? 'bg-white text-[#4A5D4E] shadow-sm font-bold'
                : 'text-stone-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>{isPt ? '4. Assistente IA' : '4. AI Ergonomic Consultant'}</span>
          </button>

          <button
            id="tab-btn-breaks"
            onClick={() => setActiveTab('breaks')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
              activeTab === 'breaks'
                ? 'bg-white text-[#4A5D4E] shadow-sm font-bold'
                : 'text-stone-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            <span>{isPt ? '5. Pausas & Alongamentos' : '5. Active Breaks'}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
