import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { timingSafeEqual } from "crypto";

import { calculateReturnHash } from "../../../modules/autopay/utils/calculate-return-hash";

const AUTOPAY_SERVICE_ID = process.env.AUTOPAY_SERVICE_ID!;
const AUTOPAY_SECRET = process.env.AUTOPAY_KEY!;
const AUTOPAY_SEPARATOR = process.env.AUTOPAY_SEPARATOR!;

// const STORE_URL = process.env.STORE_URL!;
const STORE_URL = "https://gamerfix.pl";

function hashesMatch(actual: string, expected: string): boolean {
  const actualBuffer = Buffer.from(actual.toLowerCase(), "utf8");
  const expectedBuffer = Buffer.from(expected.toLowerCase(), "utf8");

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualBuffer, expectedBuffer);
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const serviceId = String(req.query.ServiceID || "");
  const orderId = String(req.query.OrderID || "");
  const receivedHash = String(req.query.Hash || "");

  if (!serviceId || !orderId || !receivedHash) {
    return res.status(400).send("Missing Autopay return parameters");
  }

  // 1. Verify ServiceID
  if (serviceId !== AUTOPAY_SERVICE_ID) {
    console.error("Autopay return: invalid ServiceID");

    return res.status(400).send("Invalid ServiceID");
  }

  // 2. Verify Hash
  const expectedHash = calculateReturnHash(serviceId, orderId, {
    secret: AUTOPAY_SECRET,
    separator: AUTOPAY_SEPARATOR,
  });

  if (!hashesMatch(receivedHash, expectedHash)) {
    console.error("Autopay return: invalid hash");

    return res.status(400).send("Invalid Hash");
  }

  // 3. Resolve Medusa Query
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  // Autopay OrderID looks like:
  // 57_TCNXMPCWEB
  //
  // The first part is Medusa's display_id.
  const displayId = orderId.split("_")[0];

  if (!displayId || !/^\d+$/.test(displayId)) {
    console.error("Autopay return: invalid OrderID", orderId);

    return res.status(400).send("Invalid OrderID");
  }

  // 4. Find Medusa order
  const { data: orders } = await query.graph({
    entity: "order",
    fields: ["id", "display_id", "shipping_address.country_code"],
    filters: {
      display_id: Number(displayId),
    },
  });

  const order = orders[0];

  if (!order) {
    console.error("Autopay return: order not found", {
      orderId,
      displayId,
    });

    return res.status(404).send("Order not found");
  }

  // 5. Country code
  const countryCode = order.shipping_address?.country_code?.toLowerCase();

  if (!countryCode) {
    console.error("Autopay return: order has no country code", order.id);

    return res.status(500).send("Order has no country code");
  }

  // 6. Redirect customer back to storefront
  const redirectUrl = `${STORE_URL}/${countryCode}/order/${order.id}/confirmed`;

  return res.redirect(302, redirectUrl);
}
