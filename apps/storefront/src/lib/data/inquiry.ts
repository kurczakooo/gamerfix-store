"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  removeCartId,
  setCartId,
} from "./cookies"
import { getRegion } from "./regions"
import { getLocale } from "./locale-actions"

export async function sendInquiry({
  name,
  email,
  phone,
  subject,
  content,
}: {
  name: string
  email: string
  phone: string
  subject: string
  content: string
}) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  console.log(name, email, phone, subject, content)

  return content
}
