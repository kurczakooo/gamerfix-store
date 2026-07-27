import TopBannerContent from "../../../../../data/top-banner.json"

export default async function TopBanner() {
  return (
    <div className="top-0 inset-x-0 z-30">
      <div className="h-12 overflow-hidden bg-orange-500 ">
        <div className="flex h-full items-center justify-center">
          <span className="text-large-semi">{TopBannerContent.content}</span>
        </div>
      </div>
    </div>
  )
}
