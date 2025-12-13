# Online/Offline Quick Reference

## App Works With & Without Internet

```
┌─────────────────────────────────────────────────────────┐
│              WITHOUT INTERNET (OFFLINE)                 │
└─────────────────────────────────────────────────────────┘

✅ WORKS PERFECTLY:
  ✓ Daily Check-in        → Saved locally, syncs when online
  ✓ Calendar              → Shows cached mood history
  ✓ Profile               → Can view settings
  ✓ Nutrition Library     → Shows cached content
  ✓ Metabolite Estimator  → Local calculations
  ✓ Donations History     → Shows past donations
  ✓ Notifications         → Queued and sent when online

⚠️  NEEDS INTERNET:
  ⚠ Chat Room             → Cannot receive messages, but can queue to send

USER EXPERIENCE:
  - Red banner appears: "📡 You're offline"
  - App continues working normally
  - Offline changes queue locally
  - All features gracefully degrade


┌─────────────────────────────────────────────────────────┐
│                WITH INTERNET (ONLINE)                   │
└─────────────────────────────────────────────────────────┘

✅ EVERYTHING WORKS:
  ✓ All features normal
  ✓ Real-time chat
  ✓ Push notifications
  ✓ Donations
  ✓ All data syncs

🔄 AUTOMATIC SYNC:
  - Queued offline changes send automatically
  - Teal banner: "🔄 Syncing..." while syncing
  - Banner disappears when done
```

## Feature Matrix

```
┌──────────────────┬────────────┬─────────────┬──────────────┐
│     Feature      │   Online   │   Offline   │  Auto-Sync?  │
├──────────────────┼────────────┼─────────────┼──────────────┤
│ Daily Check-in   │     ✅     │      ✅     │      ✅      │
│ Calendar         │     ✅     │    ✅ (*)   │      ✅      │
│ Profile          │     ✅     │    ✅ (view)│      ✅      │
│ Chat Room        │     ✅     │   ⚠️ (queue)│      ✅      │
│ Donations        │     ✅     │    ✅ (view)│      ❌      │
│ Notifications    │     ✅     │    ✅ (*)   │      ✅      │
│ Push Messages    │     ✅     │      ❌     │      N/A     │
└──────────────────┴────────────┴─────────────┴──────────────┘

(*) = Shows cached data
(queue) = Queued locally, sent when online
(view) = Can view history, can't create new
```

## Chat Behavior

```
OFFLINE CHAT:
  User types message
      ↓
  Message queued locally (stored in IndexedDB)
      ↓
  Yellow warning appears
      ↓
  User comes online
      ↓
  Message automatically sends
      ↓
  Real-time listener reconnects
      ↓
  User sees: their message + live chat stream

NO ACTION NEEDED - ALL AUTOMATIC!
```

## Data Persistence

```
What Gets Saved Locally:
  ├── Daily entries (check-ins)
  ├── Mood data
  ├── User profile (cached)
  ├── Chat messages (queued)
  ├── Notifications (queued)
  └── Sync metadata

Storage Location:
  Service Worker Cache    → Assets (CSS, JS, images)
  IndexedDB              → Data (entries, pending changes)
  LocalStorage           → Session info
```

## OfflineBanner States

```
NOT SHOWN:
  - App is online
  - No pending changes
  - Everything synced

RED BANNER (Offline):
  "📡 You're offline. Your changes will sync when connected."
  - Shows when internet lost
  - Disappears when reconnected

TEAL BANNER (Syncing):
  "🔄 Syncing changes..." (with count)
  - Shows when syncing pending changes
  - Disappears when all synced
```

## Testing Offline

```bash
# In Browser DevTools:
1. Open DevTools (F12)
2. Go to "Network" tab
3. Check "Offline" ✓
4. Create daily entry → Works! ✓
5. Type chat message → Works! ✓
6. Click Send → Message queued ✓
7. Uncheck "Offline" to restore
8. Watch "Syncing..." banner
9. Everything syncs automatically ✓

# On Real Device:
1. Turn off WiFi / Mobile data
2. OfflineBanner appears
3. Create check-in → Saves locally
4. Type chat → Message queues
5. Turn internet back on
6. Auto-syncs in background
7. Banner shows "Syncing..." then gone
```

## Key Points

✅ **Works offline:** Daily entries, calendar, profile, most features
⚠️ **Needs online:** Chat (real-time), push notifications
🔄 **Auto-syncs:** All changes automatically sync when you come back online
📱 **Mobile ready:** Works great on Capacitor/Android
🔋 **Battery efficient:** Background sync uses native OS scheduler
💾 **Data safe:** All changes saved locally before syncing

## User Experience

```
Scenario 1: User goes offline while checking in
  ✓ Check-in still saves
  ✓ Red offline banner appears
  ✓ Red banner disappears when online
  ✓ Check-in automatically synced

Scenario 2: User types chat message offline
  ✓ Can type message
  ✓ Can click Send
  ✓ Message queued (yellow warning)
  ✓ User comes online
  ✓ Message automatically sent
  ✓ See it in real-time chat stream

Scenario 3: User uses app entirely offline
  ✓ Dashboard loads
  ✓ Calendar shows history
  ✓ Can create check-in
  ✓ Can type chat (queued)
  ✓ Everything works!

ALL WITH ZERO USER INTERVENTION!
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| OfflineBanner stuck | Refresh page, check internet |
| Chat not sending | Verify connection, refresh |
| Old data showing | Hard refresh: Cmd+Shift+R |
| Service Worker not working | Works on HTTPS + modern browsers |

---

**Bottom Line:** Your app works great offline. Chat queues messages automatically. Everything syncs when you come back online. Zero hassle! 🎉
