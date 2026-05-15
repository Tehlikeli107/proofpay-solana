import { describe, expect, it } from "vitest";
import {
  confirmOrderPayment,
  createCommerceReceipt,
  createCheckoutOrder
} from "../src/commerce/index.js";

describe("commerce checkout core", () => {
  it("creates a pending USDt checkout order", () => {
    const order = createCheckoutOrder({
      productName: "ProofPay Hoodie",
      unitPrice: 29,
      quantity: 2,
      token: "USDT",
      merchantAddress: "merchant-usdt-address",
      proofUrl: "https://github.com/Tehlikeli107/proofpay-solana"
    });

    expect(order.id).toMatch(/^order_/);
    expect(order.status).toBe("pending");
    expect(order.totalAmount).toBe(58);
    expect(order.paymentIntent.orderId).toBe(order.id);
    expect(order.paymentIntent.token).toBe("USDT");
  });

  it("rejects invalid product and amount inputs", () => {
    expect(() =>
      createCheckoutOrder({
        productName: "",
        unitPrice: 0,
        quantity: 0,
        token: "USDT",
        merchantAddress: "",
        proofUrl: "not-a-url"
      })
    ).toThrow("productName is required");
  });

  it("rejects payment confirmations with mismatched amount or token", () => {
    const order = createCheckoutOrder({
      productName: "ProofPay Hoodie",
      unitPrice: 29,
      quantity: 1,
      token: "USDT",
      merchantAddress: "merchant-usdt-address",
      proofUrl: "https://github.com/Tehlikeli107/proofpay-solana"
    });

    expect(() =>
      confirmOrderPayment(order, {
        intentId: order.paymentIntent.id,
        amount: 1,
        token: "USDT",
        reference: order.id,
        signature: "mock-signature",
        confirmedAt: "2026-05-15T00:00:00.000Z"
      })
    ).toThrow("payment amount mismatch");
  });

  it("marks a matching payment as paid and creates a receipt", () => {
    const order = createCheckoutOrder({
      productName: "ProofPay Hoodie",
      unitPrice: 29,
      quantity: 1,
      token: "USDT",
      merchantAddress: "merchant-usdt-address",
      proofUrl: "https://github.com/Tehlikeli107/proofpay-solana"
    });

    const paid = confirmOrderPayment(order, {
      intentId: order.paymentIntent.id,
      amount: 29,
      token: "USDT",
      reference: order.id,
      signature: "mock-signature",
      confirmedAt: "2026-05-15T00:00:00.000Z"
    });

    const receipt = createCommerceReceipt(paid);

    expect(paid.status).toBe("paid");
    expect(receipt.orderId).toBe(order.id);
    expect(receipt.publicPath).toBe(`/commerce/receipts/${order.id}`);
  });

  it("requires a paid order before creating a receipt", () => {
    const order = createCheckoutOrder({
      productName: "ProofPay Hoodie",
      unitPrice: 29,
      quantity: 1,
      token: "USDT",
      merchantAddress: "merchant-usdt-address",
      proofUrl: "https://github.com/Tehlikeli107/proofpay-solana"
    });

    expect(() => createCommerceReceipt(order)).toThrow("order must be paid");
  });
});
