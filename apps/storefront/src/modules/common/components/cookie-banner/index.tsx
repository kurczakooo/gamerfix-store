"use client"

import { Button, Text } from "@modules/common/components/ui"
import { useEffect, useState } from "react"

const COOKIE_CONSENT_STORAGE_KEY = "gamerfix-cookie-consent-acknowledged"

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasAcknowledged = window.localStorage.getItem(
      COOKIE_CONSENT_STORAGE_KEY
    )

    if (!hasAcknowledged) {
      setIsVisible(true)
    }
  }, [])

  const handleAcknowledge = () => {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, "true")
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div className="flex w-full small:w-[60%] flex-col items-center gap-3 rounded-large border border-grey-20 bg-white p-4 shadow-xl small:flex-row small:justify-between small:gap-6 small:py-3">
        <Text className="text-small-regular text-grey-70 text-center small:text-left">
          Używamy wyłącznie niezbędnych plików cookie, które są konieczne do
          prawidłowego działania sklepu i realizacji zamówień. Nie używamy
          plików cookie do celów marketingowych ani reklamowych.
        </Text>

        <Button
          variant="primary"
          size="small"
          className="w-full small:w-auto shrink-0"
          onClick={handleAcknowledge}
        >
          Rozumiem
        </Button>
      </div>
    </div>
  )
}
