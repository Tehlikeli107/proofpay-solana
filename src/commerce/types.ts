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

export type PaymentConfirmation = {
  intentId: string;
  amount: number;
  token: CommerceToken;
  reference: string;
  signature: string;
  confirmedAt: string;
};

export type CheckoutOrder = CreateCheckoutOrderInput & {
  id: string;
  status: "pending" | "paid";
  totalAmount: number;
  paymentIntent: PaymentIntent;
  createdAt: string;
  paymentConfirmation?: PaymentConfirmation;
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
