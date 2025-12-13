# T-Break App: Online & Offline Behavior Guide

## Overview

The T-Break app is designed to work **both with and without internet**, with smart handling of features that require connectivity:

- ✅ **Works offline:** Daily check-ins, mood tracking, calendar, profile, donations history
- ⚠️ **Requires online:** Chat (real-time community messages)
- 🔄 **Auto-syncs when online:** All offline changes automatically sync when connection restored

---

## Feature-by-Feature Breakdown

### ✅ Works Fully Offline

#### 1. **Daily Check-In** (`/checkin`)
- **Offline:** ✅ Works perfectly
- **Data:** Saved to IndexedDB locally
- **When online:** Automatically syncs to Firestore
- **User experience:** No difference whether online or offline

```
User Creates Check-in (Offline)
    ↓
Saved locally to IndexedDB
    ↓
OfflineBanner shows: "Syncing..." with pending count
    ↓
User comes online
    ↓
Background Sync automatically sends to Firestore
    ↓
OfflineBanner clears
```

#### 2. **Calendar** (`/calendar`)
- **Offline:** ✅ Works with cached data
- **Data:** Uses IndexedDB cache of previously loaded entries
- **When online:** Loads fresh data from Firestore
- **Behavior:** Shows historical mood data from device storage

#### 3. **Profile** (`/profile`)
- **Offline:** ✅ Can view settings
- **Data:** User profile cached from login
- **Limitations:** Cannot save new settings without internet
- **When online:** Settings sync automatically

#### 4. **Donations History**
- **Offline:** ✅ Can view past donations
- **Data:** Cached from previous sessions
- **Cannot:** Initiate new donations (requires Stripe/RevenueCat)
- **When online:** Can make new donations

#### 5. **Nutrition Library** (`/nutrition`)
- **Offline:** ✅ Views cached data
- **Data:** Loaded from cache on first visit
- **When online:** Updates with fresh data

#### 6. **Metabolite Estimator** (`/estimator`)
- **Offline:** ✅ Works fine
- **Data:** Calculations done locally
- **When online:** Can share/save results

---

### ⚠️ Requires Internet

#### **Chat Room** (`/chat`)
- **Offline:** ❌ Cannot receive live messages
- **Why:** Chat uses real-time Firestore listeners (`onSnapshot`)
- **When offline:** 
  - Can **type** messages (no error)
  - Messages are **queued locally**
  - See warning: "⚠️ You're offline. Messages will be queued and sent when you're back online."
- **When online:**
  - Queued messages automatically send
  - Live chat listener reactivates
  - User sees community messages in real-time

**Smart Chat Behavior:**
```
Offline:
  - User can still type messages
  - Input field enabled
  - Messages show: "Queued" indicator
  - Click Send → Message stored locally
  - Yellow warning banner appears

Online:
  - All queued messages send automatically
  - Real-time listener connects
  - Live messages appear
  - No warning banner (unless other changes pending)
```

---

## Offline Experience Details

### What Happens When User Goes Offline

1. **OfflineBanner appears** at top of screen (red):
   - Icon: 📡
   - Text: "You're offline. Your changes will sync when connected."

2. **Service Worker activates:**
   - Intercepts all API requests
   - Returns cached responses if available
   - Queues new data changes to IndexedDB

3. **IndexedDB stores:**
   - Daily entry data
   - Pending changes (with timestamps)
   - Sync metadata

4. **Features remain usable:**
   - Dashboard: Shows cached data
   - Calendar: Displays historical mood
   - Profile: View but cannot save
   - Chat: Can type, messages queue locally
   - Donations: View history only

### What Happens When User Comes Back Online

1. **OfflineBanner changes color** (teal):
   - Icon: 🔄
   - Text: "Syncing changes..." + count of pending changes

2. **Background Sync API triggered:**
   - Automatically sends all queued changes
   - Processes in background (no user action needed)
   - Removes synced items from queue

3. **Sync Complete:**
   - OfflineBanner disappears
   - All data now in Firestore
   - App fully synchronized

---

## Code Implementation

### Service Worker Caching Strategy

```javascript
// From public/service-worker.js

// Static assets (CSS, JS, images) - use cache first
cacheFirst: async (request) => {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) caches.put(request, response.clone());
  return response;
}

// API calls - try network, fallback to cache
networkFirst: async (request) => {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response(
      JSON.stringify({ error: 'Offline' }),
      { status: 503 }
    );
  }
}
```

### Offline Data Persistence

```typescript
// From src/services/offline.ts

// Save daily entry locally
export const saveDailyEntryOffline = async (entry: DailyEntry) => {
  // Stores in IndexedDB "daily-entries" object store
}

// Queue a change for later sync
export const queueOfflineChange = async (
  endpoint: string,
  method: "POST" | "PUT" | "DELETE",
  data: any
) => {
  // Stores in IndexedDB "pending-changes" object store
  // Includes: endpoint, method, data, timestamp
}

// Get all pending changes
export const getPendingChanges = async () => {
  // Returns array of unsync'd changes
  // Used by background sync to process queue
}
```

### API Service Integration

```typescript
// From src/services/dailyEntries.ts

export const saveDailyEntry = async (entry: DailyEntry) => {
  try {
    // Try to save to Firestore
    await setDoc(doc(db, COLLECTION, entry.id), entry);
  } catch (error) {
    // If offline, save locally and queue for sync
    if (!checkNetworkStatus()) {
      await saveDailyEntryOffline(entry);
      await queueOfflineChange(`/dailyEntries/${entry.id}`, "PUT", entry);
      return { success: true, queued: true };
    }
    throw error;
  }
}
```

### Chat Offline Handling

```typescript
// From src/services/chat.ts

export const sendChatMessage = async (...) => {
  try {
    // Try to send to Firestore
    await addDoc(collection(db, COLLECTION), data);
  } catch (error) {
    // Queue message for later delivery
    if (!checkNetworkStatus()) {
      await queueOfflineChange(`/chatMessages`, "POST", data);
      return { success: true, queued: true };
    }
    throw error;
  }
}

export const subscribeToChatMessages = (cb) => {
  // Real-time listener - fails gracefully if offline
  return onSnapshot(
    query(collection(db, COLLECTION), orderBy("createdAt", "desc")),
    (snapshot) => cb(msgs),
    (error) => {
      // If offline, use cached messages from IndexedDB
      console.warn("Chat listener error:", error);
    }
  );
}
```

---

## User-Facing Messages

### Offline Banner States

| State | Banner | Message |
|-------|--------|---------|
| **Online** | (None) | App works normally |
| **Offline** | 🔴 Red | "📡 You're offline. Your changes will sync when connected." |
| **Syncing** | 🟢 Teal | "🔄 Syncing changes..." (with count) |

### In-App Feedback

**Chat Room (Offline):**
```
⚠️ You're offline. Messages will be queued and sent when you're back online.

[Input field: "Write a supportive message..." (ENABLED)]
[Send button (ENABLED)]

// When user clicks Send:
// Message appears with "Queued" indicator
// Stored locally in IndexedDB
```

**Chat Room (Online):**
```
[No warning banner]

[Input field: "Write a supportive message..." (ENABLED)]
[Send button (ENABLED)]

// Messages send immediately
// Appear in real-time chat stream
```

---

## Testing Offline Behavior

### Test in Browser DevTools

1. **Open DevTools** (F12)
2. **Go to Network tab**
3. **Check "Offline"** checkbox
4. **Try these actions:**

| Action | Expected Result |
|--------|-----------------|
| Create daily check-in | ✅ Saved locally, syncs when online |
| View calendar | ✅ Shows cached data |
| Type chat message | ✅ Queues message, shows warning |
| Click Send | ✅ Message stored locally |
| Navigate away | ✅ App still works |

5. **Restore network:**
   - Uncheck "Offline"
   - Watch OfflineBanner change to "Syncing..."
   - All changes send automatically

### Test on Real Device

```bash
# Simulate offline:
1. Turn off WiFi
2. Go into Airplane Mode
3. Disable mobile data

# App behavior:
- OfflineBanner appears (red)
- All offline features still work
- Chat shows warning
- Service Worker serves cached content

# Test online:
1. Re-enable internet
2. Watch OfflineBanner change to "Syncing..."
3. All queued changes sync automatically
4. Banner disappears when done
```

---

## Performance Considerations

### Storage Limits

- **Service Worker Cache:** ~50-100MB (browser dependent)
- **IndexedDB:** ~50-500MB (browser dependent)
- **Recommended:** Cache only essential assets + last 7 days of data

### Data Freshness

- **When offline:** Shows cached data (may be old)
- **When online:** Automatically fetches fresh data
- **Real-time features:** Chat waits for connection to sync

### Battery Impact

- **Service Worker:** Minimal (only intercepts requests)
- **Background Sync:** Uses native OS battery-efficient scheduler
- **IndexedDB:** Efficient local storage

---

## Chat-Specific Behavior

### Why Chat Requires Internet

Chat uses **Firebase's real-time Firestore listener** (`onSnapshot`):
- Listens for new messages from all users
- Pushes live updates to UI
- Requires active connection

### Offline Chat Workaround

Messages are **queued locally** when offline:
```
Offline Chat Workflow:
  1. User types message
  2. User clicks "Send"
  3. Message saved to IndexedDB pending-changes
  4. Yellow warning shows
  5. User comes online
  6. Background Sync sends queued messages
  7. Real-time listener reconnects
  8. User sees their queued messages + live stream
```

### Limitations

- Cannot receive messages while offline
- Cannot see what others posted while offline
- Queued messages send when online (not real-time)
- Live listener has slight delay on reconnect (~1-2 seconds)

---

## Best Practices for Users

### When Going Offline

1. **Finish what you started:**
   - Complete daily check-in
   - Close open pages cleanly
   
2. **Know the limitations:**
   - Chat won't work
   - Messages will queue automatically
   - Everything else works fine

3. **Trust the sync:**
   - Don't resubmit queued messages
   - App handles duplicate prevention
   - Data automatically syncs when online

### When Coming Back Online

1. **App syncs automatically:**
   - No action needed
   - Watch OfflineBanner for sync progress
   - Takes seconds to minutes

2. **Verify data:**
   - Check daily entries saved
   - See chat messages posted
   - Profile updates synced

3. **No manual sync needed:**
   - Everything automatic
   - Background Sync handles it
   - Very rare to need manual intervention

---

## Troubleshooting

### Issue: OfflineBanner stuck on "Syncing"

**Solution:**
1. Check actual connection (WiFi/mobile data)
2. Refresh page
3. Clear IndexedDB: DevTools → Application → IndexedDB → Delete

### Issue: Chat messages not sent after coming online

**Solution:**
1. Verify connection active
2. Refresh page
3. Check DevTools Console for errors
4. Check pending changes count in OfflineBanner

### Issue: Old data showing instead of fresh data

**Solution:**
1. Hard refresh: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)
2. Clear Service Worker cache
3. Re-login to force data refresh

### Issue: Service Worker not caching

**Solution:**
1. Check browser supports Service Workers (Chrome 40+, Firefox 44+, Safari 11.1+)
2. Only works over HTTPS (or localhost)
3. Check DevTools → Application → Service Workers

---

## Future Enhancements

Potential improvements:

1. **Selective Sync:**
   - User chooses which changes to sync
   - Retry failed syncs manually

2. **Conflict Resolution:**
   - Handle simultaneous edits
   - Version tracking for data

3. **Progressive Rollout:**
   - Opt-in offline mode per user
   - Analytics on offline usage

4. **Enhanced Chat:**
   - Offline message drafts
   - Message queuing UI
   - Delivery status indicators

---

## Summary

| Feature | Online | Offline | Auto-Sync |
|---------|--------|---------|-----------|
| Daily Check-in | ✅ | ✅ | ✅ |
| Calendar | ✅ | ✅ (cached) | ✅ |
| Profile | ✅ | ✅ (view) | ✅ |
| Chat | ✅ | ⚠️ (queue) | ✅ |
| Donations | ✅ | ✅ (view) | ❌ |
| Notifications | ✅ | ✅ (queued) | ✅ |

**Key Point:** The app gracefully degrades when offline, with chat being the only feature that truly requires real-time internet. Everything else works seamlessly, and automatic sync keeps data in perfect sync.

---

**Note:** Chat messages sent while offline will be delivered when the user comes back online. The real-time listener will reconnect, and users will see both their queued messages and the live message stream.
