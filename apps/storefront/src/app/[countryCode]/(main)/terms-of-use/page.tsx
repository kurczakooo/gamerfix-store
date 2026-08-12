import { Heading } from "@modules/common/components/ui"
import { Metadata } from "next"
import terms from "../../../../../data/terms-of-use.json"

export const metadata: Metadata = {
  title: "Regulamin | GamerFix",
  description: "Regulamin sklepu i serwisu Gamer Fix",
}

export default async function TermsOfUse() {
  return (
    <div className="content-container" data-testid="terms-container">
      <div className="py-6 px-2 flex flex-col justify-center items-start">
        <Heading level="h1" className="text-3xl-regular">
          Regulamin sklepu i serwisu
        </Heading>

        <div className="pt-8 w-full flex flex-col gap-12">
          {[terms.storeRegulations, terms.serviceRegulations].map(
            (regulation) => (
              <section key={regulation.title} className="w-full">
                <h2 className="text-2xl font-semibold text-ui-fg-base mb-6">
                  {regulation.title}
                </h2>

                <div className="flex flex-col gap-6">
                  {regulation.sections.map((section) => (
                    <article key={section.title}>
                      <h3 className="text-lg font-semibold text-ui-fg-base mb-2">
                        {section.title}
                      </h3>

                      <div className="flex flex-col gap-2">
                        {section.content.map((paragraph, index) => (
                          <p
                            key={index}
                            className="text-base text-ui-fg-subtle leading-7"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )
          )}
        </div>
      </div>
    </div>
  )
}
