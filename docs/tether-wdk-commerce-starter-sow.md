# Statement of Work: WDK Commerce Starter

## Applicant

Salih Can Kurnaz  
GitHub: https://github.com/Tehlikeli107  
Project repository: https://github.com/Tehlikeli107/proofpay-solana

## Project Summary

WDK Commerce Starter is an open-source reference implementation for self-custodial USDt checkout flows using Tether WDK. It demonstrates how a merchant can present a product, create a checkout order, generate a payment intent, confirm payment state, and publish a receipt without relying on custodial checkout infrastructure.

The project extends the existing ProofPay repository, which already includes tested payment request and receipt primitives. WDK Commerce Starter will adapt those primitives into an e-commerce starter that other developers can clone, run, and modify for merchant payments or agent-driven purchases.

## Problem

Developers who want to accept USDt in e-commerce flows currently need to assemble wallet logic, order state, payment confirmation, and receipt handling themselves. This creates fragmented integrations and slows adoption of self-custodial stablecoin payments.

Tether WDK provides the wallet infrastructure foundation. This starter focuses on the missing application layer: a practical checkout flow with clear merchant-facing code, payment-state modeling, and documentation.

## Deliverables

1. A TypeScript commerce core for product, order, payment intent, payment confirmation, and receipt models.
2. A WDK adapter boundary with a deterministic mock adapter for local review and future real WDK integration.
3. A working checkout demo that shows product selection, payment status, and receipt output.
4. Unit tests covering successful checkout, invalid payment confirmations, unpaid receipt rejection, and adapter behavior.
5. Developer documentation explaining how merchants can adapt the starter and where WDK integration fits.
6. A short reviewer guide with setup commands, architecture notes, and milestone evidence.

## Milestones

### Milestone 1: Commerce Core

Create the core TypeScript models and tests for product validation, order creation, payment intents, payment confirmation, and receipts.

Evidence: passing `npm test` and `npm run typecheck`.

### Milestone 2: WDK Adapter Boundary

Add a wallet payment adapter interface and deterministic mock WDK adapter. The adapter will make the checkout demo reviewable without requiring a funded wallet, while keeping the boundary ready for a real WDK module.

Evidence: adapter tests and documentation describing the integration point.

### Milestone 3: Checkout Demo

Build a lightweight demo showing a sample product, checkout state, payment instruction, confirmation, and receipt. The demo will be suitable for reviewers and developers evaluating the starter.

Evidence: demo page, screenshots, and setup instructions.

### Milestone 4: Documentation and Submission Package

Update the README and add merchant integration notes so developers can clone the repository and understand how to adapt the starter for USDt e-commerce flows.

Evidence: repository documentation, final milestone summary, and public GitHub link.

## Budget Request

3,000 USDt

This request matches the scope of the WDK in eCommerce reference implementation and covers development, testing, documentation, and demo preparation.

## Estimated Duration

Less than 1 month

## Technical Support

No required technical support is needed to complete the mock-reviewed MVP. Feedback from the Tether WDK team would be welcome for aligning the adapter boundary with preferred WDK patterns before a real-payment milestone.

