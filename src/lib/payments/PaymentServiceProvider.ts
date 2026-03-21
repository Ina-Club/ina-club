export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export abstract class PaymentServiceProvider {
  /**
   * Identifies the PSP name.
   * This should match the `name` field in the `PaymentServiceProvider` database table.
   */
  abstract readonly pspName: string;

  /**
   * Charges a previously vaulted token for a specific amount.
   */
  abstract chargeToken(token: string, amount: number, currency: string): Promise<PaymentResult>;

  /**
   * Releases or detaches a vaulted token on the PSP's side so it can no longer be charged.
   */
  abstract releaseToken(token: string): Promise<boolean>;
}
