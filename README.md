# ProofPay for Solana

ProofPay is an open-source Solana Pay proof-of-work receipt tool for contributor payments, DAO work, bounties, grants, and AI-assisted deliveries.

The goal is simple: connect a delivered work item to an on-chain Solana payment so builders and communities can share a public receipt instead of chasing screenshots, wallet transfers, and scattered links.

## What It Does

- Create a payment request with recipient, token, amount, title, and proof URL.
- Generate a Solana Pay compatible payment URL.
- Attach proof of work such as a GitHub PR, demo, document, or delivery link.
- Turn a verified transaction signature into a public receipt path.
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
