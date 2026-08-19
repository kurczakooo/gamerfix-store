"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"
import Image from "next/image"

const CompanyLogo = ({ nav }: { nav?: boolean }) => {
  const navAdjustment = nav ? "justify-center" : "justify-start"

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
        <Image
          src="/android-chrome-192x192.png"
          alt="Gamer Fix logo"
          width={48}
          height={48}
          className="w-11 h-11 sm:w-12 sm:h-12"
        />
        Gamer Fix
      </LocalizedClientLink>
    </>
  )
}

export default CompanyLogo
