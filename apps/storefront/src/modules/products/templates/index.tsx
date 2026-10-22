import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActionsWrapper from "./product-actions-wrapper"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Heading } from "@modules/common/components/ui"
import { ChevronLeft } from "@medusajs/icons"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      <div
        className="content-container flex flex-col py-6 gap-4 small:gap-8"
        data-testid="product-container"
      >
        <div className="flex flex-col gap-y-2 small:gap-y-4">
          {product.collection && (
            <LocalizedClientLink
              href={`/collections/${product.collection.handle}`}
              className="text-sm small:text-medium text-ui-fg-muted hover:text-ui-fg-subtle"
            >
              <div className="flex flex-1 items-center justify-start">
                <ChevronLeft className="inline-block mr-1" />
                {product.collection.title}
              </div>
            </LocalizedClientLink>
          )}
          <Heading
            level="h2"
            className="text-2xl small:text-3xl leading-10 text-ui-fg-base"
            data-testid="product-title"
          >
            {product.title}
          </Heading>
        </div>
        <div className="flex flex-col gap-4 justify-between small:flex-1 small:flex-row">
          <div className="min-w-0 small:flex-1">
            <ImageGallery images={images} />
          </div>

          <div className="flex min-w-0 flex-col small:flex-1 small:justify-center small:items-center ">
            <div className="flex min-w-0 flex-col small:flex-1 small:justify-center small:items-center">
              <Suspense
                fallback={
                  <ProductActions
                    disabled={true}
                    product={product}
                    region={region}
                  />
                }
              >
                <ProductActionsWrapper id={product.id} region={region} />
              </Suspense>
            </div>
            <div className="flex min-w-0 flex-col small:flex-1 small:justify-start small:items-start hidden small:block">
              <ProductTabs product={product} />
            </div>
          </div>
        </div>
        <div className="flex flex-col pt-8 items-start">
          <ProductInfo product={product} />
        </div>
        <div className="block sm:hidden">
          <ProductTabs product={product} />
        </div>
        <div
          className="content-container my-16"
          data-testid="related-products-container"
        >
          <Suspense fallback={<SkeletonRelatedProducts />}>
            <RelatedProducts product={product} countryCode={countryCode} />
          </Suspense>
        </div>
      </div>
    </>
  )
}

export default ProductTemplate
