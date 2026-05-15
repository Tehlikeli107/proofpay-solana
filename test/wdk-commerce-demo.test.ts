import { describe, expect, it } from "vitest";
import { runWdkCommerceDemo } from "../src/commerce/demo.js";

describe("WDK commerce demo flow", () => {
  it("runs a reviewer-friendly checkout confirmation and receipt flow", async () => {
    const demo = await runWdkCommerceDemo();

    expect(demo.merchantAddress).toBe("wdk_mock_merchant_usdt_address");
    expect(demo.order.status).toBe("pending");
    expect(demo.order.totalAmount).toBe(42);
    expect(demo.confirmation.signature).toBe(
      `wdk_mock_signature_${demo.order.id}`
    );
    expect(demo.paidOrder.status).toBe("paid");
    expect(demo.receipt.orderId).toBe(demo.order.id);
    expect(demo.receipt.publicPath).toBe(`/commerce/receipts/${demo.order.id}`);
  });
});
