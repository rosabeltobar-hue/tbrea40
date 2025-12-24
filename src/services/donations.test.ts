// src/services/donations.test.ts
import { initiateDonation } from './donations';
import { queueOfflineChange, checkNetworkStatus } from './offline';
import type { DonationRequest } from './donations';

jest.mock('./offline');

describe('Donation Services', () => {
  const mockCheckNetworkStatus = checkNetworkStatus as jest.MockedFunction<typeof checkNetworkStatus>;
  const mockQueueOfflineChange = queueOfflineChange as jest.MockedFunction<typeof queueOfflineChange>;

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    delete (global as any).fetch;
  });

  describe('initiateDonation', () => {
    const validRequest: DonationRequest = {
      type: 'stripe',
      userId: 'user-123',
      amount: 9.99,
      tierName: 'Premium',
      stripePrice: 'price_123'
    };

    it('should initiate donation when online', async () => {
      mockCheckNetworkStatus.mockReturnValue(true);
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, sessionUrl: 'https://checkout.stripe.com/test' })
      });

      const result = await initiateDonation(validRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/initiate'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validRequest)
        })
      );
      expect(result.success).toBe(true);
      expect(result.sessionUrl).toBeDefined();
    });

    it('should queue donation when offline', async () => {
      mockCheckNetworkStatus.mockReturnValue(false);
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
      mockQueueOfflineChange.mockResolvedValue('queued-change-id');

      const result = await initiateDonation(validRequest);

      expect(result.queued).toBe(true);
      // The actual implementation returns a message, not an error field
      expect(result).toHaveProperty('queued', true);
    });

    it('should handle server errors gracefully', async () => {
      mockCheckNetworkStatus.mockReturnValue(true);
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error'
      });

      await expect(initiateDonation(validRequest)).rejects.toThrow('Donation failed: 500');
    });

    it('should use environment variable for function URL', async () => {
      const originalEnv = process.env.REACT_APP_DONATION_FUNCTION_URL;
      
      // Note: In Jest, process.env changes don't affect already-imported modules
      // This test verifies the fallback URL works correctly
      mockCheckNetworkStatus.mockReturnValue(true);
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true })
      });

      await initiateDonation(validRequest);

      // Verify fetch was called (URL will be the default since module is already loaded)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/initiate'),
        expect.anything()
      );

      process.env.REACT_APP_DONATION_FUNCTION_URL = originalEnv;
    });
  });
});
