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

type Method = {
  name: string
  description: string
  logo: string
}

const MethodGrid = ({
  methods,
  payment = false,
}: {
  methods: Method[]
  payment?: boolean
}) => (
  <div
    className={
      payment
        ? "grid grid-cols-1 gap-4 sm:grid-cols-2"
        : "grid grid-cols-1 gap-4 sm:grid-cols-2"
    }
  >
    {methods.map((method) => (
      <div
        key={method.name}
        className="flex min-h-[128px] flex-1 items-center justify-between gap-6 border border-ui-border-base bg-white py-5 pl-5 sm:py-6 sm:pl-6"
      >
        <div className="min-w-0">
          <h3 className="text-base-semi text-ui-fg-base">{method.name}</h3>
          <p className="mt-1 text-small-regular text-ui-fg-subtle">
            {method.description}
          </p>
        </div>
        <div className="flex h-16 w-[120px] shrink-0 items-center justify-center">
          <Image
            src={method.logo}
            alt={method.name}
            width={120}
            height={56}
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    ))}
  </div>
)

const MethodSection = ({
  title,
  description,
  methods,
  payment,
}: {
  title: string
  description?: string
  methods: Method[]
  payment?: boolean
}) => (
  <>
    <div className="max-w-2xl my-4">
      <h2 className="text-large-semi text-ui-fg-base">{title}</h2>
      {description && (
        <p className="mt-2 text-base-regular text-ui-fg-subtle">
          {description}
        </p>
      )}
    </div>
    <MethodGrid methods={methods} payment={payment} />
  </>
)

export default async function ShippingPayments() {
  return (
    <div
      className="content-container"
      data-testid="shipping-payments-container"
    >
      <div className="py-6 px-2">
        <Heading level="h1" className="text-3xl-regular">
          Dostawa i płatność
        </Heading>

        <div className="pt-8 flex flex-col gap-8 small:gap-10">
          <section>
            <h2 className="text-xl-semi text-ui-fg-base mb-2">
              Dostawa i płatność w sklepie
            </h2>
            <div className="flex flex-col">
              <MethodSection
                title="Dostępne metody dostawy"
                methods={storeShippingMethods}
              />
              <MethodSection
                title="Metody płatności"
                methods={storePaymentMethods}
                payment
              />
            </div>
          </section>

          <section className="border-t border-ui-border-base pt-8">
            <h2 className="text-xl-semi text-ui-fg-base mb-2">
              Dostawa i płatność w serwisie
            </h2>
            <div className="flex flex-col">
              <MethodSection
                title="Dostępne metody wysyłki sprzętu na serwis"
                description="W celu dostarczenia sprzętu na serwis osobiście prosimy o kontakt telefoniczny."
                methods={repairShopShippingMethods}
              />
              <MethodSection
                title="Dostępne metody odbioru sprzętu"
                description="W celu odebrania naprawionego sprzętu osobiście prosimy o kontakt telefoniczny."
                methods={storeShippingMethods}
              />
              <MethodSection
                title="Metody płatności"
                methods={storePaymentMethods}
                payment
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
