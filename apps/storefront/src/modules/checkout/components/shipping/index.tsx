"use client"
import { Radio, RadioGroup } from "@headlessui/react"
import { setShippingMethod } from "@lib/data/cart"
import {
  calculatePriceForShippingOption,
  setParcelLockerPoint,
} from "@lib/data/fulfillment"
import { convertToLocale } from "@lib/util/money"
import { CheckCircleSolid, Loader } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import ErrorMessage from "@modules/checkout/components/error-message"
import Divider from "@modules/common/components/divider"
import MedusaRadio from "@modules/common/components/radio"
import { Button, clx, Heading, Text } from "@modules/common/components/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Script from "next/script"
import RepairShipping from "../repair-shipping"
import Image from "next/image"

const PICKUP_OPTION_ON = "__PICKUP_ON"
const PICKUP_OPTION_OFF = "__PICKUP_OFF"

type ShippingProps = {
  cart: HttpTypes.StoreCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
  repairsInCart: boolean
}

declare global {
  interface Window {
    Furgonetka?: {
      Map: new (options: {
        apiKey: string
        courierServices: string[]
        callback: (params: any) => void
      }) => {
        show: () => void
      }
    }
  }
}

export function formatAddress(address: HttpTypes.StoreCartAddress) {
  if (!address) {
    return ""
  }

  let ret = ""

  if (address.address_1) {
    ret += ` ${address.address_1}`
  }

  if (address.address_2) {
    ret += `, ${address.address_2}`
  }

  if (address.postal_code) {
    ret += `, ${address.postal_code} ${address.city}`
  }

  if (address.country_code) {
    ret += `, ${address.country_code.toUpperCase()}`
  }

  return ret
}

const Shipping: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods,
  repairsInCart,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)
  const [selectedPoint, setSelectedPoint] = useState<{
    name: string
    code: string
  } | null>(() => {
    const name = cart.metadata?.parcel_locker_name
    const code = cart.metadata?.parcel_locker_code

    return typeof name === "string" && typeof code === "string"
      ? { name, code }
      : null
  })

  const [showPickupOptions, setShowPickupOptions] =
    useState<string>(PICKUP_OPTION_OFF)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<
    Record<string, number>
  >({})
  const [error, setError] = useState<string | null>(null)
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    cart.shipping_methods?.at(-1)?.shipping_option_id || null
  )
  const [isRepairShippingUpdating, setIsRepairShippingUpdating] =
    useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "delivery"

  const _shippingMethods = availableShippingMethods?.filter(
    (sm) =>
      (
        sm as unknown as {
          service_zone?: {
            fulfillment_set?: {
              type?: string
              location?: { address: HttpTypes.StoreCartAddress }
            }
          }
        }
      ).service_zone?.fulfillment_set?.type !== "pickup"
  )

  const _pickupMethods = availableShippingMethods?.filter(
    (sm) =>
      (
        sm as unknown as {
          service_zone?: {
            fulfillment_set?: {
              type?: string
              location?: { address: HttpTypes.StoreCartAddress }
            }
          }
        }
      ).service_zone?.fulfillment_set?.type === "pickup"
  )

  const showFurgonetkaMap = () => {
    if (!window.Furgonetka) {
      return
    }

    const map = new window.Furgonetka.Map({
      apiKey: process.env.NEXT_PUBLIC_FURGONETKA_MAP_KEY!,
      courierServices: ["inpost"],

      callback: (params) => {
        setSelectedPoint(params.point)

        setParcelLockerPoint({
          cartId: cart.id,
          existingMetadata: cart.metadata,
          parcel_locker_name: params.point.name,
          parcel_locker_code: params.point.code,
        })
      },
    })

    map.show()
  }

  const hasPickupOptions = !!_pickupMethods?.length

  const selectedShippingMethod = _shippingMethods?.find(
    (option) => option.id === shippingMethodId
  )

  useEffect(() => {
    setIsLoadingPrices(true)

    if (_shippingMethods?.length) {
      const promises = _shippingMethods
        .filter((sm) => sm.price_type === "calculated")
        .map((sm) => calculatePriceForShippingOption(sm.id, cart.id))

      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap: Record<string, number> = {}
          res
            .filter((r) => r.status === "fulfilled")
            .forEach((p) => {
              if (p.value?.id) {
                pricesMap[p.value.id] = p.value.amount ?? 0
              }
            })

          setCalculatedPricesMap(pricesMap)
          setIsLoadingPrices(false)
        })
      }
    }

    if (_pickupMethods?.find((m) => m.id === shippingMethodId)) {
      setShowPickupOptions(PICKUP_OPTION_ON)
    }
  }, [availableShippingMethods])

  const handleEdit = () => {
    router.push(pathname + "?step=delivery", { scroll: false })
  }

  const handleSubmit = () => {
    router.push(pathname + "?step=payment", { scroll: false })
  }

  const handleSetShippingMethod = async (
    id: string,
    variant: "shipping" | "pickup"
  ) => {
    setError(null)

    if (variant === "pickup") {
      setShowPickupOptions(PICKUP_OPTION_ON)
    } else {
      setShowPickupOptions(PICKUP_OPTION_OFF)
    }

    let currentId: string | null = null
    setIsLoading(true)
    setShippingMethodId((prev) => {
      currentId = prev
      return id
    })

    await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
      .catch((err) => {
        setShippingMethodId(currentId)

        setError(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <>
      <Script
        src="https://furgonetka.pl/js/dist/map/map.js"
        async
        strategy="afterInteractive"
      />
      <div className="bg-white">
        <div className="flex flex-row items-center justify-between">
          {!isOpen && (
            <>
              <Heading
                level="h2"
                className={clx(
                  "flex flex-row text-3xl-regular gap-x-2 items-baseline",
                  {
                    "opacity-50 pointer-events-none select-none":
                      cart.shipping_methods?.length === 0,
                  }
                )}
              >
                Dostawa {repairsInCart && "i odbiór"}
                {(cart.shipping_methods?.length ?? 0) > 0 && (
                  <CheckCircleSolid />
                )}
              </Heading>
              {(cart.shipping_methods?.length ?? 0) > 0 && (
                <Text>
                  <button
                    onClick={handleEdit}
                    className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
                    data-testid="edit-delivery-button"
                  >
                    Edytuj
                  </button>
                </Text>
              )}
            </>
          )}
        </div>
        {repairsInCart && (
          <RepairShipping
            cart={cart}
            isOpen={isOpen}
            onUpdatingChange={setIsRepairShippingUpdating}
          />
        )}
        {isOpen ? (
          <>
            {isOpen && (
              <Heading
                level="h2"
                className={
                  "flex flex-row text-3xl-regular gap-x-2 items-baseline my-6"
                }
              >
                Dostawa {repairsInCart && "produktów / Odbiór sprzętu"}
              </Heading>
            )}
            <div className="grid">
              <Text className="txt-medium-plus text-ui-fg-base pb-4">
                Wybierz metodę dostawy produktów
                {repairsInCart &&
                  " (Jeśli zamówienie obejmuje produkty i usługę, produkty zostaną dostarczone razem z naprawionym sprzętem)"}
              </Text>
              <div data-testid="delivery-options-container">
                <div className="pb-8 md:pt-0 pt-2">
                  {hasPickupOptions && (
                    <RadioGroup
                      value={showPickupOptions}
                      onChange={(_value) => {
                        const id = _pickupMethods.find(
                          (option) => !option.insufficient_inventory
                        )?.id

                        if (id) {
                          handleSetShippingMethod(id, "pickup")
                        }
                      }}
                    >
                      <Radio
                        value={PICKUP_OPTION_ON}
                        data-testid="delivery-option-radio"
                        className={clx(
                          "flex items-center justify-between text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:shadow-borders-interactive-with-active",
                          {
                            "border-ui-border-interactive":
                              showPickupOptions === PICKUP_OPTION_ON,
                          }
                        )}
                      >
                        <div className="flex items-center">
                          <MedusaRadio
                            checked={showPickupOptions === PICKUP_OPTION_ON}
                          />
                          <span className="text-base-regular">
                            Odbierz swoje zamówienie
                          </span>
                        </div>
                        <span className="justify-self-end text-ui-fg-base">
                          -
                        </span>
                      </Radio>
                    </RadioGroup>
                  )}
                  <RadioGroup
                    value={shippingMethodId}
                    onChange={(v) => {
                      if (v) {
                        return handleSetShippingMethod(v, "shipping")
                      }
                    }}
                  >
                    {_shippingMethods?.map((option) => {
                      const isDisabled =
                        option.price_type === "calculated" &&
                        !isLoadingPrices &&
                        typeof calculatedPricesMap[option.id] !== "number"

                      return (
                        <Radio
                          key={option.id}
                          value={option.id}
                          data-testid="delivery-option-radio"
                          disabled={isDisabled}
                          className={clx(
                            "flex items-center justify-between text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:shadow-borders-interactive-with-active",
                            {
                              "border-ui-border-interactive":
                                option.id === shippingMethodId,
                              "hover:shadow-brders-none cursor-not-allowed":
                                isDisabled,
                            }
                          )}
                        >
                          <div className="flex items-center">
                            <MedusaRadio
                              checked={option.id === shippingMethodId}
                            />
                            <div className="flex h-10 w-[72px] shrink-0 items-center justify-center small:h-16 small:w-[120px]">
                              <Image
                                src={
                                  option.name.includes("Paczkomat")
                                    ? "/images/shipping/inpost_paczkomaty.png"
                                    : "/images/shipping/inpost_kurier.png"
                                }
                                alt={option.id}
                                width={120}
                                height={56}
                                className="h-full w-full object-contain"
                              />
                            </div>
                            <span className="text-base-regular">
                              {option.name}
                            </span>
                            {option.name.includes("Paczkomat") && (
                              <>
                                <button
                                  type="button"
                                  disabled={option.id !== shippingMethodId}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    showFurgonetkaMap()
                                  }}
                                  className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover disabled:text-ui-fg-disabled underline test-small-regular pl-4"
                                >
                                  Wybierz paczkomat
                                </button>
                                {option.id === shippingMethodId &&
                                  selectedPoint && (
                                    <span className="text-small-regular text-ui-fg-subtle">
                                      {selectedPoint.name}
                                    </span>
                                  )}
                              </>
                            )}
                          </div>
                          <span className="justify-self-end text-ui-fg-base">
                            {option.price_type === "flat" ? (
                              convertToLocale({
                                amount: option.amount!,
                                currency_code: cart?.currency_code,
                              })
                            ) : calculatedPricesMap[option.id] ? (
                              convertToLocale({
                                amount: calculatedPricesMap[option.id],
                                currency_code: cart?.currency_code,
                              })
                            ) : isLoadingPrices ? (
                              <Loader />
                            ) : (
                              "-"
                            )}
                          </span>
                        </Radio>
                      )
                    })}
                  </RadioGroup>
                </div>
              </div>
            </div>
            <div>
              <ErrorMessage
                error={error}
                data-testid="delivery-option-error-message"
              />
              <Button
                size="large"
                className="mt"
                onClick={handleSubmit}
                isLoading={isLoading || isRepairShippingUpdating}
                disabled={!cart.shipping_methods?.[0]}
                data-testid="submit-delivery-option-button"
              >
                Przejdź do płatności
              </Button>
            </div>
          </>
        ) : (
          <div className="mt-6">
            <div className="text-small-regular">
              {cart && (cart.shipping_methods?.length ?? 0) > 0 && (
                <div className="flex flex-row items-center justify-between w-full">
                  <div className="flex flex-1">
                    <div className="flex flex-col w-2/5">
                      <Text className="txt-medium-plus text-ui-fg-base mb-1">
                        Metoda dostawy {repairsInCart && " / Odbioru sprzętu"}
                      </Text>
                      <Text className="txt-medium text-ui-fg-subtle">
                        {cart.shipping_methods!.at(-1)!.name}{" "}
                        {convertToLocale({
                          amount: cart.shipping_methods!.at(-1)!.amount!,
                          currency_code: cart?.currency_code,
                        })}
                      </Text>
                    </div>
                    {cart
                      .shipping_methods!.at(-1)!
                      .name.includes("Paczkomat") &&
                      selectedPoint && (
                        <Text className="txt-medium text-ui-fg-subtle self-end pl-4 sm:pl-0">
                          {selectedPoint.name}
                        </Text>
                      )}
                  </div>
                  <div className="flex h-8 w-[64px] shrink-0 items-center justify-center small:h-10 small:w-[80px]">
                    <Image
                      src={
                        cart
                          .shipping_methods!.at(-1)!
                          .name.includes("Paczkomat")
                          ? "/images/shipping/inpost_paczkomaty.png"
                          : "/images/shipping/inpost_kurier.png"
                      }
                      alt={cart.shipping_methods!.at(-1)!.name}
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
        <Divider className="mt-8" />
      </div>
    </>
  )
}

export default Shipping
