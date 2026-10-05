import {
  createWorkflow,
  when,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import {
  sendNotificationsStep,
  useQueryGraphStep,
} from "@medusajs/medusa/core-flows";

const adminEmail = "serwis.gamefix@gmail.com";

export type SendOrderConfirmationWorkflowInput = {
  id: string;
};

export const sendOrderConfirmationWorkflow = createWorkflow(
  "send-order-confirmation",
  ({ id }: SendOrderConfirmationWorkflowInput) => {
    const { data: orders } = useQueryGraphStep({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "created_at",
        "email",
        "currency_code",
        "total",
        "subtotal",
        "discount_total",
        "shipping_total",
        "tax_total",
        "item_subtotal",
        "item_total",
        "item_tax_total",
        "discount_subtotal",
        "items.*",
        "shipping_address.*",
        "billing_address.*",
        "shipping_methods.*",
        "payment_collections.payments.*",
        "customer.*",
        "metadata",
      ],
      filters: { id },
      options: { throwIfKeyNotFound: true },
    });

    const notification = when({ orders }, ({ orders }) => !!orders[0]).then(
      () =>
        sendNotificationsStep([
          {
            to: adminEmail,
            channel: "email",
            template: "order-placed",
            data: {
              order: orders[0],
              storeUrl: "https://gamerfix.pl",
            },
          },
        ]),
    );

    return new WorkflowResponse({ notification });
  },
);
