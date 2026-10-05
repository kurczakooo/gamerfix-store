import { capturePaymentWorkflow } from "@medusajs/medusa/core-flows";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import type { MedusaContainer } from "@medusajs/framework/types";

export async function captureAutopayPayment(
  scope: MedusaContainer,
  autopayOrderId: string,
) {
  // Autopay OrderID:
  // 57_TCNXMPCWEB

  const separatorIndex = autopayOrderId.indexOf("_");

  if (separatorIndex === -1) {
    throw new Error(`Invalid Autopay orderID: ${autopayOrderId}`);
  }

  const orderDisplayId = autopayOrderId.slice(0, separatorIndex);

  const query = scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: orders } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "display_id",
      "payment_collections.id",
      "payment_collections.amount",
      "payment_collections.captured_amount",
      "payment_collections.payment_sessions.id",
      "payment_collections.payment_sessions.provider_id",
      "payment_collections.payment_sessions.data",
      "payment_collections.payments.id",
      "payment_collections.payments.provider_id",
      "payment_collections.payments.amount",
      "payment_collections.payments.captured_amount",
      "payment_collections.payments.data",
    ],
    filters: {
      display_id: Number(orderDisplayId),
    },
  });

  const order = orders[0];

  if (!order) {
    throw new Error(
      `Medusa order not found for Autopay orderID: ${autopayOrderId}`,
    );
  }

  const paymentCollection = order.payment_collections?.[0];

  if (!paymentCollection) {
    throw new Error(`Payment collection not found for order ${order.id}`);
  }

  const payment = paymentCollection.payments?.find(
    (payment) => payment.provider_id === "pp_autopay_transfer_autopay",
  );

  if (!payment) {
    throw new Error(`Autopay payment not found for order ${order.id}`);
  }

  // Idempotency:
  // if the ITN gets sent again we handle it here
  if (payment.captured_amount && payment.captured_amount > 0) {
    return payment;
  }

  const captureAmount = payment.amount ?? paymentCollection.amount;

  if (captureAmount == null) {
    throw new Error(
      `Unable to determine capture amount for payment ${payment.id}`,
    );
  }

  const { result } = await capturePaymentWorkflow(scope).run({
    input: {
      payment_id: payment.id,
      amount: captureAmount,
    },
  });

  return result;
}
