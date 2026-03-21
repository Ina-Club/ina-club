import { PaymentResult, PaymentServiceProvider } from "./PaymentServiceProvider";

/**
 * A mock PSP implementation to satisfy the MVP requirements without actual payment processing.
 */
export class MockPaymentProvider extends PaymentServiceProvider {
  readonly pspName = "MOCK_PSP";

  async chargeToken(token: string, amount: number, currency: string): Promise<PaymentResult> {
    console.log(`[MOCK_PSP] Charging token ${token} for ${amount} ${currency}`);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // In a mock environment, we can assume success
    return {
      success: true,
      transactionId: `mock_txn_${Math.random().toString(36).substring(7)}`,
    };
  }

  async releaseToken(token: string): Promise<boolean> {
    console.log(`[MOCK_PSP] Releasing token ${token}`);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    return true;
  }
}
