import { HttpTypes } from "@medusajs/types"
import { Text } from "@modules/common/components/ui"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const statusTranslations: Record<string, string> = {
  // Payment
  not_paid: "Nieopłacone",
  awaiting: "Oczekuje na płatność",
  authorized: "Autoryzowane",
  partially_authorized: "Częściowo autoryzowane",
  captured: "Opłacone",
  partially_captured: "Częściowo opłacone",
  partially_refunded: "Częściowo zwrócone",
  refunded: "Zwrócone",
  canceled: "Anulowane",
  requires_action: "Wymaga działania",

  // Fulfillment
  not_fulfilled: "Nie zrealizowano",
  partially_fulfilled: "Częściowo zrealizowano",
  fulfilled: "Zrealizowano",
  partially_shipped: "Częściowo wysłano",
  shipped: "Wysłano",
  partially_delivered: "Częściowo dostarczono",
  delivered: "Dostarczono",
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (str: string) => {
    return statusTranslations[str] ?? str
  }

  return (
    <div>
      <Text>
        Szczegóły zamówienia zostały wysłane na adres{" "}
        <span
          className="text-ui-fg-medium-plus font-semibold"
          data-testid="order-email"
        >
          {order.email}
        </span>
        .
      </Text>
      <Text className="mt-2">
        Data zamówienia:{" "}
        <span data-testid="order-date">
          {new Date(order.created_at).toLocaleDateString()}
        </span>
      </Text>
      <Text className="mt-2 text-ui-fg-interactive">
        Numer zamówienia: <span data-testid="order-id">{order.display_id}</span>
      </Text>

      <div className="flex items-center text-compact-small gap-x-4 mt-4">
        {showStatus && (
          <>
            <Text>
              Status zamówienia:{" "}
              <span className="text-ui-fg-subtle " data-testid="order-status">
                {formatStatus(order.fulfillment_status)}
              </span>
            </Text>
            <Text>
              Status płatności:{" "}
              <span
                className="text-ui-fg-subtle "
                sata-testid="order-payment-status"
              >
                {formatStatus(order.payment_status)}
              </span>
            </Text>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
