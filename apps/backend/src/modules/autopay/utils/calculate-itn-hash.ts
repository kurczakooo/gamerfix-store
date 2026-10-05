import { createHash } from "crypto";

type CalculateItnHashOptions = {
  serviceId: string;
  secret: string;
  separator: string;
};

export function calculateItnHash(
  serviceId: string,
  orderId: string,
  remoteId: string,
  amount: string,
  currency: string,
  gatewayId: string,
  paymentDate: string,
  paymentStatus: string,
  paymentStatusDetails: string,
  { secret, separator }: CalculateItnHashOptions,
): string {
  const hashInput =
    [
      serviceId,
      orderId,
      remoteId,
      amount,
      currency,
      gatewayId,
      paymentDate,
      paymentStatus,
      paymentStatusDetails,
    ].join(separator) +
    separator +
    secret;

  return createHash("sha256").update(hashInput, "utf8").digest("hex");
}
