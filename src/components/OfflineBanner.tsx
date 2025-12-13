// src/components/OfflineBanner.tsx

import React from "react";
import { useOfflineContext } from "../context/OfflineContext";
import "../styles/offline-banner.css";

export const OfflineBanner: React.FC = () => {
  const { isOnline, pendingChangesCount, isSyncing } = useOfflineContext();

  // Don't show banner if online and no pending changes
  if (isOnline && pendingChangesCount === 0) {
    return null;
  }

  return (
    <div className={`offline-banner ${isOnline ? "syncing" : "offline"}`}>
      <div className="offline-banner-content">
        {isOnline ? (
          <>
            <span className="offline-banner-icon">🔄</span>
            <span className="offline-banner-text">
              {isSyncing ? "Syncing changes..." : ""}
              {!isSyncing && pendingChangesCount > 0
                ? `${pendingChangesCount} change${
                    pendingChangesCount === 1 ? "" : "s"
                  } ready to sync`
                : ""}
            </span>
          </>
        ) : (
          <>
            <span className="offline-banner-icon">📡</span>
            <span className="offline-banner-text">
              You're offline. Your changes will sync when connected.
            </span>
          </>
        )}
      </div>
    </div>
  );
};
