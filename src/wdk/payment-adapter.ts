import type {
  CommerceToken,
  PaymentConfirmation,
  PaymentIntent
} from "../commerce/index.js";

export type PaymentIntentInput = {
  orderId: string;
  merchantAddress: string;
  amount: number;
  token: CommerceToken;
};

export interface WalletPaymentAdapter {
  createAddress(): Promise<string>;
  createPaymentIntent(input: PaymentIntentInput): Promise<PaymentIntent>;
  checkPayment(intentId: string): Promise<PaymentConfirmation>;
}

export function createMockWdkPaymentAdapter(): WalletPaymentAdapter {
  return {
    async createAddress() {
      return "wdk_mock_merchant_usdt_address";
    },
    async createPaymentIntent(input) {
      return {
        id: `wdk_intent_${input.orderId}`,
        orderId: input.orderId,
        merchantAddress: input.merchantAddress,
        amount: input.amount,
        token: input.token,
        reference: input.orderId
      };
    },
    async checkPayment(intentId) {
      const reference = intentId.replace("wdk_intent_", "");
      return {
        intentId,
        amount: 42,
        token: "USDT",
        reference,
        signature: `wdk_mock_signature_${reference}`,
        confirmedAt: "2026-05-15T00:00:00.000Z"
      };
    }
  };
}
