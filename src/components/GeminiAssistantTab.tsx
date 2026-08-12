import React, { useState } from 'react';
import { SetupType } from '../types';
import {
  Bot,
  Sparkles,
  Camera,
  Send,
  Loader2,
  AlertCircle,
  HelpCircle,
  RefreshCw
} from 'lucide-react';

interface GeminiAssistantTabProps {
  setupType: SetupType;
  lang: 'pt' | 'en';
  prefilledPrompt?: string;
  onClearPrefilledPrompt?: () => void;
}

export const GeminiAssistantTab: React.FC<GeminiAssistantTabProps> = ({
  setupType,
  lang,
  prefilledPrompt,
  onClearPrefilledPrompt
}) => {
  const isPt = lang === 'pt';
  const [userPrompt, setUserPrompt] = useState(prefilledPrompt || '');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const presetPrompts = [
    isPt
      ? 'Como ajustar a altura do monitor e teclado quando trabalho num portátil em casa?'
      : 'How to adjust monitor and keyboard when using a laptop at home?',
    isPt
      ? 'Sinto dores na região lombar ao fim de 4 horas de trabalho. Que ajustes fazer na cadeira?'
      : 'I feel lower back pain after 4 hours. What chair adjustments to make?',
    isPt
      ? 'Tenho reflexos intensos da janela no monitor. Como resolver de acordo com o DL 349/93?'
      : 'I have window reflections on screen. How to resolve according to DL 349/93?',
    isPt
      ? 'Quais os exercícios de alongamento recomendados para aliviar o túnel cárpico e pulso?'
      : 'Which stretch exercises relieve carpal tunnel and wrist strain?'
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async (promptToUse?: string) => {
    const activePrompt = promptToUse || userPrompt;
    if (!activePrompt.trim() && !imageBase64) return;

    setIsLoading(true);
    setErrorMsg(null);
    setAiResponse(null);

    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: activePrompt,
          imageBase64: imageBase64 || undefined,
          setupType
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro na comunicação com a IA.');
      }

      setAiResponse(data.result);
      if (onClearPrefilledPrompt) onClearPrefilledPrompt();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Falha ao obter o parecer da IA.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#4A5D4E] text-white p-6 rounded-3xl shadow-sm border border-[#38473C]">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 text-white rounded-2xl">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">
                {isPt ? 'Consultor de IA Ergonómica IQAS' : 'IQAS AI Ergonomic Consultant'}
              </h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white">
                Gemini 3.6 Flash
              </span>
            </div>
            <p className="text-xs text-stone-100 mt-1">
              {isPt
                ? 'Obtenha pareceres e soluções ergonómicas instantâneas fundamentadas na legislação portuguesa (DL 349/93 e Lei 102/2009).'
                : 'Get instant ergonomic recommendations based on Portuguese SST legislation.'}
            </p>
          </div>
        </div>
      </div>

      {/* Input Stage */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        {/* Preset Prompt Chips */}
        <div>
          <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block mb-2">
            {isPt ? 'Perguntas e Dúvidas Frequentes:' : 'Frequently Asked Questions:'}
          </label>
          <div className="flex flex-wrap gap-2">
            {presetPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setUserPrompt(prompt);
                  handleAnalyze(prompt);
                }}
                className="text-xs text-stone-800 dark:text-stone-200 bg-stone-100/80 hover:bg-stone-200/80 dark:bg-stone-800 dark:hover:bg-stone-700 px-3.5 py-1.5 rounded-full border border-stone-200 dark:border-stone-700 transition text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Text Area & Image Attach */}
        <div className="space-y-3">
          <textarea
            rows={4}
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder={
              isPt
                ? 'Descreva a sua dor, desconforto, queixa ou configuração atual do seu posto de trabalho...'
                : 'Describe your pain, discomfort, or workspace layout...'
            }
            className="w-full text-xs p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-[#1A1A17] dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#4A5D4E]"
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Image File Attachment */}
            <div className="flex items-center gap-3">
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 transition">
                <Camera className="w-4 h-4 text-[#4A5D4E]" />
                <span>{isPt ? 'Anexar Foto do Posto' : 'Attach Workspace Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {imageBase64 && (
                <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full border border-stone-200 dark:border-stone-700">
                  <img
                    src={imageBase64}
                    alt="Anexo"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-xs text-[#4A5D4E] dark:text-emerald-400 font-medium">
                    {isPt ? 'Foto Carregada' : 'Photo Attached'}
                  </span>
                  <button
                    onClick={() => setImageBase64(null)}
                    className="text-xs text-rose-500 font-bold ml-1 hover:underline"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              id="analyze-gemini-btn"
              onClick={() => handleAnalyze()}
              disabled={isLoading || (!userPrompt.trim() && !imageBase64)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold bg-[#4A5D4E] hover:bg-[#38473C] text-white disabled:opacity-50 transition shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isPt ? 'A Analisar com Gemini...' : 'Analyzing...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{isPt ? 'Obter Parecer Técnico' : 'Get AI Recommendation'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Output */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* AI Response Output Card */}
      {aiResponse && (
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-[#4A5D4E]" />
              <h3 className="font-bold text-base text-[#1A1A17] dark:text-white">
                {isPt ? 'Parecer Ergonómico e Recomendação Técnica' : 'Technical Recommendation'}
              </h3>
            </div>

            <button
              onClick={() => handleAnalyze()}
              className="text-xs text-[#4A5D4E] dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isPt ? 'Regerar' : 'Regenerate'}</span>
            </button>
          </div>

          <div className="prose prose-stone dark:prose-invert text-xs sm:text-sm max-w-none leading-relaxed whitespace-pre-line font-normal">
            {aiResponse}
          </div>
        </div>
      )}
    </div>
  );
};
