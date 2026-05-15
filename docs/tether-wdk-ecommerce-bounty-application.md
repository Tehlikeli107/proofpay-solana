# Tether WDK in eCommerce Bounty Application

## Form Website

https://github.com/Tehlikeli107/proofpay-solana

## Relevant Experience

I am building ProofPay, an open-source TypeScript payment and receipt toolkit for crypto payment workflows. The repository already includes tested primitives for payment requests, verified receipts, USDt checkout orders, payment intents, payment confirmations, and a WDK-facing adapter boundary:

https://github.com/Tehlikeli107/proofpay-solana

I recently added a WDK Commerce Starter track specifically for this bounty. The current implementation includes:

- TypeScript commerce core for product, order, payment intent, confirmation, and receipt models.
- USDt support for Tether-focused checkout flows.
- A deterministic mock WDK payment adapter so reviewers can inspect the checkout state machine without a funded wallet.
- A static demo showing product, payment intent, and receipt states.
- Unit tests and TypeScript type checks.
- Statement of work and implementation plan for the WDK ecommerce integration.

The target platform for the bounty is a custom headless ecommerce reference implementation, which is explicitly within the bounty scope. I chose this target because it is the fastest way to create a clean, reusable integration that other merchants or platform plugin developers can adapt.

My proposed delivery path aligns with the bounty milestones:

M1 - Proposal and Platform Selection:
I will deliver the platform analysis, architecture document, target platform selection, and integration plan. This is already started in the repository through the WDK Commerce Starter design and statement of work.

M2 - Core Payment Flow:
I will extend the current mock-reviewed checkout flow into a WDK-powered payment flow with USDt payment creation, transaction signing/broadcasting integration, status tracking, and merchant/customer confirmation states on a supported network.

M3 - Final Delivery:
I will submit the complete public GitHub repository, setup documentation, architecture overview, merchant integration walkthrough, security considerations, and a 2-5 minute demo video showing the full cart-to-confirmation payment flow.

I have experience working with TypeScript, test-first development, open-source contribution workflows, and AI-assisted scoped execution. A recent open-source contribution is:

https://github.com/CapSoftware/Cap/pull/1821

For this bounty, I will keep the implementation modular and maintainable: ecommerce state and receipt logic stay in a pure TypeScript core, while WDK-specific signing, broadcasting, and transaction status tracking stay behind a small adapter boundary. This should make the reference implementation easier for non-blockchain-specialist merchants and developers to understand, run, and adapt.

## Optional Follow-Up Note

I accidentally submitted the general Tether grant form first with the same project direction. This bounty application is the correct targeted submission for WDK in eCommerce.

