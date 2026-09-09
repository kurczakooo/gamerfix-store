import { CreditCard } from "@medusajs/icons"
import Bancontact from "@modules/common/icons/bancontact"
import Blik from "@modules/common/icons/blik"
import AutopayTransfer from "@modules/common/icons/autopay-transfer"
import PayOnDelivery from "@modules/common/icons/pobranie"
import React from "react"

/* Map of payment provider_id to their title and icon. Add in any payment providers you want to use. */
export const paymentInfoMap: Record<
  string,
  { title: string; icon: React.JSX.Element }
> = {
  //   "pp_medusa-payments_default": {
  //     title: "Credit card",
  //     icon: <CreditCard />,
  //   },
  //   pp_autopay_blik_autopay: {
  //     title: "Blik",
  //     icon: <Blik size={48} />,
  //   },
  pp_autopay_transfer_autopay: {
    title: "Blik lub Szybki przelew",
    icon: <AutopayTransfer size={48} />,
  },
  pp_autopay_pobranie_autopay: {
    title: "Płatność za pobraniem",
    icon: <PayOnDelivery size={48} />,
  },
}

// This only checks if it is native stripe or medusa payments for card payments, it ignores the other stripe-based providers
export const isStripeLike = (providerId?: string) => {
  return (
    providerId?.startsWith("pp_stripe_") || providerId?.startsWith("pp_medusa-")
  )
}

export const isBlikAutopay = (providerId?: string) => {
  return providerId?.startsWith("pp_autopay_blik_autopay")
}
export const isTransferAutopay = (providerId?: string) => {
  return providerId?.startsWith("pp_autopay_transfer_autopay")
}
export const isPayOnDeliveryAutopay = (providerId?: string) => {
  return providerId?.startsWith("pp_autopay_pobranie_autopay")
}

// Add currencies that don't need to be divided by 100
export const noDivisionCurrencies = [
  "krw",
  "jpy",
  "vnd",
  "clp",
  "pyg",
  "xaf",
  "xof",
  "bif",
  "djf",
  "gnf",
  "kmf",
  "mga",
  "rwf",
  "xpf",
  "htg",
  "vuv",
  "xag",
  "xdr",
  "xau",
]
