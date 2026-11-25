import { HttpTypes } from "@medusajs/types"
import { Text } from "@modules/common/components/ui"
import { Fragment } from "react"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4  mx-auto">
        <Text
          className="text-medium text-ui-fg-base whitespace-pre-line"
          data-testid="product-description"
        >
          {(product.description ?? "").split("\n").map((line, index, lines) => (
            <Fragment key={index}>
              {/^#\s+/.test(line) ? (
                <strong>{line.replace(/^#\s+/, "")}</strong>
              ) : (
                line
              )}
              {index < lines.length - 1 && <br />}
            </Fragment>
          ))}
        </Text>
      </div>
    </div>
  )
}

export default ProductInfo
