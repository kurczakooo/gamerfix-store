import { Heading, Text } from "@modules/common/components/ui"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"

type ShipToServiceDetailsProps = {
  order: HttpTypes.StoreOrder
}

const SERVICE_COLLECTION_TITLE = "Usługi"

const ShippingToService = ({ order }: ShipToServiceDetailsProps) => {
  const hasServiceItems = order.items.some(
    (item) => item.product_collection === SERVICE_COLLECTION_TITLE
  )
  const sentToServiceMethod = order.metadata?.sent_to_service_method

  const renderShippingToServiceText = (method: string | null | undefined) => {
    if (method === "inpost-locker") {
      return "Nadanie przez paczkomat InPost (Za darmo)\n\nEtykieta wysyłkowa znajduje się w załączniku maila z potwiedzeniem.\nPo wydrukowaniu naklej ją na paczkę i nadaj w najbliższym paczkomacie InPost."
    }
    if (method === "own-shipping") {
      return "Wysyłka na własną rękę (Własny koszt)\nSamodzielnie nadaj przesyłkę do paczkomatu PCI01M\nbądź na adres: Ujny 16, 26-015 Pierzchnica,\nZ danymi do wysyłki:\nGamer Fix\n+48 455 567 724\nserwis.gamefix@gmail.com"
    }
    return ""
  }

  return (
    <>
      {hasServiceItems && (
        <div>
          <Heading level="h2" className="flex flex-row text-3xl-regular my-6">
            Wysyłka i odbiór sprzętu
          </Heading>
          <div>
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/2">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Metoda wysyłki sprzętu
                </Text>
                <Text
                  className="txt-medium text-ui-fg-subtle whitespace-pre-line"
                  data-testid="payment-method"
                >
                  {renderShippingToServiceText(sentToServiceMethod)}
                </Text>
              </div>
              <div className="flex flex-col w-1/2">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Metoda odbioru sprzętu
                </Text>
                <Text
                  className="txt-medium text-ui-fg-subtle whitespace-pre-line"
                  data-testid="payment-method"
                >
                  {
                    "Sprzęt zostanie odesłany przez wybraną metodę dostawy. (Jeśli zamówienie obejmuje produkty i usługę, produkty zostaną dostarczone razem z naprawionym sprzętem)"
                  }
                </Text>
              </div>
            </div>
          </div>

          <Divider className="mt-8" />
        </div>
      )}
    </>
  )
}

export default ShippingToService
