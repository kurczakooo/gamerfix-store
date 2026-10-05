import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { AdminOrder, DetailWidgetProps } from "@medusajs/framework/types";
import { Container, Heading, Text } from "@medusajs/ui";

const RepairShopShippingMethod = ({ data }: DetailWidgetProps<AdminOrder>) => {
  const shippingMethodsMap = {
    "own-shipping": "Customer handles the shipping on his own",
    "inpost-locker": "Customer recieved a parcel letter from us",
  };

  const shippingMethod = data.metadata?.sent_to_service_method;

  if (!shippingMethod) {
    return <></>;
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Device shipment to the repair shop 📦 🛠️</Heading>
      </div>
      <div className="flex items-center justify-between px-6 py-4">
        <Text>{shippingMethodsMap[shippingMethod]}</Text>
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "order.details.side.before",
});

export default RepairShopShippingMethod;
