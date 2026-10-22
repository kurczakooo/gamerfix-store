import { Plus, Minus } from "@medusajs/icons"
import { Button } from "@modules/common/components/ui"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@modules/common/components/ui"
import React from "react"

type QuantitySelectionProps = {
  selectedVariant: HttpTypes.StoreProductVariant | null
  selectedQuantity: number
  setQuantity: (quantity: number) => void
  disabled: boolean
}

const QuantitySelection: React.FC<QuantitySelectionProps> = ({
  selectedVariant,
  selectedQuantity,
  setQuantity,
  disabled,
}) => {
  const filteredOptions = Array.from(
    { length: selectedVariant?.inventory_quantity ?? 0 },
    (_, i) => (i + 1).toString()
  )

  return (
    <div className="flex flex-1 small:w-96">
      <span className="flex flex-1 items-end text-large-regular text-ui-fg-muted">
        Ilość
      </span>
      <div className="flex flex-1 justify-between items-center">
        <Button
          onClick={() => setQuantity(selectedQuantity - 1)}
          disabled={
            disabled ||
            (selectedVariant?.inventory_quantity ?? 0) <= 1 ||
            selectedQuantity <= 1
          }
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span>{selectedQuantity}</span>
        <Button
          onClick={() => setQuantity(selectedQuantity + 1)}
          disabled={
            disabled ||
            selectedQuantity >= (selectedVariant?.inventory_quantity ?? 0)
          }
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export default QuantitySelection
