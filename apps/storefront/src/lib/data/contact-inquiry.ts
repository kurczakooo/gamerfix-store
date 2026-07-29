"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders } from "./cookies"
import medusaError from "@lib/util/medusa-error"

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

  return sdk.client
    .fetch("/store/inquiries", {
      method: "POST",
      headers,
      body: {
        name,
        email,
        phone: phone || null,
        subject,
        content,
      },
    })
    .then(() => {
      return "Inquiry sent successfully"
    })
    .catch(medusaError)
}
