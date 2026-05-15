# Tether Demo Video Script

Target length: 2-5 minutes.

## Video Goal

Show that ProofPay has a working, testable foundation for WDK-powered USDt checkout and a smaller WDK payment receipt module proposal.

## Scene 1: Repository Context

Duration: 20-30 seconds.

Narration:

> This is ProofPay, an open-source TypeScript payment and receipt toolkit. For the Tether WDK bounties, I added a WDK Commerce Starter track and a smaller WDK payment receipts module proposal.

Show:

- GitHub repository homepage.
- README `WDK Commerce Starter` section.
- `Tether Submissions` section.

## Scene 2: Checkout State Model

Duration: 35-50 seconds.

Narration:

> The commerce core models a product, order, payment intent, payment confirmation, and receipt. This first milestone uses pure TypeScript so the payment state machine is easy to test before wiring real WDK signing and broadcasting.

Show:

- `src/commerce/checkout.ts`
- `src/commerce/types.ts`
- `test/commerce-checkout.test.ts`

Highlight:

- Pending order creation.
- Matching payment confirmation.
- Receipt creation only after payment is confirmed.

## Scene 3: WDK Adapter Boundary

Duration: 30-45 seconds.

Narration:

> WDK-specific functionality is isolated behind a small adapter boundary. The repository currently uses a deterministic mock adapter for review, and the approved milestone would replace this with real WDK transaction signing, broadcasting, and status tracking.

Show:

- `src/wdk/payment-adapter.ts`
- `test/wdk-payment-adapter.test.ts`

Highlight:

- `createAddress`
- `createPaymentIntent`
- `checkPayment`

## Scene 4: Static Demo

Duration: 30-45 seconds.

Narration:

> The static demo shows the intended reviewer-facing flow: product, payment intent, and receipt evidence. This is not a production payment processor yet; it is the reviewable foundation for the WDK ecommerce milestone.

Show:

- `web/index.html` opened in a browser.
- Product card.
- Payment intent card.
- Receipt card.

## Scene 5: Verification

Duration: 30-40 seconds.

Narration:

> The repository includes automated tests and TypeScript checks. These prove the checkout and receipt behavior is stable before the real WDK integration is added.

Run:

```powershell
npm test
npm run typecheck
```

Show:

- Passing Vitest output.
- Passing TypeScript output.

Optional focused demo command:

```powershell
npm test -- wdk-commerce-demo
```

## Scene 6: Bounty Fit

Duration: 30-45 seconds.

Narration:

> For WDK in eCommerce, the next milestone is a real WDK-powered checkout flow with signing, broadcasting, status tracking, documentation, and a complete cart-to-confirmation demo. For WDK Module, the smaller target is `wdk-protocol-payment-receipts`, focused on reusable payment confirmation and receipt reporting for WDK wallets and commerce flows.

Show:

- `docs/tether-reviewer-guide.md`
- `docs/wdk-protocol-payment-receipts-spec.md`
- `docs/tether-wdk-ecommerce-bounty-application.md`
- `docs/tether-wdk-module-bounty-application.md`

## Closing

Duration: 10-15 seconds.

Narration:

> The current proof of work is intentionally scoped and testable. With scope alignment from the Tether WDK team, the next step is to replace the mock adapter with real WDK integration and submit the final deliverables.
