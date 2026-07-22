import InteractiveLink from "@modules/common/components/interactive-link"
import { Heading } from "@modules/common/components/ui"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Informacje kontaktowe firmy Gamer Fix",
}

export default async function About() {
  return (
    <div className="py-12">
      <div className="content-container" data-testid="cart-container">
        <div
          className="py-48 px-2 flex flex-col justify-center items-start"
          data-testid="empty-cart-message"
        >
          <Heading
            level="h1"
            className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
          >
            Strona kontaktowa
          </Heading>
          <div>
            <InteractiveLink href="/store">Przeglądaj produkty</InteractiveLink>
          </div>
        </div>
      </div>
    </div>
  )
}
