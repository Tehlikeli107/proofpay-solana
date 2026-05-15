# WDK Commerce Starter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a tested WDK Commerce Starter MVP that demonstrates self-custodial USDt checkout, payment confirmation, and receipt flows for the Tether grant submission.

**Architecture:** Add a pure TypeScript `src/commerce` core for products, orders, payment intents, confirmations, and receipts. Add a `src/wdk` adapter boundary with a deterministic mock adapter so the demo is reviewable before real WDK payment wiring. Update the static `web` demo and docs to show the Tether WDK e-commerce fit.

**Tech Stack:** TypeScript, Vitest, static HTML/CSS, existing ProofPay repository structure.

---

## File Structure

- Create `src/commerce/types.ts`: shared commerce types and token definitions.
- Create `src/commerce/checkout.ts`: pure checkout/order/confirmation/receipt functions.
- Create `src/commerce/index.ts`: public commerce exports.
- Create `src/wdk/payment-adapter.ts`: adapter interface and deterministic mock WDK adapter.
- Create `src/wdk/index.ts`: public WDK adapter exports.
- Create `test/commerce-checkout.test.ts`: tests for checkout core behavior.
- Create `test/wdk-payment-adapter.test.ts`: tests for adapter behavior.
- Modify `src/core/payment-request.ts`: add `USDT` to supported tokens.
- Modify `src/core/index.ts`: export commerce and WDK modules.
- Modify `README.md`: add WDK Commerce Starter section and commands.
- Modify `web/index.html`: show commerce starter demo flow.
- Modify `web/styles.css`: support the updated checkout demo.

## Task 1: Support USDt Token in ProofPay Core

**Files:**
- Modify: `src/core/payment-request.ts`
- Test: `test/payment-request.test.ts`

- [ ] **Step 1: Write the failing test**

Add this test inside `describe("payment request core", ...)` in `test/payment-request.test.ts`:

```ts
it("supports USDt requests for Tether commerce flows", () => {
  const request = createPaymentRequest({
    recipient: "merchant-usdt-address",
    amount: 19.99,
    token: "USDT",
    title: "WDK Commerce Starter order",
    proofUrl: "https://github.com/Tehlikeli107/proofpay-solana"
  });

  expect(request.token).toBe("USDT");
  expect(request.status).toBe("pending");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm test -- payment-request
```

Expected: TypeScript or runtime failure because `"USDT"` is not included in `PaymentToken`.

- [ ] **Step 3: Write minimal implementation**

Change the token type and validation in `src/core/payment-request.ts`:

```ts
export type PaymentToken = "SOL" | "USDC" | "USDG" | "USDT";
```

```ts
if (!["SOL", "USDC", "USDG", "USDT"].includes(input.token)) {
  throw new Error("unsupported token");
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```powershell
npm test -- payment-request
```

Expected: all payment request tests pass.

- [ ] **Step 5: Commit**

```powershell
git add src/core/payment-request.ts test/payment-request.test.ts
git commit -m "feat: support usdt payment requests"
```

## Task 2: Commerce Checkout Core

**Files:**
- Create: `src/commerce/types.ts`
- Create: `src/commerce/checkout.ts`
- Create: `src/commerce/index.ts`
- Test: `test/commerce-checkout.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `test/commerce-checkout.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  confirmOrderPayment,
  createCommerceReceipt,
  createCheckoutOrder
} from "../src/commerce/index.js";

describe("commerce checkout core", () => {
  it("creates a pending USDt checkout order", () => {
    const order = createCheckoutOrder({
      productName: "ProofPay Hoodie",
      unitPrice: 29,
      quantity: 2,
      token: "USDT",
      merchantAddress: "merchant-usdt-address",
      proofUrl: "https://github.com/Tehlikeli107/proofpay-solana"
    });

    expect(order.id).toMatch(/^order_/);
    expect(order.status).toBe("pending");
    expect(order.totalAmount).toBe(58);
    expect(order.paymentIntent.orderId).toBe(order.id);
    expect(order.paymentIntent.token).toBe("USDT");
  });

  it("rejects invalid product and amount inputs", () => {
    expect(() =>
      createCheckoutOrder({
        productName: "",
        unitPrice: 0,
        quantity: 0,
        token: "USDT",
        merchantAddress: "",
        proofUrl: "not-a-url"
      })
    ).toThrow("productName is required");
  });

  it("rejects payment confirmations with mismatched amount or token", () => {
    const order = createCheckoutOrder({
      productName: "ProofPay Hoodie",
      unitPrice: 29,
      quantity: 1,
      token: "USDT",
      merchantAddress: "merchant-usdt-address",
      proofUrl: "https://github.com/Tehlikeli107/proofpay-solana"
    });

    expect(() =>
      confirmOrderPayment(order, {
        intentId: order.paymentIntent.id,
        amount: 1,
        token: "USDT",
        reference: order.id,
        signature: "mock-signature",
        confirmedAt: "2026-05-15T00:00:00.000Z"
      })
    ).toThrow("payment amount mismatch");
  });

  it("marks a matching payment as paid and creates a receipt", () => {
    const order = createCheckoutOrder({
      productName: "ProofPay Hoodie",
      unitPrice: 29,
      quantity: 1,
      token: "USDT",
      merchantAddress: "merchant-usdt-address",
      proofUrl: "https://github.com/Tehlikeli107/proofpay-solana"
    });

    const paid = confirmOrderPayment(order, {
      intentId: order.paymentIntent.id,
      amount: 29,
      token: "USDT",
      reference: order.id,
      signature: "mock-signature",
      confirmedAt: "2026-05-15T00:00:00.000Z"
    });

    const receipt = createCommerceReceipt(paid);

    expect(paid.status).toBe("paid");
    expect(receipt.orderId).toBe(order.id);
    expect(receipt.publicPath).toBe(`/commerce/receipts/${order.id}`);
  });

  it("requires a paid order before creating a receipt", () => {
    const order = createCheckoutOrder({
      productName: "ProofPay Hoodie",
      unitPrice: 29,
      quantity: 1,
      token: "USDT",
      merchantAddress: "merchant-usdt-address",
      proofUrl: "https://github.com/Tehlikeli107/proofpay-solana"
    });

    expect(() => createCommerceReceipt(order)).toThrow("order must be paid");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm test -- commerce-checkout
```

Expected: module not found for `../src/commerce/index.js`.

- [ ] **Step 3: Write minimal implementation**

Create `src/commerce/types.ts`:

```ts
export type CommerceToken = "USDT" | "USDC";

export type CreateCheckoutOrderInput = {
  productName: string;
  unitPrice: number;
  quantity: number;
  token: CommerceToken;
  merchantAddress: string;
  proofUrl: string;
};

export type PaymentIntent = {
  id: string;
  orderId: string;
  merchantAddress: string;
  amount: number;
  token: CommerceToken;
  reference: string;
};

export type CheckoutOrder = CreateCheckoutOrderInput & {
  id: string;
  status: "pending" | "paid";
  totalAmount: number;
  paymentIntent: PaymentIntent;
  createdAt: string;
  paymentConfirmation?: PaymentConfirmation;
};

export type PaymentConfirmation = {
  intentId: string;
  amount: number;
  token: CommerceToken;
  reference: string;
  signature: string;
  confirmedAt: string;
};

export type CommerceReceipt = {
  orderId: string;
  productName: string;
  amount: number;
  token: CommerceToken;
  signature: string;
  publicPath: string;
  issuedAt: string;
};
```

Create `src/commerce/checkout.ts` with validation, order creation, confirmation, and receipt creation.

Create `src/commerce/index.ts`:

```ts
export * from "./checkout.js";
export * from "./types.js";
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```powershell
npm test -- commerce-checkout
```

Expected: commerce checkout tests pass.

- [ ] **Step 5: Commit**

```powershell
git add src/commerce test/commerce-checkout.test.ts
git commit -m "feat: add commerce checkout core"
```

## Task 3: WDK Payment Adapter Boundary

**Files:**
- Create: `src/wdk/payment-adapter.ts`
- Create: `src/wdk/index.ts`
- Test: `test/wdk-payment-adapter.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `test/wdk-payment-adapter.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createMockWdkPaymentAdapter } from "../src/wdk/index.js";

describe("mock WDK payment adapter", () => {
  it("creates deterministic merchant addresses and payment intents", async () => {
    const adapter = createMockWdkPaymentAdapter();
    const merchantAddress = await adapter.createAddress();
    const intent = await adapter.createPaymentIntent({
      orderId: "order_abc",
      merchantAddress,
      amount: 42,
      token: "USDT"
    });

    expect(merchantAddress).toBe("wdk_mock_merchant_usdt_address");
    expect(intent.id).toBe("wdk_intent_order_abc");
    expect(intent.reference).toBe("order_abc");
  });

  it("returns deterministic confirmation evidence for an intent", async () => {
    const adapter = createMockWdkPaymentAdapter();
    const confirmation = await adapter.checkPayment("wdk_intent_order_abc");

    expect(confirmation.intentId).toBe("wdk_intent_order_abc");
    expect(confirmation.signature).toBe("wdk_mock_signature_order_abc");
    expect(confirmation.reference).toBe("order_abc");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm test -- wdk-payment-adapter
```

Expected: module not found for `../src/wdk/index.js`.

- [ ] **Step 3: Write minimal implementation**

Create `src/wdk/payment-adapter.ts`:

```ts
import type {
  CommerceToken,
  PaymentConfirmation,
  PaymentIntent
} from "../commerce/index.js";

export type PaymentIntentInput = {
  orderId: string;
  merchantAddress: string;
  amount: number;
  token: CommerceToken;
};

export interface WalletPaymentAdapter {
  createAddress(): Promise<string>;
  createPaymentIntent(input: PaymentIntentInput): Promise<PaymentIntent>;
  checkPayment(intentId: string): Promise<PaymentConfirmation>;
}

export function createMockWdkPaymentAdapter(): WalletPaymentAdapter {
  return {
    async createAddress() {
      return "wdk_mock_merchant_usdt_address";
    },
    async createPaymentIntent(input) {
      return {
        id: `wdk_intent_${input.orderId}`,
        orderId: input.orderId,
        merchantAddress: input.merchantAddress,
        amount: input.amount,
        token: input.token,
        reference: input.orderId
      };
    },
    async checkPayment(intentId) {
      const reference = intentId.replace("wdk_intent_", "");
      return {
        intentId,
        amount: 42,
        token: "USDT",
        reference,
        signature: `wdk_mock_signature_${reference}`,
        confirmedAt: "2026-05-15T00:00:00.000Z"
      };
    }
  };
}
```

Create `src/wdk/index.ts`:

```ts
export * from "./payment-adapter.js";
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```powershell
npm test -- wdk-payment-adapter
```

Expected: adapter tests pass.

- [ ] **Step 5: Commit**

```powershell
git add src/wdk test/wdk-payment-adapter.test.ts
git commit -m "feat: add wdk payment adapter boundary"
```

## Task 4: Public Exports and Demo Documentation

**Files:**
- Modify: `src/core/index.ts`
- Modify: `README.md`
- Modify: `web/index.html`
- Modify: `web/styles.css`

- [ ] **Step 1: Export new modules**

Update `src/core/index.ts`:

```ts
export * from "./payment-request.js";
export * from "../commerce/index.js";
export * from "../wdk/index.js";
```

- [ ] **Step 2: Update README with WDK Commerce Starter section**

Add a section that includes:

```markdown
## WDK Commerce Starter

WDK Commerce Starter is the Tether-focused commerce demo for ProofPay. It shows a cloneable USDt checkout flow with product, order, payment intent, deterministic mock WDK confirmation, and receipt output.

The first milestone uses a mock WDK adapter so reviewers can run the flow without funded wallets. The adapter boundary is intentionally small so a real WDK module can replace the mock in the next milestone.
```

- [ ] **Step 3: Update static demo**

Add a WDK Commerce Starter section to `web/index.html` showing:

```html
<section class="commerce-flow">
  <h2>WDK Commerce Starter</h2>
  <div class="checkout-grid">
    <article>
      <span>Product</span>
      <strong>ProofPay Hoodie</strong>
      <p>29 USDt checkout demo</p>
    </article>
    <article>
      <span>Payment Intent</span>
      <strong>wdk_intent_order_demo</strong>
      <p>Merchant receives a USDt payment instruction through the WDK adapter boundary.</p>
    </article>
    <article>
      <span>Receipt</span>
      <strong>/commerce/receipts/order_demo</strong>
      <p>Confirmed payment evidence becomes a public receipt record.</p>
    </article>
  </div>
</section>
```

- [ ] **Step 4: Add styles**

Add responsive styles for `.commerce-flow` and `.checkout-grid` in `web/styles.css`.

- [ ] **Step 5: Run verification**

Run:

```powershell
npm test
npm run typecheck
git diff --check
```

Expected: tests and typecheck pass; no whitespace errors.

- [ ] **Step 6: Commit**

```powershell
git add src/core/index.ts README.md web/index.html web/styles.css
git commit -m "docs: present wdk commerce starter demo"
```

## Task 5: Final Verification and Push

**Files:**
- No new files.

- [ ] **Step 1: Run full verification**

Run:

```powershell
npm test
npm run typecheck
git status --short
```

Expected: tests pass, typecheck passes, and only intended files are cleanly committed.

- [ ] **Step 2: Push**

Run:

```powershell
git push
```

Expected: `main` updates on `https://github.com/Tehlikeli107/proofpay-solana`.

