import ShopDropdown from "../nav-shop-dropdown"
import { listCategories } from "@lib/data/categories"
import { filterCategoriesByHandle } from "@lib/util/product"

export default async function ShopButton() {
  const productCategories = await listCategories().catch(() => null)

  return (
    <ShopDropdown
      categories={filterCategoriesByHandle(productCategories, "service", false)}
      services={false}
    />
  )
}
