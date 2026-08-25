import { HttpTypes } from "@medusajs/types"
import { Text } from "@modules/common/components/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import VideoPreview from "../video-preview"
import { retrieveYouTubePlaylist, YouTubeVideo } from "@lib/data/youtube"
import VideoRailCarousel from "./video-carousel"

export default async function VideoRail({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const featuredVideos = await retrieveYouTubePlaylist()

  if (!featuredVideos) {
    return null
  }

  return (
    <div className="content-container py-8 small:py-16">
      <div className="flex justify-between mb-8">
        <Text className="text-xl-semi">Nasze filmy na YouTube</Text>
        <InteractiveLink
          href="https://www.youtube.com/@gamer-fix-serwis/featured"
          external
        >
          Wyświetl kanał
        </InteractiveLink>
      </div>
      <VideoRailCarousel videos={featuredVideos} region={region} />
    </div>
  )
}
