"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { StoreProductCategory } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"
import { Fragment, useState } from "react"

const ShopDropdown = ({
  categories: categories,
}: {
  categories?: StoreProductCategory[] | null
}) => {
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false)

  const open = () => setShopDropdownOpen(true)
  const close = () => setShopDropdownOpen(false)

  return (
    <div className="h-full z-50" onMouseEnter={open} onMouseLeave={close}>
      <Popover className="relative h-full">
        <PopoverButton className="h-full">
          <LocalizedClientLink
            className="hover:text-ui-fg-base"
            href="/store"
            data-testid="nav-store-link"
          >{`Sklep`}</LocalizedClientLink>
        </PopoverButton>
        <Transition
          show={shopDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel
            static
            className="hidden small:block absolute top-[calc(100%+1px)] left-[-300px] bg-white border-x border-b border-gray-200 w-[800px] text-ui-fg-base"
            data-testid="nav-cart-dropdown"
          >
            <div className="overflow-y-scroll max-h-[402px] px-4 py-4 grid grid-cols-1 gap-y-8 no-scrollbar">
              {categories && categories?.length > 0 && (
                <div className="flex flex-col ">
                  <ul
                    className="grid grid-cols-3 "
                    data-testid="navbar-categories"
                  >
                    {categories?.map((c) => {
                      if (c.parent_category) {
                        return
                      }

                      const children =
                        c.category_children?.map((child) => ({
                          name: child.name,
                          handle: child.handle,
                          id: child.id,
                        })) || null

                      return (
                        <li
                          className="flex flex-col gap-2 text-ui-fg-subtle"
                          key={c.id}
                        >
                          <LocalizedClientLink
                            className={clx(
                              "hover:text-ui-fg-base",
                              children && "txt-small text-[18px] font-semibold"
                            )}
                            href={`/categories/${c.handle}`}
                            data-testid="category-link"
                          >
                            {c.name}
                          </LocalizedClientLink>
                          {children && (
                            <ul className="grid grid-cols-1 ml-3 gap-2">
                              {children &&
                                children.map((child) => (
                                  <li key={child.id}>
                                    <LocalizedClientLink
                                      className="hover:text-ui-fg-base txt-small text-[16px]"
                                      href={`/categories/${child.handle}`}
                                      data-testid="category-link"
                                    >
                                      {child.name}
                                    </LocalizedClientLink>
                                  </li>
                                ))}
                            </ul>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default ShopDropdown
