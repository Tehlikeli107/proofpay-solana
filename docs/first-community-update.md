# ProofPay Community Update 1

## Summary

ProofPay for Solana has started as a small open-source Solana Pay tool for linking delivered work to on-chain payment verification and public receipts.

## Shipped

- Created the initial repository structure.
- Added the grant-facing design document.
- Added a tested TypeScript core for payment requests, Solana Pay URLs, and verified receipt records.
- Added a static product page for reviewer context.
- Added milestone and weekly update templates.

## Evidence

- Tests: `npm test`
- Typecheck: `npm run typecheck`
- Design: `docs/proofpay-design.md`
- Milestones: `docs/milestones.md`

## Next

- Add wallet connection.
- Add payment request creation UI.
- Render Solana Pay QR codes.
- Add transaction verification through Solana RPC.
