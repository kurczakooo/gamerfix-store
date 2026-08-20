import Divider from "@modules/common/components/divider"
import { Heading } from "@modules/common/components/ui"
import { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Dostawa i płatność | Gamer Fix",
  description:
    "Informacje o metodach dostawy i płatności na stronie sklepu i w serwisie Gamer Fix",
}

const storeShippingMethods = [
  {
    name: "InPost Kurier",
    description: "Szybka dostawa do twojego domu.",
    logo: "/images/shipping/inpost_kurier.png",
  },
  {
    name: "InPost Paczkomaty",
    description: "Szybka dostawa do wybranego paczkomatu.",
    logo: "/images/shipping/inpost_paczkomaty.png",
  },
]

const repairShopShippingMethods = [
  {
    name: "InPost Kurier",
    description: "Nadanie paczki u kuriera, który przyjedzie pod twój adres.",
    logo: "/images/shipping/inpost_kurier.png",
  },
  {
    name: "InPost Paczkomaty",
    description: "Nadanie paczki w paczkomacie.",
    logo: "/images/shipping/inpost_paczkomaty.png",
  },
]

const storePaymentMethods = [
  {
    name: "BLIK",
    description: "Płatność za pomocą kodu BLIK.",
    logo: "/images/payment/blik_telefon.png",
  },
  {
    name: "Szybki przelew",
    description: "Płatność szybkim przelewem bankowym.",
    logo: "/images/payment/szybki_przelew.png",
  },
  {
    name: "Manualny przelew",
    description: "Płatność za pomocą przelewu tradycyjnego.",
    logo: "/images/payment/przelew.svg",
  },
  {
    name: "Płatność za pobraniem",
    description: "Płatność przy odbiorze paczki od kuriera.",
    logo: "/images/payment/pobranie.svg",
  },
]

export default async function ShippingPayments() {
  return (
    <div className="content-container">
      <div className="py-8 px-2 flex flex-col gap-12">
        <Heading level="h1" className="text-3xl-regular">
          Dostawa i płatność w sklepie
        </Heading>

        <section>
          <h2 className="text-xl font-semibold text-ui-fg-base mb-6">
            Dostępne metody dostawy
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {storeShippingMethods.map((method) => (
              <div
                key={method.name}
                className="border rounded-lg p-6 flex flex-col gap-4 bg-white"
              >
                <Image
                  src={method.logo}
                  alt={method.name}
                  height={40}
                  width={100}
                  className="object-contain h-24 w-auto"
                />

                <p className="text-sm text-ui-fg-subtle">
                  {method.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ui-fg-base mb-6">
            Metody płatności
          </h2>

          <div className="flex flex-wrap gap-6">
            {storePaymentMethods.map((method) => (
              <div
                key={method.name}
                className="border rounded-lg px-6 py-4 flex items-center bg-white"
              >
                <Image
                  src={method.logo}
                  alt={method.name}
                  width={100}
                  height={40}
                  className="object-contain h-24 w-auto"
                />

                <p className="text-sm text-ui-fg-subtle">
                  {method.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        <Heading level="h1" className="text-3xl-regular">
          Dostawa i płatność w serwisie
        </Heading>

        <section>
          <h2 className="text-xl font-semibold text-ui-fg-base mb-6">
            Dostępne metody wysyłki sprzętu na serwis
          </h2>

          <p className="text-sm text-ui-fg-subtle mb-6">
            W celu dostarczenia sprzętu na serwis osobiście prosimy o kontakt
            telefoniczny.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {repairShopShippingMethods.map((method) => (
              <div
                key={method.name}
                className="border rounded-lg p-6 flex flex-col gap-4 bg-white"
              >
                <Image
                  src={method.logo}
                  alt={method.name}
                  width={120}
                  height={50}
                  className="object-contain h-24 w-auto"
                />

                <p className="text-sm text-ui-fg-subtle">
                  {method.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ui-fg-base mb-6">
            Dostępne metody odbioru sprzętu
          </h2>

          <p className="text-sm text-ui-fg-subtle mb-6">
            W celu odebrania naprawionego sprzętu osobiście prosimy o kontakt
            telefoniczny.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {storeShippingMethods.map((method) => (
              <div
                key={method.name}
                className="border rounded-lg p-6 flex flex-col gap-4 bg-white"
              >
                <Image
                  src={method.logo}
                  alt={method.name}
                  width={120}
                  height={50}
                  className="object-contain h-24 w-auto"
                />

                <p className="text-sm text-ui-fg-subtle">
                  {method.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ui-fg-base mb-6">
            Metody płatności
          </h2>

          <div className="flex flex-wrap gap-6">
            {storePaymentMethods.map((method) => (
              <div
                key={method.name}
                className="border rounded-lg px-6 py-4 flex items-center bg-white"
              >
                <Image
                  src={method.logo}
                  alt={method.name}
                  width={100}
                  height={40}
                  className="object-contain h-24 w-auto"
                />

                <p className="text-sm text-ui-fg-subtle">
                  {method.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
