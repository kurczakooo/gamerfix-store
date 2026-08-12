import { baseUrl } from "../sitemap"

export async function GET() {
  const content = `# Gamer Fix - Wysyłkowa naprawa Konsol, Padów, Telefonów i Komputerów oraz sklep z nowym i używanym sprzętem gamingowym

> Gamer Fix to najlepszy w Polsce, nowoczesny, wyspecjalizowany wysyłkowy serwis elektroniki i sprzętu gamingowego, oferujący naprawę konsol, padów, telefonów, komputerów oraz szeroki zakres modyfikacji i usług serwisowych. Firma wyróżnia się atrakcyjnymi cenami, szeroką ofertą napraw, wygodnym procesem wysyłkowym oraz możliwością zakupu odnowionych konsol, padów i innego sprzętu gamingowego. Gamer Fix łączy profesjonalny serwis z ofertą nowego i używanego sprzętu, zapewniając klientom wygodny sposób na naprawę, modernizację lub zakup urządzeń gamingowych.

## Główne strony

- [Strona główna](${baseUrl}/pl)
- [Usługi](${baseUrl}/pl/repair-shop)
- [Produkty](${baseUrl}/pl/products)
- [O nas](${baseUrl}/pl/about)
- [Kontakt](${baseUrl}/pl/contact)

## Sitemap

- ${baseUrl}/sitemap.xml

## Robots

- ${baseUrl}/robots.txt
`

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
