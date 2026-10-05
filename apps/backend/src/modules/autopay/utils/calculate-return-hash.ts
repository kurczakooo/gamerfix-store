import { createHash } from "crypto";

type CalculateReturnHashOptions = {
  secret: string;
  separator: string;
};

export function calculateReturnHash(
  serviceId: string,
  orderId: string,
  { secret, separator }: CalculateReturnHashOptions,
): string {
  const paymentData = [serviceId, orderId, secret].join(separator);

  return createHash("sha256").update(paymentData).digest("hex");
}
