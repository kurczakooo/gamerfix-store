"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders, getCacheOptions, getCacheTag } from "./cookies"
import medusaError from "@lib/util/medusa-error"
import { revalidateTag } from "next/cache"

export const listCartShippingMethods = async (cartId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("fulfillment")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreShippingOptionListResponse>(
      `/store/shipping-options`,
      {
        method: "GET",
        query: {
          cart_id: cartId,
        },
        headers,
        next,
        cache: "no-store",
      }
    )
    .then(({ shipping_options }) => shipping_options)
    .catch(() => {
      return null
    })
}

export const calculatePriceForShippingOption = async (
  optionId: string,
  cartId: string,
  data?: Record<string, unknown>
) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("fulfillment")),
  }

  const body = { cart_id: cartId, data }

  if (data) {
    body.data = data
  }

  return sdk.client
    .fetch<{ shipping_option: HttpTypes.StoreCartShippingOption }>(
      `/store/shipping-options/${optionId}/calculate`,
      {
        method: "POST",
        body,
        headers,
        next,
      }
    )
    .then(({ shipping_option }) => shipping_option)
    .catch((_e) => {
      return null
    })
}

export async function setSendToServiceMethod({
  cartId,
  existingMetadata,
  sent_to_service_method,
}: {
  cartId: string
  existingMetadata?: Record<string, unknown> | null
  sent_to_service_method: string | null
}) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .update(
      cartId,
      {
        metadata: {
          ...existingMetadata,
          sent_to_service_method: sent_to_service_method,
        },
      },
      {},
      headers
    )
    .then(async ({ cart }: { cart: HttpTypes.StoreCart }) => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      return cart
    })
    .catch(medusaError)
}

export async function setParcelLockerPoint({
  cartId,
  existingMetadata,
  parcel_locker_name,
  parcel_locker_code,
}: {
  cartId: string
  existingMetadata?: Record<string, unknown> | null
  parcel_locker_name: string | null
  parcel_locker_code: string | null
}) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .update(
      cartId,
      {
        metadata: {
          ...existingMetadata,
          parcel_locker_name: parcel_locker_name,
          parcel_locker_code: parcel_locker_code,
        },
      },
      {},
      headers
    )
    .then(async ({ cart }: { cart: HttpTypes.StoreCart }) => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      return cart
    })
    .catch(medusaError)
}
