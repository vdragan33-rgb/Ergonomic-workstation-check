export type SetupType = 'home' | 'office';

export type ComplianceStatus = 'compliant' | 'improvement' | 'non_compliant' | 'na';

export type PriorityLevel = 'high' | 'medium' | 'low';

export type CostCategory = 'free' | 'low' | 'requisition';

export interface ChecklistItem {
  id: string;
  categoryId: string;
  titlePt: string;
  titleEn: string;
  legalRef: string; // e.g. "DL 349/93 Anexo II, 1.a"
  descriptionPt: string;
  descriptionEn: string;
  verificationTipPt: string;
  verificationTipEn: string;
  setupTypeApplies: 'both' | 'home' | 'office';
  priority: PriorityLevel;
  costCategory: CostCategory;
}

export interface ChecklistCategory {
  id: string;
  titlePt: string;
  titleEn: string;
  iconName: string;
  descriptionPt: string;
  descriptionEn: string;
  items: ChecklistItem[];
}

export interface AssessmentItemState {
  status: ComplianceStatus;
  notes?: string;
  photoUrl?: string;
  targetDate?: string;
}

export interface AssessmentRecord {
  id: string;
  date: string; // ISO date string
  setupType: SetupType;
  employeeName: string;
  evaluatorName: string;
  employeeDepartment: string;
  scorePercent: number;
  riskLevel: 'low' | 'medium' | 'high';
  totalEvaluated: number;
  compliantCount: number;
  improvementCount: number;
  nonCompliantCount: number;
  naCount: number;
  categoryScores: Record<string, number>; // categoryId -> score %
  itemStates: Record<string, AssessmentItemState>;
  overallNotes?: string;
}

export interface ActionItem {
  id: string;
  assessmentId: string;
  itemId: string;
  employeeName?: string;
  itemTitlePt: string;
  itemTitleEn?: string;
  categoryTitlePt: string;
  categoryTitleEn?: string;
  setupType: SetupType;
  priority: PriorityLevel;
  costCategory: CostCategory;
  legalRef: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
  targetDate?: string;
  assignedTo?: string;
  notes?: string;
}

export interface AppOwnerSettings {
  ownerEmail: string;
  secondaryEmails?: string;
  organizationName?: string;
  defaultLanguage?: 'pt' | 'en';
  updatedAt?: string;
}

export interface StretchExercise {
  id: string;
  titlePt: string;
  titleEn: string;
  bodyPartPt: string;
  durationSec: number;
  instructionsPt: string[];
  benefitsPt: string;
  iconType: string;
}
