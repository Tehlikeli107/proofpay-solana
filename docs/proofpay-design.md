# ProofPay for Solana Design

## Purpose

ProofPay links delivered work to Solana-native payments. A builder creates a payment request, attaches proof of work, shares a Solana Pay compatible payment link or QR code, and receives a public receipt once the transaction is verified.

## Grant Fit

The project targets Solana Foundation Turkey grant focus areas:

- Payments: Solana Pay payment links and receipt verification.
- DAO tooling: transparent contributor payment records.
- Developer tooling: a small open-source core that other bounty, DAO, and grant tools can reuse.

## MVP Scope

The first MVP stays intentionally small:

- Create payment requests with recipient, token, amount, title, and proof URL.
- Generate Solana Pay compatible transfer URLs.
- Normalize request data into public receipt records.
- Verify transaction status through a pluggable verification interface.
- Publish a simple web demo and documentation.

## Architecture

- `src/core`: pure TypeScript domain logic for request validation, Solana Pay URL generation, and receipt creation.
- `src/app`: later web UI layer. It should call `src/core` rather than duplicating payment logic.
- `docs`: grant-facing plan, weekly updates, and launch notes.

Pure core functions come first because they are easy to test and useful even if the UI changes.

## Success Criteria

By the end of the grant period:

- A live MVP exists.
- The repository is public or reviewable.
- At least 10 payment requests can be created.
- At least 5 receipts are verified on Solana devnet or mainnet.
- The project includes a short demo and setup documentation.
