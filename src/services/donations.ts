// src/services/donations.ts
import { queueOfflineChange, checkNetworkStatus } from "./offline";

export interface DonationRequest {
  type: "stripe" | "revenuecat";
  userId: string;
  amount: number;
  tierName: string;
  productId?: string;
  stripePrice?: string;
}

export interface DonationResponse {
  success?: boolean;
  sessionUrl?: string;
  error?: string;
  queued?: boolean;
}

const CLOUD_FUNCTION_URL = process.env.REACT_APP_DONATION_FUNCTION_URL || 
  "https://us-central1-proj2aaf5898.cloudfunctions.net/donations";

export const initiateDonation = async (request: DonationRequest): Promise<DonationResponse> => {
  try {
    const response = await fetch(`${CLOUD_FUNCTION_URL}/initiate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Donation failed: ${response.status} ${error}`);
    }

    return await response.json();
  } catch (err) {
    // If offline, queue the donation for processing
    if (!checkNetworkStatus()) {
      console.log("Offline: Queuing donation for sync");
      await queueOfflineChange(
        `/donations/initiate`,
        "POST",
        request
      );
      return { success: true, queued: true };
    }
    console.error("Error initiating donation:", err);
    throw err;
  }
};

export const recordDonation = async (
  userId: string,
  amount: number,
  type: "stripe" | "revenuecat" | "manual",
  transactionId?: string
) => {
  try {
    const response = await fetch(`${CLOUD_FUNCTION_URL}/record`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId,
        amount,
        type,
        transactionId,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to record donation: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    // If offline, queue the donation record
    if (!checkNetworkStatus()) {
      console.log("Offline: Queuing donation record for sync");
      await queueOfflineChange(
        `/donations/record`,
        "POST",
        {
          userId,
          amount,
          type,
          transactionId,
          timestamp: new Date().toISOString()
        }
      );
      return { success: true, queued: true };
    }
    console.error("Error recording donation:", err);
    throw err;
  }
};

