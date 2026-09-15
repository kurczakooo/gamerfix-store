import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import VideoRail from "@modules/home/components/youtube/video-rail"

export const metadata: Metadata = {
  title: "Gamer Fix | Wysyłkowa naprawa Konsol, Padów, Telefonów i Komputerów",
  description:
    "Naprawiamy konsole PlayStation, Xbox i Nintendo, pady, telefony oraz komputery. Oferujemy także gry, akcesoria i sprzęt elektroniczny. Zamów naprawę online i wyślij sprzęt do serwisu.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />
      <div className="py-6 sm:py-8">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
        <ul className="flex flex-col gap-x-6">
          <VideoRail region={region} />
        </ul>
      </div>
    </>
  )
}
