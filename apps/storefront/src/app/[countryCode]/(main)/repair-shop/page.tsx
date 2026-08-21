import { Metadata } from "next"

import { parseOptionValueIds } from "@lib/util/product-option-filters"
import { listCategories } from "@lib/data/categories"
import { getCollectionByHandle } from "@lib/data/collections"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import { filterCategoriesByHandle } from "@lib/util/product"

export const metadata: Metadata = {
  title:
    "Serwis wysyłkowy | Konsole, Pady, Komputery, Telefony, Inny sprzęt | Gamer Fix",
  description:
    "Serwis Gamer Fix - Wysyłkowa naprawa konsol PlayStation, Xbox i Nintendo, padów DualSense, DualShock, Xbox oraz Joy-Con. Wyślij swój sprzęt do serwisu na aby zlecić konkretną usługę naprawy, bądź uzyskać diagnozę, wycenę i naprawę swojego sprzętu.",
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
  const [allCategories, serviceCollection] = await Promise.all([
    listCategories(),
    getCollectionByHandle("services"),
  ])
  const serviceCategories = filterCategoriesByHandle(
    allCategories,
    "service",
    true
  )

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      optionValueIds={optionValueIds}
      categories={serviceCategories}
      service={true}
      collectionId={serviceCollection?.id}
    />
  )
}
