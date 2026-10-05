import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { AdminOrder, DetailWidgetProps } from "@medusajs/framework/types";
import { Container, Heading, Text } from "@medusajs/ui";

const ParcelBoxShippingWidget = ({ data }: DetailWidgetProps<AdminOrder>) => {
  const parcelLockerCode = data.metadata?.parcel_locker_code;
  const parcelLockerAddress = data.metadata?.parcel_locker_name;

  if (!parcelLockerCode && !parcelLockerAddress) {
    return <></>;
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Parcel Box Shipping 📦</Heading>
      </div>
      <div className="flex items-center justify-between px-6 py-4">
        <Text>Parcel Box Code</Text>
        <Text>{parcelLockerCode}</Text>
      </div>
      <div className="flex items-center justify-between px-6 py-4">
        <Text>Parcel Box Name & Address</Text>
        <Text>{parcelLockerAddress}</Text>
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "order.details.side.before",
});

export default ParcelBoxShippingWidget;
