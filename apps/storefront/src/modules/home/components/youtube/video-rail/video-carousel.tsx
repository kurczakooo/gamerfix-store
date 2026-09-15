"use client"

import useEmblaCarousel from "embla-carousel-react"
import { HttpTypes } from "@medusajs/types"

import VideoPreview from "../video-preview"
import { YouTubeVideo } from "@lib/data/youtube"
import { useCallback, useEffect, useState } from "react"

type Props = {
  videos: YouTubeVideo[]
  region: HttpTypes.StoreRegion
}

export default function VideoRailCarousel({ videos, region }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  })

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return

    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    setScrollSnaps(emblaApi.scrollSnapList())
    onSelect()

    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)

    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect])

  return (
    <div className="relative">
      {/* Carousel */}
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {videos.map((video) => (
            <div
              key={video.id}
              className="
                embla__slide
                min-w-0
                flex-[0_0_100%]
                small:flex-[0_0_50%]
                medium:flex-[0_0_33.333%]
                px-2
              "
            >
              <VideoPreview video={video} region={region} />
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-3 small:mt-6">
        {/* Previous */}
        <button
          type="button"
          onClick={scrollPrev}
          aria-label="Poprzednie filmy"
          className="
            flex items-center justify-center
            w-10 h-10
            border border-ui-border-base
            rounded-full
            hover:bg-ui-bg-subtle
            transition-colors
          "
        >
          ←
        </button>

        {/* Indicators */}
        <div className="flex items-center gap-2">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Przejdź do filmu ${index + 1}`}
              className={`
                h-2 rounded-full transition-all
                ${
                  index === selectedIndex
                    ? "w-6 bg-ui-fg-base"
                    : "w-2 bg-ui-fg-muted"
                }
              `}
            />
          ))}
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={scrollNext}
          aria-label="Następne filmy"
          className="
            flex items-center justify-center
            w-10 h-10
            border border-ui-border-base
            rounded-full
            hover:bg-ui-bg-subtle
            transition-colors
          "
        >
          →
        </button>
      </div>

      {/* Counter */}
      <div className="text-center mt-3 text-sm text-ui-fg-subtle">
        {selectedIndex + 1} / {scrollSnaps.length}
      </div>
    </div>
  )
}
