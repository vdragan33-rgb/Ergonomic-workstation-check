import React, { useState, useEffect } from 'react';
import { SetupType, AssessmentItemState, AssessmentRecord, ActionItem, AppOwnerSettings } from './types';
import { CHECKLIST_CATEGORIES } from './data/checklistItems';
import { INITIAL_HISTORICAL_RECORDS, INITIAL_ACTION_ITEMS } from './data/sampleData';
import {
  subscribeAssessments,
  subscribeActionItems,
  saveAssessmentToFirestore,
  saveActionItemToFirestore
} from './lib/firebase';
import { Header } from './components/Header';
import { ChecklistTab } from './components/ChecklistTab';
import { PostureGuideTab } from './components/PostureGuideTab';
import { AnalyticsTab } from './components/AnalyticsTab';
import { GeminiAssistantTab } from './components/GeminiAssistantTab';
import { ActiveBreaksTab } from './components/ActiveBreaksTab';
import { ReportModal } from './components/ReportModal';
import { OwnerSettingsModal } from './components/OwnerSettingsModal';
import { SendEmailModal } from './components/SendEmailModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'checklist' | 'posture' | 'analytics' | 'gemini' | 'breaks'>('checklist');
  const [setupType, setSetupType] = useState<SetupType>('home');
  const [lang, setLang] = useState<'pt' | 'en'>('pt');

  // Employee & Evaluator Information
  const [employeeName, setEmployeeName] = useState('');
  const [department, setDepartment] = useState('');
  const [evaluatorName, setEvaluatorName] = useState('');

  // Modals
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isOwnerSettingsOpen, setIsOwnerSettingsOpen] = useState(false);
  const [isSendEmailOpen, setIsSendEmailOpen] = useState(false);
  const [selectedEmailEmployee, setSelectedEmailEmployee] = useState<string>('all');

  // Gemini Prefilled Query
  const [geminiPrefilledPrompt, setGeminiPrefilledPrompt] = useState<string | undefined>(undefined);

  // Item States for Checklist
  const [itemStates, setItemStates] = useState<Record<string, AssessmentItemState>>(() => {
    const saved = localStorage.getItem('iqas_ergonomics_states');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const defaultStates: Record<string, AssessmentItemState> = {};
    CHECKLIST_CATEGORIES.forEach((cat) => {
      cat.items.forEach((item) => {
        defaultStates[item.id] = { status: 'compliant' };
      });
    });
    return defaultStates;
  });

  // Historical Assessment Records
  const [records, setRecords] = useState<AssessmentRecord[]>(() => {
    const saved = localStorage.getItem('iqas_ergonomics_records');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_HISTORICAL_RECORDS;
  });

  // Action Items List
  const [actionItems, setActionItems] = useState<ActionItem[]>(() => {
    const saved = localStorage.getItem('iqas_ergonomics_actions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ACTION_ITEMS;
  });

  // Real-time Firebase Sync for Assessments and Action Items
  useEffect(() => {
    const unsubscribeAssessments = subscribeAssessments((remoteRecords) => {
      if (remoteRecords && remoteRecords.length > 0) {
        setRecords(remoteRecords);
      }
    });

    const unsubscribeActions = subscribeActionItems((remoteActions) => {
      if (remoteActions && remoteActions.length > 0) {
        setActionItems(remoteActions);
      }
    });

    return () => {
      unsubscribeAssessments();
      unsubscribeActions();
    };
  }, []);

  // Save to LocalStorage & Firestore backup
  useEffect(() => {
    localStorage.setItem('iqas_ergonomics_states', JSON.stringify(itemStates));
  }, [itemStates]);

  useEffect(() => {
    localStorage.setItem('iqas_ergonomics_records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('iqas_ergonomics_actions', JSON.stringify(actionItems));
  }, [actionItems]);

  // Overall Score Calculation
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
  const overallScore = Math.round(rawScore * 100);

  const riskLevel: 'low' | 'medium' | 'high' =
    overallScore >= 85 ? 'low' : overallScore >= 65 ? 'medium' : 'high';

  // Derived list of unique employee names for retrieval
  const savedEmployeeList = Array.from(
    new Set([
      ...records.map((r) => r.employeeName).filter(Boolean),
      ...actionItems.map((a) => a.employeeName).filter(Boolean)
    ])
  ).sort();

  // Handle Employee Profile Retrieval (REQUIREMENT 2 & 4)
  const handleSelectEmployeeProfile = (targetName: string) => {
    if (!targetName) return;
    setEmployeeName(targetName);

    // Search latest assessment for this employee
    const empRecords = records.filter(
      (r) => r.employeeName && r.employeeName.toLowerCase().trim() === targetName.toLowerCase().trim()
    );

    if (empRecords.length > 0) {
      const latest = [...empRecords].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];

      if (latest.itemStates) {
        setItemStates(latest.itemStates);
      }
      if (latest.employeeDepartment) setDepartment(latest.employeeDepartment);
      if (latest.evaluatorName) setEvaluatorName(latest.evaluatorName);
      if (latest.setupType) setSetupType(latest.setupType);
    }
  };

  // Handle Starting a New Assessment
  const handleNewAssessment = () => {
    setEmployeeName('');
    const defaultStates: Record<string, AssessmentItemState> = {};
    CHECKLIST_CATEGORIES.forEach((cat) => {
      cat.items.forEach((item) => {
        defaultStates[item.id] = { status: 'compliant' };
      });
    });
    setItemStates(defaultStates);
  };

  // Save current assessment record to LocalState & Firebase Firestore
  const handleSaveAssessment = async () => {
    const finalEmpName = employeeName.trim() || 'Colaborador Não Identificado';

    const newRecord: AssessmentRecord = {
      id: `eval-${Date.now()}`,
      date: new Date().toISOString(),
      setupType,
      employeeName: finalEmpName,
      evaluatorName: evaluatorName.trim() || 'Avaliador SST',
      employeeDepartment: department.trim() || 'IQAS',
      scorePercent: overallScore,
      riskLevel,
      totalEvaluated,
      compliantCount,
      improvementCount,
      nonCompliantCount,
      naCount,
      categoryScores: {},
      itemStates: { ...itemStates },
      overallNotes: `Avaliação do posto ${setupType === 'home' ? 'Teletrabalho' : 'Escritório IQAS'} realizada.`
    };

    setRecords((prev) => [newRecord, ...prev]);

    // Generate new Action Items for Non-Compliant items
    CHECKLIST_CATEGORIES.forEach((cat) => {
      cat.items.forEach((item) => {
        const state = itemStates[item.id];
        if (state && (state.status === 'non_compliant' || state.status === 'improvement')) {
          const actionItem: ActionItem = {
            id: `act-${Date.now()}-${item.id}`,
            assessmentId: newRecord.id,
            itemId: item.id,
            employeeName: finalEmpName,
            itemTitlePt: item.titlePt,
            itemTitleEn: item.titleEn,
            categoryTitlePt: cat.titlePt,
            categoryTitleEn: cat.titleEn,
            setupType,
            priority: state.status === 'non_compliant' ? 'high' : 'medium',
            costCategory: 'free',
            legalRef: item.legalRef,
            status: 'pending',
            createdAt: new Date().toISOString().split('T')[0],
            targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            assignedTo: finalEmpName,
            notes: state.notes || 'Recomenda-se correção em conformidade com as orientações ergonómicas.'
          };

          setActionItems((prev) => [actionItem, ...prev]);
          saveActionItemToFirestore(actionItem);
        }
      });
    });

    // Save to Firestore
    await saveAssessmentToFirestore(newRecord);

    alert(
      lang === 'pt'
        ? `Avaliação de "${finalEmpName}" guardada com sucesso no Firebase e no painel de analytics!`
        : `Assessment for "${finalEmpName}" saved successfully to Firebase!`
    );
  };

  // Quick redirect to Gemini Assistant tab with item query
  const handleAskGeminiForItem = (itemTitle: string, legalRef: string) => {
    const promptText = `Como corrigir a não-conformidade no requisito "${itemTitle}" (${legalRef}) no meu posto de ${
      setupType === 'home' ? 'Teletrabalho' : 'Escritório IQAS'
    }?`;
    setGeminiPrefilledPrompt(promptText);
    setActiveTab('gemini');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2D2D2A] font-sans transition-colors">
      {/* Primary Sticky Application Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setupType={setupType}
        setSetupType={setSetupType}
        lang={lang}
        setLang={setLang}
        overallScore={overallScore}
        riskLevel={riskLevel}
        onOpenOwnerSettings={() => setIsOwnerSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'checklist' && (
          <ChecklistTab
            setupType={setupType}
            lang={lang}
            itemStates={itemStates}
            setItemStates={setItemStates}
            employeeName={employeeName}
            setEmployeeName={setEmployeeName}
            department={department}
            setDepartment={setDepartment}
            evaluatorName={evaluatorName}
            setEvaluatorName={setEvaluatorName}
            savedEmployeeList={savedEmployeeList}
            onSelectEmployeeProfile={handleSelectEmployeeProfile}
            onNewAssessment={handleNewAssessment}
            onSaveAssessment={handleSaveAssessment}
            onOpenReport={() => setIsReportOpen(true)}
            onAskGeminiForItem={handleAskGeminiForItem}
            isAutoSaved={true}
          />
        )}

        {activeTab === 'posture' && <PostureGuideTab lang={lang} />}

        {activeTab === 'analytics' && (
          <AnalyticsTab
            records={records}
            actionItems={actionItems}
            setActionItems={setActionItems}
            lang={lang}
            onOpenReport={() => setIsReportOpen(true)}
            onOpenSendEmail={(emp) => {
              setSelectedEmailEmployee(emp);
              setIsSendEmailOpen(true);
            }}
            onOpenOwnerSettings={() => setIsOwnerSettingsOpen(true)}
          />
        )}

        {activeTab === 'gemini' && (
          <GeminiAssistantTab
            setupType={setupType}
            lang={lang}
            prefilledPrompt={geminiPrefilledPrompt}
            onClearPrefilledPrompt={() => setGeminiPrefilledPrompt(undefined)}
          />
        )}

        {activeTab === 'breaks' && <ActiveBreaksTab lang={lang} />}
      </main>

      {/* Official SST Compliance Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        setupType={setupType}
        lang={lang}
        itemStates={itemStates}
        overallScore={overallScore}
        riskLevel={riskLevel}
        evaluatorName={evaluatorName}
        department={department}
      />

      {/* App Owner Email Settings Modal */}
      <OwnerSettingsModal
        isOpen={isOwnerSettingsOpen}
        onClose={() => setIsOwnerSettingsOpen(false)}
        lang={lang}
      />

      {/* Send Email Analytics Modal */}
      <SendEmailModal
        isOpen={isSendEmailOpen}
        onClose={() => setIsSendEmailOpen(false)}
        lang={lang}
        selectedEmployeeName={selectedEmailEmployee}
        records={records}
        actionItems={actionItems}
      />
    </div>
  );
}
