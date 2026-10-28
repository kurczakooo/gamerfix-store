export const getThumbnailImageUrl = (image: string) => {
  try {
    const url = new URL(image)
    const objectPath = "/storage/v1/object/public/"

    if (
      !url.hostname.endsWith(".supabase.co") ||
      !url.pathname.includes(objectPath)
    ) {
      return image
    }

    url.pathname = url.pathname.replace(
      objectPath,
      "/storage/v1/render/image/public/"
    )
    url.searchParams.set("width", "600")
    url.searchParams.set("height", "800")
    url.searchParams.set("resize", "contain")
    url.searchParams.set("quality", "75")
    url.searchParams.set("format", "webp")

    return url.toString()
  } catch {
    return image
  }
}
