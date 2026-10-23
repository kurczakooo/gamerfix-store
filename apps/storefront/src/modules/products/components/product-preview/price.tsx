import { Text, clx } from "@modules/common/components/ui"
import { formatPrice } from "@lib/util/money"
import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  const sale = price.price_type === "sale"

  return (
    <>
      {sale && (
        <>
          <Text
            className="text-ui-fg-interactive text-small-semi font-semibold sm:text-large-semi"
            data-testid="price"
          >
            {formatPrice(
              price.calculated_price,
              price.calculated_price_number,
              price.currency_code
            )}
          </Text>
          <Text
            className="line-through text-xsmall-semi font-semibold sm:text-large-semi text-ui-fg-muted"
            data-testid="original-price"
          >
            {formatPrice(
              price.original_price,
              price.original_price_number,
              price.currency_code
            )}
          </Text>
        </>
      )}
      {!sale && (
        <Text
          className="text-ui-fg-subtle text-small-semi font-semibold sm:text-large-semi"
          data-testid="price"
        >
          {formatPrice(
            price.calculated_price,
            price.calculated_price_number,
            price.currency_code
          )}
        </Text>
      )}
    </>
  )
}
