# ProofPay for Solana

ProofPay is an open-source Solana Pay proof-of-work receipt tool for contributor payments, DAO work, bounties, grants, and AI-assisted deliveries.

The goal is simple: connect a delivered work item to an on-chain Solana payment so builders and communities can share a public receipt instead of chasing screenshots, wallet transfers, and scattered links.

## What It Does

- Create a payment request with recipient, token, amount, title, and proof URL.
- Generate a Solana Pay compatible payment URL.
- Attach proof of work such as a GitHub PR, demo, document, or delivery link.
- Turn a verified transaction signature into a public receipt path.
- Model USDt checkout orders, payment intents, confirmations, and receipts for a Tether WDK commerce starter.
- Keep the core logic testable and reusable for a future web dashboard.

## Why Solana

Solana is well suited for small, fast contributor payments because transactions are cheap and payment confirmation can be verified on-chain. ProofPay uses that strength for DAO contributor payouts, bounty deliverables, grant milestones, and independent service payments.

## MVP Status

This repository currently contains the first grant proof-of-work package:

- TypeScript payment request core
- Solana Pay URL generation
- Verified receipt model
- Unit tests
- Grant design document
- Milestone and update templates
- Static demo landing page in `web/`

## Commands

```powershell
npm install
npm test
npm run typecheck
```

## Tether Submissions

This repository supports two Tether WDK bounty applications:

- WDK in eCommerce: a custom headless ecommerce reference implementation for USDt checkout flows.
- WDK Module: `wdk-protocol-payment-receipts`, a smaller module proposal for payment confirmation, receipt generation, and lightweight payment reporting.

Reviewer materials:

- `docs/tether-reviewer-guide.md`
- `docs/tether-demo-video-script.md`
- `docs/tether-wdk-ecommerce-bounty-application.md`
- `docs/tether-wdk-module-bounty-application.md`

## WDK Commerce Starter

WDK Commerce Starter is the Tether-focused commerce demo for ProofPay. It shows a cloneable USDt checkout flow with product, order, payment intent, deterministic mock WDK confirmation, and receipt output.

The first milestone uses a mock WDK adapter so reviewers can run the flow without funded wallets. The adapter boundary is intentionally small so a real WDK module can replace the mock in the next milestone.

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
  proofUrl: "https://github.com/Tehlikeli107/proofpay-solana"
});

const confirmation = await adapter.checkPayment(order.paymentIntent.id);
const paidOrder = confirmOrderPayment(order, {
  ...confirmation,
  amount: order.totalAmount
});
const receipt = createCommerceReceipt(paidOrder);
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
  title: "Cap web-backend test coverage",
  proofUrl: "https://github.com/CapSoftware/Cap/pull/1821"
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

## Roadmap

1. Add wallet connect and payment request creation UI.
2. Add QR code rendering for Solana Pay links.
3. Add transaction verification through Solana RPC.
4. Add public receipt pages.
5. Deploy the MVP and publish a demo video.

## Grant Context

ProofPay was proposed for the Solana Foundation Turkey Grants program as a small, shippable payments and DAO tooling project. The requested MVP focuses on speed, proof of work, and open-source composability.
