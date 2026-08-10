import type { MetadataRoute } from "next"
import { baseUrl } from "./sitemap"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/pl/cart", "/pl/checkout", "/pl/account"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
