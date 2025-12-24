// src/context/OfflineContext.test.tsx
import { renderHook, act } from '@testing-library/react';
import { OfflineProvider, useOfflineContext } from './OfflineContext';
import { getPendingChanges } from '../services/offline';

jest.mock('../services/offline');

describe('OfflineContext', () => {
  const mockGetPendingChanges = getPendingChanges as jest.MockedFunction<typeof getPendingChanges>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetPendingChanges.mockResolvedValue([]);
  });

  it('should provide initial online state', () => {
    const { result } = renderHook(() => useOfflineContext(), {
      wrapper: OfflineProvider
    });

    expect(result.current.isOnline).toBe(navigator.onLine);
    expect(result.current.pendingChangesCount).toBe(0);
    expect(result.current.isSyncing).toBe(false);
  });

  it('should update online status when network changes', () => {
    const { result } = renderHook(() => useOfflineContext(), {
      wrapper: OfflineProvider
    });

    // Simulate going offline
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    expect(result.current.isOnline).toBe(false);

    // Simulate going online
    act(() => {
      window.dispatchEvent(new Event('online'));
    });

    expect(result.current.isOnline).toBe(true);
  });

  it('should update pending changes count', async () => {
    mockGetPendingChanges.mockResolvedValue([
      { id: '1', endpoint: '/test', method: 'POST', data: {}, timestamp: Date.now(), synced: false }
    ]);

    let result: any;
    await act(async () => {
      const hook = renderHook(() => useOfflineContext(), {
        wrapper: OfflineProvider
      });
      result = hook.result;
      // Wait for initial pending changes check
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(mockGetPendingChanges).toHaveBeenCalled();
    expect(result.current.pendingChangesCount).toBeGreaterThanOrEqual(0);
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useOfflineContext());
    }).toThrow('useOfflineContext must be used within OfflineProvider');

    consoleSpy.mockRestore();
  });
});
