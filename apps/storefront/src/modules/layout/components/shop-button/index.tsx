import ShopDropdown from "../nav-shop-dropdown"
import { listCategories } from "@lib/data/categories"

export default async function ShopButton() {
  const productCategories = await listCategories().catch(() => null)

  return <ShopDropdown categories={productCategories} />
}
