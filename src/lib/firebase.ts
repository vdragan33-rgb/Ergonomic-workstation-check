import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { AssessmentRecord, ActionItem } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  };
}

// Initialize Firebase App & Firestore
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Test Connection on init as per Skill constraints
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'settings', 'ownerConfig'));
    console.log('Firebase Firestore connection verified.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or starting up.');
    } else {
      console.log('Firebase init checked:', error);
    }
    return false;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface AppOwnerSettings {
  ownerEmail: string;
  secondaryEmails?: string;
  organizationName?: string;
  defaultLanguage?: 'pt' | 'en';
  updatedAt?: string;
}

// Owner Settings Firestore API
export async function getOwnerSettingsFromFirestore(): Promise<AppOwnerSettings | null> {
  const path = 'settings/ownerConfig';
  try {
    const docRef = doc(db, 'settings', 'ownerConfig');
    const snap = await getDocFromServer(docRef).catch(() => null);
    if (snap && snap.exists()) {
      return snap.data() as AppOwnerSettings;
    }
    return null;
  } catch (err) {
    console.error('Error fetching owner settings:', err);
    return null;
  }
}

export async function saveOwnerSettingsToFirestore(settings: AppOwnerSettings): Promise<void> {
  const path = 'settings/ownerConfig';
  try {
    const docRef = doc(db, 'settings', 'ownerConfig');
    await setDoc(docRef, { ...settings, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Assessment Records Firestore API
export async function getAssessmentsFromFirestore(): Promise<AssessmentRecord[]> {
  const path = 'assessments';
  try {
    const colRef = collection(db, 'assessments');
    const snap = await getDocs(colRef);
    const list: AssessmentRecord[] = [];
    snap.forEach((d) => {
      list.push(d.data() as AssessmentRecord);
    });
    return list;
  } catch (err) {
    console.error('Error fetching assessments from Firestore:', err);
    return [];
  }
}

export async function saveAssessmentToFirestore(record: AssessmentRecord): Promise<void> {
  const path = `assessments/${record.id}`;
  try {
    const docRef = doc(db, 'assessments', record.id);
    await setDoc(docRef, record, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Action Items Firestore API
export async function getActionItemsFromFirestore(): Promise<ActionItem[]> {
  const path = 'actionItems';
  try {
    const colRef = collection(db, 'actionItems');
    const snap = await getDocs(colRef);
    const list: ActionItem[] = [];
    snap.forEach((d) => {
      list.push(d.data() as ActionItem);
    });
    return list;
  } catch (err) {
    console.error('Error fetching action items from Firestore:', err);
    return [];
  }
}

export async function saveActionItemToFirestore(item: ActionItem): Promise<void> {
  const path = `actionItems/${item.id}`;
  try {
    const docRef = doc(db, 'actionItems', item.id);
    await setDoc(docRef, item, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Listen to Real-time Updates for Assessments
export function subscribeAssessments(callback: (records: AssessmentRecord[]) => void) {
  const path = 'assessments';
  return onSnapshot(
    collection(db, 'assessments'),
    (snap) => {
      const list: AssessmentRecord[] = [];
      snap.forEach((d) => list.push(d.data() as AssessmentRecord));
      callback(list);
    },
    (err) => handleFirestoreError(err, OperationType.GET, path)
  );
}

// Listen to Real-time Updates for Action Items
export function subscribeActionItems(callback: (items: ActionItem[]) => void) {
  const path = 'actionItems';
  return onSnapshot(
    collection(db, 'actionItems'),
    (snap) => {
      const list: ActionItem[] = [];
      snap.forEach((d) => list.push(d.data() as ActionItem));
      callback(list);
    },
    (err) => handleFirestoreError(err, OperationType.GET, path)
  );
}
