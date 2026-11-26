"use client"

import { HttpTypes } from "@medusajs/types"

const TotalItems = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const items = cartState?.items?.filter((item) => !item.metadata?.is_cod_fee)

  const totalItems =
    items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  return <span>{`(${totalItems})`}</span>
}

export default TotalItems
