"use client"

import { convertToLocale, formatPrice } from "@lib/util/money"
import React from "react"
import { HttpTypes } from "@medusajs/types"

type CartTotalsProps = {
  totals: {
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    currency_code: string
    items?: HttpTypes.StoreCartLineItem[]
    item_subtotal?: number | null
    shipping_subtotal?: number | null
    discount_subtotal?: number | null
  }
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const {
    currency_code,
    total,
    tax_total,
    items,
    item_subtotal,
    shipping_subtotal,
    discount_subtotal,
  } = totals

  const pobranieFee = items?.find((item) => item.metadata?.is_cod_fee)
  const codFeeAmount = pobranieFee?.unit_price ?? 0

  const subtotalWithoutCodFee = (item_subtotal ?? 0) - codFeeAmount
  const formatCurrency = (amount: number) =>
    formatPrice(
      convertToLocale({ amount, currency_code }),
      amount,
      currency_code
    )

  return (
    <div>
      <div className="flex flex-col gap-y-2 txt-medium text-ui-fg-subtle ">
        <div className="flex items-center justify-between">
          <span>Wstępna wartość koszyka</span>
          <span
            data-testid="cart-subtotal"
            data-value={subtotalWithoutCodFee || 0}
          >
            {formatCurrency(subtotalWithoutCodFee)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Dostawa</span>
          <span data-testid="cart-shipping" data-value={shipping_subtotal || 0}>
            {formatCurrency(shipping_subtotal ?? 0)}
          </span>
        </div>
        {pobranieFee && (
          <div className="flex items-center justify-between">
            <span>{pobranieFee.title}</span>
            <span
              data-testid="cart-cod-fee"
              data-value={pobranieFee.unit_price}
            >
              {formatCurrency(pobranieFee.unit_price)}
            </span>
          </div>
        )}
        {!!discount_subtotal && (
          <div className="flex items-center justify-between">
            <span>Rabat</span>
            <span
              className="text-ui-fg-interactive"
              data-testid="cart-discount"
              data-value={discount_subtotal || 0}
            >
              - {formatCurrency(discount_subtotal ?? 0)}
            </span>
          </div>
        )}
      </div>
      <div className="h-px w-full border-b border-gray-200 my-4" />
      <div className="flex items-center justify-between text-ui-fg-base mb-2 txt-medium ">
        <span>Wartość koszyka</span>
        <span
          className="txt-xlarge-plus"
          data-testid="cart-total"
          data-value={total || 0}
        >
          {formatCurrency(total ?? 0)}
        </span>
      </div>
      <div className="h-px w-full border-b border-gray-200 mt-4" />
    </div>
  )
}

export default CartTotals
