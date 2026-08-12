import { Metadata } from "next"

import { parseOptionValueIds } from "@lib/util/product-option-filters"
import { listCategories } from "@lib/data/categories"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import { filterCategoriesByHandle } from "@lib/util/product"

export const metadata: Metadata = {
  title: "Sklep | Konsole, Pady, Gry, Akcesoria, Sprzęt | Gamer Fix",
  description:
    "Sklep Gamer Fix - konsole PlayStation, Xbox i Nintendo, pady i kontrolery DualSense, DualShock, Xbox oraz Joy-Con. Kup także gry, akcesoria i sprzęt elektroniczny.",
}

type StorePageSearchParams = Record<string, string | string[] | undefined> & {
  sortBy?: SortOptions
  page?: string
  optionValueIds?: string | string[]
}

type Params = {
  searchParams: Promise<StorePageSearchParams>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page } = searchParams
  const optionValueIds = parseOptionValueIds(searchParams)
  const allCategories = await listCategories()
  const productCategories = filterCategoriesByHandle(
    allCategories,
    "service",
    false
  )

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      optionValueIds={optionValueIds}
      categories={productCategories}
    />
  )
}
