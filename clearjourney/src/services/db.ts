import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { ScanRecord, SensoryFeedback } from '../types';

export interface ClinicalDiaryEntry {
  date: string; // 'YYYY-MM-DD'
  workout_level: 'NONE' | 'MODERATE' | 'INTENSE (HEAVY PERSPIRATION)';
  sun_exposure: 'MINIMAL (<15 MIN)' | 'MODERATE (15-60 MIN)' | 'PROLONGED (>60 MIN)';
  spf_compliance: 'NO SPF' | 'APPLIED ONCE' | 'REAPPLIED (SPF 50+)';
  water_intake: '<1.0 L' | '1.0 - 2.0 L' | '>2.0 L';
  sleep_duration: '<6 HOURS' | '6 - 8 HOURS' | '>8 HOURS';
  barrier_symptoms: string[];
  timestamp: number;
}

interface ClearJourneyDBSchema extends DBSchema {
  scans: {
    key: string;
    value: ScanRecord;
    indexes: { 'by-day': number; 'by-timestamp': number };
  };
  photos: {
    key: string; // `${scanId}_${angle}`
    value: {
      id: string;
      scanId: string;
      angle: string;
      blobData: Blob | string;
      createdAt: number;
    };
  };
  dailyLogs: {
    key: string; // 'YYYY-MM-DD'
    value: ClinicalDiaryEntry;
  };
  sensoryFeedback: {
    key: string;
    value: SensoryFeedback;
  };
}

const DB_NAME = 'ClearJourney_DB';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<ClearJourneyDBSchema>> | null = null;

export async function getDB(): Promise<IDBPDatabase<ClearJourneyDBSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<ClearJourneyDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('scans')) {
          const scanStore = db.createObjectStore('scans', { keyPath: 'id' });
          scanStore.createIndex('by-day', 'dayNumber');
          scanStore.createIndex('by-timestamp', 'timestamp');
        }
        if (!db.objectStoreNames.contains('photos')) {
          db.createObjectStore('photos', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('dailyLogs')) {
          db.createObjectStore('dailyLogs', { keyPath: 'date' });
        }
        if (!db.objectStoreNames.contains('sensoryFeedback')) {
          db.createObjectStore('sensoryFeedback', { keyPath: 'date' });
        }
      },
    });
  }
  return dbPromise;
}

export async function saveScan(scan: ScanRecord): Promise<void> {
  const db = await getDB();
  await db.put('scans', scan);
}

export async function getAllScans(): Promise<ScanRecord[]> {
  const db = await getDB();
  const scans = await db.getAllFromIndex('scans', 'by-day');
  return scans.sort((a, b) => a.dayNumber - b.dayNumber);
}

export async function getScanById(id: string): Promise<ScanRecord | undefined> {
  const db = await getDB();
  return db.get('scans', id);
}

export async function clearAllScans(): Promise<void> {
  const db = await getDB();
  await db.clear('scans');
  await db.clear('photos');
}

export async function savePhotoBlob(id: string, scanId: string, angle: string, blobData: Blob | string): Promise<void> {
  const db = await getDB();
  await db.put('photos', {
    id,
    scanId,
    angle,
    blobData,
    createdAt: Date.now(),
  });
}

export async function saveDailyDiaryEntry(entry: ClinicalDiaryEntry): Promise<void> {
  const db = await getDB();
  await db.put('dailyLogs', entry);
  try {
    localStorage.setItem(`diary_${entry.date}`, JSON.stringify(entry));
    localStorage.setItem('latest_diary_entry', JSON.stringify(entry));
  } catch (e) {}
}

export async function getDailyDiaryEntry(dateString: string): Promise<ClinicalDiaryEntry | undefined> {
  try {
    const local = localStorage.getItem(`diary_${dateString}`);
    if (local) return JSON.parse(local);
  } catch (e) {}
  const db = await getDB();
  return db.get('dailyLogs', dateString);
}

export async function getRecentDailyDiaryEntries(): Promise<ClinicalDiaryEntry[]> {
  const db = await getDB();
  const entries = await db.getAll('dailyLogs');
  return entries.sort((a, b) => b.timestamp - a.timestamp);
}
