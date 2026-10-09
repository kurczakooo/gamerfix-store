import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { OptionValueIds } from "@lib/util/product-option-filters"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"

import projectsData from "../../../../data/projects.json"
import ProjectPreview from "../components/project-preview"

const PROJECT_LIMIT = 12

type PaginatedProjectsParams = {
  limit: number
  id?: string[]
}

export default async function PaginatedProjects({
  page,
  countryCode,
  optionValueIds,
}: {
  page: number
  countryCode: string
  optionValueIds?: OptionValueIds
}) {
  const queryParams: PaginatedProjectsParams = {
    limit: 12,
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const {
    response: { projects, count },
  } = projectsData
  //   } = await listProductsWithSort({
  //     page,
  //     queryParams,
  //     countryCode,
  //     optionValueIds,
  //   })

  const totalPages = Math.ceil(count / PROJECT_LIMIT)

  return (
    <>
      <ul
        className="grid w-full grid-cols-1 gap-x-6 gap-y-4 "
        data-testid="products-list"
      >
        {projects.map((p) => {
          return (
            <li key={p.id}>
              {/* <ProductPreview product={p} region={region} /> */}
              <ProjectPreview project={p} />
            </li>
          )
        })}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="project-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
