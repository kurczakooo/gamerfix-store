import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button, Heading } from "@modules/common/components/ui"

const Hero = () => {
  return (
    <div className="h-[55vh] sm:h-[75vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle overflow-hidden">
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/images/content/hero.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(1px)",
          transform: "scale(1.13)",
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        <span>
          <Heading
            level="h1"
            className="text-xl sm:text-3xl lg:text-4xl leading-tight text-white"
            style={{ textShadow: "0 0 15px rgba(0,0,0,0.95)" }}
          >
            Witaj na sklepie Gamer Fix
          </Heading>
        </span>

        <div className="space-y-8 mt-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <p
              className="text-small-semi sm:text-large-semi text-white"
              style={{ textShadow: "0 0 10px rgba(0,0,0,0.9)" }}
            >
              Szukasz konsoli, pada, gier lub innego sprzętu?
            </p>
            <LocalizedClientLink href="/store">
              <Button variant="secondary">Przeglądaj produkty</Button>
            </LocalizedClientLink>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <p
              className="text-small-semi sm:text-large-semi text-white"
              style={{ textShadow: "0 0 10px rgba(0,0,0,0.9)" }}
            >
              Czy twój sprzęt wymaga naprawy?
            </p>
            <LocalizedClientLink href="/repair-shop">
              <Button variant="secondary">Przeglądaj usługi</Button>
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
