import { listCategories } from "@lib/data/categories"
import { HttpTypes } from "@medusajs/types"

export const isSimpleProduct = (product: HttpTypes.StoreProduct): boolean => {
  return (
    product.options?.length === 1 && product.options[0].values?.length === 1
  )
}

export const filterCategoriesByHandle = (
  categories: Awaited<ReturnType<typeof listCategories>> | null,
  handle: string,
  include: boolean
) => {
  if (!categories) {
    return []
  }

  const filtered = categories.filter((category) => {
    const categoryHandle = category.handle?.toLowerCase() ?? ""
    if (include) return categoryHandle.includes(handle)
    return !categoryHandle.includes(handle)
  })

  return filtered.filter((category) => !category.parent_category)
}
