import { describe, expect, it } from "vitest";
import { createMockWdkPaymentAdapter } from "../src/wdk/index.js";

describe("mock WDK payment adapter", () => {
  it("creates deterministic merchant addresses and payment intents", async () => {
    const adapter = createMockWdkPaymentAdapter();
    const merchantAddress = await adapter.createAddress();
    const intent = await adapter.createPaymentIntent({
      orderId: "order_abc",
      merchantAddress,
      amount: 42,
      token: "USDT"
    });

    expect(merchantAddress).toBe("wdk_mock_merchant_usdt_address");
    expect(intent.id).toBe("wdk_intent_order_abc");
    expect(intent.reference).toBe("order_abc");
  });

  it("returns deterministic confirmation evidence for an intent", async () => {
    const adapter = createMockWdkPaymentAdapter();
    const confirmation = await adapter.checkPayment("wdk_intent_order_abc");

    expect(confirmation.intentId).toBe("wdk_intent_order_abc");
    expect(confirmation.signature).toBe("wdk_mock_signature_order_abc");
    expect(confirmation.reference).toBe("order_abc");
  });
});
