import { CreditCard } from "@medusajs/icons"
import Bancontact from "@modules/common/icons/bancontact"
import Blik from "@modules/common/icons/blik"
import DpayTransfer from "@modules/common/icons/dpay-transfer"
import Ideal from "@modules/common/icons/ideal"
import PayPal from "@modules/common/icons/paypal"
import PayOnDelivery from "@modules/common/icons/pobranie"
import React from "react"

/* Map of payment provider_id to their title and icon. Add in any payment providers you want to use. */
export const paymentInfoMap: Record<
  string,
  { title: string; icon: React.JSX.Element }
> = {
  //   pp_stripe_stripe: {
  //     title: "Credit card",
  //     icon: <CreditCard />,
  //   },
  //   "pp_medusa-payments_default": {
  //     title: "Credit card",
  //     icon: <CreditCard />,
  //   },
  //   "pp_stripe-ideal_stripe": {
  //     title: "iDeal",
  //     icon: <Ideal />,
  //   },
  //   "pp_stripe-bancontact_stripe": {
  //     title: "Bancontact",
  //     icon: <Bancontact />,
  //   },
  //   pp_paypal_paypal: {
  //     title: "PayPal",
  //     icon: <PayPal />,
  //   },
  //   pp_system_default: {
  //     title: "Manualna płatność",
  //     icon: <CreditCard />,
  //   },
  pp_dpay_blik_dpay: {
    title: "Blik",
    icon: <Blik size={48} />,
  },
  pp_dpay_transfer_dpay: {
    title: "Szybki przelew",
    icon: <DpayTransfer size={48} />,
  },
  pp_dpay_pobranie_dpay: {
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

export const isPaypal = (providerId?: string) => {
  return providerId?.startsWith("pp_paypal")
}
export const isManual = (providerId?: string) => {
  return providerId?.startsWith("pp_system_default")
}
export const isBlikDpay = (providerId?: string) => {
  return providerId?.startsWith("pp_dpay_blik_dpay")
}
export const isTransferDpay = (providerId?: string) => {
  return providerId?.startsWith("pp_dpay_transfer_dpay")
}
export const isPayOnDeliveryDpay = (providerId?: string) => {
  return providerId?.startsWith("pp_dpay_pobranie_dpay")
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
