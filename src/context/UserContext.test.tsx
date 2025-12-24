// src/context/UserContext.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { UserProvider, useUser } from './UserContext';
import { listenToAuthChanges } from '../services/auth';
import { onSnapshot } from 'firebase/firestore';

// Mock Firebase modules
jest.mock('../services/auth');
jest.mock('firebase/firestore');
jest.mock('../firebase', () => ({
  db: {},
  auth: {}
}));

describe('UserContext', () => {
  const mockListenToAuthChanges = listenToAuthChanges as jest.MockedFunction<typeof listenToAuthChanges>;
  const mockOnSnapshot = onSnapshot as jest.MockedFunction<typeof onSnapshot>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide initial null user state', () => {
    mockListenToAuthChanges.mockImplementation((cb) => {
      cb(null);
      return jest.fn();
    });

    const { result } = renderHook(() => useUser(), {
      wrapper: UserProvider
    });

    expect(result.current.authUser).toBeNull();
    expect(result.current.profile).toBeNull();
    expect(result.current.user).toBeNull();
  });

  it('should update authUser when Firebase auth changes', async () => {
    const mockUser = {
      uid: 'test-uid',
      email: 'test@example.com'
    } as any;

    mockListenToAuthChanges.mockImplementation((cb) => {
      cb(mockUser);
      return jest.fn();
    });

    mockOnSnapshot.mockImplementation((ref: any, ...args: any[]) => {
      const callback = args[args.length - 1];
      if (typeof callback === 'function') {
        callback({
          exists: () => true,
          data: () => ({
            id: 'test-uid',
            email: 'test@example.com',
            plan: 'free'
          })
        } as any);
      }
      return jest.fn();
    });

    const { result } = renderHook(() => useUser(), {
      wrapper: UserProvider
    });

    await waitFor(() => {
      expect(result.current.authUser).toEqual(mockUser);
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it('should sync profile from Firestore when user is authenticated', async () => {
    const mockUser = { uid: 'test-uid', email: 'test@example.com' } as any;
    const mockProfile = {
      id: 'test-uid',
      email: 'test@example.com',
      plan: 'free',
      currentDay: 5,
      totalCoins: 100
    };

    mockListenToAuthChanges.mockImplementation((cb) => {
      cb(mockUser);
      return jest.fn();
    });

    mockOnSnapshot.mockImplementation((ref: any, callback: any) => {
      callback({
        exists: () => true,
        data: () => mockProfile
      } as any);
      return jest.fn();
    });

    const { result } = renderHook(() => useUser(), {
      wrapper: UserProvider
    });

    await waitFor(() => {
      expect(result.current.profile).toEqual(mockProfile);
    });
  });

  it('should clear profile when user logs out', async () => {
    let authCallback: any;

    mockListenToAuthChanges.mockImplementation((cb) => {
      authCallback = cb;
      return jest.fn();
    });

    const { result } = renderHook(() => useUser(), {
      wrapper: UserProvider
    });

    // Simulate logout
    authCallback(null);

    await waitFor(() => {
      expect(result.current.authUser).toBeNull();
      expect(result.current.profile).toBeNull();
    });
  });
});
