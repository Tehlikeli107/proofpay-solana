# WDK Protocol Payment Receipts Module Spec

Proposed package name: `wdk-protocol-payment-receipts`

## Purpose

`wdk-protocol-payment-receipts` is a small WDK-compatible module proposal for payment confirmation, receipt generation, and lightweight payment reporting in WDK-powered wallets and checkout flows.

The module is intentionally smaller than a full ecommerce integration. It focuses on the reusable layer many WDK applications need after a transaction is created: normalize payment evidence, track confirmation state, and expose a developer-friendly receipt payload.

## Bounty Fit

This proposal targets the WDK Module bounty. It fits the analytics/reporting and protocol-extension scope by adding a reusable payment receipt module instead of a full wallet application or production merchant dashboard.

The module will follow these bounty expectations after scope alignment:

- WDK module architecture and naming conventions.
- WDK manager pattern compatibility.
- Bare runtime compatibility.
- Complete TypeScript definitions.
- JSDoc documentation.
- Automated tests using `brittle`.
- Demo script or short video.
- Pull request to the appropriate Tether GitHub repository.

## Proposed API

```ts
type PaymentReceiptStatus = "pending" | "broadcast" | "confirmed" | "failed";

type PaymentReceiptInput = {
  reference: string;
  amount: number;
  token: "USDT" | "USDC" | string;
  network: string;
  sender?: string;
  recipient: string;
  transactionId?: string;
  observedAt: string;
};

type PaymentReceipt = PaymentReceiptInput & {
  id: string;
  status: PaymentReceiptStatus;
  publicPath: string;
};

interface PaymentReceiptsManager {
  createPending(input: PaymentReceiptInput): PaymentReceipt;
  markBroadcast(receipt: PaymentReceipt, transactionId: string): PaymentReceipt;
  markConfirmed(receipt: PaymentReceipt, confirmedAt: string): PaymentReceipt;
  markFailed(receipt: PaymentReceipt, reason: string): PaymentReceipt;
}
```

The final API should be adjusted to match WDK team conventions before implementation.

## State Model

`pending`: A payment request or checkout reference exists, but no transaction evidence has been observed.

`broadcast`: A transaction id exists, but the confirmation threshold has not been reached.

`confirmed`: The transaction is confirmed and can be presented to a merchant, customer, or application.

`failed`: The payment attempt failed or was rejected by the adapter/status tracker.

## Integration Boundary

The module should not own signing, custody, or broadcasting. Those responsibilities stay with WDK wallet and protocol modules. This module consumes transaction evidence and returns normalized receipt state.

Expected upstream data sources:

- WDK wallet transaction result.
- WDK status tracker or indexer result.
- Ecommerce checkout reference.
- Wallet app payment metadata.

## Current Proof of Work

This repository already includes a smaller version of the state model:

- `src/commerce/checkout.ts`: checkout, confirmation, and receipt behavior.
- `src/wdk/payment-adapter.ts`: WDK-facing adapter interface.
- `src/commerce/demo.ts`: reviewer-friendly checkout confirmation and receipt flow.
- `test/wdk-commerce-demo.test.ts`: executable demo flow test.

## Milestones

### M1: Module Design and Compatibility

Deliver:

- Final module interface.
- WDK manager compatibility notes.
- Bare runtime compatibility notes.
- Test fixture plan.

### M2: Implementation and Testing

Deliver:

- TypeScript module source.
- Type definitions.
- JSDoc.
- Brittle test suite.
- Example usage script.

### M3: Final Delivery

Deliver:

- Installation and usage documentation.
- API reference.
- Demo script or 2-5 minute video.
- Pull request to the appropriate Tether GitHub repository.

## Out of Scope

- Custody or key management.
- Transaction signing.
- Transaction broadcasting.
- Full ecommerce storefront.
- Merchant analytics dashboard.
- Compliance or tax reporting.

