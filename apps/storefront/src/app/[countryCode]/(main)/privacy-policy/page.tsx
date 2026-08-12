import { Heading } from "@modules/common/components/ui"
import { Metadata } from "next"
import privacy from "../../../../../data/privacy-policy.json"

export const metadata: Metadata = {
  title: "Polityka Prywatności | Gamer Fix",
  description: "Polityka prywatności sklepu i serwisu Gamer Fix",
}

export default async function PrivacyPolicy() {
  return (
    <div className="content-container" data-testid="privacy-container">
      <div className="py-6 px-2 flex flex-col justify-center items-start">
        <Heading level="h1" className="text-3xl-regular">
          {privacy.title}
        </Heading>

        <div className="pt-8 w-full max-w-4xl flex flex-col gap-8">
          {privacy.sections.map((section) => (
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
