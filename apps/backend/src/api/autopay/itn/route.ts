import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

import { parseAutopayItn } from "../../../modules/autopay/utils/parse-itn";
import { calculateItnHash } from "../../../modules/autopay/utils/calculate-itn-hash";
import { captureAutopayPayment } from "../../../modules/autopay/utils/capture-autopay-payment";
import { buildAutopayConfirmation } from "../../../modules/autopay/utils/build-itn-confirmation";

const AUTOPAY_SERVICE_ID = process.env.AUTOPAY_SERVICE_ID!;
const AUTOPAY_SECRET = process.env.AUTOPAY_KEY!;
const AUTOPAY_SEPARATOR = process.env.AUTOPAY_SEPARATOR!;

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const encodedTransactions = (
      req.body as {
        transactions?: string;
      }
    )?.transactions;

    if (typeof encodedTransactions !== "string") {
      console.error("Autopay ITN: missing transactions");

      return res.status(400).send("Missing transactions");
    }

    const itn = parseAutopayItn(encodedTransactions);

    // 1. Validate service ID
    if (itn.serviceID !== AUTOPAY_SERVICE_ID) {
      console.error("Autopay ITN: invalid service ID");

      return res
        .status(200)
        .type("application/xml")
        .send(
          buildAutopayConfirmation({
            serviceId: itn.serviceID,
            orderId: itn.transaction.remoteID,
            confirmation: "NOTCONFIRMED",
            secret: AUTOPAY_SECRET,
            separator: AUTOPAY_SEPARATOR,
          }),
        );
    }

    // 2. Validate hash
    const expectedHash = calculateItnHash(
      itn.serviceID,
      itn.transaction.orderID,
      itn.transaction.remoteID,
      itn.transaction.amount,
      itn.transaction.currency,
      itn.transaction.gatewayID,
      itn.transaction.paymentDate,
      itn.transaction.paymentStatus,
      itn.transaction.paymentStatusDetails,
      {
        secret: AUTOPAY_SECRET,
        separator: AUTOPAY_SEPARATOR,
      },
    );

    const hashValid = expectedHash.toLowerCase() === itn.hash.toLowerCase();

    if (!hashValid) {
      console.error("Autopay ITN: invalid hash");

      return res
        .status(200)
        .type("application/xml")
        .send(
          buildAutopayConfirmation({
            serviceId: itn.serviceID,
            orderId: itn.transaction.orderID,
            confirmation: "NOTCONFIRMED",
            secret: AUTOPAY_SECRET,
            separator: AUTOPAY_SEPARATOR,
          }),
        );
    }

    // 3. SUCCESS
    if (itn.transaction.paymentStatus === "SUCCESS") {
      await captureAutopayPayment(req.scope, itn.transaction.orderID);
    }

    // 4. Confirmation
    const confirmation = buildAutopayConfirmation({
      serviceId: itn.serviceID,
      orderId: itn.transaction.orderID,
      confirmation: "CONFIRMED",
      secret: AUTOPAY_SECRET,
      separator: AUTOPAY_SEPARATOR,
    });

    return res
      .status(200)
      .setHeader("Content-Type", "application/xml; charset=UTF-8")
      .send(confirmation);
  } catch (error) {
    console.error("AUTOPAY ITN ERROR:", error);

    return res.status(500).send("ITN processing error");
  }
}
