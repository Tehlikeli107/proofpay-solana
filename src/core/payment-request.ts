export type PaymentToken = "SOL" | "USDC" | "USDG" | "USDT";

export type CreatePaymentRequestInput = {
  recipient: string;
  amount: number;
  token: PaymentToken;
  title: string;
  proofUrl: string;
};

export type PaymentRequest = CreatePaymentRequestInput & {
  id: string;
  status: "pending" | "verified";
  createdAt: string;
};

export type VerifiedTransaction = {
  signature: string;
  slot: number;
  verifiedAt: string;
};

export type PaymentReceipt = PaymentRequest &
  VerifiedTransaction & {
    requestId: string;
    publicPath: string;
    status: "verified";
  };

export function createPaymentRequest(
  input: CreatePaymentRequestInput
): PaymentRequest {
  validatePaymentRequest(input);

  return {
    ...input,
    id: `proofpay_${randomId()}`,
    status: "pending",
    createdAt: new Date().toISOString()
  };
}

export function generateSolanaPayUrl(input: {
  recipient: string;
  amount: number;
  label: string;
  memo: string;
}): string {
  if (!input.recipient.trim()) {
    throw new Error("recipient is required");
  }
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error("amount must be greater than 0");
  }

  const params = new URLSearchParams({
    amount: String(input.amount),
    label: input.label,
    memo: input.memo
  });

  return `solana:${input.recipient}?${params.toString()}`;
}

export function createReceipt(
  request: PaymentRequest,
  transaction: VerifiedTransaction
): PaymentReceipt {
  if (!transaction.signature.trim()) {
    throw new Error("signature is required");
  }

  return {
    ...request,
    ...transaction,
    requestId: request.id,
    status: "verified",
    publicPath: `/receipts/${request.id}`
  };
}

function validatePaymentRequest(input: CreatePaymentRequestInput): void {
  if (!input.recipient.trim()) {
    throw new Error("recipient is required");
  }
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error("amount must be greater than 0");
  }
  if (!["SOL", "USDC", "USDG", "USDT"].includes(input.token)) {
    throw new Error("unsupported token");
  }
  if (!input.title.trim()) {
    throw new Error("title is required");
  }

  try {
    new URL(input.proofUrl);
  } catch {
    throw new Error("proofUrl must be a valid URL");
  }
}

function randomId(): string {
  const bytes = new Uint8Array(8);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}
