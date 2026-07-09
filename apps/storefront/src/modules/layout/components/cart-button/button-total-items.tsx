import { retrieveCart } from "@lib/data/cart"
import TotalItems from "../cart-dropdown/total-items"

export default async function CartButtonTotalItems() {
  const cart = await retrieveCart().catch(() => null)

  return <TotalItems cart={cart} />
}
