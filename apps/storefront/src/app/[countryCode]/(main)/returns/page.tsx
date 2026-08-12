import { Heading } from "@modules/common/components/ui"
import { Metadata } from "next"
import returns from "../../../../../data/returns.json"

export const metadata: Metadata = {
  title: "Zwroty i reklamacje | Gamer Fix",
  description:
    "Zasady zwrotu i reklamacji produktów ze sklepu i usług serwisowych wykonanych przez Gamer Fix",
}

export default async function Returns() {
  return (
    <div className="content-container" data-testid="privacy-container">
      <div className="py-6 px-2 flex flex-col justify-center items-start">
        <Heading level="h1" className="text-3xl-regular">
          {returns.title}
        </Heading>

        <div className="pt-8 w-full max-w-4xl flex flex-col gap-8">
          {returns.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-ui-fg-base mb-3">
                {section.title}
              </h2>

              <div className="flex flex-col gap-3">
                {section.content.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-base text-ui-fg-subtle leading-7"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
