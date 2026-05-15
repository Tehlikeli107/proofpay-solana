# Tether Scope Alignment Note

This note can be used if the Tether team replies and asks to refine scope before a bounty agreement.

## Short Reply

Thank you for reviewing the applications. I submitted two related but separate scopes:

- WDK in eCommerce: a custom headless ecommerce reference implementation for USDt checkout, confirmation UI, documentation, and demo video.
- WDK Module: `wdk-protocol-payment-receipts`, a smaller reusable module focused on payment confirmation, receipt generation, and lightweight payment reporting.

The current repository contains a testable foundation for both scopes:

https://github.com/Tehlikeli107/proofpay-solana

It currently uses a deterministic mock WDK adapter so the checkout state machine, payment confirmation, and receipt model can be reviewed without live funds. I do not consider this the final WDK integration. The proposed next milestone is to align with the WDK team on the exact module/manager conventions and replace the mock adapter with real WDK signing, broadcasting, and status tracking where required by the selected bounty scope.

## Scope Preference

If Tether prefers a smaller first deliverable, I recommend starting with the WDK Module bounty:

`wdk-protocol-payment-receipts`

Reason:

- It is smaller than a full ecommerce reference implementation.
- It can be useful across ecommerce, wallet, and agent payment flows.
- It cleanly avoids custody/signing responsibilities.
- It matches the WDK Module bounty's analytics/reporting and module architecture requirements.

If Tether prefers a more user-facing deliverable, the WDK in eCommerce bounty is the better fit.

## Questions for Tether

1. Which WDK repository should the final pull request target?
2. What is the preferred module naming convention for payment/receipt modules?
3. Which WDK manager interface should this module implement?
4. Which supported network should be used for the first USDt transaction demo?
5. Should the first version use WDK Indexer API directly for status tracking, or should it consume status through an existing WDK manager?

