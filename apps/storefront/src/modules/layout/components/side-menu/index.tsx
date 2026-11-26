"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { retrieveCustomer } from "@lib/data/customer"
import { sdk } from "@lib/config"
import { XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Fragment, useRef, useState, type TouchEvent } from "react"
import { Locale } from "@lib/data/locales"
import Menu from "@modules/common/icons/menu"
import CompanyLogo from "../company-logo/index."
import Divider from "@modules/common/components/divider"
import { filterCategoriesByHandle } from "@lib/util/product"

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
  categories: HttpTypes.StoreProductCategory[] | null
}

const SideMenu = ({
  regions,
  locales,
  currentLocale,
  categories,
}: SideMenuProps) => {
  const touchStart = useRef<{ id: number; x: number; y: number } | null>(null)
  const [customerLoggedIn, setCustomerLoggedIn] = useState(false)
  const productCategories = filterCategoriesByHandle(
    categories,
    "service",
    false
  )
  const serviceCategories = filterCategoriesByHandle(
    categories,
    "service",
    true
  )

  // GESTURE SWIPE TO CLOSE THE SIDE MENU
  const handleTouchStart = (event: TouchEvent<HTMLElement>) => {
    if (event.touches.length !== 1) {
      touchStart.current = null
      return
    }

    const touch = event.touches[0]
    touchStart.current = {
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY,
    }
  }
  const handleTouchEnd = (
    event: TouchEvent<HTMLElement>,
    close: () => void
  ) => {
    const start = touchStart.current
    touchStart.current = null

    if (!start || event.touches.length > 0) {
      return
    }

    const touch = Array.from(event.changedTouches).find(
      (changedTouch) => changedTouch.identifier === start.id
    )

    if (!touch) {
      return
    }

    const horizontalDistance = start.x - touch.clientX
    const verticalDistance = Math.abs(start.y - touch.clientY)

    if (horizontalDistance >= 60 && horizontalDistance > verticalDistance) {
      close()
    }
  }

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  aria-label="Otwórz menu"
                  onClick={() => {
                    if (!open) {
                      void retrieveCustomer()
                        .then((customer) => setCustomerLoggedIn(!!customer))
                        .catch(() => {})
                    }
                  }}
                  className="relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none hover:text-ui-fg-base"
                >
                  <Menu />
                </Popover.Button>
              </div>

              {open && (
                <div
                  className="fixed inset-0 z-[60] bg-black/0 pointer-events-auto"
                  onClick={close}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={(event) => handleTouchEnd(event, close)}
                  onTouchCancel={() => {
                    touchStart.current = null
                  }}
                  data-testid="side-menu-backdrop"
                />
              )}

              <Transition
                show={open}
                as={Fragment}
                enter="transition-transform ease-out duration-200"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition-transform ease-in duration-200"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <PopoverPanel
                  className="fixed inset-y-0 left-0 z-[60] flex h-screen h-[100dvh] w-4/5 flex-col border-r border-gray-200 bg-white text-sm text-ui-fg-base small:w-1/3 2xlarge:w-1/4"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={(event) => handleTouchEnd(event, close)}
                  onTouchCancel={() => {
                    touchStart.current = null
                  }}
                >
                  <div
                    data-testid="nav-menu-popup"
                    className="flex h-full flex-col overflow-y-auto p-6"
                  >
                    <div className="flex justify-end" id="xmark">
                      <CompanyLogo nav={false} />
                      <button
                        data-testid="close-menu-button"
                        onClick={close}
                        aria-label="Zamknij menu"
                      >
                        <XMark />
                      </button>
                    </div>
                    <Divider className="mt-4 mb-4" />
                    <ul className="flex flex-col flex-1 gap-6 items-start pt-6">
                      <li>
                        <LocalizedClientLink
                          href="/repair-shop"
                          className="text-3xl text-ui-fg-subtle hover:text-ui-fg-base"
                          onClick={close}
                          data-testid="repair-shop-link"
                        >
                          Serwis
                        </LocalizedClientLink>
                      </li>
                      {serviceCategories?.map((category) => (
                        <li key={category.id}>
                          <LocalizedClientLink
                            href={`/categories/${category.handle}`}
                            className="text-2xl leading-5 ml-5 font-normal text-ui-fg-subtle hover:text-ui-fg-base"
                            onClick={close}
                            data-testid={`category-link-${category.id}`}
                          >
                            {category.name}
                          </LocalizedClientLink>
                        </li>
                      ))}
                      <li>
                        <LocalizedClientLink
                          href="/store"
                          className="text-3xl leading-10 text-ui-fg-subtle hover:text-ui-fg-base"
                          onClick={close}
                          data-testid="store-link"
                        >
                          Sklep
                        </LocalizedClientLink>
                      </li>
                      {productCategories?.map((category) => (
                        <li key={category.id}>
                          <LocalizedClientLink
                            href={`/categories/${category.handle}`}
                            className="text-2xl leading-5 ml-5 font-normal text-ui-fg-subtle hover:text-ui-fg-base"
                            onClick={close}
                            data-testid={`category-link-${category.id}`}
                          >
                            {category.name}
                          </LocalizedClientLink>
                        </li>
                      ))}
                      <li>
                        <LocalizedClientLink
                          href="/contact"
                          className="text-3xl leading-10 text-ui-fg-subtle hover:text-ui-fg-base"
                          onClick={close}
                          data-testid="contact-link"
                        >
                          Kontakt
                        </LocalizedClientLink>
                      </li>
                      <li className="mt-auto w-full">
                        <Divider className="mb-4" />
                        <LocalizedClientLink
                          href="/account"
                          className="text-3xl text-ui-fg-subtle hover:text-ui-fg-base"
                          onClick={close}
                          data-testid="account-link"
                        >
                          {customerLoggedIn ? "Konto" : "Zaloguj się"}
                        </LocalizedClientLink>
                      </li>
                    </ul>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
