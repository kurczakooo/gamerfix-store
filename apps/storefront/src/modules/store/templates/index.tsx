import { Suspense } from "react"

import { OptionValueIds } from "@lib/util/product-option-filters"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  optionValueIds,
  categories,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
  categories: HttpTypes.StoreProductCategory[]
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  const rootCategories = categories.filter(
    (category) => !category.parent_category
  )

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <RefinementList sortBy={sort} />
      <div className="w-full">
        <div className="mb-8 text-2xl-semi">
          <h1 data-testid="store-page-title">Wszystkie produkty</h1>
        </div>
        {rootCategories.length > 0 && (
          <div className="mb-8 text-base-large">
            <ul className="flex flex-wrap gap-2">
              {rootCategories.map((category) => (
                <li key={category.id}>
                  <LocalizedClientLink
                    className="hover:text-black"
                    href={`/categories/${category.handle}`}
                    data-testid="category-link"
                  >
                    <button
                      className="border-ui-border-base bg-ui-bg-subtle border text-s h-10 rounded-rounded px-4 hover:shadow-elevation-card-rest transition-shadow ease-in-out duration-150"
                      data-testid="category-button"
                    >
                      {category.name}
                    </button>
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            optionValueIds={optionValueIds}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
