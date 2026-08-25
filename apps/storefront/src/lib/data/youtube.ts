"use server"

export type YouTubeVideo = {
  id: string
  title: string
  description: string
  standardThumbnailUrl: string
  mediumThumbnailUrl: string
  publishedAt: string
}

export const retrieveYouTubePlaylist = async () => {
  const maxResults = 20

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${process.env.YOUTUBE_PLAYLIST_ID}&maxResults=${maxResults}&key=${process.env.GCP_YOUTUBE_KEY}`,
    {
      next: {
        revalidate: 3600,
      },
    }
  )

  if (!res.ok) {
    throw new Error("Failed to fetch YouTube videos")
  }

  const data = await res.json()

  return data.items.map(
    (item: any): YouTubeVideo => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      standardThumbnailUrl: item.snippet.thumbnails.standard?.url ?? "",
      mediumThumbnailUrl: item.snippet.thumbnails.medium?.url ?? "",
      publishedAt: item.snippet.publishedAt,
    })
  )
}
