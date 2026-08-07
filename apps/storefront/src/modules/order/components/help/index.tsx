import { Heading } from "@modules/common/components/ui"
import UnderlineLink from "@modules/common/components/interactive-link"
import React from "react"

const Help = () => {
  return (
    <div className="mt-6">
      <Heading className="text-base-semi">Potrzebujesz pomocy?</Heading>
      <div className="text-base-regular my-2">
        <ul className="gap-y-2 flex flex-col">
          <li>
            <UnderlineLink href="/contact">Kontakt</UnderlineLink>
          </li>
          <li>
            <UnderlineLink href="/contact">Zwroty</UnderlineLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Help
