import { createMockWdkPaymentAdapter } from "../wdk/index.js";
import {
  confirmOrderPayment,
  createCheckoutOrder,
  createCommerceReceipt
} from "./checkout.js";
import type {
  CheckoutOrder,
  CommerceReceipt,
  PaymentConfirmation
} from "./types.js";

export type WdkCommerceDemoResult = {
  merchantAddress: string;
  order: CheckoutOrder;
  confirmation: PaymentConfirmation;
  paidOrder: CheckoutOrder;
  receipt: CommerceReceipt;
};

export async function runWdkCommerceDemo(): Promise<WdkCommerceDemoResult> {
  const adapter = createMockWdkPaymentAdapter();
  const merchantAddress = await adapter.createAddress();
  const order = createCheckoutOrder({
    productName: "WDK Commerce Starter Demo",
    unitPrice: 42,
    quantity: 1,
    token: "USDT",
    merchantAddress,
    proofUrl: "https://github.com/Tehlikeli107/proofpay-solana"
  });
  const paymentIntent = await adapter.createPaymentIntent({
    orderId: order.id,
    merchantAddress,
    amount: order.totalAmount,
    token: order.token
  });
  const orderWithWdkIntent: CheckoutOrder = {
    ...order,
    paymentIntent
  };

  const confirmation = await adapter.checkPayment(
    orderWithWdkIntent.paymentIntent.id
  );
  const paidOrder = confirmOrderPayment(orderWithWdkIntent, confirmation);
  const receipt = createCommerceReceipt(paidOrder);

  return {
    merchantAddress,
    order: orderWithWdkIntent,
    confirmation,
    paidOrder,
    receipt
  };
}
