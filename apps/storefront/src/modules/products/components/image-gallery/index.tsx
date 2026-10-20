"use client"

import React, { useState, useEffect, useCallback } from "react"

import { HttpTypes } from "@medusajs/types"
import { Container } from "@modules/common/components/ui"
import useEmblaCarousel from "embla-carousel-react"
import Image from "next/image"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(
    images.length > 0 ? 0 : -1
  )
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({ loop: true })
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  })

  const onThumbClick = useCallback(
    (index: number) => {
      emblaMainApi?.scrollTo(index)
    },
    [emblaMainApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaMainApi) return
    const selectedIndex = emblaMainApi.selectedScrollSnap()
    setSelectedImageIndex(selectedIndex)
    emblaThumbsApi?.scrollTo(selectedIndex)
  }, [emblaMainApi, emblaThumbsApi])

  useEffect(() => {
    if (!emblaMainApi) return
    onSelect()

    emblaMainApi.on("select", onSelect).on("reInit", onSelect)
    return () => {
      emblaMainApi.off("select", onSelect).off("reInit", onSelect)
    }
  }, [emblaMainApi, onSelect])

  return (
    <div className="flex items-start relative">
      <div className="flex flex-col flex-1 small:mx-16 gap-y-4">
        <div className="overflow-hidden rounded-rounded" ref={emblaMainRef}>
          <div className="flex touch-pan-y touch-pinch-zoom rounded-rounded">
            {images.map((image, index) => (
              <Container
                key={image.id}
                className="relative mr-4 aspect-[29/34] w-full shrink-0 basis-full overflow-hidden bg-ui-bg-subtle"
                id={image.id}
              >
                {!!image.url && (
                  <Image
                    src={image.url}
                    priority={index <= 2 ? true : false}
                    className="absolute inset-0 rounded-rounded"
                    alt={`Product image ${index + 1}`}
                    fill
                    sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                )}
              </Container>
            ))}
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaThumbsRef}>
          <div className="flex touch-pan-y touch-pinch-zoom ">
            {images.map((image, index) => (
              <div className="min-w-0 shrink-0 basis-1/5 px-1" key={image.id}>
                <button
                  type="button"
                  onClick={() => onThumbClick(index)}
                  aria-label={`Show product image ${index + 1}`}
                  aria-current={
                    index === selectedImageIndex ? "true" : undefined
                  }
                  className={`relative block aspect-square w-full overflow-hidden rounded-rounded border-2 ${
                    index === selectedImageIndex
                      ? "border-ui-border-interactive"
                      : "border-transparent"
                  }`}
                >
                  {!!image.url && (
                    <Image
                      src={image.url}
                      alt={`Product image ${index + 1}`}
                      fill
                      sizes="(max-width: 576px) 20vw, 120px"
                      className="absolute inset-0 rounded-rounded object-cover"
                    />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageGallery
