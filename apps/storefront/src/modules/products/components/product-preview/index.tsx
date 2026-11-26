import { Text } from "@modules/common/components/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region: _region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div data-testid="product-wrapper">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          isFeatured={isFeatured}
          isNew={
            product.metadata && product.metadata.new
              ? product.metadata.new
              : false
          }
          bestSeller={
            product.metadata && product.metadata.bestseller
              ? product.metadata.bestseller
              : false
          }
          lastItems={
            product.metadata && product.metadata.lastItems
              ? product.metadata.lastItems
              : false
          }
        />
        <div className="mt-4">
          <Text
            className="text-small-regular sm:text-large-regular text-ui-fg-subtle"
            data-testid="product-title"
          >
            {product.title}
          </Text>
          <div className="mt-1 flex flex-wrap items-center justify-end gap-x-2 gap-y-1">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
