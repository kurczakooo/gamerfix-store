import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const orderId = req.params.id;

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: orders } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "payment_collections.payments.id",
      "payment_collections.payments.captured_at",
      "payment_collections.payments.canceled_at",
    ],
    filters: { id: orderId },
  });

  const order = orders[0];

  if (!order) {
    res.status(404).json({ message: "Order not found" });
    return;
  }

  const pendingPayment = order.payment_collections
    ?.flatMap(collection => collection.payments ?? [])
    .find(payment => !payment.captured_at && !payment.canceled_at);

  if (!pendingPayment) {
    res.status(200).json({ captured: false });
    return;
  }

  const paymentModuleService = req.scope.resolve(Modules.PAYMENT);
  await paymentModuleService.capturePayment({ payment_id: pendingPayment.id });

  res.status(200).json({ captured: true });
};
