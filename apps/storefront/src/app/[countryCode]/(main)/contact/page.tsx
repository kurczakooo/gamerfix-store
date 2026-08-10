import { Heading } from "@modules/common/components/ui"
import TikTok from "@modules/common/icons/tiktok"
import Youtube from "@modules/common/icons/youtube"
import Facebook from "@modules/common/icons/facebook"
import { Metadata } from "next"
import Phone from "@modules/common/icons/phone"
import Email from "@modules/common/icons/email"
import Clock from "@modules/common/icons/clock"
import contactInfo from "../../../../../data/contact.json"
import ContactForm from "@modules/subpages/templates/contact-form"

export const metadata: Metadata = {
  title: "Kontakt | Gamer Fix - Serwis i sklep z konso",
  description: "Skontaktuj się z nami, ",
}

export default async function Contact() {
  return (
    <div className="content-container" data-testid="contact-container">
      <div className="py-6 px-2">
        <Heading level="h1" className="text-3xl-regular">
          Informacje kontaktowe
        </Heading>

        <div className="pt-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="flex flex-col gap-10">
            <section>
              <h2 className="text-xl font-semibold text-ui-fg-base mb-4">
                Dane firmy
              </h2>

              <div className=" text-base text-ui-fg-subtle leading-7">
                <p>{contactInfo.companyName}</p>
                <p>{contactInfo.addressLine1}</p>
                <p>{contactInfo.addressLine2}</p>
                <p>NIP: {contactInfo.nip}</p>
                <p>REGON: {contactInfo.regon}</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ui-fg-base mb-4">
                Dane kontaktowe
              </h2>

              <div className="text-base text-ui-fg-subtle leading-9">
                <a className="hover:text-ui-fg-base">
                  <div className="flex items-center gap-1">
                    <Phone />
                    {contactInfo.phone}
                  </div>
                </a>
                <a className="hover:text-ui-fg-base">
                  <div className="flex items-center gap-1">
                    <Email />
                    {contactInfo.email}
                  </div>
                </a>
                <a className="hover:text-ui-fg-base">
                  <div className="flex items-center gap-1">
                    <Clock />
                    {contactInfo.openHours}
                  </div>
                </a>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ui-fg-base mb-4">
                Social media
              </h2>

              <div className="text-base text-ui-fg-subtle leading-9">
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
              </div>
            </section>
          </div>
          <div className="rounded-lg border border-ui-border-base p-8 min-h-[500px]">
            <h2 className="text-xl font-semibold text-ui-fg-base mb-2">
              Formularz kontaktowy
            </h2>
            <div className="text-base text-ui-fg-subtle leading-9 mb-8">
              Wypełnij formularz, wyślij zapytanie i odezwiemy się do ciebie!
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
