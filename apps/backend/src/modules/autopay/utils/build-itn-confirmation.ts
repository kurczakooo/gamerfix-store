import { createHash } from "crypto";

type Confirmation = "CONFIRMED" | "NOTCONFIRMED";

type BuildConfirmationInput = {
  serviceId: string;
  orderId: string;
  confirmation: Confirmation;
  secret: string;
  separator: string;
};

export function buildAutopayConfirmation({
  serviceId,
  orderId,
  confirmation,
  secret,
  separator,
}: BuildConfirmationInput): string {
  const hashInput = [serviceId, orderId, confirmation, secret].join(separator);

  const hash = createHash("sha256").update(hashInput, "utf8").digest("hex");

  return `<?xml version="1.0" encoding="UTF-8"?>
<confirmationList>
  <serviceID>${escapeXml(serviceId)}</serviceID>
  <transactionsConfirmations>
    <transactionConfirmed>
      <orderID>${escapeXml(orderId)}</orderID>
      <confirmation>${confirmation}</confirmation>
    </transactionConfirmed>
  </transactionsConfirmations>
  <hash>${hash}</hash>
</confirmationList>`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
