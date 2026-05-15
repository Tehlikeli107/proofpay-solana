# WDK Commerce Starter Design

## Purpose

WDK Commerce Starter is a small open-source reference implementation for self-custodial stablecoin checkout flows using Tether WDK. It shows how a merchant can present a product, collect a USDt payment request, confirm payment state, and publish a receipt without depending on custodial checkout infrastructure.

The project is designed as a sponsor-specific extension of ProofPay: ProofPay provides the payment request, proof, and receipt model; WDK Commerce Starter demonstrates that model in an e-commerce checkout experience aligned with Tether's WDK in eCommerce bounty.

## Sponsor Fit

Tether's WDK in eCommerce bounty says e-commerce platforms lack a reference implementation for self-custodial crypto payments, checkout flows, payment confirmations, and embedded wallet experiences. This starter directly targets that gap.

The deliverable should make it easy for a reviewer to see:

- How WDK can be wired into a checkout-style flow.
- How a merchant would model orders and payment status.
- How a buyer or automated agent could complete a payment.
- How payment evidence becomes a receipt.
- How another developer can clone, run, and adapt the starter.

## MVP Scope

The first MVP is intentionally narrow:

- A static product catalog with one sample item.
- A checkout flow that creates an order and payment request.
- A WDK adapter boundary that can run in mock mode first and real WDK mode in a subsequent milestone.
- A receipt model that links order, payment request, and confirmation evidence.
- A local demo page and CLI-friendly core tests.
- Documentation for merchant integration and bounty submission.

The MVP does not process real customer funds. The first implementation uses deterministic mock payment confirmation so the flow is reviewable without a funded wallet. Real WDK integration is isolated behind an adapter so the next milestone can replace the mock without rewriting the checkout domain model.

## Architecture

The implementation is split into three layers:

- `src/commerce`: pure TypeScript order, checkout, payment state, and receipt logic.
- `src/wdk`: WDK-facing adapter interface plus a mock adapter for local demos.
- `web`: a lightweight static demo that imports or mirrors the core flow for reviewer context.

The pure commerce core stays independent from WDK runtime details. That keeps the project testable, and it avoids building a fragile demo around a changing beta SDK surface. WDK-specific code enters through a small interface:

```ts
export interface WalletPaymentAdapter {
  createAddress(): Promise<string>;
  createPaymentIntent(input: PaymentIntentInput): Promise<PaymentIntent>;
  checkPayment(intentId: string): Promise<PaymentConfirmation>;
}
```

## Data Flow

1. Buyer selects a sample product.
2. Checkout core creates an order with `pending` status.
3. WDK adapter creates a payment intent for the merchant address, token, amount, and order reference.
4. Checkout core stores the intent on the order and returns a buyer-facing payment instruction.
5. Confirmation checks move the order to `paid` only when the adapter returns matching amount, token, and order reference.
6. Receipt creation publishes an immutable receipt object with order id, amount, token, payment evidence, and proof URL.

## Error Handling

The core rejects:

- Empty product names.
- Non-positive prices.
- Unsupported tokens.
- Missing merchant address.
- Payment confirmations with wrong amount, token, or order reference.
- Duplicate receipt creation for unpaid orders.

Errors should be returned as typed validation results in domain functions where possible. Throwing is acceptable only for impossible programmer errors in the adapter boundary.

## Testing

The first implementation uses TDD around the commerce core:

- Order creation validates product, token, amount, and merchant address.
- Checkout creates a pending order and payment intent.
- Confirmation rejects wrong amount or token.
- Confirmation marks a matching payment as paid.
- Receipt creation requires a paid order.
- Mock WDK adapter returns deterministic buyer and payment data.

All tests run with the existing `npm test` command.

## Success Criteria

The MVP is successful when:

- `npm test` and `npm run typecheck` pass.
- A reviewer can read the README and understand the Tether WDK bounty fit in under two minutes.
- The demo shows product, checkout, payment status, and receipt states.
- The code clearly separates merchant checkout logic from WDK adapter logic.
- The repository can be linked in a Tether WDK in eCommerce bounty application.

## Out of Scope

- Custodial payment processing.
- Real mainnet payments.
- KYC, tax, compliance, refunds, disputes, and chargebacks.
- Full Shopify/WooCommerce plugins.
- Production wallet key management.
