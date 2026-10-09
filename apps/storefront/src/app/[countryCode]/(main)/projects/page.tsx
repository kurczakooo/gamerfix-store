import { Metadata } from "next"

import { parseOptionValueIds } from "@lib/util/product-option-filters"
import { listCategories } from "@lib/data/categories"
import { getCollectionByHandle } from "@lib/data/collections"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { filterCategoriesByHandle } from "@lib/util/product"
import ProjectsTemplate from "@modules/projects/templates"

export const metadata: Metadata = {
  title:
    "Zrealizowane naprawy | Konsole, Pady, Komputery, Telefony, Inny sprzęt | Gamer Fix",
  description:
    "Serwis Gamer Fix - Najciekawsze zrealizowane naprawy elektroniki przeprowadzone przez Gamer Fix. Wyślij swój sprzęt do serwisu na aby zlecić konkretną usługę naprawy, bądź uzyskać diagnozę, wycenę i naprawę swojego sprzętu.",
}

type RepairStorePageSearchParams = Record<
  string,
  string | string[] | undefined
> & {
  sortBy?: SortOptions
  page?: string
  optionValueIds?: string | string[]
}

type Params = {
  searchParams: Promise<RepairStorePageSearchParams>
  params: Promise<{
    countryCode: string
  }>
}

export default async function RepairShopPage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page } = searchParams
  const optionValueIds = parseOptionValueIds(searchParams)

  return (
    <ProjectsTemplate
      page={page}
      countryCode={params.countryCode}
      optionValueIds={optionValueIds}
    />
  )
}
