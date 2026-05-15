import { describe, expect, it } from "vitest";
import {
  createPaymentRequest,
  createReceipt,
  generateSolanaPayUrl
} from "../src/core/payment-request.js";

describe("payment request core", () => {
  it("creates a normalized payment request with proof of work metadata", () => {
    const request = createPaymentRequest({
      recipient: "7C7vHrLQYxF2S8hWcM7K8zM2zNyfHqQ6E9YBvrZ1h2bD",
      amount: 25,
      token: "USDC",
      title: "Cap web-backend test coverage",
      proofUrl: "https://github.com/CapSoftware/Cap/pull/1821"
    });

    expect(request.id).toMatch(/^proofpay_/);
    expect(request.status).toBe("pending");
    expect(request.amount).toBe(25);
    expect(request.token).toBe("USDC");
    expect(request.proofUrl).toBe("https://github.com/CapSoftware/Cap/pull/1821");
  });

  it("supports USDt requests for Tether commerce flows", () => {
    const request = createPaymentRequest({
      recipient: "merchant-usdt-address",
      amount: 19.99,
      token: "USDT",
      title: "WDK Commerce Starter order",
      proofUrl: "https://github.com/Tehlikeli107/proofpay-solana"
    });

    expect(request.token).toBe("USDT");
    expect(request.status).toBe("pending");
  });

  it("rejects invalid payment request inputs before a Solana Pay URL is generated", () => {
    expect(() =>
      createPaymentRequest({
        recipient: "",
        amount: 0,
        token: "USDC",
        title: "",
        proofUrl: "not-a-url"
      })
    ).toThrow("recipient is required");
  });

  it("generates a Solana Pay transfer URL with amount, label, and memo", () => {
    const url = generateSolanaPayUrl({
      recipient: "7C7vHrLQYxF2S8hWcM7K8zM2zNyfHqQ6E9YBvrZ1h2bD",
      amount: 12.5,
      label: "ProofPay",
      memo: "proofpay_abc123"
    });

    expect(url).toContain("solana:7C7vHrLQYxF2S8hWcM7K8zM2zNyfHqQ6E9YBvrZ1h2bD");
    expect(url).toContain("amount=12.5");
    expect(url).toContain("label=ProofPay");
    expect(url).toContain("memo=proofpay_abc123");
  });

  it("creates a public receipt from a verified transaction signature", () => {
    const request = createPaymentRequest({
      recipient: "7C7vHrLQYxF2S8hWcM7K8zM2zNyfHqQ6E9YBvrZ1h2bD",
      amount: 5,
      token: "SOL",
      title: "Demo delivery",
      proofUrl: "https://example.com/demo"
    });

    const receipt = createReceipt(request, {
      signature: "5VfUXiGdNcE1mP9iYh6jGkQp2wZk7dTnL4bQw2bHn8aR",
      slot: 123456,
      verifiedAt: "2026-05-15T00:00:00.000Z"
    });

    expect(receipt.status).toBe("verified");
    expect(receipt.requestId).toBe(request.id);
    expect(receipt.signature).toBe("5VfUXiGdNcE1mP9iYh6jGkQp2wZk7dTnL4bQw2bHn8aR");
    expect(receipt.publicPath).toBe(`/receipts/${request.id}`);
  });
});
