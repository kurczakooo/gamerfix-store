import { Suspense } from "react"

import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import Cart from "@modules/common/icons/cart"
import CartButtonTotalItems from "@modules/layout/components/cart-button/button-total-items"
import ShopButton from "@modules/layout/components/shop-button"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b duration-200 bg-white border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex small:hidden flex basis-0 h-full items-center">
            <div className="h-full text-xl font-semibold">
              <SideMenu
                regions={regions}
                locales={locales}
                currentLocale={currentLocale}
              />
            </div>
          </div>

          <div className="flex flex-1 small:flex-none items-center justify-center h-full">
            <LocalizedClientLink
              href="/"
              className="hover:text-ui-fg-base text-xl"
              data-testid="nav-store-link"
            >
              GAMER FIX
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-12 h-full justify-center text-xl font-semibold">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <Suspense
                fallback={
                  <LocalizedClientLink
                    className="hover:text-ui-fg-base flex gap-2"
                    href="/store"
                    data-testid="nav-store-link"
                  ></LocalizedClientLink>
                }
              >
                <ShopButton />
              </Suspense>
            </div>
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/services"
                data-testid="nav-services-link"
              >
                Serwis
              </LocalizedClientLink>
            </div>
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/contact"
                data-testid="nav-contact-link"
              >
                Kontakt
              </LocalizedClientLink>
            </div>
          </div>
          <div className="flex items-center gap-x-6 h-full text-xl font-semibold">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/account"
                data-testid="nav-account-link"
              >
                Konto
              </LocalizedClientLink>
            </div>
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <Suspense
                fallback={
                  <LocalizedClientLink
                    className="hover:text-ui-fg-base flex gap-2"
                    href="/cart"
                    data-testid="nav-cart-link"
                  ></LocalizedClientLink>
                }
              >
                <CartButton />
              </Suspense>
            </div>
            <div className="flex small:hidden items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="hover:text-ui-fg-base flex gap-2"
                href="/cart"
                data-testid="nav-cart-link"
              >
                <div className="flex flex-1 items-center">
                  <Cart />
                  <CartButtonTotalItems />
                </div>
              </LocalizedClientLink>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
