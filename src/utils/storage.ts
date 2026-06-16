/**
 * Report history storage using IndexedDB via a simple wrapper.
 * Falls back to localStorage if IndexedDB is unavailable.
 */

import type { SavedReport } from '../types/report';

const DB_NAME = 'future-pulse';
const STORE_NAME = 'reports';
const MAX_REPORTS = 50;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// localStorage fallback
const LS_KEY = 'fp-saved-reports';

function getFromLS(): SavedReport[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as SavedReport[]) : [];
  } catch {
    return [];
  }
}

function setToLS(reports: SavedReport[]): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(reports));
  } catch {
    // quota exceeded or unavailable
  }
}

export async function saveReport(report: SavedReport): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    // Check count and evict oldest if needed
    const count = await new Promise<number>((resolve, reject) => {
      const req = store.count();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

    if (count >= MAX_REPORTS) {
      const index = store.index('createdAt');
      const cursorReq = index.openCursor(null, 'next');
      await new Promise<void>((resolve, reject) => {
        cursorReq.onsuccess = () => {
          const cursor = cursorReq.result;
          if (cursor) {
            store.delete(cursor.primaryKey);
            resolve();
          } else {
            resolve();
          }
        };
        cursorReq.onerror = () => reject(cursorReq.error);
      });
    }

    store.put(report);
    tx.commit();
  } catch {
    // Fallback to localStorage
    const reports = getFromLS();
    reports.unshift(report);
    if (reports.length > MAX_REPORTS) reports.length = MAX_REPORTS;
    setToLS(reports);
  }
}

export async function getAllReports(): Promise<SavedReport[]> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('createdAt');

    return new Promise((resolve, reject) => {
      const results: SavedReport[] = [];
      const req = index.openCursor(null, 'prev');
      req.onsuccess = () => {
        const cursor = req.result;
        if (cursor) {
          results.push(cursor.value as SavedReport);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return getFromLS();
  }
}

export async function deleteReport(id: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(id);
    tx.commit();
  } catch {
    const reports = getFromLS().filter((r) => r.id !== id);
    setToLS(reports);
  }
}

export async function clearAllReports(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.clear();
    tx.commit();
  } catch {
    setToLS([]);
  }
}
