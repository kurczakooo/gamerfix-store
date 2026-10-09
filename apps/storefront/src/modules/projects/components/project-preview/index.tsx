import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

type Project = {
  id: number
  title: string
  displayDate: string
  description: string
  images: string[]
}

export default function ProjectPreview({ project }: { project: Project }) {
  const thumbnail = project.images[0]

  return (
    <LocalizedClientLink
      href={`/projects/${project.id}`}
      className="group block border-b border-ui-border-base py-4"
    >
      <div
        data-testid="product-wrapper"
        className="flex min-h-40 items-center sm:items-stretch"
      >
        <div className="relative size-28 shrink-0 overflow-hidden sm:size-64">
          <Image
            src={thumbnail}
            alt={project.title}
            draggable={false}
            fill
            sizes="(max-width: 640px) 112px, 256px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col py-1 pl-4 sm:px-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
            <h2
              className="order-2 text-base-regular text-small-semi text-ui-fg-base font-semibold sm:order-1 sm:text-large-semi"
              data-testid="product-title"
            >
              {project.title}
            </h2>
            <time
              dateTime={project.displayDate}
              className="order-1 self-end whitespace-nowrap text-xs text-ui-fg-muted sm:order-2 sm:self-auto sm:text-sm"
            >
              {new Date(project.displayDate).toLocaleDateString()}
            </time>
          </div>
          <p className="mt-4 line-clamp-4 text-base-regular text-xsmall-regular sm:text-medium-regular text-ui-fg-subtle">
            {project.description}
          </p>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
