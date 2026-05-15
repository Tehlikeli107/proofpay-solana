# Tether Reviewer Guide

This guide is for reviewers of the WDK in eCommerce and WDK Module bounty applications connected to this repository.

## Repository

GitHub: https://github.com/Tehlikeli107/proofpay-solana

## Submitted Tether Bounties

### WDK in eCommerce

Proposed deliverable: a custom headless ecommerce reference implementation for self-custodial USDt checkout flows.

Current proof of work:

- USDt checkout order model.
- Payment intent model.
- Payment confirmation model.
- Receipt model.
- Mock WDK payment adapter boundary.
- Static demo showing product, payment intent, and receipt states.
- Tests for checkout and receipt behavior.

Next milestone after approval:

- Replace the deterministic mock adapter with a real WDK integration path.
- Add transaction signing, broadcasting, and status tracking on a supported network.
- Add merchant/customer confirmation UI.
- Record a 2-5 minute cart-to-confirmation demo video.

Application text: `docs/tether-wdk-ecommerce-bounty-application.md`

### WDK Module

Proposed deliverable: `wdk-protocol-payment-receipts`, a small WDK-compatible module for payment confirmation, receipt generation, and lightweight payment reporting.

Current proof of work:

- Payment request and receipt primitives.
- Commerce payment state modeling.
- Mock WDK adapter boundary.
- Clear module proposal and milestone map.

Next milestone after approval:

- Align module surface with WDK module architecture and manager conventions.
- Implement TypeScript definitions and JSDoc.
- Add brittle tests.
- Add usage examples and demo script.
- Submit a pull request to the appropriate Tether GitHub repository after scope alignment.

Application text: `docs/tether-wdk-module-bounty-application.md`

## How to Review Locally

```powershell
npm install
npm test
npm run typecheck
```

Expected result:

- All tests pass.
- TypeScript typecheck completes without errors.

## Key Files

- `src/core/payment-request.ts`: generic payment request and receipt primitives.
- `src/commerce/checkout.ts`: checkout order, payment confirmation, and commerce receipt logic.
- `src/wdk/payment-adapter.ts`: WDK-facing adapter interface plus deterministic mock adapter.
- `src/commerce/demo.ts`: executable reviewer demo flow.
- `test/commerce-checkout.test.ts`: checkout and receipt tests.
- `test/wdk-payment-adapter.test.ts`: mock adapter tests.
- `test/wdk-commerce-demo.test.ts`: end-to-end mock checkout confirmation and receipt demo test.
- `web/index.html`: static reviewer demo.

## Current Scope Boundary

The current repository intentionally does not claim to process live funds. It demonstrates the payment state machine, receipt model, and WDK adapter boundary in a testable form. The real WDK signing, broadcasting, and status tracking work is the next milestone proposed for the bounty agreement.

## Runnable Demo Flow

```powershell
npm test -- wdk-commerce-demo
```

This runs the reviewer-friendly checkout flow from `src/commerce/demo.ts`:

1. Create a mock WDK merchant address.
2. Create a USDt checkout order.
3. Create a WDK-shaped payment intent.
4. Confirm payment through the mock WDK adapter.
5. Generate a commerce receipt.

## Why This Is Useful

WDK ecommerce and wallet developers need repeatable patterns for checkout state, payment confirmation, and receipt evidence. This repository keeps those concerns small and modular so a real WDK integration can be added without rewriting the commerce domain model.
