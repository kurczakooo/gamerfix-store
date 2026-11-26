import ShopDropdown from "../layout/components/nav-shop-dropdown"
import { listCategories } from "@lib/data/categories"
import { filterCategoriesByHandle } from "@lib/util/product"
import { HttpTypes } from "@medusajs/types"

export default async function RepairShopButton({
  categories,
}: {
  categories: HttpTypes.StoreProductCategory[] | null
}) {
  return (
    <ShopDropdown
      categories={filterCategoriesByHandle(categories, "service", true)}
      services={true}
    />
  )
}
