import { Container, Text } from "@modules/common/components/ui"
import { HttpTypes } from "@medusajs/types"
import { YouTubeVideo } from "@lib/data/youtube"
import Image from "next/image"
import { cleanText } from "@lib/util/text"

export default function VideoPreview({
  video,
  region: _region,
}: {
  video: YouTubeVideo | null
  region: HttpTypes.StoreRegion
}) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${video?.id}`}
      className="group"
      target="_blank"
      rel="noreferrer"
    >
      <div data-testid="video-wrapper">
        <Container
          className="relative aspect-video w-full overflow-hidden p-0 bg-ui-bg-subtle shadow-elevation-card-rest rounded-large group-hover:shadow-elevation-card-hover transition-shadow ease-in-out duration-150"
          data-testid="video-container"
        >
          <Image
            src={video?.standardThumbnailUrl ?? ""}
            alt="video-thumbnail"
            className="absolute inset-0 object-cover object-center"
            draggable={false}
            sizes="280px"
            fill
          />
        </Container>
        <div className="mt-4">
          <Text
            className="text-small-semi sm:text-large-semi text-ui-fg-subtle font-semibold"
            data-testid="video-title"
          >
            {video?.title}
          </Text>
          <Text
            className="mt-2 text-xsmall-regular sm:text-medium-regular text-ui-fg-subtle"
            data-testid="video-description"
          >
            {cleanText(video?.description, {
              words: [
                "Facebook",
                "Instagram",
                "Tiktok",
                "Whatsapp",
                "serwis.gamefix@gmail.com",
                "Social Media",
                "Strona do",
              ],
              substrings: ["#", "+", "455", "567", "724", ":", "━"],
              removeLinks: true,
              removeEmojis: true,
            })}
          </Text>
        </div>
      </div>
    </a>
  )
}
