// src/services/offline.ts

import { DailyEntry } from "../types";

const DB_NAME = "tbreak-offline-db";
const DB_VERSION = 1;

interface PendingChange {
  id: string;
  endpoint: string;
  method: "POST" | "PUT" | "DELETE";
  data: any;
  timestamp: number;
  synced: boolean;
}

interface StoredDailyEntry extends DailyEntry {
  _synced?: boolean;
  _pendingDelete?: boolean;
}

/**
 * Open IndexedDB connection
 */
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Store for daily entries
      if (!db.objectStoreNames.contains("daily-entries")) {
        const store = db.createObjectStore("daily-entries", { keyPath: "id" });
        store.createIndex("userId", "userId", { unique: false });
        store.createIndex("date", "date", { unique: false });
      }

      // Store for pending changes (queued for sync)
      if (!db.objectStoreNames.contains("pending-changes")) {
        db.createObjectStore("pending-changes", { keyPath: "id" });
      }

      // Store for offline metadata
      if (!db.objectStoreNames.contains("metadata")) {
        db.createObjectStore("metadata", { keyPath: "key" });
      }
    };
  });
};

/**
 * Save daily entry to IndexedDB (for offline access)
 */
export const saveDailyEntryOffline = async (entry: DailyEntry): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["daily-entries"], "readwrite");
    const store = transaction.objectStore("daily-entries");
    const request = store.put({
      ...entry,
      _synced: true,
      _pendingDelete: false,
    });

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

/**
 * Get daily entry from IndexedDB
 */
export const getDailyEntryOffline = async (entryId: string): Promise<StoredDailyEntry | null> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["daily-entries"], "readonly");
    const store = transaction.objectStore("daily-entries");
    const request = store.get(entryId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
};

/**
 * Get all daily entries for a user from IndexedDB
 */
export const getDailyEntriesOffline = async (userId: string): Promise<StoredDailyEntry[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["daily-entries"], "readonly");
    const store = transaction.objectStore("daily-entries");
    const index = store.index("userId");
    const request = index.getAll(userId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || []);
  });
};

/**
 * Queue a change for offline sync
 */
export const queueOfflineChange = async (
  endpoint: string,
  method: "POST" | "PUT" | "DELETE",
  data: any
): Promise<string> => {
  const db = await openDB();
  const changeId = `${endpoint}-${Date.now()}`;

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["pending-changes"], "readwrite");
    const store = transaction.objectStore("pending-changes");
    const request = store.put({
      id: changeId,
      endpoint,
      method,
      data,
      timestamp: Date.now(),
      synced: false,
    });

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(changeId);
  });
};

/**
 * Get all pending changes (for sync)
 */
export const getPendingChanges = async (): Promise<PendingChange[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["pending-changes"], "readonly");
    const store = transaction.objectStore("pending-changes");
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || []);
  });
};

/**
 * Mark a change as synced (remove from pending)
 */
export const markChangeAsSynced = async (changeId: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["pending-changes"], "readwrite");
    const store = transaction.objectStore("pending-changes");
    const request = store.delete(changeId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

/**
 * Clear all offline data (for logout)
 */
export const clearOfflineData = async (): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["daily-entries", "pending-changes"], "readwrite");
    
    transaction.objectStore("daily-entries").clear();
    transaction.objectStore("pending-changes").clear();

    transaction.onerror = () => reject(transaction.error);
    transaction.oncomplete = () => resolve();
  });
};

/**
 * Set offline status in metadata
 */
export const setOfflineStatus = async (isOnline: boolean): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["metadata"], "readwrite");
    const store = transaction.objectStore("metadata");
    const request = store.put({
      key: "online-status",
      value: isOnline,
      timestamp: Date.now(),
    });

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

/**
 * Get offline status
 */
export const getOfflineStatus = async (): Promise<boolean> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["metadata"], "readonly");
      const store = transaction.objectStore("metadata");
      const request = store.get("online-status");

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result?.value ?? true);
    });
  } catch {
    return true; // Assume online if error
  }
};

/**
 * Request background sync
 */
export const requestBackgroundSync = async (): Promise<void> => {
  if (!("serviceWorker" in navigator)) {
    console.warn("Background sync not supported");
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const syncManager = (registration as any).sync;
    if (syncManager) {
      await syncManager.register("sync-offline-data");
      console.log("Background sync registered");
    }
  } catch (error) {
    console.error("Failed to register background sync:", error);
  }
};

/**
 * Check network connectivity
 */
export const checkNetworkStatus = (): boolean => {
  return navigator.onLine;
};

/**
 * Listen for online/offline events
 */
export const setupOfflineListener = (onStatusChange: (isOnline: boolean) => void): (() => void) => {
  const handleOnline = () => {
    console.log("App came online");
    setOfflineStatus(true);
    onStatusChange(true);
    requestBackgroundSync();
  };

  const handleOffline = () => {
    console.log("App went offline");
    setOfflineStatus(false);
    onStatusChange(false);
  };

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
};
