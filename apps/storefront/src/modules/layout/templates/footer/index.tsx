import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text } from "@modules/common/components/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import TikTok from "@modules/common/icons/tiktok"
import Facebook from "@modules/common/icons/facebook"
import Youtube from "@modules/common/icons/youtube"
import Phone from "@modules/common/icons/phone"
import Email from "@modules/common/icons/email"

import contactInfo from "../../../../../data/contact.json"
import CompanyLogo from "@modules/layout/components/company-logo/index."

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="border-t border-ui-border-base w-full bg-white">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-6 xsmall:flex-row items-start justify-between py-20">
          <div>
            <CompanyLogo />
            <ul className="grid grid-cols-1 gap-y-2 pt-2 text-ui-fg-subtle text-small-base">
              <li className="hover:text-ui-fg-base">
                <div className="flex items-center gap-1">
                  <Phone />
                  {contactInfo.phone}
                </div>
              </li>
              <li className="hover:text-ui-fg-base">
                <div className="flex items-center gap-1">
                  <Email />
                  {contactInfo.email}
                </div>
              </li>
            </ul>
          </div>
          <div className="text-small-regular gap-10 md:gap-x-16 grid grid-cols-2 sm:grid-cols-4">
            <div className="flex flex-col gap-y-2">
              <span className="text-ui-fg-base font-bold">Pomoc</span>
              <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle text-small-base">
                <li>
                  <LocalizedClientLink
                    href="/contact"
                    className="hover:text-ui-fg-base"
                  >
                    Kontakt
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/faq"
                    className="hover:text-ui-fg-base"
                  >
                    FAQ
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/terms-of-use"
                    className="hover:text-ui-fg-base"
                  >
                    Regulamin sklepu i serwisu
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/privacy-policy"
                    className="hover:text-ui-fg-base"
                  >
                    Polityka prywatności
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/ship-and-pay"
                    className="hover:text-ui-fg-base"
                  >
                    Dostawa i płatność
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/returns"
                    className="hover:text-ui-fg-base"
                  >
                    Zwroty i reklamacje
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-y-2">
              <span className="text-ui-fg-base font-bold">
                Więcej o Gamer Fix
              </span>
              <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle text-small-base">
                <li>
                  <LocalizedClientLink
                    href="/about"
                    className="hover:text-ui-fg-base"
                  >
                    O firmie
                  </LocalizedClientLink>
                </li>
                <li>
                  <a
                    href="https://www.tiktok.com/@gamerfix.serwis"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-ui-fg-base"
                  >
                    <div className="flex items-center gap-1">
                      <TikTok />
                      TikTok
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/profile.php?id=61589715426415"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-ui-fg-base"
                  >
                    <div className="flex items-center gap-1">
                      <Facebook />
                      Facebook
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@gamer-fix-serwis/featured"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-ui-fg-base"
                  >
                    <div className="flex items-center gap-1">
                      <Youtube />
                      YouTube
                    </div>
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-y-2">
              <span className="text-small-base-plus txt-ui-fg-base">
                REVIEWS
              </span>
            </div>
          </div>
        </div>
        <div className="flex w-full mb-8 justify-between text-ui-fg-muted">
          <Text className="text-xs">
            © {new Date().getFullYear()} Gamer Fix
          </Text>
        </div>
      </div>
    </footer>
  )
}
