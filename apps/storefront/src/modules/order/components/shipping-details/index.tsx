import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@modules/common/components/ui"

import Divider from "@modules/common/components/divider"

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  const parcelLockerMetadata = order.metadata
  const isParcelLocker =
    !!order.shipping_methods[0]?.name?.includes("Paczkomat") &&
    !!parcelLockerMetadata?.parcel_locker_name &&
    !!parcelLockerMetadata?.parcel_locker_code

  return (
    <div>
      <Heading level="h2" className="flex flex-row text-3xl-regular my-6">
        Dostawa
      </Heading>
      <div className="flex flex-wrap items-start gap-y-6 gap-x-4 sm:gap-x-0">
        <div
          className="flex flex-col w-[calc(50%-0.5rem)] sm:w-1/3 sm:pr-8"
          data-testid="shipping-address-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-1">
            Adres dostawy
          </Text>
          <Text className="txt-medium text-ui-fg-subtle break-words">
            {order.shipping_address?.first_name}{" "}
            {order.shipping_address?.last_name}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle break-words">
            {order.shipping_address?.address_1}{" "}
            {order.shipping_address?.address_2}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle break-words">
            {order.shipping_address?.postal_code},{" "}
            {order.shipping_address?.city}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle break-words">
            {order.shipping_address?.country_code?.toUpperCase()}
          </Text>
        </div>

        <div
          className="flex flex-col w-[calc(50%-0.5rem)] sm:w-1/3 sm:pr-8"
          data-testid="shipping-contact-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-1">Kontakt</Text>
          <Text className="txt-medium text-ui-fg-subtle break-words">
            {order.shipping_address?.phone}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle break-words">
            {order.email}
          </Text>
        </div>

        <div
          className="flex flex-col w-full sm:w-1/3"
          data-testid="shipping-method-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-1">
            Metoda dostawy
          </Text>
          <Text className="txt-medium text-ui-fg-subtle break-words">
            {(order.shipping_methods?.[0] as { name?: string })?.name} (
            {convertToLocale({
              amount: order.shipping_methods?.[0].total ?? 0,
              currency_code: order.currency_code,
            })}
            )
          </Text>
          <Text className="txt-medium text-ui-fg-subtle whitespace-pre-line break-words">
            {isParcelLocker &&
              `Paczkomat: ${parcelLockerMetadata?.parcel_locker_name}\nKod paczkomatu: ${parcelLockerMetadata?.parcel_locker_code}`}
          </Text>
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default ShippingDetails
