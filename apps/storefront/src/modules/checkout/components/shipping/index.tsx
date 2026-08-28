"use client"
import { Radio, RadioGroup } from "@headlessui/react"
import { setParcelLockerPoint, setShippingMethod } from "@lib/data/cart"
import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
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
import Image from "next/image"

const PICKUP_OPTION_ON = "__PICKUP_ON"
const PICKUP_OPTION_OFF = "__PICKUP_OFF"

type ShippingProps = {
  cart: HttpTypes.StoreCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
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

function formatAddress(address: HttpTypes.StoreCartAddress) {
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
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)
  const [selectedPoint, setSelectedPoint] = useState<{
    name: string
    code: string
  } | null>(
    (cart.metadata?.parcel_locker_point as {
      name: string
      code: string
    } | null) ?? null
  )

  const [showPickupOptions, setShowPickupOptions] =
    useState<string>(PICKUP_OPTION_OFF)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<
    Record<string, number>
  >({})
  const [error, setError] = useState<string | null>(null)
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    cart.shipping_methods?.at(-1)?.shipping_option_id || null
  )

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
          point: params.point,
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
        <div className="flex flex-row items-center justify-between mb-6">
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
            Dostawa
            {!isOpen && (cart.shipping_methods?.length ?? 0) > 0 && (
              <CheckCircleSolid />
            )}
          </Heading>
          {!isOpen &&
            cart?.shipping_address &&
            cart?.billing_address &&
            cart?.email && (
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
        </div>
        {isOpen ? (
          <>
            <div className="grid">
              <div className="flex flex-col">
                <span className="font-medium txt-medium text-ui-fg-base mb-4">
                  Wybierz metodę dostawy
                </span>
              </div>
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
                        <div className="flex items-center gap-x-4">
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
                          <div className="flex items-center gap-x-4">
                            <MedusaRadio
                              checked={option.id === shippingMethodId}
                            />
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
                                  className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover disabled:text-ui-fg-disabled underline test-small-regular"
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

            {showPickupOptions === PICKUP_OPTION_ON && (
              <div className="grid">
                <div className="flex flex-col">
                  <span className="font-medium txt-medium text-ui-fg-base">
                    Odbierz w sklepie
                  </span>
                  <span className="mb-4 text-ui-fg-muted txt-medium">
                    Wybierz sklep w pobliżu
                  </span>
                </div>
                <div data-testid="delivery-options-container">
                  <div className="pb-8 md:pt-0 pt-2">
                    <RadioGroup
                      value={shippingMethodId}
                      onChange={(v) => {
                        if (v) {
                          return handleSetShippingMethod(v, "pickup")
                        }
                      }}
                    >
                      {_pickupMethods?.map((option) => {
                        return (
                          <Radio
                            key={option.id}
                            value={option.id}
                            disabled={option.insufficient_inventory}
                            data-testid="delivery-option-radio"
                            className={clx(
                              "flex items-center justify-between text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:shadow-borders-interactive-with-active",
                              {
                                "border-ui-border-interactive":
                                  option.id === shippingMethodId,
                                "hover:shadow-brders-none cursor-not-allowed":
                                  option.insufficient_inventory,
                              }
                            )}
                          >
                            <div className="flex items-start gap-x-4">
                              <MedusaRadio
                                checked={option.id === shippingMethodId}
                              />
                              <div className="flex flex-col">
                                <span className="text-base-regular">
                                  {option.name}
                                </span>
                                <span className="text-base-regular text-ui-fg-muted">
                                  {formatAddress(
                                    (
                                      option as unknown as {
                                        service_zone?: {
                                          fulfillment_set?: {
                                            location?: {
                                              address: HttpTypes.StoreCartAddress
                                            }
                                          }
                                        }
                                      }
                                    ).service_zone?.fulfillment_set?.location
                                      ?.address as HttpTypes.StoreCartAddress
                                  )}
                                </span>
                              </div>
                            </div>
                            <span className="justify-self-end text-ui-fg-base">
                              {convertToLocale({
                                amount: option.amount!,
                                currency_code: cart?.currency_code,
                              })}
                            </span>
                          </Radio>
                        )
                      })}
                    </RadioGroup>
                  </div>
                </div>
              </div>
            )}

            <div>
              <ErrorMessage
                error={error}
                data-testid="delivery-option-error-message"
              />
              <Button
                size="large"
                className="mt"
                onClick={handleSubmit}
                isLoading={isLoading}
                disabled={
                  !cart.shipping_methods?.[0] ||
                  (selectedShippingMethod?.name.includes("Paczkomat") &&
                    !selectedPoint)
                }
                data-testid="submit-delivery-option-button"
              >
                Przejdź do płatności
              </Button>
            </div>
          </>
        ) : (
          <div>
            <div className="text-small-regular">
              {cart && (cart.shipping_methods?.length ?? 0) > 0 && (
                <div className="flex flex-row items-center justify-between w-full">
                  <div className="flex">
                    <div className="flex flex-col w-1/3">
                      <Text className="txt-medium-plus text-ui-fg-base mb-1">
                        Metoda dostawy
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
                  <Image
                    src={
                      cart.shipping_methods!.at(-1)!.name.includes("Paczkomat")
                        ? "/images/shipping/inpost_paczkomaty.png"
                        : "/images/shipping/inpost_kurier.png"
                    }
                    alt={cart.shipping_methods!.at(-1)!.name}
                    width={80}
                    height={40}
                    className="object-contain"
                  />
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
