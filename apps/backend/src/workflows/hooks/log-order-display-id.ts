import { completeCartWorkflow } from "@medusajs/medusa/core-flows";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { IPaymentModuleService, MedusaContainer } from "@medusajs/framework/types";

type BeforePaymentAuthorizationInput = { input: { id: string } };
type HookStepContext = { container: MedusaContainer };

// Injects the order's display_id into the autopay_transfer session's data before authorization.
// `beforePaymentAuthorization` isn't part of the public hooks type yet, hence the cast.
(completeCartWorkflow.hooks as any).beforePaymentAuthorization(
  async (
    { input }: BeforePaymentAuthorizationInput,
    { container }: HookStepContext,
  ) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    const { data: orderCarts } = await query.graph({
      entity: "order_cart",
      fields: ["order_id"],
      filters: { cart_id: input.id },
    });

    const orderId = orderCarts[0]?.order_id;

    if (!orderId) {
      return;
    }

    const { data: orders } = await query.graph({
      entity: "order",
      fields: ["display_id"],
      filters: { id: orderId },
    });

    const displayId = orders[0]?.display_id;

    if (!displayId) {
      return;
    }

    const { data: carts } = await query.graph({
      entity: "cart",
      fields: [
        "payment_collection.payment_sessions.id",
        "payment_collection.payment_sessions.data",
        "payment_collection.payment_sessions.amount",
        "payment_collection.payment_sessions.currency_code",
        "payment_collection.payment_sessions.provider_id",
      ],
      filters: { id: input.id },
    });

    const session = carts[0]?.payment_collection?.payment_sessions?.find(
      (s: any) => s.provider_id === "pp_autopay_transfer_autopay",
    );

    if (!session) {
      return;
    }

    const paymentModuleService = container.resolve<IPaymentModuleService>(
      Modules.PAYMENT,
    );

    await paymentModuleService.updatePaymentSession({
      id: session.id,
      amount: session.amount,
      currency_code: session.currency_code,
      data: {
        ...session.data,
        orderDisplayId: displayId,
      },
    });
  },
);
