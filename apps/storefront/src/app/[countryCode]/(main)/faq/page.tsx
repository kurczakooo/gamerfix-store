import { Heading } from "@modules/common/components/ui"
import { Metadata } from "next"
import faq from "../../../../../data/faq.json"
import Accordion from "@modules/products/components/product-tabs/accordion"

export const metadata: Metadata = {
  title: "FAQ | Gamer Fix",
  description: "Pytania, które klienci zadają najczęściej i odpowiedzi do nich",
}

export default async function About() {
  return (
    <div className="content-container" data-testid="cart-container">
      <div className="py-6 px-2 flex flex-col justify-center items-start">
        <Heading
          level="h1"
          className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
        >
          Najczęściej zadawane pytania
        </Heading>

        <div className="pt-8 pb-2 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {faq.map((section) => (
              <div key={section.category} className="flex flex-col">
                <h2 className="text-xl font-semibold text-ui-fg-base mb-4">
                  {section.category}
                </h2>

                <Accordion type="multiple">
                  {section.items.map((item) => (
                    <Accordion.Item
                      key={item.q}
                      title={item.q}
                      value={item.q}
                      titleClassName="text-base font-semibold text-ui-fg-base"
                      contentClassName="text-base font-normal text-ui-fg-subtle leading-7 pt-2"
                    >
                      {item.a}
                    </Accordion.Item>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
