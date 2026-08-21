import ShopDropdown from "../layout/components/nav-shop-dropdown"
import { listCategories } from "@lib/data/categories"
import { filterCategoriesByHandle } from "@lib/util/product"

export default async function RepairShopButton() {
  const productCategories = await listCategories().catch(() => null)

  return (
    <ShopDropdown
      categories={filterCategoriesByHandle(productCategories, "service", true)}
      services={true}
    />
  )
}
