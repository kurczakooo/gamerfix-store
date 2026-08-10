import { listCategories } from "@lib/data/categories"
import { listAllProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import type { MetadataRoute } from "next"

export const baseUrl = "https://gamerfix.pl"
const countryCode = "pl"
const today = new Date()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const region = await getRegion(countryCode)
  const productCategories = await listCategories().catch(() => null)

  const products = await listAllProducts({
    regionId: region?.id,
    queryParams: {
      fields: "*variants.calculated_price",
      limit: 100,
    },
  })

  return [
    ...staticPages,
    ...(productCategories ?? []).map((category) => ({
      url: `${baseUrl}/pl/categories/${category.handle}`,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 0.9,
    })),
    ...products.map((product) => ({
      url: `${baseUrl}/pl/products/${product.handle}`,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 0.9,
    })),
  ]
}

const staticPages: MetadataRoute.Sitemap = [
  {
    url: `${baseUrl}/pl`,
    lastModified: today,
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    url: `${baseUrl}/pl/store`,
    lastModified: today,
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: `${baseUrl}/pl/repair-service`,
    lastModified: today,
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: `${baseUrl}/pl/about`,
    lastModified: today,
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    url: `${baseUrl}/pl/faq`,
    lastModified: today,
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: `${baseUrl}/pl/contact`,
    lastModified: today,
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${baseUrl}/pl/ship-and-pay`,
    lastModified: today,
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${baseUrl}/pl/privacy-policy`,
    lastModified: today,
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${baseUrl}/pl/terms-of-use`,
    lastModified: today,
    changeFrequency: "monthly",
    priority: 0.7,
  },
]
