import React, { useState, useEffect } from 'react';
import { SAMPLE_STRETCHES } from '../data/sampleData';
import { StretchExercise } from '../types';
import {
  Eye,
  Clock,
  Play,
  Pause,
  RotateCcw,
  HeartPulse,
  CheckCircle2,
  Sparkles,
  User,
  Hand,
  Shield,
  RefreshCw
} from 'lucide-react';

interface ActiveBreaksTabProps {
  lang: 'pt' | 'en';
}

export const ActiveBreaksTab: React.FC<ActiveBreaksTabProps> = ({ lang }) => {
  const isPt = lang === 'pt';

  // 20-20-20 Rule Timer State (20 minutes = 1200 seconds)
  const [eyeTimerSec, setEyeTimerSec] = useState(1200);
  const [isEyeTimerRunning, setIsEyeTimerRunning] = useState(false);
  const [isEyeRestActive, setIsEyeRestActive] = useState(false);
  const [eyeRestCountdown, setEyeRestCountdown] = useState(20);

  // Guided Stretch Active Card
  const [selectedStretch, setSelectedStretch] = useState<StretchExercise>(SAMPLE_STRETCHES[0]);
  const [stretchTimerSec, setStretchTimerSec] = useState(SAMPLE_STRETCHES[0].durationSec);
  const [isStretchTimerRunning, setIsStretchTimerRunning] = useState(false);

  // 20-20-20 Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isEyeTimerRunning && eyeTimerSec > 0) {
      interval = setInterval(() => {
        setEyeTimerSec((prev) => prev - 1);
      }, 1000);
    } else if (isEyeTimerRunning && eyeTimerSec === 0) {
      setIsEyeRestActive(true);
      setIsEyeTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isEyeTimerRunning, eyeTimerSec]);

  // Eye Rest 20s Countdown Effect
  useEffect(() => {
    let interval: any = null;
    if (isEyeRestActive && eyeRestCountdown > 0) {
      interval = setInterval(() => {
        setEyeRestCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isEyeRestActive && eyeRestCountdown === 0) {
      setIsEyeRestActive(false);
      setEyeRestCountdown(20);
      setEyeTimerSec(1200); // Reset to 20 mins
    }
    return () => clearInterval(interval);
  }, [isEyeRestActive, eyeRestCountdown]);

  // Stretch Countdown Effect
  useEffect(() => {
    let interval: any = null;
    if (isStretchTimerRunning && stretchTimerSec > 0) {
      interval = setInterval(() => {
        setStretchTimerSec((prev) => prev - 1);
      }, 1000);
    } else if (isStretchTimerRunning && stretchTimerSec === 0) {
      setIsStretchTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isStretchTimerRunning, stretchTimerSec]);

  const handleSelectStretch = (st: StretchExercise) => {
    setSelectedStretch(st);
    setStretchTimerSec(st.durationSec);
    setIsStretchTimerRunning(false);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#4A5D4E] text-white p-6 rounded-3xl shadow-sm border border-[#38473C]">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 text-white rounded-2xl">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">
                {isPt ? 'Pausas Ativas e Exercícios de Compensação' : 'Active Breaks & Ergonomic Stretches'}
              </h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white">
                DL 349/93 Art. 6.º
              </span>
            </div>
            <p className="text-xs text-stone-100 mt-1">
              {isPt
                ? 'Prevenção de fadiga estática e tensão ocular através da Regra 20-20-20 e rotinas de alongamento guiadas.'
                : 'Prevent static muscle fatigue and eye strain via guided break routines.'}
            </p>
          </div>
        </div>
      </div>

      {/* 20-20-20 Eye Strain Companion Card */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-7 space-y-3">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#4A5D4E]" />
            <h3 className="font-bold text-lg text-[#1A1A17] dark:text-white">
              {isPt ? 'Lembrete da Regra 20-20-20 Ocular' : '20-20-20 Eye Strain Reminder'}
            </h3>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            {isPt
              ? 'A cada 20 minutos de trabalho contínuo diante do ecrã, olhe para um ponto distante a pelo menos 6 metros durante 20 segundos para relaxar os músculos ciliares dos olhos.'
              : 'Every 20 minutes look at an object 20 feet (6 meters) away for 20 seconds.'}
          </p>

          <div className="flex items-center gap-3 pt-2">
            {!isEyeTimerRunning ? (
              <button
                id="start-eye-timer-btn"
                onClick={() => setIsEyeTimerRunning(true)}
                className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold bg-[#4A5D4E] hover:bg-[#38473C] text-white transition shadow-sm"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isPt ? 'Iniciar Temporizador (20 min)' : 'Start Timer'}</span>
              </button>
            ) : (
              <button
                id="pause-eye-timer-btn"
                onClick={() => setIsEyeTimerRunning(false)}
                className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold bg-amber-700 hover:bg-amber-800 text-white transition shadow-sm"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span>{isPt ? 'Pausar' : 'Pause'}</span>
              </button>
            )}

            <button
              id="reset-eye-timer-btn"
              onClick={() => {
                setIsEyeTimerRunning(false);
                setIsEyeRestActive(false);
                setEyeTimerSec(1200);
                setEyeRestCountdown(20);
              }}
              className="p-2.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 transition"
              title="Reiniciar"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Visual Timer Display */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800">
          {isEyeRestActive ? (
            <div className="text-center space-y-2 animate-pulse">
              <span className="text-xs font-bold uppercase text-[#4A5D4E] dark:text-emerald-400">
                {isPt ? '👀 Olhe para a Distância Now!' : 'Look Far Away!'}
              </span>
              <div className="text-4xl font-black text-[#4A5D4E] dark:text-emerald-400">
                {eyeRestCountdown}s
              </div>
              <p className="text-[11px] text-stone-500">
                {isPt ? 'Fixe um objeto a 6 metros' : 'Focus 20ft away'}
              </p>
            </div>
          ) : (
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                {isPt ? 'Próxima Pausa em:' : 'Next Eye Break:'}
              </span>
              <div className="text-3xl font-mono font-black text-[#1A1A17] dark:text-white">
                {formatTime(eyeTimerSec)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Guided Stretches Library & Active Timer */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
        <h3 className="font-bold text-lg text-[#1A1A17] dark:text-white">
          {isPt ? 'Biblioteca de Alongamentos Ergonómicos Guiados' : 'Guided Ergonomic Stretch Library'}
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Stretch Selection List */}
          <div className="lg:col-span-5 space-y-2">
            {SAMPLE_STRETCHES.map((st) => {
              const isSelected = selectedStretch.id === st.id;

              return (
                <button
                  key={st.id}
                  onClick={() => handleSelectStretch(st)}
                  className={`w-full p-3.5 rounded-2xl text-left transition border flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#4A5D4E]/10 border-[#4A5D4E] ring-1 ring-[#4A5D4E]/30'
                      : 'bg-stone-50/80 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 hover:bg-stone-100'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs text-[#1A1A17] dark:text-white">
                      {isPt ? st.titlePt : st.titleEn}
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400">
                      {st.bodyPartPt} • {st.durationSec}s
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-[#4A5D4E]" />}
                </button>
              );
            })}
          </div>

          {/* Active Stretch Display & Instruction Card */}
          <div className="lg:col-span-7 bg-stone-50 dark:bg-stone-950 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-[#4A5D4E] dark:text-emerald-400">
                {selectedStretch.bodyPartPt}
              </span>
              <span className="text-xs font-mono font-medium text-stone-500">
                {selectedStretch.durationSec} segundos
              </span>
            </div>

            <h4 className="font-bold text-base text-[#1A1A17] dark:text-white">
              {isPt ? selectedStretch.titlePt : selectedStretch.titleEn}
            </h4>

            <p className="text-xs text-stone-600 dark:text-stone-300 italic">
              "{selectedStretch.benefitsPt}"
            </p>

            <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase">
                {isPt ? 'Instruções Passo a Passo:' : 'Instructions:'}
              </span>
              <ol className="text-xs text-stone-700 dark:text-stone-300 space-y-2 list-decimal list-inside leading-relaxed">
                {selectedStretch.instructionsPt.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Timer Controls */}
            <div className="pt-4 flex items-center justify-between border-t border-stone-200 dark:border-stone-800">
              <div className="text-2xl font-mono font-black text-[#4A5D4E] dark:text-emerald-400">
                {stretchTimerSec}s
              </div>

              <div className="flex items-center gap-2">
                {!isStretchTimerRunning ? (
                  <button
                    onClick={() => setIsStretchTimerRunning(true)}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold bg-[#4A5D4E] hover:bg-[#38473C] text-white transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isPt ? 'Iniciar Exercício' : 'Start Stretch'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsStretchTimerRunning(false)}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold bg-amber-700 hover:bg-amber-800 text-white transition"
                  >
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>{isPt ? 'Pausar' : 'Pause'}</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsStretchTimerRunning(false);
                    setStretchTimerSec(selectedStretch.durationSec);
                  }}
                  className="p-2.5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
