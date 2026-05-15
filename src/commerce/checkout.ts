import type {
  CheckoutOrder,
  CommerceReceipt,
  CommerceToken,
  CreateCheckoutOrderInput,
  PaymentConfirmation,
  PaymentIntent
} from "./types.js";

export function createCheckoutOrder(
  input: CreateCheckoutOrderInput
): CheckoutOrder {
  validateCheckoutInput(input);

  const id = `order_${randomId()}`;
  const totalAmount = normalizeAmount(input.unitPrice * input.quantity);
  const paymentIntent: PaymentIntent = {
    id: `intent_${id}`,
    orderId: id,
    merchantAddress: input.merchantAddress,
    amount: totalAmount,
    token: input.token,
    reference: id
  };

  return {
    ...input,
    id,
    status: "pending",
    totalAmount,
    paymentIntent,
    createdAt: new Date().toISOString()
  };
}

export function confirmOrderPayment(
  order: CheckoutOrder,
  confirmation: PaymentConfirmation
): CheckoutOrder {
  if (confirmation.intentId !== order.paymentIntent.id) {
    throw new Error("payment intent mismatch");
  }
  if (confirmation.amount !== order.totalAmount) {
    throw new Error("payment amount mismatch");
  }
  if (confirmation.token !== order.token) {
    throw new Error("payment token mismatch");
  }
  if (confirmation.reference !== order.id) {
    throw new Error("payment reference mismatch");
  }
  if (!confirmation.signature.trim()) {
    throw new Error("payment signature is required");
  }

  return {
    ...order,
    status: "paid",
    paymentConfirmation: confirmation
  };
}

export function createCommerceReceipt(order: CheckoutOrder): CommerceReceipt {
  if (order.status !== "paid" || !order.paymentConfirmation) {
    throw new Error("order must be paid");
  }

  return {
    orderId: order.id,
    productName: order.productName,
    amount: order.totalAmount,
    token: order.token,
    signature: order.paymentConfirmation.signature,
    publicPath: `/commerce/receipts/${order.id}`,
    issuedAt: order.paymentConfirmation.confirmedAt
  };
}

function validateCheckoutInput(input: CreateCheckoutOrderInput): void {
  if (!input.productName.trim()) {
    throw new Error("productName is required");
  }
  if (!Number.isFinite(input.unitPrice) || input.unitPrice <= 0) {
    throw new Error("unitPrice must be greater than 0");
  }
  if (!Number.isInteger(input.quantity) || input.quantity <= 0) {
    throw new Error("quantity must be greater than 0");
  }
  if (!isCommerceToken(input.token)) {
    throw new Error("unsupported commerce token");
  }
  if (!input.merchantAddress.trim()) {
    throw new Error("merchantAddress is required");
  }

  try {
    new URL(input.proofUrl);
  } catch {
    throw new Error("proofUrl must be a valid URL");
  }
}

function isCommerceToken(token: string): token is CommerceToken {
  return ["USDT", "USDC"].includes(token);
}

function normalizeAmount(amount: number): number {
  return Math.round(amount * 100_000_000) / 100_000_000;
}

function randomId(): string {
  const bytes = new Uint8Array(8);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}
