"use client"

import { Heading, Text, clx } from "@modules/common/components/ui"

import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

const Review = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard = !!(
    (cart as unknown as Record<string, unknown>)?.gift_cards &&
    ((cart as unknown as Record<string, unknown>)?.gift_cards as unknown[])
      ?.length > 0 &&
    cart?.total === 0
  )

  const previousStepsCompleted =
    cart.shipping_address &&
    (cart.shipping_methods?.length ?? 0) > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline mb-4",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
          Sprawdź powyższe podsumowanie zamówienia
        </Heading>
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          <PaymentButton cart={cart} data-testid="submit-order-button" />
          <div className="flex items-start gap-x-1 w-full mb-6">
            <div className="w-full">
              <Text className="txt-medium-compact text-ui-fg-base my-6">
                Klikając przycisk potwierdzasz, że akceptujesz nasz Regulamin
                oraz Politykę Prywatności.
              </Text>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Review
