"use client"

import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const TotalItems = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  return (
    <div
      className="h-full z-50"
    >
      <LocalizedClientLink
            className="hover:text-ui-fg-base"
            href="/cart"
            data-testid="nav-cart-link"
          >{`(${totalItems})`}</LocalizedClientLink>
    </div>
  )
}

export default TotalItems
