"use client"

import { isBlikDpay, isPayOnDeliveryDpay, isTransferDpay } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/ui"
import React, { use, useState } from "react"
import ErrorMessage from "../error-message"
import { SubmitButton } from "../submit-button"
import Input from "@modules/common/components/input"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]
  console.log(paymentSession?.provider_id)

  switch (true) {
    case isPayOnDeliveryDpay(paymentSession?.provider_id):
      return (
        <PayOnDeliveryPaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isTransferDpay(paymentSession?.provider_id):
      return (
        <TransferPaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isBlikDpay(paymentSession?.provider_id):
      return (
        <DpayBlikPaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    default:
      return <Button disabled>Wybierz metodę płatności</Button>
  }
}

export default PaymentButton

const DpayBlikPaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [blikCode, setBlikCode] = useState("")
  const [completingBlik, setCompletingBlik] = useState(false)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
        setCompletingBlik(false)
        setBlikCode("")
      })
  }

  const handlePayment = () => {
    setSubmitting(true)

    // send order to db with payment not completed
  }

  const formAction = () => {
    setCompletingBlik(true)

    // onPaymentCompleted()
    console.log("Completed")

    // request with blik code to backend
    // backend request with blik code to dpay
    // dpay returns aswer to backend
    // based on the answer set the payment to success or fail
    // based on payment status send a answer to frontend with fail or success and show proper screen
  }

  return (
    <div className="relative">
      {!submitting && !completingBlik && (
        <Button
          disabled={notReady}
          isLoading={submitting}
          onClick={handlePayment}
          size="large"
          data-testid="submit-order-button"
        >
          Złóż zamówienie i przejdź do płatności
        </Button>
      )}

      {submitting && (
        <form action={formAction}>
          <div className="flex flex-col gap-y-2 mt-6 max-w-[200px]">
            <Input
              disabled={completingBlik}
              value={blikCode}
              onChange={(e) => setBlikCode(e.target.value)}
              label="Kod BLIK"
              name="blik_code"
              required
              maxLength={6}
              pattern="[0-9]{6}"
              inputMode="numeric"
              data-testid="blik-code-input"
            />
            <SubmitButton
              data-testid="blik-pay-button"
              disabled={completingBlik}
            >
              Zapłać
            </SubmitButton>
          </div>
        </form>
      )}

      {completingBlik && (
        <div className="mt-2 tetxt-medium-compact text-ui-fg-base my-6">
          Potwierdź płatność w aplikacji bankowej...
        </div>
      )}

      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </div>
  )
}

const TransferPaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const handlePayment = async () => {
    setSubmitting(true)
  }

  return (
    <>
      <Button
        disabled={notReady}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        Złóż zamówienie i przejdź do płatności
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="stripe-payment-error-message"
      />
    </>
  )
}

const PayOnDeliveryPaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    setSubmitting(true)
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <>
      <Button
        disabled={notReady}
        onClick={onPaymentCompleted}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        Złóż zamówienie
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="pay-on-delivery-payment-error-message"
      />
    </>
  )
}
