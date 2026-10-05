import { createHash } from "crypto";

type AutopayHashOptions = {
  serviceId: string;
  secret: string;
  separator: string;
};

export function calculateHash(
  orderId: string,
  amount: number,
  description: string,
  customerEmail: string,
  { serviceId, secret, separator }: AutopayHashOptions,
): string {
  const paymentData = [
    serviceId,
    orderId,
    amount,
    description,
    customerEmail,
    secret,
  ].join(separator);
  return createHash("sha256").update(paymentData).digest("hex");
}
