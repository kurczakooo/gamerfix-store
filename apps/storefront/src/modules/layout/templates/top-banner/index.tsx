import TopBannerContent from "../../../../../data/top-banner.json"

export default async function TopBanner() {
  return (
    <div className="top-0 inset-x-0 z-30">
      <div className="overflow-hidden bg-[#f29b3f]">
        <div className="flex h-full items-center justify-center py-2 px-4">
          <span className="whitespace-nowrap text-center text-sm font-semibold sm:text-base lg:text-large-semi">
            {TopBannerContent.content}
          </span>
        </div>
      </div>
    </div>
  )
}
