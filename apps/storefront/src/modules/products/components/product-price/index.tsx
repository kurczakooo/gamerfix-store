import { clx } from "@modules/common/components/ui"

import { formatPrice } from "@lib/util/format-price"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  return (
    <div className="flex flex-col text-ui-fg-base">
      <div
        className={clx(
          "flex w-full items-baseline justify-between gap-x-2 text-xl-semi",
          {
            "text-ui-fg-interactive": selectedPrice.price_type === "sale",
          }
        )}
      >
        <span className="whitespace-nowrap text-sm text-ui-fg-muted">
          {product.collection?.handle === "products" && "Cena za szt."}
          {product.collection?.handle === "services" &&
            "Cena za wykonanie usługi "}
        </span>
        <span
          className="ml-auto whitespace-nowrap text-right"
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {!variant && "Od "}
          {formatPrice(
            selectedPrice.calculated_price,
            selectedPrice.calculated_price_number,
            selectedPrice.currency_code
          )}
        </span>
      </div>
      {selectedPrice.price_type === "sale" && (
        <>
          <p>
            <span className="text-ui-fg-subtle">Oryginalna cena: </span>
            <span
              className="line-through"
              data-testid="original-product-price"
              data-value={selectedPrice.original_price_number}
            >
              {formatPrice(
                selectedPrice.original_price,
                selectedPrice.original_price_number,
                selectedPrice.currency_code
              )}
            </span>
          </p>
          <span className="text-ui-fg-interactive">
            -{selectedPrice.percentage_diff}%
          </span>
        </>
      )}
    </div>
  )
}
