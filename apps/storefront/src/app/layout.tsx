import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

const icons = [
  "/images/content/laptop.png",
  "/images/content/controller.png",
  "/images/content/ps5.png",
  "/images/content/phone.png",
  "/images/content/xbox.png",
]

const patternIcons = Array.from(
  { length: 100 },
  (_, index) => icons[index % icons.length]
)

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="pl" data-mode="light">
      <body>
        <main className="relative isolate pattern-bg">
          <div className="pattern-icons" aria-hidden="true">
            {patternIcons.map((src, index) => (
              <img key={index} src={src} alt="" />
            ))}
          </div>
          {props.children}
        </main>
      </body>
    </html>
  )
}
