# ProofPay for Solana

> **Project status:** experimental payments/tooling MVP. The repository demonstrates payment-request and receipt workflows, but it is not presented as a production payment processor, audited financial system, or completed Tether WDK integration.

ProofPay is a Solana Pay proof-of-work receipt tool for contributor payments, DAO work, bounties, grants, and AI-assisted deliveries.

The goal is simple: connect a delivered work item to an on-chain Solana payment so builders and communities can share a verifiable receipt instead of relying only on screenshots, wallet transfers, and scattered links.

## What It Does

- Create a payment request with recipient, token, amount, title, and proof URL.
- Generate a Solana Pay compatible payment URL.
- Attach proof of work such as a GitHub PR, demo, document, or delivery link.
- Turn a verified transaction signature into a receipt model/path.
- Model USDt checkout orders, payment intents, confirmations, and receipts for a Tether WDK commerce starter.
- Keep the core logic testable and reusable for a future web dashboard.

## Why Solana

Solana provides low-cost, fast-settlement primitives that are useful for small contributor payments. ProofPay explores how those primitives can be connected to explicit work evidence for DAO payouts, bounty deliverables, grant milestones, and independent service payments.

## MVP Status

This repository currently contains the first grant proof-of-work package:

- TypeScript payment request core
- Solana Pay URL generation
- receipt model
- unit tests
- grant design document
- milestone and update templates
- static demo landing page in `web/`

The current repository should be evaluated as an MVP/code artifact. Before production use, transaction verification, wallet handling, failure cases, RPC trust assumptions, token semantics, security review, and deployment behavior need dedicated validation.

## Commands

```powershell
npm install
npm test
npm run typecheck
```

## Tether Submission Materials

The repository contains materials prepared around two Tether WDK bounty directions:

- WDK in eCommerce: a custom headless ecommerce reference implementation for USDt checkout flows.
- WDK Module: `wdk-protocol-payment-receipts`, a smaller module proposal for payment confirmation, receipt generation, and lightweight payment reporting.

Reviewer materials:

- `docs/tether-reviewer-guide.md`
- `docs/tether-demo-video-script.md`
- `docs/wdk-protocol-payment-receipts-spec.md`
- `docs/tether-scope-alignment-note.md`
- `docs/tether-wdk-ecommerce-bounty-application.md`
- `docs/tether-wdk-module-bounty-application.md`

These documents describe proposal/submission work and should not be interpreted as evidence that a bounty was awarded, that WDK integration is complete, or that Tether endorses the project.

## WDK Commerce Starter

WDK Commerce Starter is the Tether-focused commerce demo for ProofPay. It shows a cloneable USDt checkout flow with product, order, payment intent, deterministic mock WDK confirmation, and receipt output.

The first milestone uses a mock WDK adapter so the flow can run without funded wallets. The adapter boundary is intentionally small so a real WDK module can replace the mock in a later milestone.

```ts
import {
  confirmOrderPayment,
  createCheckoutOrder,
  createCommerceReceipt,
  createMockWdkPaymentAdapter
} from "./src/core";

const adapter = createMockWdkPaymentAdapter();
const merchantAddress = await adapter.createAddress();

const order = createCheckoutOrder({
  productName: "ProofPay Hoodie",
  unitPrice: 29,
  quantity: 1,
  token: "USDT",
  merchantAddress,
  proofUrl: "https://github.com/salihcankurnaz/proofpay-solana"
});

const confirmation = await adapter.checkPayment(order.paymentIntent.id);
const paidOrder = confirmOrderPayment(order, {
  ...confirmation,
  amount: order.totalAmount
});
const receipt = createCommerceReceipt(paidOrder);
```

Reviewer/demo test:

```powershell
npm test -- wdk-commerce-demo
```

## Current Core API

```ts
import {
  createPaymentRequest,
  createReceipt,
  generateSolanaPayUrl
} from "./src/core/payment-request";

const request = createPaymentRequest({
  recipient: "7C7vHrLQYxF2S8hWcM7K8zM2zNyfHqQ6E9YBvrZ1h2bD",
  amount: 25,
  token: "USDC",
  title: "Example contributor task",
  proofUrl: "https://github.com/example/project/pull/123"
});

const paymentUrl = generateSolanaPayUrl({
  recipient: request.recipient,
  amount: request.amount,
  label: "ProofPay",
  memo: request.id
});

const receipt = createReceipt(request, {
  signature: "5VfUXiGdNcE1mP9iYh6jGkQp2wZk7dTnL4bQw2bHn8aR",
  slot: 123456,
  verifiedAt: new Date().toISOString()
});
```

## Security and Reliability Boundary

The code is a research/MVP surface, not a security audit. A production payment workflow should additionally address at least:

- authoritative transaction verification through a defined RPC strategy;
- token/mint validation;
- replay and duplicate-payment handling;
- wallet and key-management boundaries;
- confirmation/finality policy;
- malformed or adversarial proof URLs;
- amount/decimal handling;
- RPC outages and inconsistent responses;
- independent security review.

## Roadmap

1. Add wallet connect and payment request creation UI.
2. Add QR code rendering for Solana Pay links.
3. Add transaction verification through Solana RPC.
4. Add public receipt pages.
5. Deploy a testable MVP and preserve reproducible demo evidence.

## Grant Context

ProofPay was prepared as a small payments/DAO-tooling grant concept. Repository materials document the proposal and implementation direction; they do not by themselves establish grant acceptance or external validation.

## License status

No repository-level `LICENSE` file is currently committed. Until a license is explicitly selected and added, do not infer reuse rights from the repository being publicly visible.
