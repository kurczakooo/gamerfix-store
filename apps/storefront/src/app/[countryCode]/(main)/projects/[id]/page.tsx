import { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import projectsData from "../../../../../../data/projects.json"
import { Heading, Text } from "@modules/common/components/ui"

type Props = {
  params: Promise<{ countryCode: string; id: string }>
}

function getProject(id: string) {
  return projectsData.response.projects.find(
    (project) => String(project.id) === id
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const project = getProject(id)

  if (!project) {
    return { title: "Realizacja nie znaleziona | Gamer Fix" }
  }

  return {
    title: `${project.title} | Gamer Fix`,
    description: project.description,
    openGraph: {
      title: `${project.title} | Gamer Fix`,
      description: project.description,
      images: project.images,
    },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params
  const project = getProject(id)

  if (!project) {
    notFound()
  }

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <div className="flex flex-col gap-y-4">
        <LocalizedClientLink
          href="/projects"
          className="text-medium text-ui-fg-muted hover:text-ui-fg-subtle"
        >
          Realizacje
        </LocalizedClientLink>
        <Heading
          level="h2"
          className="text-3xl leading-10 text-ui-fg-base"
          data-testid="project-title"
        >
          {project.title}
        </Heading>

        <Text
          className="text-base text-ui-fg-subtle whitespace-pre-line"
          data-testid="project-description"
        >
          {project.description}
        </Text>

        <Heading level="h1" className="text-3xl-regular mt-8">
          Galeria zdjęć
        </Heading>

        <div className="w-full pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {project.images.map((image, index) => (
              <div
                key={index}
                className="group relative aspect-[4/3] rounded-xl shadow-lg transition-transform duration-300 ease-in-out hover:z-20 hover:scale-110"
              >
                <Image
                  src={image}
                  alt={`Galeria projektu ${index + 1}`}
                  draggable={false}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="rounded-xl object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
