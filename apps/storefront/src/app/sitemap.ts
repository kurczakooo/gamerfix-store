import { listCategories } from "@lib/data/categories"
import { listAllProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import type { MetadataRoute } from "next"

const baseUrl = "https://gamerfix.pl"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const countryCode = "pl"

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
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    })),
    ...products.map((product) => ({
      url: `${baseUrl}/pl/products/${product.handle}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    })),
  ]
}

const staticPages: MetadataRoute.Sitemap = [
  {
    url: `${baseUrl}/pl`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    url: `${baseUrl}/pl/store`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: `${baseUrl}/pl/repair-service`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: `${baseUrl}/pl/about`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    url: `${baseUrl}/pl/faq`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: `${baseUrl}/pl/contact`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${baseUrl}/pl/ship-and-pay`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${baseUrl}/pl/privacy-policy`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${baseUrl}/pl/terms-of-use`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  },
]
