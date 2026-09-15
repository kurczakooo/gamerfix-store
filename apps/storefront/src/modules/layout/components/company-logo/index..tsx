"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"
import Image from "next/image"
import { useEffect, useState } from "react"

const icons = [
  "/images/content/controller192.webp",
  "/images/content/ps5192.webp",
  "/images/content/phone192.webp",
  "/images/content/xbox192.webp",
  "/images/content/laptop192.webp",
]

const ICON_INDEX_KEY = "gamer-fix-logo-index"
let currentIcon: string | null = null

const CompanyLogo = ({ nav }: { nav?: boolean }) => {
  const navAdjustment = nav ? "justify-center" : "justify-start"

  const [icon, setIcon] = useState<string | null>(currentIcon)

  useEffect(() => {
    if (!currentIcon) {
      let nextIndex = 0

      try {
        const savedIndex = Number(localStorage.getItem(ICON_INDEX_KEY))
        nextIndex = Number.isInteger(savedIndex) ? savedIndex % icons.length : 0
        localStorage.setItem(
          ICON_INDEX_KEY,
          String((nextIndex + 1) % icons.length)
        )
      } catch {
        nextIndex = Math.floor(Math.random() * icons.length)
      }

      currentIcon = icons[nextIndex]
    }

    setIcon(currentIcon)
  }, [])

  return (
    <>
      <LocalizedClientLink
        href="/"
        className={clx(
          "hover:text-ui-fg-base text-ui-fg-subtle text-xl-regular font-medium flex flex-1 small:flex-none items-center h-full gap-1",
          navAdjustment
        )}
        data-testid="nav-store-link"
      >
        <span className="w-11 h-11 sm:w-12 sm:h-12">
          {icon && (
            <Image
              src={icon}
              alt="Gamer Fix logo"
              width={48}
              height={48}
              className="w-11 h-11 sm:w-12 sm:h-12"
            />
          )}
        </span>
        Gamer Fix
      </LocalizedClientLink>
    </>
  )
}

export default CompanyLogo
