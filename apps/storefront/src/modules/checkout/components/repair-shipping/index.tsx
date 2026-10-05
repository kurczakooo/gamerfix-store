"use client"
import { Radio, RadioGroup } from "@headlessui/react"
import { setSendToServiceMethod } from "@lib/data/fulfillment"
import { CheckCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import MedusaRadio from "@modules/common/components/radio"
import { Badge, clx, Heading, Text } from "@modules/common/components/ui"
import Image from "next/image"
import { useState } from "react"

const repairShippingChoices = {
  sendToService: {
    title: "Wybierz metodę wysyłki sprzętu na serwis",
    options: [
      {
        id: "inpost-locker",
        title: "Wysyłka paczkomatem InPost",
        price: "Za darmo",
        priceBadgeColor: "green",
        icon: "/images/shipping/inpost_paczkomaty.png",
        subtitle:
          "Na paczkę naklejasz etykietę, którą otrzymasz na adres email po złożeniu zamówienia, i nadajesz przesyłkę w najbliższym paczkomacie.",
      },
      {
        id: "own-shipping",
        title: "Wysyłka na własną rękę",
        price: "Własny koszt",
        priceBadgeColor: "orange",
        icon: "/images/shipping/parcel.svg",
        subtitle:
          "Samodzielnie nadaj przesyłkę do paczkomatu PCI01M\nbądź na adres: Ujny 16, 26-015 Pierzchnica,\nZ danymi do wysyłki:\nGamer Fix\n+48 455 567 724\nserwis.gamefix@gmail.com",
      },
    ],
  },
}

type RepairShippingProps = {
  cart: HttpTypes.StoreCart
  isOpen: boolean
  onUpdatingChange?: (isUpdating: boolean) => void
}

const RepairShipping: React.FC<RepairShippingProps> = ({
  cart,
  isOpen,
  onUpdatingChange,
}) => {
  const [sendToServiceMethod, setSendToServiceMethodState] = useState<
    string | null
  >(() => {
    const send_method = cart.metadata?.sent_to_service_method

    return typeof send_method === "string" ? send_method : null
  })
  const [isUpdating, setIsUpdating] = useState(false)

  const onSelectMethod = async (id: string) => {
    const previousMethod = sendToServiceMethod

    setSendToServiceMethodState(id)
    setIsUpdating(true)
    onUpdatingChange?.(true)

    await setSendToServiceMethod({
      cartId: cart.id,
      existingMetadata: cart.metadata,
      sent_to_service_method: id,
    }).catch(() => {
      setSendToServiceMethodState(previousMethod)
    })

    setIsUpdating(false)
    onUpdatingChange?.(false)
  }

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        {isOpen && (
          <Heading
            level="h2"
            className={clx(
              "flex flex-row text-3xl-regular gap-x-2 items-baseline",
              {
                "opacity-50 pointer-events-none select-none":
                  !isOpen && cart.shipping_methods?.length === 0,
              }
            )}
          >
            Wysyłka sprzętu
          </Heading>
        )}
      </div>
      {isOpen ? (
        <>
          <div className="grid gap-y-8">
            <div>
              <Text className="txt-medium-plus text-ui-fg-base">
                {repairShippingChoices.sendToService.title}
              </Text>
              <RadioGroup
                value={sendToServiceMethod}
                onChange={onSelectMethod}
                disabled={isUpdating}
                className="pt-4"
              >
                <div className="grid gap-y-2">
                  {repairShippingChoices.sendToService.options.map((option) => (
                    <Radio
                      key={option.id}
                      value={option.id}
                      className={({ checked }) =>
                        clx(
                          "flex cursor-pointer items-start justify-between rounded-rounded border px-4 py-4 text-medium text-ui-fg-subtle hover:shadow-borders-interactive-with-active small:px-8",
                          {
                            "border-ui-border-interactive": checked,
                          }
                        )
                      }
                    >
                      {({ checked }) => (
                        <div className="flex flex-1 min-w-0 items-center">
                          <MedusaRadio checked={checked} />
                          <div className="flex min-w-0 flex-1 items-center">
                            <div className="flex h-10 w-[72px] shrink-0 items-center justify-center small:h-16 small:w-[120px]">
                              <Image
                                src={option.icon}
                                alt={option.id}
                                width={120}
                                height={56}
                                className="h-full w-full object-contain"
                              />
                            </div>
                            <div className="flex min-w-0 flex-1 flex-col gap-y-1 pl-2 small:pl-0">
                              <div className="flex min-w-0 items-start justify-between gap-x-2">
                                <Text className="min-w-0 flex-1 txt-medium-plus text-ui-fg-base">
                                  {option.title}
                                </Text>
                                <Badge
                                  color={option.priceBadgeColor}
                                  className="shrink-0 whitespace-nowrap"
                                >
                                  {option.price}
                                </Badge>
                              </div>
                              {option.subtitle && (
                                <Text className="txt-medium text-ui-fg-subtle whitespace-pre-wrap">
                                  {option.subtitle}
                                </Text>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </Radio>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-6">
          <div className="text-small-regular">
            {sendToServiceMethod && (
              <div className="flex flex-row items-center justify-between w-full">
                <div className="flex flex-col w-2/5">
                  <Text className="txt-medium-plus text-ui-fg-base mb-1">
                    Metoda wysyłki sprzętu na serwis
                  </Text>
                  <Text className="txt-medium text-ui-fg-subtle whitespace-pre-wrap">
                    {repairShippingChoices.sendToService.options.find(
                      (option) => option.id === sendToServiceMethod
                    )?.title ?? sendToServiceMethod}
                    {"\n(Szczegóły będą w potwierdzeniu zamówienia)"}
                  </Text>
                </div>
                <div className="flex h-8 w-[64px] shrink-0 items-center justify-center small:h-10 small:w-[80px]">
                  <Image
                    src={
                      repairShippingChoices.sendToService.options.find(
                        (option) => option.id === sendToServiceMethod
                      )?.icon ?? sendToServiceMethod
                    }
                    alt={sendToServiceMethod}
                    width={80}
                    height={40}
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default RepairShipping
