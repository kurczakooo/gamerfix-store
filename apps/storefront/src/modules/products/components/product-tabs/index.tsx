"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"
import Repair from "@modules/common/icons/repair"
import Money from "@modules/common/icons/money"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    // {
    //   label: "Szczegółowe parametry",
    //   component: <ProductInfoTab product={product} />,
    // },
    ...(product.collection?.handle === "products"
      ? [
          {
            label: "Dostawa i zwroty",
            component: <ShippingInfoTab product={product} />,
          },
        ]
      : []),
    ...(product.collection?.handle === "services"
      ? [
          {
            label: "Proces naprawy",
            component: <ServiceInfoTab product={product} />,
          },
        ]
      : []),
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-2 gap-x-8">
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">Materiał</span>
            <p>{product.material ? product.material : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Kraj pochodzenia</span>
            <p>{product.origin_country ? product.origin_country : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Typ</span>
            <p>{product.type ? product.type.value : "-"}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">Waga</span>
            <p>{product.weight ? `${product.weight} g` : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Wymiary</span>
            <p>
              {product.length && product.width && product.height
                ? `${product.length}L x ${product.width}W x ${product.height}H`
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ShippingInfoTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold">Szybka dostawa</span>
            <p className="max-w-sm">
              Składając zamówienie do 16:00, paczka zostanie nadana tego samego
              dnia.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-semibold">Wymiana produktu</span>
            <p className="max-w-sm">
              Jeśli otrzymany produkt się nie podoba, lub jest uszkodzony -
              wymienimy go. Na zwrot przysługuje 14 dni od zakupu.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Back />
          <div>
            <span className="font-semibold">Proste zwroty</span>
            <p className="max-w-sm">
              Po prostu odeślij produkt, a my po weryfikacji zwrócimy pieniądze.
              Szczegóły w zakładce "Zwroty i reklamacje" w stopce strony.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ServiceInfoTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold">Wysyłka i odbiór sprzętu</span>
            <p className="max-w-sm">
              Po złożeniu zamówienia, przygotuj sprzęt do wysyłki. Etykietę
              wysyłkową otrzymasz na maila gdy zaksięgujemy płatność (Zazwyczaj
              tego samego dnia). Paczkę nadajesz do nas wybraną metodą, a po
              zakończeniu naprawy odsyłamy sprzęt.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Repair />
          <div>
            <span className="font-semibold">Czas trwania naprawy</span>
            <p className="max-w-sm">
              Po otrzymaniu sprzętu, przeprowadzamy weryfikację jego stanu, oraz
              rozpoczynamy naprawę deklarowanego uszkodzenia. Naprawa trwa
              zazwyczaj 1-3 dni roboczych, po czym odsyłamy sprzęt do ciebie. W
              szczególnych przypadkach naprawa może trwać dłużej, wtedy
              informacja o ewentualnym wydłużeniu czasu naprawy zostaje
              przekazana telefonicznie lub mailowo.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Money size="20" />
          <div>
            <span className="font-semibold">Dodatkowe koszty</span>
            <p className="max-w-sm">
              Chcemy, aby każde urządzenie które trafi do naszego serwisu,
              zostało przywrócone do w pełni działającego stanu. Dlatego, jeśli
              podczas naprawy wykryjemy inne usterki, skontaktujemy się z tobą
              telefonicznie w celu ustalenia szczegółów przeprowadzenia
              dodatkowych napraw oraz ich kosztów.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
