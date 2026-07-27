import { Heading } from "@modules/common/components/ui"
import { Metadata } from "next"
import Image from "next/image"
import about from "../../../../../data/about.json"

export const metadata: Metadata = {
  title: "O firmie",
  description: "Informacje o firmie Gamer Fix",
}

export default async function About() {
  return (
    <div className="content-container" data-testid="privacy-container">
      <div className="py-6 px-2 flex flex-col justify-center items-start">
        <Heading level="h1" className="text-3xl-regular">
          {about.title}
        </Heading>

        <div className="pt-8 w-full max-w-4xl flex flex-col gap-6">
          {about.sections.map((section) => (
            <section key={section.content}>
              <p className="text-base text-ui-fg-subtle leading-7">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        <Heading level="h1" className="text-3xl-regular mt-8">
          Galeria zdjęć
        </Heading>

        <div className="w-full pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {about.gallery.map((image, index) => (
              <div key={index} className="group relative rounded-l">
                <Image
                  src={image}
                  alt={`Galeria ${index + 1}`}
                  width={800}
                  height={600}
                  className="
                    relative
                    z-0
                    h-64
                    w-full
                    object-cover
                    rounded-xl
                    transition-all
                    duration-300
                    ease-in-out
                    group-hover:scale-150
                    group-hover:z-20
                    shadow-lg
                "
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
