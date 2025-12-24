// src/services/auth.test.ts
import { signUp, signIn, logout, listenToAuthChanges } from './auth';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

jest.mock('firebase/auth');
jest.mock('../firebase', () => ({
  auth: { currentUser: null }
}));

describe('Auth Services', () => {
  const mockCreateUser = createUserWithEmailAndPassword as jest.MockedFunction<typeof createUserWithEmailAndPassword>;
  const mockSignIn = signInWithEmailAndPassword as jest.MockedFunction<typeof signInWithEmailAndPassword>;
  const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;
  const mockOnAuthStateChanged = onAuthStateChanged as jest.MockedFunction<typeof onAuthStateChanged>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should create a new user with email and password', async () => {
      const mockUserCredential = {
        user: { uid: 'new-user-id', email: 'test@example.com' }
      };
      mockCreateUser.mockResolvedValue(mockUserCredential as any);

      const result = await signUp('test@example.com', 'password123');

      expect(mockCreateUser).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        'password123'
      );
      expect(result).toEqual(mockUserCredential);
    });

    it('should throw error on invalid credentials', async () => {
      mockCreateUser.mockRejectedValue(new Error('Invalid email'));

      await expect(signUp('invalid', 'short')).rejects.toThrow('Invalid email');
    });
  });

  describe('signIn', () => {
    it('should sign in user with email and password', async () => {
      const mockUserCredential = {
        user: { uid: 'user-id', email: 'test@example.com' }
      };
      mockSignIn.mockResolvedValue(mockUserCredential as any);

      const result = await signIn('test@example.com', 'password123');

      expect(mockSignIn).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        'password123'
      );
      expect(result).toEqual(mockUserCredential);
    });

    it('should throw error on wrong password', async () => {
      mockSignIn.mockRejectedValue(new Error('Wrong password'));

      await expect(signIn('test@example.com', 'wrongpass')).rejects.toThrow('Wrong password');
    });
  });

  describe('logout', () => {
    it('should sign out current user', async () => {
      mockSignOut.mockResolvedValue(undefined);

      await logout();

      expect(mockSignOut).toHaveBeenCalledWith(expect.anything());
    });
  });

  describe('listenToAuthChanges', () => {
    it('should listen to auth state changes', () => {
      const mockCallback = jest.fn();
      const mockUnsubscribe = jest.fn();

      mockOnAuthStateChanged.mockReturnValue(mockUnsubscribe);

      const unsubscribe = listenToAuthChanges(mockCallback);

      expect(mockOnAuthStateChanged).toHaveBeenCalled();
      expect(typeof unsubscribe).toBe('function');
    });

    it('should call callback when auth state changes', () => {
      const mockCallback = jest.fn();
      const mockUser = { uid: 'user-123', email: 'test@example.com' };

      mockOnAuthStateChanged.mockImplementation((auth, callback) => {
        (callback as any)(mockUser as any);
        return jest.fn();
      });

      listenToAuthChanges(mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(mockUser);
    });
  });
});
